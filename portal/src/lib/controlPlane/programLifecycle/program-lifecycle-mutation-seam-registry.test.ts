import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

import ts from "typescript";

import {
  PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY,
  PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY_VERSION,
  PROGRAM_LIFECYCLE_SEAM_DISPOSITIONS,
  type ProgramLifecycleMutationSeam,
} from "./program-lifecycle-mutation-seam-registry";

type SourceKind = "TS" | "PRISMA" | "SQL";
type Source = Readonly<{ path: string; text: string; kind: SourceKind }>;
type EffectKind =
  | "PRISMA_MUTATION"
  | "RAW_SQL_INSERT"
  | "RAW_SQL_UPDATE"
  | "RAW_SQL_DELETE"
  | "PRISMA_RAW_EXECUTION"
  | "TRANSACTION"
  | "CLIENT_POST"
  | "REQUEST_BODY"
  | "REQUEST_OWNERSHIP"
  | "ROUTE_POST";
type EffectFinding = Readonly<{ coordinate: string; kind: EffectKind; evidence: string }>;
type EdgeKind = "CALL" | "IMPORT" | "REEXPORT" | "CONTAINMENT" | "ARGUMENT" | "ASSIGNMENT" | "RETURN";
type EvidenceEdge = Readonly<{ from: string; to: string; kind: EdgeKind; evidence: string }>;
type InferredSeam = Readonly<Pick<ProgramLifecycleMutationSeam,
  "path" | "symbol" | "surfaceClass" | "effectClass" | "triggerClass" | "disposition" | "writeCapable" | "evidencePosture" | "canonicalBoundary"
> & { readonly evidence: readonly string[] }>;
type ScanResult = Readonly<{
  seams: readonly InferredSeam[];
  effects: readonly EffectFinding[];
  edges: readonly EvidenceEdge[];
  effectiveExportedCoordinates: readonly string[];
  declarativeCount: number;
  productionSourceCount: number;
  migrationFileCount: number;
}>;
type Declaration = Readonly<{
  path: string;
  symbol: string;
  coordinate: string;
  node: ts.Node;
  sourceFile: ts.SourceFile;
  exported: boolean;
  defaultExported: boolean;
  method: boolean;
  containerCoordinate: string | null;
}>;
type CallSite = Readonly<{
  owner: Declaration;
  calleeName: string;
  calleeExpression: ts.Expression;
  lifecycleReceiver: boolean;
  edgeKind: Extract<EdgeKind, "CALL" | "ARGUMENT" | "ASSIGNMENT" | "RETURN">;
  evidence: string;
}>;
type ImportBinding = Readonly<{ localName: string; importedName: string; targetPath: string; namespace: boolean }>;
type StarExport = Readonly<{ sourcePath: string; targetPath: string; namespaceName: string | null; evidence: string }>;
type EffectiveExports = Readonly<{
  edges: readonly EvidenceEdge[];
  declarationCoordinates: ReadonlySet<string>;
  lifecyclePostCoordinates: ReadonlySet<string>;
}>;
type CompilerContext = Readonly<{
  checker: ts.TypeChecker;
  sourceFiles: ReadonlyMap<string, ts.SourceFile>;
  coordinateBySymbol: ReadonlyMap<ts.Symbol, string>;
}>;

const ROOT = resolve(import.meta.dirname, "../../../../..");
const ENTRY_KEYS = Object.freeze(["id", "path", "symbol", "surfaceClass", "effectClass", "triggerClass", "guardEvidence", "canonicalBoundary", "disposition", "replacement", "writeCapable", "evidencePosture", "authorityEffect", "mutationAuthorized"]);
const WRITE_METHODS = Object.freeze(["create", "createMany", "update", "updateMany", "upsert", "delete", "deleteMany"]);
const RAW_METHODS = Object.freeze(["$queryRaw", "$queryRawUnsafe", "$executeRaw", "$executeRawUnsafe"]);
const LIFECYCLE_TABLE = /program_(?:lifecycle_records|transition_commands|lifecycle_transition_receipts)/i;

function isProgramLifecyclePath(path: string): boolean {
  return path.includes("/programLifecycle/") || path.includes("/program-lifecycle/");
}

const PURE_ANCHORS: readonly InferredSeam[] = Object.freeze([
  anchor("portal/src/lib/controlPlane/programLifecycle/one-active-program-invariant.ts", "evaluateOneActiveProgramInvariant", "PURE", "NONE", "DIRECT", "CANONICAL_AND_GUARDED", "STATIC_SOURCE", "C1"),
  anchor("portal/src/lib/controlPlane/programLifecycle/canonical-active-program-resolver.ts", "resolveCanonicalActiveProgram", "PURE", "NONE", "DIRECT", "CANONICAL_AND_GUARDED", "STATIC_SOURCE", "C2"),
  anchor("portal/src/lib/controlPlane/programLifecycle/program-state-transition-matrix.ts", "evaluateProgramStateTransition", "PURE", "NONE", "DIRECT", "CANONICAL_AND_GUARDED", "STATIC_SOURCE", "C3"),
  anchor("portal/src/lib/controlPlane/programLifecycle/program-activation-eligibility-gate.ts", "evaluateProgramActivationEligibility", "PURE", "NONE", "DIRECT", "CANONICAL_AND_GUARDED", "STATIC_SOURCE", "C4"),
  anchor("portal/src/lib/controlPlane/programLifecycle/program-transition-receipt-boundary.ts", "createProgramTransitionReceiptSetDraft", "PURE", "IN_MEMORY_DRAFT", "DIRECT", "CANONICAL_AND_GUARDED", "STATIC_SOURCE", "C8"),
  anchor("portal/src/lib/controlPlane/programLifecycle/program-binding-propagation-boundary.ts", "compareProgramBindingSnapshots", "PURE", "NONE", "SUPPLIED_SNAPSHOT", "CLASSIFICATION_ONLY", "SUPPLIED_SNAPSHOT", "C9"),
  anchor("portal/src/lib/controlPlane/programLifecycle/downstream-active-program-guard.ts", "evaluateDownstreamActiveProgramGuard", "PURE", "NONE", "SUPPLIED_SNAPSHOT", "CLASSIFICATION_ONLY", "SUPPLIED_SNAPSHOT", "C10"),
  anchor("portal/src/lib/controlPlane/programLifecycle/frozen-program-protection-boundary.ts", "evaluateFrozenProgramProtection", "PURE", "NONE", "SUPPLIED_SNAPSHOT", "CLASSIFICATION_ONLY", "SUPPLIED_SNAPSHOT", "C11"),
  anchor("portal/src/lib/controlPlane/programLifecycle/founder-active-program-control-surface.ts", "buildFounderActiveProgramControlSurface", "DISPLAY", "NONE", "SUPPLIED_SNAPSHOT", "DOCUMENTARY_ONLY", "SUPPLIED_SNAPSHOT", "C12"),
  anchor("portal/src/app/operator/program-lifecycle/page.tsx", "ProgramLifecyclePage", "DISPLAY", "NONE", "SUPPLIED_SNAPSHOT", "DOCUMENTARY_ONLY", "SUPPLIED_SNAPSHOT", "C12"),
  anchor("portal/src/lib/controlPlane/programLifecycle/program-lifecycle-reconciliation-recovery-boundary.ts", "reconcileProgramLifecycleFaultAndRehearseRollback", "PURE", "NONE", "SUPPLIED_SNAPSHOT", "CLASSIFICATION_ONLY", "SUPPLIED_SNAPSHOT", "C14"),
]);

function anchor(
  path: string,
  symbol: string,
  surfaceClass: InferredSeam["surfaceClass"],
  effectClass: InferredSeam["effectClass"],
  triggerClass: InferredSeam["triggerClass"],
  disposition: InferredSeam["disposition"],
  evidencePosture: InferredSeam["evidencePosture"],
  canonicalBoundary: string,
): InferredSeam {
  return Object.freeze({ path, symbol, surfaceClass, effectClass, triggerClass, disposition, writeCapable: false, evidencePosture, canonicalBoundary, evidence: Object.freeze(["explicit pure non-effect canonical anchor"]) });
}

function coordinate(path: string, symbol: string): string {
  return `${path}#${symbol}`;
}

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = resolve(directory, entry.name);
    if (entry.isDirectory()) return ["__tests__", ".next", "dist", "generated", "node_modules"].includes(entry.name) ? [] : sourceFiles(absolute);
    return /\.(?:ts|tsx)$/.test(entry.name) && !/\.(?:test|spec)\.tsx?$/.test(entry.name) ? [absolute] : [];
  });
}

function migrationFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = resolve(directory, entry.name);
    if (entry.isDirectory()) return migrationFiles(absolute);
    return entry.name === "migration.sql" ? [absolute] : [];
  });
}

function collectRepositorySources(): readonly Source[] {
  const productionFiles = sourceFiles(resolve(ROOT, "portal/src")).sort();
  const sources: Source[] = productionFiles.map((file) => Object.freeze({ path: relative(ROOT, file), text: readFileSync(file, "utf8"), kind: "TS" as const }));
  sources.push(Object.freeze({ path: "portal/prisma/schema.prisma", text: readFileSync(resolve(ROOT, "portal/prisma/schema.prisma"), "utf8"), kind: "PRISMA" }));
  for (const file of migrationFiles(resolve(ROOT, "portal/prisma/migrations")).sort()) sources.push(Object.freeze({ path: relative(ROOT, file), text: readFileSync(file, "utf8"), kind: "SQL" }));
  return Object.freeze(sources);
}

function hasExportModifier(node: ts.Node): boolean {
  return Boolean(ts.canHaveModifiers(node) && ts.getModifiers(node)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword));
}

function hasDefaultModifier(node: ts.Node): boolean {
  return Boolean(ts.canHaveModifiers(node) && ts.getModifiers(node)?.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword));
}

function declarationSymbol(node: ts.Node): string | null {
  if (ts.isClassDeclaration(node)) return node.name?.text ?? (hasExportModifier(node) ? "default" : null);
  if (ts.isFunctionDeclaration(node)) return node.name?.text ?? (hasExportModifier(node) ? "default" : null);
  if (ts.isMethodDeclaration(node) || ts.isPropertyDeclaration(node) || ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node)) return node.name && ts.isIdentifier(node.name) ? node.name.text : null;
  if (ts.isConstructorDeclaration(node)) return "constructor";
  if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) return node.name.text;
  return null;
}

function topLevelContainer(node: ts.Node, sourceFile: ts.SourceFile): string | null {
  let current = node.parent;
  while (current && current !== sourceFile) {
    if (ts.isFunctionDeclaration(current) && current.parent === sourceFile && current.name) return current.name.text;
    if (ts.isVariableDeclaration(current) && current.parent.parent.parent === sourceFile && ts.isIdentifier(current.name)) return current.name.text;
    if (ts.isClassDeclaration(current) && current.parent === sourceFile && current.name) return current.name.text;
    current = current.parent;
  }
  return null;
}

function collectDeclarations(source: Source, sourceFile: ts.SourceFile): readonly Declaration[] {
  const declarations: Declaration[] = [];
  const visit = (node: ts.Node): void => {
    const topLevelFunction = ts.isFunctionDeclaration(node) && node.parent === sourceFile;
    const topLevelVariable = ts.isVariableDeclaration(node) && node.parent.parent.parent === sourceFile;
    const topLevelClass = ts.isClassDeclaration(node) && node.parent === sourceFile;
    const method = ts.isMethodDeclaration(node) || ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node) || ts.isConstructorDeclaration(node);
    if (topLevelFunction || topLevelVariable || topLevelClass || method) {
      const symbol = declarationSymbol(node);
      if (symbol) {
        const exported = topLevelFunction || topLevelClass
          ? hasExportModifier(node)
          : topLevelVariable
            ? hasExportModifier(node.parent.parent)
            : false;
        const container = method ? topLevelContainer(node, sourceFile) : null;
        declarations.push(Object.freeze({ path: source.path, symbol, coordinate: coordinate(source.path, symbol), node, sourceFile, exported, defaultExported: hasDefaultModifier(node), method, containerCoordinate: container ? coordinate(source.path, container) : null }));
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return declarations;
}

function declarationNameNode(node: ts.Node): ts.Node | null {
  if (ts.isClassDeclaration(node) || ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node) || ts.isPropertyDeclaration(node) || ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node) || ts.isVariableDeclaration(node)) return node.name ?? null;
  return null;
}

function createCompilerContext(sources: readonly Source[]): CompilerContext {
  const absoluteSources = new Map<string, Source>();
  for (const source of sources) absoluteSources.set(resolve(ROOT, source.path), source);
  const options: ts.CompilerOptions = {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    baseUrl: resolve(ROOT, "portal"),
    paths: { "@/*": ["src/*"] },
    noEmit: true,
    skipLibCheck: true,
  };
  const defaultHost = ts.createCompilerHost(options, true);
  const host: ts.CompilerHost = {
    ...defaultHost,
    fileExists: (fileName) => absoluteSources.has(resolve(fileName)) || defaultHost.fileExists(fileName),
    directoryExists: (directoryName) => {
      const absoluteDirectory = resolve(directoryName);
      return [...absoluteSources.keys()].some((fileName) => fileName.startsWith(`${absoluteDirectory}/`)) || defaultHost.directoryExists?.(directoryName) || false;
    },
    readFile: (fileName) => absoluteSources.get(resolve(fileName))?.text ?? defaultHost.readFile(fileName),
    getSourceFile: (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
      const source = absoluteSources.get(resolve(fileName));
      if (!source) return defaultHost.getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
      return ts.createSourceFile(fileName, source.text, languageVersion, true, source.path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    },
  };
  const program = ts.createProgram({ rootNames: [...absoluteSources.keys()], options, host });
  const checker = program.getTypeChecker();
  const sourceFiles = new Map<string, ts.SourceFile>();
  const declarations: Declaration[] = [];
  for (const source of sources) {
    const sourceFile = program.getSourceFile(resolve(ROOT, source.path));
    assert.ok(sourceFile, `COMPILER_SOURCE_UNAVAILABLE:${source.path}`);
    sourceFiles.set(source.path, sourceFile);
    declarations.push(...collectDeclarations(source, sourceFile));
  }
  const coordinateBySymbol = new Map<ts.Symbol, string>();
  for (const declaration of declarations) {
    const name = declarationNameNode(declaration.node);
    if (!name) continue;
    const symbol = checker.getSymbolAtLocation(name);
    if (symbol) coordinateBySymbol.set(symbol, declaration.coordinate);
  }
  return Object.freeze({ checker, sourceFiles, coordinateBySymbol });
}

function contains(outer: ts.Node, inner: ts.Node): boolean {
  return outer.pos <= inner.pos && outer.end >= inner.end;
}

function ownerFor(node: ts.Node, declarations: readonly Declaration[]): Declaration | null {
  const candidates = declarations.filter((declaration) => contains(declaration.node, node)).sort((left, right) => (left.node.end - left.node.pos) - (right.node.end - right.node.pos));
  return candidates[0] ?? null;
}

function callName(expression: ts.Expression): string | null {
  if (ts.isIdentifier(expression)) return expression.text;
  if (ts.isPropertyAccessExpression(expression)) return expression.name.text;
  if (ts.isElementAccessExpression(expression) && expression.argumentExpression && ts.isStringLiteral(expression.argumentExpression)) return expression.argumentExpression.text;
  return null;
}

function unwrapExpression(expression: ts.Expression): ts.Expression {
  let current = expression;
  while (ts.isParenthesizedExpression(current) || ts.isAsExpression(current) || ts.isTypeAssertionExpression(current) || ts.isSatisfiesExpression(current) || ts.isNonNullExpression(current)) current = current.expression;
  return current;
}

function resolvedSymbolAt(node: ts.Node, compiler: CompilerContext): ts.Symbol | null {
  let symbol = compiler.checker.getSymbolAtLocation(node);
  const seen = new Set<ts.Symbol>();
  while (symbol && (symbol.flags & ts.SymbolFlags.Alias) !== 0 && !seen.has(symbol)) {
    seen.add(symbol);
    symbol = compiler.checker.getAliasedSymbol(symbol);
  }
  return symbol ?? null;
}

function symbolResolvedCoordinate(expression: ts.Expression, compiler: CompilerContext): string | null {
  const unwrapped = unwrapExpression(expression);
  const location = ts.isPropertyAccessExpression(unwrapped)
    ? unwrapped.name
    : ts.isElementAccessExpression(unwrapped) && unwrapped.argumentExpression
      ? unwrapped.argumentExpression
      : unwrapped;
  const symbol = resolvedSymbolAt(location, compiler);
  return symbol ? compiler.coordinateBySymbol.get(symbol) ?? null : null;
}

function symbolInitializer(expression: ts.Expression, compiler: CompilerContext): ts.Expression | null {
  const unwrapped = unwrapExpression(expression);
  if (!ts.isIdentifier(unwrapped)) return null;
  const symbol = resolvedSymbolAt(unwrapped, compiler);
  const declaration = symbol?.valueDeclaration ?? symbol?.declarations?.[0];
  return declaration && ts.isVariableDeclaration(declaration) && declaration.initializer ? declaration.initializer : null;
}

function propertyChain(expression: ts.Expression): readonly string[] {
  if (ts.isIdentifier(expression)) return [expression.text];
  if (expression.kind === ts.SyntaxKind.ThisKeyword) return ["this"];
  if (ts.isPropertyAccessExpression(expression)) return [...propertyChain(expression.expression), expression.name.text];
  if (ts.isElementAccessExpression(expression) && expression.argumentExpression && ts.isStringLiteral(expression.argumentExpression)) return [...propertyChain(expression.expression), expression.argumentExpression.text];
  return [];
}

function sqlOperation(text: string): "INSERT" | "UPDATE" | "DELETE" | null {
  if (!LIFECYCLE_TABLE.test(text)) return null;
  if (/\bINSERT\s+INTO\b/i.test(text)) return "INSERT";
  if (/\bUPDATE\s+(?:["`]?[\w-]+["`]?\.)?["`]?program_/i.test(text)) return "UPDATE";
  if (/\bDELETE\s+FROM\b/i.test(text)) return "DELETE";
  return null;
}

function staticString(expression: ts.Expression, compiler: CompilerContext, seen: ReadonlySet<ts.Symbol> = new Set()): string | null {
  const unwrapped = unwrapExpression(expression);
  if (ts.isStringLiteral(unwrapped) || ts.isNoSubstitutionTemplateLiteral(unwrapped)) return unwrapped.text;
  if (ts.isTemplateExpression(unwrapped)) {
    let value = unwrapped.head.text;
    for (const span of unwrapped.templateSpans) {
      const substitution = staticString(span.expression, compiler, seen);
      if (substitution === null) return null;
      value += substitution + span.literal.text;
    }
    return value;
  }
  if (ts.isTaggedTemplateExpression(unwrapped) && /^(?:Prisma\.)?sql$/.test(unwrapped.tag.getText())) return staticString(unwrapped.template, compiler, seen);
  if (ts.isIdentifier(unwrapped)) {
    const symbol = resolvedSymbolAt(unwrapped, compiler);
    if (!symbol || seen.has(symbol)) return null;
    const initializer = symbolInitializer(unwrapped, compiler);
    return initializer ? staticString(initializer, compiler, new Set([...seen, symbol])) : null;
  }
  return null;
}

function staticObjectProperties(expression: ts.Expression, compiler: CompilerContext, seen: ReadonlySet<ts.Symbol> = new Set()): ReadonlyMap<string, ts.Expression> | null {
  const unwrapped = unwrapExpression(expression);
  if (ts.isIdentifier(unwrapped)) {
    const symbol = resolvedSymbolAt(unwrapped, compiler);
    if (!symbol || seen.has(symbol)) return null;
    const initializer = symbolInitializer(unwrapped, compiler);
    return initializer ? staticObjectProperties(initializer, compiler, new Set([...seen, symbol])) : null;
  }
  if (!ts.isObjectLiteralExpression(unwrapped)) return null;
  const properties = new Map<string, ts.Expression>();
  for (const property of unwrapped.properties) {
    if (ts.isSpreadAssignment(property)) {
      const spread = staticObjectProperties(property.expression, compiler, seen);
      if (!spread) return null;
      for (const [name, value] of spread) properties.set(name, value);
      continue;
    }
    if (ts.isShorthandPropertyAssignment(property)) {
      properties.set(property.name.text, property.name);
      continue;
    }
    if (!ts.isPropertyAssignment(property) || (!ts.isIdentifier(property.name) && !ts.isStringLiteral(property.name))) return null;
    properties.set(property.name.text, property.initializer);
  }
  return properties;
}

function hasPostOption(call: ts.CallExpression, compiler: CompilerContext): boolean {
  const options = call.arguments[1];
  if (!options) return false;
  const method = staticObjectProperties(options, compiler)?.get("method");
  return Boolean(method && staticString(method, compiler)?.toUpperCase() === "POST");
}

function lifecycleEndpoint(call: ts.CallExpression, compiler: CompilerContext): boolean {
  const first = call.arguments[0];
  return Boolean(first && staticString(first, compiler)?.includes("/api/operator/program-lifecycle"));
}

function isRecognizedRequestClient(expression: ts.Expression, compiler: CompilerContext, seen: ReadonlySet<ts.Symbol> = new Set()): boolean {
  const unwrapped = unwrapExpression(expression);
  if (!ts.isIdentifier(unwrapped)) return false;
  if (unwrapped.text === "fetchLike") return true;
  const symbol = compiler.checker.getSymbolAtLocation(unwrapped);
  if (!symbol) return unwrapped.text === "fetch";
  if (seen.has(symbol)) return false;
  const declarations = symbol.declarations ?? [];
  if (unwrapped.text === "fetch" && declarations.every((declaration) => declaration.getSourceFile().isDeclarationFile || ts.isImportSpecifier(declaration) || ts.isImportClause(declaration))) return true;
  if (declarations.some((declaration) => ts.isImportSpecifier(declaration) && (declaration.propertyName?.text ?? declaration.name.text) === "fetch")) return true;
  const initializer = symbolInitializer(unwrapped, compiler);
  return initializer ? isRecognizedRequestClient(initializer, compiler, new Set([...seen, symbol])) : false;
}

function lifecycleDelegateNames(sourceFile: ts.SourceFile): ReadonlySet<string> {
  const names = new Set<string>();
  const delegateType = /(?:ProgramLifecycleRecord|ProgramTransitionCommand|ProgramLifecycleTransitionReceipt)(?:Delegate)?/;
  const collectTyped = (node: ts.Node): void => {
    if ((ts.isParameter(node) || ts.isVariableDeclaration(node)) && ts.isIdentifier(node.name) && delegateType.test(node.type?.getText(sourceFile) ?? "")) names.add(node.name.text);
    ts.forEachChild(node, collectTyped);
  };
  collectTyped(sourceFile);
  let changed = true;
  while (changed) {
    changed = false;
    const visit = (node: ts.Node): void => {
      if (ts.isVariableDeclaration(node) && ts.isObjectBindingPattern(node.name) && node.initializer) {
        for (const element of node.name.elements) {
          const sourceName = element.propertyName && (ts.isIdentifier(element.propertyName) || ts.isStringLiteral(element.propertyName)) ? element.propertyName.text : ts.isIdentifier(element.name) ? element.name.text : "";
          if (["programLifecycleRecord", "programTransitionCommand", "programLifecycleTransitionReceipt"].includes(sourceName) && ts.isIdentifier(element.name) && !names.has(element.name.text)) { names.add(element.name.text); changed = true; }
        }
      }
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
        const initializer = unwrapExpression(node.initializer);
        const chain = propertyChain(initializer);
        const lifecycleModel = chain.some((part) => ["programLifecycleRecord", "programTransitionCommand", "programLifecycleTransitionReceipt"].includes(part));
        const alias = ts.isIdentifier(initializer) && names.has(initializer.text);
        if ((lifecycleModel || alias) && !names.has(node.name.text)) { names.add(node.name.text); changed = true; }
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
  }
  return names;
}

function isLifecycleDelegate(expression: ts.Expression, delegateNames: ReadonlySet<string>): boolean {
  const chain = propertyChain(unwrapExpression(expression));
  return chain.some((part) => ["programLifecycleRecord", "programTransitionCommand", "programLifecycleTransitionReceipt"].includes(part)) || chain.some((part) => delegateNames.has(part));
}

function isInboundRequestReceiver(receiver: ts.Expression, node: ts.Node, sourceFile: ts.SourceFile, compiler: CompilerContext): boolean {
  const unwrapped = unwrapExpression(receiver);
  if (!ts.isIdentifier(unwrapped)) return false;
  const resolvesRequest = (identifier: ts.Identifier, seen: ReadonlySet<ts.Symbol> = new Set()): boolean => {
    const symbol = compiler.checker.getSymbolAtLocation(identifier);
    if (symbol && seen.has(symbol)) return false;
    let current: ts.Node | undefined = node;
    while (current) {
      if (ts.isFunctionLike(current)) {
        const parameter = current.parameters.find((candidate) => ts.isIdentifier(candidate.name) && candidate.name.text === identifier.text);
        if (parameter) return identifier.text === "request" || /(?:Next)?Request/.test(parameter.type?.getText(sourceFile) ?? "");
      }
      current = current.parent;
    }
    const initializer = symbolInitializer(identifier, compiler);
    const next = initializer ? unwrapExpression(initializer) : null;
    return Boolean(next && ts.isIdentifier(next) && resolvesRequest(next, new Set(symbol ? [...seen, symbol] : seen)));
  };
  return resolvesRequest(unwrapped);
}

function isEnclosingParameter(name: string, node: ts.Node): boolean {
  let current: ts.Node | undefined = node;
  while (current) {
    if (ts.isFunctionLike(current) && current.parameters.some((parameter) => ts.isIdentifier(parameter.name) && parameter.name.text === name)) return true;
    current = current.parent;
  }
  return false;
}

function hasLifecycleReceiver(expression: ts.Expression, node: ts.Node, sourceFile: ts.SourceFile, compiler: CompilerContext): boolean {
  if (!ts.isPropertyAccessExpression(expression) && !ts.isElementAccessExpression(expression)) return false;
  const receiver = expression.expression;
  if (/ProgramLifecycle|ActivationSupersession|TransitionReceipt/.test(compiler.checker.typeToString(compiler.checker.getTypeAtLocation(receiver)))) return true;
  if (isLifecycleDelegate(receiver, lifecycleDelegateNames(sourceFile))) return true;
  if (ts.isCallExpression(receiver)) return /ProgramLifecycle|ActivationSupersession|TransitionReceipt/.test(callName(receiver.expression) ?? "");
  if (!ts.isIdentifier(receiver)) return /ProgramLifecycle|ActivationSupersession|TransitionReceipt/.test(receiver.getText(sourceFile));
  let current: ts.Node | undefined = node;
  while (current) {
    if (ts.isFunctionLike(current)) {
      const parameter = current.parameters.find((candidate) => ts.isIdentifier(candidate.name) && candidate.name.text === receiver.text);
      if (parameter && /ProgramLifecycle|ActivationSupersession|TransitionReceipt/.test(parameter.type?.getText(sourceFile) ?? "")) return true;
    }
    current = current.parent;
  }
  const initializer = symbolInitializer(receiver, compiler);
  return Boolean(initializer && /ProgramLifecycle|ActivationSupersession|TransitionReceipt/.test(initializer.getText(sourceFile)));
}

function inspectTypeScriptSource(source: Source, declarations: readonly Declaration[], compiler: CompilerContext): Readonly<{ effects: readonly EffectFinding[]; calls: readonly CallSite[] }> {
  const effects: EffectFinding[] = [];
  const calls: CallSite[] = [];
  const sourceFile = declarations[0]?.sourceFile ?? ts.createSourceFile(source.path, source.text, ts.ScriptTarget.Latest, true, source.path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const delegateNames = lifecycleDelegateNames(sourceFile);
  const ownershipRequests = new Map<string, { abortController: boolean; parameterCall: boolean }>();
  const addEffect = (owner: Declaration | null, kind: EffectKind, evidence: string): void => {
    if (!owner) throw new Error(`UNOWNED_EFFECT:${source.path}:${kind}`);
    effects.push(Object.freeze({ coordinate: owner.coordinate, kind, evidence }));
  };
  const visit = (node: ts.Node): void => {
    if (ts.isCallExpression(node)) {
      const owner = ownerFor(node, declarations);
      const name = callName(node.expression);
      if (name) {
        const expressionText = node.expression.getText(sourceFile);
        const fullText = node.getText(sourceFile);
        const receiver = ts.isPropertyAccessExpression(node.expression) || ts.isElementAccessExpression(node.expression) ? node.expression.expression : null;
        if (receiver && WRITE_METHODS.includes(name as (typeof WRITE_METHODS)[number]) && isLifecycleDelegate(receiver, delegateNames)) addEffect(owner, "PRISMA_MUTATION", expressionText);
        if (RAW_METHODS.includes(name as (typeof RAW_METHODS)[number])) {
          const sqlText = node.arguments[0] ? staticString(node.arguments[0], compiler) : null;
          const operation = sqlOperation(sqlText ?? fullText);
          if (operation) addEffect(owner, "PRISMA_RAW_EXECUTION", expressionText);
          if (operation) addEffect(owner, `RAW_SQL_${operation}`, (sqlText ?? fullText).slice(0, 240));
        }
        if (name === "$transaction" && (isProgramLifecyclePath(source.path) || LIFECYCLE_TABLE.test(fullText) || /programLifecycleRecord|programTransitionCommand|programLifecycleTransitionReceipt/.test(fullText))) addEffect(owner, "TRANSACTION", expressionText);
        if (isRecognizedRequestClient(node.expression, compiler) && hasPostOption(node, compiler) && lifecycleEndpoint(node, compiler)) addEffect(owner, "CLIENT_POST", expressionText);
        if (isProgramLifecyclePath(source.path) && name === "json" && ts.isPropertyAccessExpression(node.expression) && isInboundRequestReceiver(node.expression.expression, node, sourceFile, compiler)) addEffect(owner, "REQUEST_BODY", expressionText);
      }
      if (owner && name) {
        const receiverConstruction = ts.isPropertyAccessExpression(node.parent) && node.parent.expression === node && ts.isCallExpression(node.parent.parent);
        if (!receiverConstruction) calls.push(Object.freeze({ owner, calleeName: name, calleeExpression: node.expression, lifecycleReceiver: hasLifecycleReceiver(node.expression, node, sourceFile, compiler), edgeKind: "CALL", evidence: node.expression.getText(sourceFile) }));
        for (const argument of node.arguments) {
          const argumentName = callName(argument);
          if (argumentName) calls.push(Object.freeze({ owner, calleeName: argumentName, calleeExpression: argument, lifecycleReceiver: false, edgeKind: "ARGUMENT", evidence: argument.getText(sourceFile) }));
        }
        if (ts.isIdentifier(node.expression) && isEnclosingParameter(node.expression.text, node)) {
          const state = ownershipRequests.get(owner.coordinate) ?? { abortController: false, parameterCall: false };
          state.parameterCall = true;
          ownershipRequests.set(owner.coordinate, state);
        }
      }
    }
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      const owner = declarations.find((declaration) => declaration.node === node) ?? ownerFor(node, declarations);
      const initializerName = callName(node.initializer);
      if (owner && initializerName && !ts.isCallExpression(node.initializer)) calls.push(Object.freeze({ owner, calleeName: initializerName, calleeExpression: node.initializer, lifecycleReceiver: false, edgeKind: "ASSIGNMENT", evidence: node.initializer.getText(sourceFile) }));
    }
    if (ts.isReturnStatement(node) && node.expression) {
      const owner = ownerFor(node, declarations);
      const returnedName = callName(node.expression);
      if (owner && returnedName && !ts.isCallExpression(node.expression)) calls.push(Object.freeze({ owner, calleeName: returnedName, calleeExpression: node.expression, lifecycleReceiver: false, edgeKind: "RETURN", evidence: node.expression.getText(sourceFile) }));
      if (owner && ts.isObjectLiteralExpression(node.expression)) {
        for (const property of node.expression.properties) {
          if (!ts.isPropertyAssignment(property) && !ts.isShorthandPropertyAssignment(property)) continue;
          const value = ts.isPropertyAssignment(property) ? property.initializer : property.name;
          const valueName = callName(value);
          if (valueName) calls.push(Object.freeze({ owner, calleeName: valueName, calleeExpression: value, lifecycleReceiver: false, edgeKind: "RETURN", evidence: value.getText(sourceFile) }));
        }
      }
    }
    if (ts.isTaggedTemplateExpression(node)) {
      const owner = ownerFor(node, declarations);
      const name = callName(node.tag);
      if (name && RAW_METHODS.includes(name as (typeof RAW_METHODS)[number])) {
        const sqlText = staticString(node.template, compiler) ?? node.getText(sourceFile);
        const operation = sqlOperation(sqlText);
        if (operation) addEffect(owner, "PRISMA_RAW_EXECUTION", node.tag.getText(sourceFile));
        if (operation) addEffect(owner, `RAW_SQL_${operation}`, sqlText.slice(0, 240));
      }
    }
    if (ts.isNewExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "AbortController") {
      const owner = ownerFor(node, declarations);
      if (owner) {
        const state = ownershipRequests.get(owner.coordinate) ?? { abortController: false, parameterCall: false };
        state.abortController = true;
        ownershipRequests.set(owner.coordinate, state);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  for (const declaration of declarations) {
    if (declaration.symbol === "POST" && declaration.exported && declaration.path.includes("/api/operator/program-lifecycle/")) addEffect(declaration, "ROUTE_POST", "exported lifecycle POST route");
    const state = ownershipRequests.get(declaration.coordinate);
    if (state?.abortController && state.parameterCall) addEffect(declaration, "REQUEST_OWNERSHIP", "AbortController plus parameter-owned request call");
  }
  return Object.freeze({ effects: Object.freeze(effects), calls: Object.freeze(calls) });
}

function moduleTargetPath(fromPath: string, specifier: string, sourcePaths: readonly string[]): string | null {
  const base = specifier.startsWith("@/")
    ? `portal/src/${specifier.slice(2)}`
    : specifier.startsWith(".")
      ? relative(ROOT, resolve(ROOT, dirname(fromPath), specifier))
      : null;
  if (!base) return null;
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`]) if (sourcePaths.includes(candidate)) return candidate;
  return null;
}

function collectImportBindings(source: Source, sourcePaths: readonly string[], declarations: readonly Declaration[], compiler: CompilerContext): Readonly<{ bindings: readonly ImportBinding[]; reexports: readonly EvidenceEdge[]; starExports: readonly StarExport[] }> {
  const sourceFile = compiler.sourceFiles.get(source.path)!;
  const bindings: ImportBinding[] = [];
  const reexports: EvidenceEdge[] = [];
  const starExports: StarExport[] = [];
  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const targetPath = moduleTargetPath(source.path, statement.moduleSpecifier.text, sourcePaths);
      if (!targetPath || !statement.importClause) continue;
      if (statement.importClause.name) bindings.push(Object.freeze({ localName: statement.importClause.name.text, importedName: "default", targetPath, namespace: false }));
      const named = statement.importClause.namedBindings;
      if (named && ts.isNamedImports(named)) for (const element of named.elements) bindings.push(Object.freeze({ localName: element.name.text, importedName: element.propertyName?.text ?? element.name.text, targetPath, namespace: false }));
      if (named && ts.isNamespaceImport(named)) bindings.push(Object.freeze({ localName: named.name.text, importedName: "*", targetPath, namespace: true }));
    }
    if (ts.isExportDeclaration(statement)) {
      const targetPath = statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier) ? moduleTargetPath(source.path, statement.moduleSpecifier.text, sourcePaths) : null;
      if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
        for (const element of statement.exportClause.elements) {
          const importedName = element.propertyName?.text ?? element.name.text;
          const target = targetPath
            ? importedName === "default"
              ? declarations.find((candidate) => candidate.path === targetPath && candidate.defaultExported)?.coordinate ?? coordinate(targetPath, "default")
              : coordinate(targetPath, importedName)
            : symbolResolvedCoordinate(element.propertyName ?? element.name, compiler);
          const from = coordinate(source.path, element.name.text);
          if (target && target !== from) reexports.push(Object.freeze({ from, to: target, kind: "REEXPORT", evidence: statement.getText(sourceFile) }));
        }
      } else if (targetPath && statement.exportClause && ts.isNamespaceExport(statement.exportClause)) {
        starExports.push(Object.freeze({ sourcePath: source.path, targetPath, namespaceName: statement.exportClause.name.text, evidence: statement.getText(sourceFile) }));
        for (const declaration of declarations.filter((candidate) => candidate.path === targetPath && candidate.exported)) reexports.push(Object.freeze({ from: coordinate(source.path, statement.exportClause.name.text), to: declaration.coordinate, kind: "REEXPORT", evidence: statement.getText(sourceFile) }));
      } else if (targetPath && !statement.exportClause) {
        starExports.push(Object.freeze({ sourcePath: source.path, targetPath, namespaceName: null, evidence: statement.getText(sourceFile) }));
        for (const declaration of declarations.filter((candidate) => candidate.path === targetPath && candidate.exported)) reexports.push(Object.freeze({ from: coordinate(source.path, declaration.symbol), to: declaration.coordinate, kind: "REEXPORT", evidence: statement.getText(sourceFile) }));
      }
    }
    if (ts.isExportAssignment(statement) && !statement.isExportEquals) {
      for (const target of referencedValueCoordinates(statement.expression, compiler)) reexports.push(Object.freeze({ from: coordinate(source.path, "default"), to: target, kind: "REEXPORT", evidence: statement.getText(sourceFile) }));
    }
  }
  return Object.freeze({ bindings: Object.freeze(bindings), reexports: Object.freeze(reexports), starExports: Object.freeze(starExports) });
}

function expandStarReexports(seedEdges: readonly EvidenceEdge[], starExports: readonly StarExport[], declarations: readonly Declaration[]): readonly EvidenceEdge[] {
  const edges = [...seedEdges];
  const edgeKeys = new Set(edges.map((edge) => `${edge.from}\0${edge.to}\0${edge.kind}`));
  let changed = true;
  while (changed) {
    changed = false;
    for (const star of starExports) {
      const targets = new Map<string, string>();
      for (const declaration of declarations) {
        if (declaration.path === star.targetPath && declaration.exported && !declaration.defaultExported) targets.set(declaration.symbol, declaration.coordinate);
      }
      for (const edge of edges) {
        if (!edge.from.startsWith(`${star.targetPath}#`)) continue;
        const exposedName = edge.from.slice(star.targetPath.length + 1);
        if (exposedName !== "default") targets.set(exposedName, edge.from);
      }
      for (const [exposedName, target] of targets) {
        const from = coordinate(star.sourcePath, star.namespaceName ?? exposedName);
        const key = `${from}\0${target}\0REEXPORT`;
        if (edgeKeys.has(key)) continue;
        edges.push(Object.freeze({ from, to: target, kind: "REEXPORT", evidence: star.evidence }));
        edgeKeys.add(key);
        changed = true;
      }
    }
  }
  return edges;
}

function referencedValueCoordinates(expression: ts.Expression, compiler: CompilerContext): readonly string[] {
  const coordinates = new Set<string>();
  const visit = (node: ts.Node): void => {
    if (ts.isExpression(node)) {
      const unwrapped = unwrapExpression(node);
      const resolved = symbolResolvedCoordinate(unwrapped, compiler);
      if ((ts.isIdentifier(unwrapped) || ts.isPropertyAccessExpression(unwrapped) || ts.isElementAccessExpression(unwrapped)) && resolved) coordinates.add(resolved);
      if (unwrapped !== node) { visit(unwrapped); return; }
    }
    ts.forEachChild(node, visit);
  };
  visit(expression);
  return [...coordinates];
}

function effectiveExports(sources: readonly Source[], compiler: CompilerContext): EffectiveExports {
  const edges: EvidenceEdge[] = [];
  const declarationCoordinates = new Set<string>();
  const lifecyclePostCoordinates = new Set<string>();
  const addTarget = (from: string, symbol: ts.Symbol, evidence: string, seen: ReadonlySet<ts.Symbol> = new Set()): void => {
    const target = (symbol.flags & ts.SymbolFlags.Alias) !== 0 ? compiler.checker.getAliasedSymbol(symbol) : symbol;
    if (seen.has(target)) return;
    const directCoordinate = compiler.coordinateBySymbol.get(target);
    if (directCoordinate) {
      declarationCoordinates.add(directCoordinate);
      if (directCoordinate !== from) edges.push(Object.freeze({ from, to: directCoordinate, kind: "REEXPORT", evidence }));
      return;
    }
    if ((target.flags & ts.SymbolFlags.Module) !== 0) {
      for (const nested of compiler.checker.getExportsOfModule(target)) addTarget(from, nested, evidence, new Set([...seen, target]));
    }
  };
  for (const source of sources) {
    const sourceFile = compiler.sourceFiles.get(source.path)!;
    const moduleSymbol = compiler.checker.getSymbolAtLocation(sourceFile);
    if (moduleSymbol) {
      for (const exported of compiler.checker.getExportsOfModule(moduleSymbol)) {
        const publicCoordinate = coordinate(source.path, exported.getName());
        addTarget(publicCoordinate, exported, `effective module export ${exported.getName()}`);
        if (exported.getName() === "POST" && source.path.includes("/api/operator/program-lifecycle/") && source.path.endsWith("/route.ts")) lifecyclePostCoordinates.add(publicCoordinate);
      }
    }
    for (const statement of sourceFile.statements) {
      if (!ts.isExportAssignment(statement) || statement.isExportEquals) continue;
      for (const target of referencedValueCoordinates(statement.expression, compiler)) edges.push(Object.freeze({ from: coordinate(source.path, "default"), to: target, kind: "REEXPORT", evidence: statement.getText(sourceFile) }));
    }
  }
  return Object.freeze({ edges: Object.freeze(edges), declarationCoordinates, lifecyclePostCoordinates });
}

function valueFlowEdges(declarations: readonly Declaration[], compiler: CompilerContext): readonly EvidenceEdge[] {
  const edges: EvidenceEdge[] = [];
  for (const declaration of declarations) {
    if (!ts.isVariableDeclaration(declaration.node) || !declaration.node.initializer) continue;
    for (const target of referencedValueCoordinates(declaration.node.initializer, compiler)) {
      if (target !== declaration.coordinate) edges.push(Object.freeze({ from: declaration.coordinate, to: target, kind: "ASSIGNMENT", evidence: declaration.node.initializer.getText(declaration.sourceFile) }));
    }
  }
  return edges;
}

function resolveCallTarget(call: CallSite, compiler: CompilerContext, bindings: readonly ImportBinding[], declarations: readonly Declaration[], directEffectCoordinates: readonly string[]): string | null {
  const expression = call.calleeExpression;
  const symbolCoordinate = symbolResolvedCoordinate(expression, compiler);
  if (symbolCoordinate && symbolCoordinate !== call.owner.coordinate) return symbolCoordinate;
  if (ts.isIdentifier(expression)) {
    const binding = bindings.find((candidate) => candidate.localName === expression.text && !candidate.namespace);
    if (binding) return binding.importedName === "default"
      ? declarations.find((declaration) => declaration.path === binding.targetPath && declaration.defaultExported)?.coordinate ?? coordinate(binding.targetPath, "default")
      : coordinate(binding.targetPath, binding.importedName);
  }
  if (ts.isPropertyAccessExpression(expression) && ts.isIdentifier(expression.expression)) {
    const namespaceName = expression.expression.text;
    const binding = bindings.find((candidate) => candidate.localName === namespaceName && candidate.namespace);
    if (binding) return coordinate(binding.targetPath, expression.name.text);
  }
  const directTargets = declarations.filter((declaration) => declaration.symbol === call.calleeName && directEffectCoordinates.includes(declaration.coordinate));
  if (ts.isPropertyAccessExpression(expression) && call.lifecycleReceiver && directTargets.length === 1) return directTargets[0]!.coordinate;
  if (ts.isPropertyAccessExpression(expression) && call.calleeName === "execute" && ts.isCallExpression(expression.expression)) {
    const factoryName = callName(expression.expression.expression);
    const factoryTargets = declarations.filter((declaration) => declaration.path === call.owner.path && declaration.symbol === factoryName);
    if (factoryTargets.length === 1) return factoryTargets[0]!.coordinate;
  }
  return null;
}

function inferWriteSeam(declaration: Declaration, directKinds: readonly EffectKind[]): InferredSeam {
  const supersession = declaration.path.includes("program-activation-supersession");
  const directTransaction = directKinds.includes("TRANSACTION");
  const directSql = directKinds.some((kind) => kind.startsWith("RAW_SQL_") || kind === "PRISMA_MUTATION");
  const boundary = declaration.path.endsWith("-boundary.ts");
  const surfaceClass = directSql || (directTransaction && declaration.method) ? "ADAPTER" : boundary ? "PURE" : "SERVER";
  const effectClass = directSql ? "RAW_SQL_PERSISTENCE" : supersession ? "LIFECYCLE_TRANSACTION" : "PERSISTENCE_BOUNDARY";
  const triggerClass = surfaceClass === "ADAPTER" || boundary ? "ADAPTER" : "DIRECT";
  const canonicalBoundary = declaration.path.includes("program-lifecycle-persistence-boundary")
    ? "C6A"
    : declaration.path.endsWith("program-lifecycle-persistence.ts")
      ? "C6"
      : declaration.symbol === "setProgramLifecycleState"
        ? "C7"
        : declaration.symbol === "insertProgramTransitionReceiptSet"
          ? "C8"
          : "C7/C8";
  return Object.freeze({ path: declaration.path, symbol: declaration.symbol, surfaceClass, effectClass, triggerClass, disposition: "CANONICAL_AND_GUARDED", writeCapable: true, evidencePosture: "STATIC_SOURCE", canonicalBoundary, evidence: Object.freeze(directKinds.length > 0 ? [...directKinds] : ["structural caller path to write-capable seam"]) });
}

function inferRequestSeam(declaration: Declaration, directKinds: readonly EffectKind[]): InferredSeam {
  const c12 = declaration.path.includes("app/operator/program-lifecycle/");
  const route = declaration.path.includes("/api/operator/program-lifecycle/");
  return Object.freeze({
    path: declaration.path,
    symbol: declaration.symbol,
    surfaceClass: route ? "ROUTE" : c12 ? "CLIENT" : "SERVER",
    effectClass: "NONE",
    triggerClass: "REQUEST",
    disposition: "CLASSIFICATION_ONLY",
    writeCapable: false,
    evidencePosture: c12 ? "SUPPLIED_SNAPSHOT" : "STATIC_SOURCE",
    canonicalBoundary: c12 ? "C12" : "C5",
    evidence: Object.freeze(directKinds.length > 0 ? [...directKinds] : ["structural caller path to request-capable seam"]),
  });
}

function inferExposureSeam(exposureCoordinate: string, writeCapable: boolean): InferredSeam {
  const separator = exposureCoordinate.lastIndexOf("#");
  const path = exposureCoordinate.slice(0, separator);
  const symbol = exposureCoordinate.slice(separator + 1);
  return Object.freeze({
    path,
    symbol,
    surfaceClass: "SERVER",
    effectClass: writeCapable ? "PERSISTENCE_BOUNDARY" : "NONE",
    triggerClass: "DIRECT",
    disposition: writeCapable ? "CANONICAL_AND_GUARDED" : "CLASSIFICATION_ONLY",
    writeCapable,
    evidencePosture: "STATIC_SOURCE",
    canonicalBoundary: "DECLARED_CANONICAL_METADATA_REQUIRED",
    evidence: Object.freeze(["public re-export exposure with structurally reachable lifecycle effect"]),
  });
}

function inferEffectiveRoutePostSeam(exposureCoordinate: string, evidence: string): InferredSeam {
  const separator = exposureCoordinate.lastIndexOf("#");
  return Object.freeze({
    path: exposureCoordinate.slice(0, separator),
    symbol: exposureCoordinate.slice(separator + 1),
    surfaceClass: "ROUTE",
    effectClass: "NONE",
    triggerClass: "REQUEST",
    disposition: "CLASSIFICATION_ONLY",
    writeCapable: false,
    evidencePosture: "STATIC_SOURCE",
    canonicalBoundary: "C5",
    evidence: Object.freeze([evidence]),
  });
}

function declarativeSeams(sources: readonly Source[]): readonly InferredSeam[] {
  const findings: InferredSeam[] = [];
  const observedCoordinates = new Set<string>();
  const addFinding = (finding: InferredSeam): void => {
    const existingIndex = findings.findIndex((candidate) => coordinate(candidate.path, candidate.symbol) === coordinate(finding.path, finding.symbol));
    if (existingIndex < 0) { findings.push(finding); return; }
    const existing = findings[existingIndex]!;
    for (const key of ["surfaceClass", "effectClass", "triggerClass", "disposition", "writeCapable", "evidencePosture", "canonicalBoundary"] as const) {
      if (existing[key] !== finding[key]) throw new Error(`CONFLICTING_CLASSIFICATION:${coordinate(finding.path, finding.symbol)}`);
    }
    findings[existingIndex] = Object.freeze({ ...existing, evidence: Object.freeze([...existing.evidence, ...finding.evidence]) });
  };
  for (const source of sources) {
    if (source.kind === "PRISMA") {
      for (const match of source.text.matchAll(/^model\s+(ProgramLifecycleRecord|ProgramTransitionCommand|ProgramLifecycleTransitionReceipt)\s*\{/gm)) {
        const statementKey = coordinate(source.path, `model ${match[1]}`);
        if (observedCoordinates.has(statementKey)) throw new Error(`DUPLICATE_DECLARATIVE_COORDINATE:${statementKey}`);
        observedCoordinates.add(statementKey);
        addFinding(Object.freeze({ path: source.path, symbol: `model ${match[1]}`, surfaceClass: "SCHEMA", effectClass: "DECLARATIVE", triggerClass: "DECLARATION", disposition: "DOCUMENTARY_ONLY", writeCapable: false, evidencePosture: "DECLARATIVE_ONLY", canonicalBoundary: match[1] === "ProgramLifecycleRecord" ? "C6/C7" : "C8", evidence: Object.freeze([match[0]]) }));
      }
    }
    if (source.kind === "SQL") {
      for (const statement of source.text.split(";").map((value) => value.trim()).filter(Boolean)) {
        const match = /^(?:(CREATE|ALTER|DROP)\s+TABLE|(INSERT)\s+INTO|(UPDATE)|(DELETE)\s+FROM)\s+(?:"[^"]+"\.)?"(program_lifecycle_records|program_transition_commands|program_lifecycle_transition_receipts)"/i.exec(statement);
        if (!match) continue;
        const action = match[1]?.toUpperCase() ?? (match[2] ? "INSERT" : match[3] ? "UPDATE" : "DELETE");
        const table = match[5]!;
        const actionPhrase = ["CREATE", "ALTER", "DROP"].includes(action) ? `${action} TABLE` : action === "INSERT" ? "INSERT INTO" : action === "DELETE" ? "DELETE FROM" : "UPDATE";
        const symbol = `${actionPhrase} "${table}"`;
        const alterKind = action === "ALTER" ? (/\bADD\s+COLUMN\b/i.test(statement) ? "ADD_COLUMN" : /\bADD\s+CONSTRAINT\b/i.test(statement) ? "ADD_CONSTRAINT" : /\bDROP\s+COLUMN\b/i.test(statement) ? "DROP_COLUMN" : "OTHER") : action;
        const uniquenessKey = `${coordinate(source.path, symbol)}:${alterKind}`;
        if (observedCoordinates.has(uniquenessKey)) throw new Error(`DUPLICATE_DECLARATIVE_COORDINATE:${coordinate(source.path, symbol)}`);
        observedCoordinates.add(uniquenessKey);
        const canonicalBoundary = table === "program_lifecycle_records" ? (action === "CREATE" ? "C6" : "C7") : "C8";
        addFinding(Object.freeze({ path: source.path, symbol, surfaceClass: "MIGRATION", effectClass: "DECLARATIVE", triggerClass: "DECLARATION", disposition: "DOCUMENTARY_ONLY", writeCapable: false, evidencePosture: "DECLARATIVE_ONLY", canonicalBoundary, evidence: Object.freeze([statement]) }));
      }
    }
  }
  return findings;
}

function assertUniqueSeams(seams: readonly InferredSeam[]): void {
  const sorted = [...seams].map((seam) => coordinate(seam.path, seam.symbol)).sort();
  for (let index = 1; index < sorted.length; index += 1) if (sorted[index] === sorted[index - 1]) throw new Error(`DUPLICATE_COORDINATE:${sorted[index]}`);
}

function scanSources(sources: readonly Source[]): ScanResult {
  const typeScriptSources = sources.filter((source) => source.kind === "TS");
  const compiler = createCompilerContext(typeScriptSources);
  const declarations = typeScriptSources.flatMap((source) => collectDeclarations(source, compiler.sourceFiles.get(source.path)!));
  const sourcePaths = typeScriptSources.map((source) => source.path);
  const inspections = typeScriptSources.map((source) => inspectTypeScriptSource(source, declarations.filter((declaration) => declaration.path === source.path), compiler));
  const effective = effectiveExports(typeScriptSources, compiler);
  const effects = inspections.flatMap((inspection) => inspection.effects);
  for (const publicCoordinate of effective.lifecyclePostCoordinates) {
    if (!effects.some((effect) => effect.coordinate === publicCoordinate && effect.kind === "ROUTE_POST")) effects.push(Object.freeze({ coordinate: publicCoordinate, kind: "ROUTE_POST", evidence: "effective lifecycle POST module export" }));
  }
  const calls = inspections.flatMap((inspection) => inspection.calls);
  const directWriteCoordinates = effects.filter((effect) => ["PRISMA_MUTATION", "RAW_SQL_INSERT", "RAW_SQL_UPDATE", "RAW_SQL_DELETE", "PRISMA_RAW_EXECUTION", "TRANSACTION"].includes(effect.kind)).map((effect) => effect.coordinate);
  const directRequestCoordinates = effects.filter((effect) => ["CLIENT_POST", "REQUEST_BODY", "REQUEST_OWNERSHIP", "ROUTE_POST"].includes(effect.kind)).map((effect) => effect.coordinate);
  const imports = typeScriptSources.map((source) => ({ path: source.path, ...collectImportBindings(source, sourcePaths, declarations, compiler) }));
  const callEdges: EvidenceEdge[] = [];
  for (const call of calls) {
    const binding = imports.find((entry) => entry.path === call.owner.path)?.bindings ?? [];
    const target = resolveCallTarget(call, compiler, binding, declarations, directWriteCoordinates);
    if (target) callEdges.push(Object.freeze({ from: call.owner.coordinate, to: target, kind: call.edgeKind, evidence: call.evidence }));
  }
  const importEdges: EvidenceEdge[] = imports.flatMap((entry) => entry.bindings.map((binding) => Object.freeze({ from: coordinate(entry.path, "<module>"), to: coordinate(binding.targetPath, binding.importedName), kind: "IMPORT" as const, evidence: binding.namespace ? `namespace ${binding.localName}` : binding.localName })));
  const reexports = expandStarReexports(
    [...effective.edges, ...imports.flatMap((entry) => entry.reexports)],
    imports.flatMap((entry) => entry.starExports),
    declarations,
  );
  const containmentEdges: EvidenceEdge[] = declarations.flatMap((declaration) => declaration.containerCoordinate ? [Object.freeze({ from: declaration.containerCoordinate, to: declaration.coordinate, kind: "CONTAINMENT" as const, evidence: "lexical member containment" })] : []);
  const assignmentEdges = valueFlowEdges(declarations, compiler);
  const graphEdges = [...callEdges, ...reexports, ...containmentEdges, ...assignmentEdges];
  const writeReachable = new Set(directWriteCoordinates);
  const requestReachable = new Set(directRequestCoordinates);
  let changed = true;
  while (changed) {
    changed = false;
    for (const edge of graphEdges) {
      if (writeReachable.has(edge.to) && !writeReachable.has(edge.from)) { writeReachable.add(edge.from); changed = true; }
      if (requestReachable.has(edge.to) && !requestReachable.has(edge.from)) { requestReachable.add(edge.from); changed = true; }
    }
  }
  const seams: InferredSeam[] = [];
  for (const declaration of declarations) {
    const directKinds = effects.filter((effect) => effect.coordinate === declaration.coordinate).map((effect) => effect.kind);
    const writes = writeReachable.has(declaration.coordinate);
    const requests = requestReachable.has(declaration.coordinate);
    const pureAnchor = PURE_ANCHORS.find((anchorValue) => coordinate(anchorValue.path, anchorValue.symbol) === declaration.coordinate);
    if ((writes && requests) || (pureAnchor && (writes || requests))) throw new Error(`CONFLICTING_CLASSIFICATION:${declaration.coordinate}`);
    if (pureAnchor) seams.push(Object.freeze({ ...pureAnchor, evidence: Object.freeze([declaration.node.getText(declaration.sourceFile).slice(0, 200)]) }));
    else if (writes && (declaration.exported || effective.declarationCoordinates.has(declaration.coordinate) || directKinds.length > 0)) seams.push(inferWriteSeam(declaration, directKinds));
    else if (requests && (declaration.exported || effective.declarationCoordinates.has(declaration.coordinate))) seams.push(inferRequestSeam(declaration, directKinds));
  }
  const declarationCoordinates = new Set(declarations.map((declaration) => declaration.coordinate));
  for (const exposure of reexports) {
    if (declarationCoordinates.has(exposure.from) || seams.some((seam) => coordinate(seam.path, seam.symbol) === exposure.from)) continue;
    const writes = writeReachable.has(exposure.from);
    const requests = requestReachable.has(exposure.from);
    if (writes && requests) throw new Error(`CONFLICTING_CLASSIFICATION:${exposure.from}`);
    if (effective.lifecyclePostCoordinates.has(exposure.from)) seams.push(inferEffectiveRoutePostSeam(exposure.from, exposure.evidence));
    else if (writes || requests) seams.push(inferExposureSeam(exposure.from, writes));
  }
  const declarationsFound = declarativeSeams(sources);
  seams.push(...declarationsFound);
  assertUniqueSeams(seams);
  const seamCoordinates = seams.map((seam) => coordinate(seam.path, seam.symbol));
  const canReach = (from: string, to: string): boolean => {
    const visited = new Set<string>();
    const pending = [from];
    while (pending.length > 0) {
      const current = pending.pop()!;
      if (current === to) return true;
      if (visited.has(current)) continue;
      visited.add(current);
      for (const edge of graphEdges) if (edge.from === current) pending.push(edge.to);
    }
    return false;
  };
  for (const effect of effects) assert.ok(seamCoordinates.some((seamCoordinate) => canReach(seamCoordinate, effect.coordinate)), `UNMAPPED_EFFECT:${effect.coordinate}:${effect.kind}`);
  const relevantEdges = [...callEdges, ...importEdges, ...reexports, ...containmentEdges, ...assignmentEdges].filter((edge) => seamCoordinates.includes(edge.to) || writeReachable.has(edge.to) || requestReachable.has(edge.to));
  return Object.freeze({
    seams: Object.freeze(seams),
    effects: Object.freeze(effects),
    edges: Object.freeze(relevantEdges),
    effectiveExportedCoordinates: Object.freeze([...effective.declarationCoordinates].sort()),
    declarativeCount: declarationsFound.length,
    productionSourceCount: typeScriptSources.length,
    migrationFileCount: sources.filter((source) => source.kind === "SQL").length,
  });
}

function assertFrozen(value: unknown): void {
  if (value === null || typeof value !== "object") return;
  assert.equal(Object.isFrozen(value), true);
  for (const key of Reflect.ownKeys(value)) assertFrozen((value as Record<PropertyKey, unknown>)[key]);
}

function fixture(path: string, text: string): Source {
  return Object.freeze({ path, text, kind: "TS" });
}

function sqlFixture(path: string, text: string): Source {
  return Object.freeze({ path, text, kind: "SQL" });
}

assert.equal(PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY_VERSION, "c13-program-lifecycle-mutation-seam-registry/v1");
assert.deepEqual(PROGRAM_LIFECYCLE_SEAM_DISPOSITIONS, ["CANONICAL_AND_GUARDED", "CLASSIFICATION_ONLY", "DOCUMENTARY_ONLY", "FORMALLY_DEPRECATED_AND_UNREACHABLE", "UNRESOLVED_BYPASS"]);
assertFrozen(PROGRAM_LIFECYCLE_SEAM_DISPOSITIONS);
assertFrozen(PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY);
assert.deepEqual(PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY.map((entry) => entry.id), [...PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY].map((entry) => entry.id).sort());
assert.equal(new Set(PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY.map((entry) => entry.id)).size, PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY.length);
assert.equal(new Set(PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY.map((entry) => coordinate(entry.path, entry.symbol))).size, PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY.length);
for (const entry of PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY) {
  assert.deepEqual(Reflect.ownKeys(entry), ENTRY_KEYS);
  assert.match(entry.id, /^C13-SEAM-[0-9]{3}$/);
  assert.match(entry.path, /^(?:portal\/src|portal\/prisma)\//);
  assert.ok(entry.symbol.length > 0 && entry.guardEvidence.length > 0 && entry.canonicalBoundary.length > 0);
  assert.equal(entry.authorityEffect, "NONE");
  assert.equal(entry.mutationAuthorized, false);
  assert.equal(entry.disposition === "FORMALLY_DEPRECATED_AND_UNREACHABLE", entry.replacement !== null);
  if (entry.writeCapable) assert.ok(["PERSISTENCE_BOUNDARY", "RAW_SQL_PERSISTENCE", "LIFECYCLE_TRANSACTION"].includes(entry.effectClass));
  if (["NONE", "IN_MEMORY_DRAFT", "DECLARATIVE"].includes(entry.effectClass)) assert.equal(entry.writeCapable, false);
}

const live = scanSources(collectRepositorySources());
const liveCoordinates = live.seams.map((seam) => coordinate(seam.path, seam.symbol)).sort();
const registryCoordinates = PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY.map((entry) => coordinate(entry.path, entry.symbol)).sort();
assert.deepEqual(liveCoordinates, registryCoordinates);
for (const seam of live.seams) {
  const entry = PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY.find((candidate) => coordinate(candidate.path, candidate.symbol) === coordinate(seam.path, seam.symbol));
  assert.ok(entry);
  for (const key of ["surfaceClass", "effectClass", "triggerClass", "disposition", "writeCapable", "evidencePosture"] as const) assert.equal(entry[key], seam[key], `${coordinate(seam.path, seam.symbol)}:${key}`);
  assert.ok(entry.canonicalBoundary.length > 0 && entry.guardEvidence.length > 0, `${coordinate(seam.path, seam.symbol)}:declared canonical metadata`);
}
assert.equal(PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY.some((entry) => entry.disposition === "UNRESOLVED_BYPASS"), false);
assert.ok(PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY.filter((entry) => entry.writeCapable).every((entry) => ["C6A", "C6", "C7", "C8", "C7/C8"].includes(entry.canonicalBoundary)));
assert.ok(PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY.filter((entry) => ["C5", "C9", "C10", "C11", "C12"].includes(entry.canonicalBoundary)).every((entry) => !entry.writeCapable));
assert.deepEqual(PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY.filter((entry) => entry.symbol === "createProgramTransitionReceiptSetDraft").map((entry) => [entry.effectClass, entry.writeCapable]), [["IN_MEMORY_DRAFT", false]]);
assert.deepEqual(PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY.filter((entry) => entry.path.endsWith("FounderActiveProgramControlSurface.tsx")).map((entry) => [entry.symbol, entry.surfaceClass, entry.disposition]), [
  ["createC5ClassificationTransport", "CLIENT", "CLASSIFICATION_ONLY"],
  ["createClassificationRequestBoundary", "CLIENT", "CLASSIFICATION_ONLY"],
  ["FounderActiveProgramControlSurface", "CLIENT", "CLASSIFICATION_ONLY"],
]);
assert.deepEqual(PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY.filter((entry) => entry.surfaceClass === "SCHEMA").map((entry) => entry.symbol), ["model ProgramLifecycleRecord", "model ProgramTransitionCommand", "model ProgramLifecycleTransitionReceipt"]);
assert.deepEqual(PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY.filter((entry) => entry.path.includes("20260730190000")).map((entry) => entry.symbol), ["CREATE TABLE \"program_transition_commands\"", "CREATE TABLE \"program_lifecycle_transition_receipts\""]);
assert.equal(PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY.length, 31);
assert.deepEqual(Object.fromEntries(PROGRAM_LIFECYCLE_SEAM_DISPOSITIONS.map((disposition) => [disposition, PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY.filter((entry) => entry.disposition === disposition).length])), {
  CANONICAL_AND_GUARDED: 13,
  CLASSIFICATION_ONLY: 9,
  DOCUMENTARY_ONLY: 9,
  FORMALLY_DEPRECATED_AND_UNREACHABLE: 0,
  UNRESOLVED_BYPASS: 0,
});
const c14RegistryEntry = PROGRAM_LIFECYCLE_MUTATION_SEAM_REGISTRY.find((entry) => entry.id === "C13-SEAM-031");
assert.ok(c14RegistryEntry);
assert.deepEqual(c14RegistryEntry, {
  id: "C13-SEAM-031",
  path: "portal/src/lib/controlPlane/programLifecycle/program-lifecycle-reconciliation-recovery-boundary.ts",
  symbol: "reconcileProgramLifecycleFaultAndRehearseRollback",
  surfaceClass: "PURE",
  effectClass: "NONE",
  triggerClass: "SUPPLIED_SNAPSHOT",
  guardEvidence: "C14 supplied-snapshot fault reconciliation, human-review reporting, and in-memory rollback rehearsal only",
  canonicalBoundary: "C14",
  disposition: "CLASSIFICATION_ONLY",
  replacement: null,
  writeCapable: false,
  evidencePosture: "SUPPLIED_SNAPSHOT",
  authorityEffect: "NONE",
  mutationAuthorized: false,
});
assert.equal(live.effects.length, 13);
assert.equal(live.declarativeCount, 7);
assert.equal(live.seams.filter((seam) => seam.writeCapable).length, 8);

const mutationFixtures = scanSources([
  fixture("fixture/direct.ts", "export async function anything() { return prisma.programLifecycleRecord.update({}); }"),
  fixture("fixture/insert.ts", "function arbitraryInsert() { return prisma.$queryRaw(Prisma.sql`INSERT INTO \"program_lifecycle_records\" VALUES (1)`); }"),
  fixture("fixture/update.ts", "function arbitraryUpdate() { return prisma.$queryRaw(Prisma.sql`UPDATE \"program_lifecycle_records\" SET x = 1`); }"),
  fixture("fixture/delete.ts", "function arbitraryDelete() { return prisma.$queryRaw(Prisma.sql`DELETE FROM \"program_lifecycle_records\"`); }"),
  fixture("fixture/execute.ts", "function arbitraryExecute() { return prisma.$executeRaw(Prisma.sql`UPDATE \"program_lifecycle_records\" SET x = 1`); }"),
  fixture("fixture/transaction.ts", "function surprisingWrapper() { return prisma.$transaction(async (tx) => tx.programLifecycleRecord.update({})); }"),
  fixture("portal/src/app/api/operator/program-lifecycle/alternate/route.ts", "export async function POST() { return new Response(null); }"),
  fixture("portal/src/app/operator/program-lifecycle/alternate.tsx", "export function oddlyNamedTransport() { return fetch('/api/operator/program-lifecycle/alternate', { method: \"POST\" }); }"),
]);
for (const kind of ["PRISMA_MUTATION", "RAW_SQL_INSERT", "RAW_SQL_UPDATE", "RAW_SQL_DELETE", "PRISMA_RAW_EXECUTION", "TRANSACTION", "ROUTE_POST", "CLIENT_POST"] as const) assert.ok(mutationFixtures.effects.some((effect) => effect.kind === kind));

const genericPrismaFixtures = scanSources([
  fixture("fixture/tx.ts", "export function txWrite(tx: unknown) { return tx.programLifecycleRecord.update({}); }"),
  fixture("fixture/db.ts", "export function dbWrite(db: unknown) { return db.programLifecycleRecord.delete({}); }"),
  fixture("fixture/this-db.ts", "export class Store { mutate() { return this.prisma.programLifecycleRecord.upsert({}); } }"),
  fixture("fixture/detached.ts", "const records = db.programLifecycleRecord; const alias = records; export function detachedWrite() { return alias.createMany({}); }"),
  fixture("fixture/destructured.ts", "const { programLifecycleRecord: records } = db; export function destructuredWrite() { return records.update({}); }"),
  fixture("fixture/typed-delegate.ts", "type ProgramLifecycleRecordDelegate = { delete(args: unknown): unknown }; export function typedDelegateWrite(records: ProgramLifecycleRecordDelegate) { return records.delete({}); }"),
]);
assert.deepEqual(genericPrismaFixtures.effects.filter((effect) => effect.kind === "PRISMA_MUTATION").map((effect) => effect.coordinate).sort(), [
  "fixture/db.ts#dbWrite",
  "fixture/destructured.ts#destructuredWrite",
  "fixture/detached.ts#detachedWrite",
  "fixture/this-db.ts#mutate",
  "fixture/tx.ts#txWrite",
  "fixture/typed-delegate.ts#typedDelegateWrite",
]);
assert.ok(genericPrismaFixtures.seams.some((seam) => seam.symbol === "mutate" && seam.writeCapable));
assert.ok(genericPrismaFixtures.seams.some((seam) => seam.symbol === "Store" && seam.writeCapable));

const rawSqlFixtures = scanSources([
  fixture("fixture/raw-called.ts", [
    "export function calledInsert() { return db.$queryRaw(Prisma.sql`INSERT INTO \"program_lifecycle_records\" VALUES (1)`); }",
    "export function calledUpdate() { return db.$executeRaw(Prisma.sql`UPDATE \"program_lifecycle_records\" SET x = 1`); }",
    "export function calledDelete() { return db.$queryRawUnsafe('DELETE FROM program_lifecycle_records'); }",
  ].join("\n")),
  fixture("fixture/raw-tagged.ts", [
    "export function taggedInsert() { return db.$queryRaw`INSERT INTO \"program_lifecycle_records\" VALUES (1)`; }",
    "export function taggedUpdate() { return db.$executeRaw`UPDATE \"program_lifecycle_records\" SET x = 1`; }",
    "export function taggedDelete() { return db.$queryRawUnsafe`DELETE FROM \"program_lifecycle_records\"`; }",
  ].join("\n")),
]);
for (const operation of ["RAW_SQL_INSERT", "RAW_SQL_UPDATE", "RAW_SQL_DELETE"] as const) assert.equal(rawSqlFixtures.effects.filter((effect) => effect.kind === operation).length, 2);
assert.equal(rawSqlFixtures.effects.filter((effect) => effect.kind === "PRISMA_RAW_EXECUTION").length, 6);

const rawSqlAliasFixtures = scanSources([
  fixture("fixture/raw-alias.ts", [
    "const query = 'DELETE FROM \"program_lifecycle_records\"';",
    "const alias = (query as string);",
    "export function aliasedDelete() { return db.$executeRawUnsafe(alias); }",
  ].join("\n")),
  fixture("fixture/raw-prisma-sql.ts", [
    "const query = Prisma.sql`UPDATE \"public\".\"program_lifecycle_records\" SET \"version\" = 2`;",
    "export function schemaQualifiedUpdate() { return db.$queryRaw(query); }",
  ].join("\n")),
]);
assert.ok(rawSqlAliasFixtures.effects.some((effect) => effect.coordinate.endsWith("#aliasedDelete") && effect.kind === "PRISMA_RAW_EXECUTION"));
assert.ok(rawSqlAliasFixtures.effects.some((effect) => effect.coordinate.endsWith("#aliasedDelete") && effect.kind === "RAW_SQL_DELETE"));
assert.ok(rawSqlAliasFixtures.effects.some((effect) => effect.coordinate.endsWith("#schemaQualifiedUpdate") && effect.kind === "PRISMA_RAW_EXECUTION"));
assert.ok(rawSqlAliasFixtures.effects.some((effect) => effect.coordinate.endsWith("#schemaQualifiedUpdate") && effect.kind === "RAW_SQL_UPDATE"));

const edgeFixtures = scanSources([
  fixture("fixture/write.ts", "export function actualWrite() { return prisma.programLifecycleRecord.update({}); }"),
  fixture("fixture/alias.ts", "import { actualWrite as renamedWrite } from './write'; export function aliasFacade() { return renamedWrite(); }"),
  fixture("fixture/namespace.ts", "import * as lifecycle from './write'; export function namespaceFacade() { return lifecycle.actualWrite(); }"),
  fixture("fixture/reexport.ts", "export { actualWrite as forwardedWrite } from './write';"),
  fixture("fixture/unknown.ts", "import { actualWrite } from './write'; export function neverListedFacade() { return actualWrite(); }"),
]);
assert.ok(edgeFixtures.edges.some((edge) => edge.kind === "CALL" && edge.from.endsWith("#aliasFacade") && edge.to.endsWith("#actualWrite")));
assert.ok(edgeFixtures.edges.some((edge) => edge.kind === "CALL" && edge.from.endsWith("#namespaceFacade") && edge.to.endsWith("#actualWrite")));
assert.ok(edgeFixtures.edges.some((edge) => edge.kind === "REEXPORT" && edge.to.endsWith("#actualWrite")));
assert.ok(edgeFixtures.seams.some((seam) => seam.symbol === "neverListedFacade" && seam.writeCapable));

const effectiveLocalExportFixtures = scanSources([
  fixture("fixture/write.ts", "export function actualWrite() { return db.programLifecycleRecord.update({}); }"),
  fixture("fixture/local-facade.ts", [
    "import { actualWrite } from './write';",
    "function relay() { return actualWrite(); }",
    "export { relay };",
  ].join("\n")),
  fixture("fixture/local-class.ts", [
    "class LifecycleFactory { run() { return db.programLifecycleRecord.update({}); } }",
    "export { LifecycleFactory };",
  ].join("\n")),
]);
assert.ok(effectiveLocalExportFixtures.edges.some((edge) => edge.from.endsWith("local-facade.ts#relay") && edge.to.endsWith("write.ts#actualWrite")));
assert.ok(effectiveLocalExportFixtures.effectiveExportedCoordinates.includes("fixture/local-facade.ts#relay"));
assert.ok(effectiveLocalExportFixtures.seams.some((seam) => coordinate(seam.path, seam.symbol) === "fixture/local-facade.ts#relay" && seam.writeCapable));
assert.equal(effectiveLocalExportFixtures.edges.some((edge) => edge.from === "fixture/local-facade.ts#relay" && edge.to === edge.from), false);
assert.ok(effectiveLocalExportFixtures.effectiveExportedCoordinates.includes("fixture/local-class.ts#LifecycleFactory"));
assert.ok(effectiveLocalExportFixtures.seams.some((seam) => coordinate(seam.path, seam.symbol) === "fixture/local-class.ts#LifecycleFactory" && seam.writeCapable));

const effectiveRoutePostFixtures = scanSources([
  fixture("portal/src/app/api/operator/program-lifecycle/aliased/route.ts", [
    "function handler() { return new Response(null); }",
    "export { handler as POST };",
  ].join("\n")),
  fixture("portal/src/app/api/operator/program-lifecycle/direct/route.ts", "export function POST() { return new Response(null); }"),
]);
const aliasedPostSeams = effectiveRoutePostFixtures.seams.filter((seam) => coordinate(seam.path, seam.symbol) === "portal/src/app/api/operator/program-lifecycle/aliased/route.ts#POST");
assert.equal(aliasedPostSeams.length, 1);
const aliasedPostSeam = aliasedPostSeams[0]!;
assert.deepEqual({
  path: aliasedPostSeam.path,
  symbol: aliasedPostSeam.symbol,
  surfaceClass: aliasedPostSeam.surfaceClass,
  effectClass: aliasedPostSeam.effectClass,
  triggerClass: aliasedPostSeam.triggerClass,
  disposition: aliasedPostSeam.disposition,
  writeCapable: aliasedPostSeam.writeCapable,
  evidencePosture: aliasedPostSeam.evidencePosture,
  canonicalBoundary: aliasedPostSeam.canonicalBoundary,
}, {
  path: "portal/src/app/api/operator/program-lifecycle/aliased/route.ts",
  symbol: "POST",
  surfaceClass: "ROUTE",
  effectClass: "NONE",
  triggerClass: "REQUEST",
  disposition: "CLASSIFICATION_ONLY",
  writeCapable: false,
  evidencePosture: "STATIC_SOURCE",
  canonicalBoundary: "C5",
});
assert.ok(aliasedPostSeam.evidence.length > 0);
assertFrozen(aliasedPostSeam.evidence);
assert.ok(effectiveRoutePostFixtures.effectiveExportedCoordinates.includes("portal/src/app/api/operator/program-lifecycle/aliased/route.ts#handler"));
assert.ok(effectiveRoutePostFixtures.effects.some((effect) => effect.coordinate === "portal/src/app/api/operator/program-lifecycle/aliased/route.ts#POST" && effect.kind === "ROUTE_POST"));
assert.equal(effectiveRoutePostFixtures.edges.some((edge) => edge.from === edge.to), false);
const directPostSeam = effectiveRoutePostFixtures.seams.find((seam) => coordinate(seam.path, seam.symbol) === "portal/src/app/api/operator/program-lifecycle/direct/route.ts#POST");
assert.ok(directPostSeam);
assert.deepEqual([directPostSeam.surfaceClass, directPostSeam.effectClass, directPostSeam.triggerClass, directPostSeam.disposition, directPostSeam.writeCapable, directPostSeam.evidencePosture, directPostSeam.canonicalBoundary], ["ROUTE", "NONE", "REQUEST", "CLASSIFICATION_ONLY", false, "STATIC_SOURCE", "C5"]);

const unrelatedExposureFixtures = scanSources([
  fixture("portal/src/app/operator/program-lifecycle/exposure-client.tsx", "export function requestTransport() { return fetch('/api/operator/program-lifecycle/exposure', { method: 'POST' }); }"),
  fixture("fixture/public-request.ts", "export { requestTransport as publicRequest } from '../portal/src/app/operator/program-lifecycle/exposure-client';"),
  fixture("fixture/exposure-write.ts", "export function actualWrite() { return db.programLifecycleRecord.update({}); }"),
  fixture("fixture/public-write.ts", "export { actualWrite as publicWrite } from './exposure-write';"),
]);
const publicRequestSeam = unrelatedExposureFixtures.seams.find((seam) => coordinate(seam.path, seam.symbol) === "fixture/public-request.ts#publicRequest");
assert.ok(publicRequestSeam);
assert.deepEqual([publicRequestSeam.surfaceClass, publicRequestSeam.effectClass, publicRequestSeam.triggerClass, publicRequestSeam.disposition, publicRequestSeam.writeCapable], ["SERVER", "NONE", "DIRECT", "CLASSIFICATION_ONLY", false]);
const publicWriteSeam = unrelatedExposureFixtures.seams.find((seam) => coordinate(seam.path, seam.symbol) === "fixture/public-write.ts#publicWrite");
assert.ok(publicWriteSeam);
assert.deepEqual([publicWriteSeam.surfaceClass, publicWriteSeam.effectClass, publicWriteSeam.triggerClass, publicWriteSeam.disposition, publicWriteSeam.writeCapable], ["SERVER", "PERSISTENCE_BOUNDARY", "DIRECT", "CANONICAL_AND_GUARDED", true]);

const functionValueFixtures = scanSources([
  fixture("fixture/value-write.ts", "export function actualWrite() { return db.programLifecycleRecord.update({}); }"),
  fixture("fixture/value-flow.ts", [
    "import { actualWrite } from './value-write';",
    "declare function withAuth<T>(value: T): T;",
    "export const POST = withAuth(actualWrite);",
    "export const assignedWrite = actualWrite;",
    "export const api = { run: actualWrite };",
    "export function returnedWrite() { return actualWrite; }",
    "export function callbackWrite(wrapper: (value: unknown) => unknown) { return wrapper(actualWrite); }",
  ].join("\n")),
]);
for (const symbol of ["POST", "assignedWrite", "api", "returnedWrite", "callbackWrite"]) assert.ok(functionValueFixtures.seams.some((seam) => seam.symbol === symbol && seam.writeCapable), `missing function-value exposure ${symbol}; found ${functionValueFixtures.seams.map((seam) => seam.symbol).join(",")}; edges ${functionValueFixtures.edges.map((edge) => `${edge.from}->${edge.to}`).join(",")}`);
for (const kind of ["ARGUMENT", "ASSIGNMENT", "RETURN"] as const) assert.ok(functionValueFixtures.edges.some((edge) => edge.kind === kind && edge.to.endsWith("#actualWrite")), `missing ${kind} edge`);

const reexportFixtures = scanSources([
  fixture("fixture/reexport-write.ts", "export function actualWrite() { return db.programLifecycleRecord.update({}); }"),
  fixture("fixture/reexport-default-write.ts", "export default function defaultWrite() { return db.programLifecycleRecord.delete({}); }"),
  fixture("fixture/reexport-named.ts", "export { actualWrite } from './reexport-write';"),
  fixture("fixture/reexport-aliased.ts", "export { actualWrite as publicWrite } from './reexport-write';"),
  fixture("fixture/reexport-default.ts", "export { default as publicDefaultWrite } from './reexport-default-write';"),
  fixture("fixture/reexport-star.ts", "export * from './reexport-write';"),
  fixture("fixture/reexport-local.ts", "import { actualWrite as localWrite } from './reexport-write'; export { localWrite as publicWrite };"),
  fixture("fixture/reexport-imported-default.ts", "import { actualWrite } from './reexport-write'; export default actualWrite;"),
  fixture("fixture/reexport-wrapper-default.ts", "import { actualWrite } from './reexport-write'; declare function withAuth<T>(value: T): T; export default withAuth(actualWrite);"),
  fixture("fixture/reexport-namespace.ts", "export * as lifecycle from './reexport-write';"),
  fixture("fixture/reexport-barrel-one.ts", "export * from './reexport-write';"),
  fixture("fixture/reexport-barrel-two.ts", "export * from './reexport-barrel-one';"),
]);
for (const exposure of [
  "fixture/reexport-named.ts#actualWrite",
  "fixture/reexport-aliased.ts#publicWrite",
  "fixture/reexport-default.ts#publicDefaultWrite",
  "fixture/reexport-star.ts#actualWrite",
  "fixture/reexport-local.ts#publicWrite",
  "fixture/reexport-imported-default.ts#default",
  "fixture/reexport-wrapper-default.ts#default",
  "fixture/reexport-namespace.ts#lifecycle",
  "fixture/reexport-barrel-two.ts#actualWrite",
]) assert.ok(reexportFixtures.seams.some((seam) => coordinate(seam.path, seam.symbol) === exposure && seam.writeCapable), `unclosed public exposure ${exposure}`);

const neutralBridgeFixtures = scanSources([
  fixture("fixture/lifecycle-store.ts", "export function persist() { return db.programLifecycleRecord.update({}); }"),
  fixture("fixture/bridge.ts", "import { persist as save } from './lifecycle-store'; export function relay() { return save(); }"),
  fixture("fixture/public.ts", "export { relay as dispatch } from './bridge';"),
]);
assert.ok(neutralBridgeFixtures.seams.some((seam) => coordinate(seam.path, seam.symbol) === "fixture/bridge.ts#relay" && seam.writeCapable));
assert.ok(neutralBridgeFixtures.seams.some((seam) => coordinate(seam.path, seam.symbol) === "fixture/public.ts#dispatch" && seam.writeCapable));

const symbolIdentityFixtures = scanSources([
  fixture("fixture/a.ts", "export function sameName() { return db.programLifecycleRecord.update({}); }"),
  fixture("fixture/b.ts", "export function sameName() { return 1; }"),
  fixture("fixture/symbol-client.ts", "import { sameName as selected } from './a'; export function bridge() { return selected(); }"),
]);
assert.ok(symbolIdentityFixtures.edges.some((edge) => edge.from.endsWith("symbol-client.ts#bridge") && edge.to === "fixture/a.ts#sameName"));
assert.equal(symbolIdentityFixtures.edges.some((edge) => edge.from.endsWith("symbol-client.ts#bridge") && edge.to === "fixture/b.ts#sameName"), false);

const requestFixtures = scanSources([
  fixture("portal/src/app/operator/program-lifecycle/fetch-provider.ts", "export function fetch(input: unknown, init: unknown) { return Promise.resolve({ input, init }); }"),
  fixture("portal/src/app/operator/program-lifecycle/options.tsx", [
    "const baseOptions = { method: 'post' };",
    "const aliasedOptions = ({ ...baseOptions } satisfies RequestInit);",
    "const endpoint = ('/api/operator/program-lifecycle/activation-authority' as const);",
    "const send = fetch;",
    "export function optionsTransport() { return send(endpoint, aliasedOptions); }",
    "export function routerOnly(router: unknown) { return router.prefetch('/api/operator/program-lifecycle/activation-authority', aliasedOptions); }",
    "export function containsFetchName() { return fetchProgramData('/api/operator/program-lifecycle/activation-authority', aliasedOptions); }",
    "export function locallyShadowedFetch() { const fetch = (_input: unknown, _init: unknown) => null; return fetch(endpoint, aliasedOptions); }",
    "export function lexicallyShadowedOptions() { const aliasedOptions = { method: 'GET' }; return fetch(endpoint, aliasedOptions); }",
    "export async function responseParser(response: Response) { return response.json(); }",
  ].join("\n")),
  fixture("portal/src/app/operator/program-lifecycle/imported.tsx", "import { fetch as send } from './fetch-provider'; export function importedTransport() { return send('/api/operator/program-lifecycle/imported', { method: 'post' }); }"),
  fixture("portal/src/app/api/operator/program-lifecycle/fixture/route.ts", "export async function POST(inbound: Request) { return inbound.json(); }"),
]);
assert.ok(requestFixtures.seams.some((seam) => seam.symbol === "optionsTransport"));
assert.ok(requestFixtures.seams.some((seam) => seam.symbol === "importedTransport"));
assert.equal(requestFixtures.seams.some((seam) => ["routerOnly", "containsFetchName", "locallyShadowedFetch", "lexicallyShadowedOptions", "responseParser"].includes(seam.symbol)), false);
assert.ok(requestFixtures.effects.some((effect) => effect.coordinate.endsWith("#POST") && effect.kind === "REQUEST_BODY"));

const ownershipFixtures = scanSources([
  fixture("fixture/factory.ts", "export function createStore() { return { save() { return db.programLifecycleRecord.update({}); } }; }"),
  fixture("fixture/initializer.ts", "export const initializedWrite = db.programLifecycleRecord.create({});"),
]);
assert.ok(ownershipFixtures.effects.some((effect) => effect.coordinate === "fixture/factory.ts#save" && effect.kind === "PRISMA_MUTATION"));
assert.equal(ownershipFixtures.effects.some((effect) => effect.coordinate === "fixture/factory.ts#createStore"), false);
assert.ok(ownershipFixtures.edges.some((edge) => edge.kind === "CONTAINMENT" && edge.from.endsWith("#createStore") && edge.to.endsWith("#save")));
assert.ok(ownershipFixtures.seams.some((seam) => seam.symbol === "initializedWrite" && seam.writeCapable));

const transactionCollision = scanSources([
  fixture("portal/src/lib/controlPlane/programLifecycle/transaction-collision.ts", [
    "export function transaction() { return prisma.$transaction(async (tx: unknown) => tx.programLifecycleRecord.update({})); }",
    "export function measure(metrics: unknown) { return metrics.transaction(() => 1); }",
  ].join("\n")),
]);
assert.ok(transactionCollision.seams.some((seam) => seam.symbol === "transaction" && seam.writeCapable));
assert.equal(transactionCollision.seams.some((seam) => seam.symbol === "measure"), false);
assert.equal(transactionCollision.edges.some((edge) => edge.from.endsWith("#measure") && edge.to.endsWith("#transaction")), false);

assert.throws(() => scanSources([
  fixture("fixture/duplicate.ts", "export function repeated() { return prisma.programLifecycleRecord.update({}); }"),
  fixture("fixture/duplicate.ts", "export function repeated() { return prisma.programLifecycleRecord.update({}); }"),
]), /DUPLICATE_COORDINATE/);
assert.throws(() => scanSources([
  sqlFixture("fixture/duplicate-migration/migration.sql", "ALTER TABLE \"program_lifecycle_records\" ADD COLUMN \"x\" INTEGER; ALTER TABLE \"program_lifecycle_records\" ADD COLUMN \"y\" INTEGER;"),
]), /DUPLICATE_DECLARATIVE_COORDINATE/);

const declarativeDmlFixtures = scanSources([
  sqlFixture("fixture/insert-migration/migration.sql", "INSERT INTO \"program_lifecycle_records\" (\"programId\") VALUES ('P1');"),
  sqlFixture("fixture/update-migration/migration.sql", "UPDATE \"public\".\"program_lifecycle_records\" SET \"version\" = 1;"),
  sqlFixture("fixture/delete-migration/migration.sql", "DELETE FROM \"program_lifecycle_records\" WHERE \"programId\" = 'P1';"),
]);
assert.deepEqual(declarativeDmlFixtures.seams.map((seam) => seam.symbol).sort(), [
  "DELETE FROM \"program_lifecycle_records\"",
  "INSERT INTO \"program_lifecycle_records\"",
  "UPDATE \"program_lifecycle_records\"",
]);
assert.ok(declarativeDmlFixtures.seams.every((seam) => seam.disposition === "DOCUMENTARY_ONLY" && seam.effectClass === "DECLARATIVE" && !seam.writeCapable));

const dualAlterFixture = scanSources([
  sqlFixture("fixture/c7-dual-alter/migration.sql", [
    "ALTER TABLE \"program_lifecycle_records\" ADD COLUMN \"version\" INTEGER;",
    "ALTER TABLE \"program_lifecycle_records\" ADD CONSTRAINT \"version_nonnegative\" CHECK (\"version\" >= 0);",
  ].join("\n")),
]);
assert.equal(dualAlterFixture.declarativeCount, 1);
assert.deepEqual(dualAlterFixture.seams.map((seam) => seam.symbol), ["ALTER TABLE \"program_lifecycle_records\""]);
assert.equal(dualAlterFixture.seams[0]?.evidence.length, 2);
assert.throws(() => scanSources([
  fixture("portal/src/app/operator/program-lifecycle/conflict.tsx", "export function conflicted() { prisma.programLifecycleRecord.update({}); return fetch('/api/operator/program-lifecycle/x', { method: \"POST\" }); }"),
]), /CONFLICTING_CLASSIFICATION/);

const falsePositiveFixtures = scanSources([
  fixture("fixture/false.ts", "// prisma.programLifecycleRecord.update({});\nexport function inert() { const text = 'DELETE FROM program_lifecycle_records'; return text; }\nexport function realOwner() { return prisma.$queryRaw(Prisma.sql`INSERT INTO \"program_lifecycle_records\" VALUES (1)`); }"),
]);
assert.equal(falsePositiveFixtures.seams.some((seam) => seam.symbol === "inert"), false);
assert.equal(falsePositiveFixtures.effects.some((effect) => effect.coordinate.endsWith("#inert")), false);
assert.ok(falsePositiveFixtures.effects.every((effect) => effect.coordinate.endsWith("#realOwner")));

assert.throws(() => scanSources([
  fixture("fixture/ownerless-default.ts", "export default db.programLifecycleRecord.update({});"),
]), /UNOWNED_EFFECT:fixture\/ownerless-default\.ts:PRISMA_MUTATION/);
assert.throws(() => scanSources([
  fixture("fixture/ownerless-statement.ts", "db.programLifecycleRecord.update({});"),
]), /UNOWNED_EFFECT:fixture\/ownerless-statement\.ts:PRISMA_MUTATION/);
assert.throws(() => scanSources([
  fixture("fixture/ownerless-raw.ts", "db.$executeRawUnsafe('DELETE FROM \"program_lifecycle_records\"');"),
]), /UNOWNED_EFFECT:fixture\/ownerless-raw\.ts:PRISMA_RAW_EXECUTION/);
assert.throws(() => scanSources([
  fixture("fixture/ownerless-tagged-raw.ts", "db.$executeRaw`DELETE FROM \"program_lifecycle_records\"`;"),
]), /UNOWNED_EFFECT:fixture\/ownerless-tagged-raw\.ts:PRISMA_RAW_EXECUTION/);

export const C13_LIVE_DISCOVERY_SUMMARY = Object.freeze({
  canonicalMetadataPosture: "REGISTRY_DECLARED_NOT_INDEPENDENTLY_DISCOVERED",
  discoveryEvidencePosture: "INDEPENDENT_SYNTAX_AND_TYPESCRIPT_SYMBOL_ANALYSIS",
  residualStaticAnalysisLimitations: Object.freeze([
    "Dynamic reflection and computed behavior without statically visible symbol identity remain unproven.",
    "Untyped arbitrary objects are not inferred to be lifecycle delegates.",
    "Runtime reachability, database behavior, deployed behavior, and external-effect absence remain unavailable.",
  ]),
  productionSourceCount: live.productionSourceCount,
  migrationFileCount: live.migrationFileCount,
  seamCount: live.seams.length,
  effectCount: live.effects.length,
  callerEdgeCount: live.edges.length,
  declarativeCount: live.declarativeCount,
  writeCoordinates: Object.freeze(live.seams.filter((seam) => seam.writeCapable).map((seam) => coordinate(seam.path, seam.symbol)).sort()),
});
