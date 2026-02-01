# ingest_chats.ps1
# Safe ingest: generate JSON with Node (no ConvertTo-Json on huge content),
# POST/PUT with curl.exe from file (no truncation), minimal output.

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

# --- CONFIG ---
$ApiBase = "http://localhost:3000"
$ApiCreate = "$ApiBase/api/ingest/chat"     # POST create (dedupe OK)
$ApiList = "$ApiBase/api/ingest/chat"     # GET list? (optional)
$ApiUi = "$ApiBase/operator/chats"

$logDir = "C:\Users\Jerry Admin\Desktop\WorkDesktop\JAI-Archive\Q1'26\ChatLogs"

# If you only want to re-ingest ONE file (e.g. after editing GPT->Claude),
# set this to that filename. Otherwise leave $null to ingest all.
$OnlyFile = $null
# Example:
# $OnlyFile = "2026-01-31_gpt_to_claude.txt"

$files = @(
  @{
    path     = (Join-Path $logDir "2026-01-31_gpt_to_claude.txt")
    title    = "GPT to Claude"
    chatDate = "2026-01-31T00:00:00.000Z"
    tags     = @("2026-Q1", "chatgpt", "contextualization", "jai-nexus")
    filepath = "2026-01-31_gpt_to_claude.txt"
  },
  @{
    path     = (Join-Path $logDir "2026-01-30_audit-nexus.txt")
    title    = "Audit Nexus"
    chatDate = "2026-01-30T00:00:00.000Z"
    tags     = @("2026-Q1", "chatgpt", "audit-nexus")
    filepath = "2026-01-30_audit-nexus.txt"
  },
  @{
    path     = (Join-Path $logDir "2026-02-01.txt")
    title    = "JAI NEXUS Mass Contextualization"
    chatDate = "2026-02-01T00:00:00.000Z"
    tags     = @("2026-Q1", "chatgpt", "contextualization", "jai-nexus", "master-archive")
    filepath = "2026-02-01.txt"
  }
)

# --- Helpers ---
function Assert-Command {
  param([Parameter(Mandatory = $true)][string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Missing required command: $Name (install/ensure it's on PATH)"
  }
}

function Curl-JsonFromFile {
  param(
    [Parameter(Mandatory = $true)][ValidateSet("GET", "POST", "PUT", "PATCH")][string]$Method,
    [Parameter(Mandatory = $true)][string]$Url,
    [Parameter(Mandatory = $false)][string]$JsonFile,
    [Parameter(Mandatory = $false)][int]$TimeoutSec = 300
  )

  $args = @(
    "-sS",
    "--max-time", "$TimeoutSec",
    "-X", $Method,
    $Url
  )

  if ($JsonFile) {
    if (!(Test-Path -LiteralPath $JsonFile)) { throw "Missing JSON file: $JsonFile" }
    $args += @("-H", "Content-Type: application/json", "--data-binary", "@$JsonFile")
  }

  # IMPORTANT: Use curl.exe (Windows) not alias.
  $resp = & curl.exe @args

  return $resp
}

# --- PREREQS ---
Assert-Command "node"
Assert-Command "curl.exe"
if (!(Test-Path -LiteralPath $logDir)) { throw "LogDir not found: $logDir" }

# --- Node writer script (written once) ---
$ingestJs = Join-Path $env:TEMP "jai_ingest_payload_writer.js"

@"
const fs = require('fs');

function fail(msg) { console.error(msg); process.exit(1); }

const args = process.argv.slice(2);
if (args.length < 6) fail("Usage: node writer.js <inPath> <outPath> <title> <chatDate> <fileName> <tagsStr>");

const [inPath, outPath, title, chatDate, fileName, tagsStrRaw] = args;
const tagsStr = tagsStrRaw || "";
const tags = tagsStr.split("|").filter(Boolean);

let content;
try { content = fs.readFileSync(inPath, "utf8"); }
catch (e) { fail("Failed reading input: " + inPath + " :: " + e.message); }

if (!content || !content.trim()) fail("Empty content: " + inPath);

const payload = { content, title, source: "chatgpt", chatDate, tags, filepath: fileName };

try { fs.writeFileSync(outPath, JSON.stringify(payload), "utf8"); }
catch (e) { fail("Failed writing JSON: " + outPath + " :: " + e.message); }
"@ | Set-Content -LiteralPath $ingestJs -Encoding UTF8

function Write-PayloadJsonWithNode {
  param(
    [Parameter(Mandatory = $true)][string]$InPath,
    [Parameter(Mandatory = $true)][string]$OutPath,
    [Parameter(Mandatory = $true)][string]$Title,
    [Parameter(Mandatory = $true)][string]$ChatDate,
    [Parameter(Mandatory = $true)][string[]]$Tags,
    [Parameter(Mandatory = $true)][string]$FileName
  )

  if (!(Test-Path -LiteralPath $InPath)) { throw "Missing file: $InPath" }
  $tagsStr = ($Tags -join "|")

  # Run node quietly; failures throw because $ErrorActionPreference=Stop
  & node $ingestJs $InPath $OutPath $Title $ChatDate $FileName $tagsStr *> $null

  if (!(Test-Path -LiteralPath $OutPath)) { throw "JSON not created: $OutPath" }
  return $OutPath
}

function Parse-ApiResponse {
  param([Parameter(Mandatory = $true)][string]$Resp)

  try {
    $obj = $Resp | ConvertFrom-Json
    $created = $obj.created
    $id = $null
    if ($obj.chat -and $obj.chat.id) { $id = $obj.chat.id }
    elseif ($obj.id) { $id = $obj.id }
    return @{ ok = $true; created = $created; id = $id; raw = $obj }
  }
  catch {
    return @{ ok = $false; created = $null; id = $null; raw = $Resp }
  }
}

function Try-UpdateExisting {
  param(
    [Parameter(Mandatory = $true)][string]$JsonPath,
    [Parameter(Mandatory = $true)][int]$Id
  )

  # Try a couple common patterns
  $put1 = "$ApiBase/api/ingest/chat"         # PUT same route
  $put2 = "$ApiBase/api/ingest/chat/$Id"     # PUT by id

  # 1) PUT /api/ingest/chat
  try {
    $r = Curl-JsonFromFile -Method "PUT" -Url $put1 -JsonFile $JsonPath
    $p = Parse-ApiResponse $r
    return @{ attempted = $true; url = $put1; resp = $p }
  }
  catch {
    # swallow and try next
  }

  # 2) PUT /api/ingest/chat/:id
  try {
    $r = Curl-JsonFromFile -Method "PUT" -Url $put2 -JsonFile $JsonPath
    $p = Parse-ApiResponse $r
    return @{ attempted = $true; url = $put2; resp = $p }
  }
  catch {
    return @{ attempted = $false; url = $null; resp = $null }
  }
}

Write-Host "LogDir: $logDir"
Write-Host "API:    $ApiCreate"
Write-Host "UI:     $ApiUi"

# Filter if OnlyFile set
$toRun = $files
if ($OnlyFile) {
  $toRun = $files | Where-Object { $_.filepath -eq $OnlyFile }
  if (-not $toRun) { throw "OnlyFile '$OnlyFile' not found in config list." }
}

foreach ($f in $toRun) {
  Write-Host ""
  Write-Host "=== Ingesting $($f.filepath) ==="

  if (!(Test-Path -LiteralPath $f.path)) { throw "Missing file: $($f.path)" }

  $fileBytes = (Get-Item -LiteralPath $f.path).Length
  Write-Host "File bytes: $fileBytes"

  $tmp = Join-Path $env:TEMP ("ingest_" + $f.filepath + ".json")

  $jsonPath = Write-PayloadJsonWithNode `
    -InPath $f.path `
    -OutPath $tmp `
    -Title $f.title `
    -ChatDate $f.chatDate `
    -Tags $f.tags `
    -FileName $f.filepath

  $jsonBytes = (Get-Item -LiteralPath $jsonPath).Length
  Write-Host "JSON bytes: $jsonBytes"

  # 1) Try normal POST create/dedupe
  $respText = Curl-JsonFromFile -Method "POST" -Url $ApiCreate -JsonFile $jsonPath
  $parsed = Parse-ApiResponse $respText

  if ($parsed.ok) {
    $id = [int]$parsed.id
    if ($parsed.created -eq $true) {
      Write-Host ("RESULT: created id={0}" -f $id)
      continue
    }

    # created=false means it already exists (dedupe)
    Write-Host ("RESULT: already-present id={0} (attempting update...)" -f $id)

    # 2) Attempt update (only if your API supports it)
    $upd = Try-UpdateExisting -JsonPath $jsonPath -Id $id
    if ($upd.attempted -and $upd.resp -and $upd.resp.ok) {
      $c = $upd.resp.created
      $uid = $upd.resp.id
      if ($uid) {
        Write-Host ("UPDATE: success via {0} id={1}" -f $upd.url, $uid)
      }
      else {
        Write-Host ("UPDATE: success via {0}" -f $upd.url)
      }
    }
    else {
      Write-Host "UPDATE: endpoint not available (no PUT route). Leaving existing chat as-is."
    }
  }
  else {
    Write-Host "Response (raw):"
    Write-Host $respText
  }
}

Write-Host ""
Write-Host "Done. Now open: $ApiUi"
