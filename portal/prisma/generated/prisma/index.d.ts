
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Repo
 * 
 */
export type Repo = $Result.DefaultSelection<Prisma.$RepoPayload>
/**
 * Model Domain
 * 
 */
export type Domain = $Result.DefaultSelection<Prisma.$DomainPayload>
/**
 * Model SyncRun
 * 
 */
export type SyncRun = $Result.DefaultSelection<Prisma.$SyncRunPayload>
/**
 * Model FileIndex
 * 
 */
export type FileIndex = $Result.DefaultSelection<Prisma.$FileIndexPayload>
/**
 * Model PilotSession
 * 
 */
export type PilotSession = $Result.DefaultSelection<Prisma.$PilotSessionPayload>
/**
 * Model PilotAction
 * 
 */
export type PilotAction = $Result.DefaultSelection<Prisma.$PilotActionPayload>
/**
 * Model PilotRun
 * 
 */
export type PilotRun = $Result.DefaultSelection<Prisma.$PilotRunPayload>
/**
 * Model JaiTool
 * 
 */
export type JaiTool = $Result.DefaultSelection<Prisma.$JaiToolPayload>
/**
 * Model SotEvent
 * 
 */
export type SotEvent = $Result.DefaultSelection<Prisma.$SotEventPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model VerificationToken
 * 
 */
export type VerificationToken = $Result.DefaultSelection<Prisma.$VerificationTokenPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  ADMIN: 'ADMIN',
  AGENT: 'AGENT'
};

export type Role = (typeof Role)[keyof typeof Role]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Repos
 * const repos = await prisma.repo.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Repos
   * const repos = await prisma.repo.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.repo`: Exposes CRUD operations for the **Repo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Repos
    * const repos = await prisma.repo.findMany()
    * ```
    */
  get repo(): Prisma.RepoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.domain`: Exposes CRUD operations for the **Domain** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Domains
    * const domains = await prisma.domain.findMany()
    * ```
    */
  get domain(): Prisma.DomainDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.syncRun`: Exposes CRUD operations for the **SyncRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SyncRuns
    * const syncRuns = await prisma.syncRun.findMany()
    * ```
    */
  get syncRun(): Prisma.SyncRunDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fileIndex`: Exposes CRUD operations for the **FileIndex** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FileIndices
    * const fileIndices = await prisma.fileIndex.findMany()
    * ```
    */
  get fileIndex(): Prisma.FileIndexDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pilotSession`: Exposes CRUD operations for the **PilotSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PilotSessions
    * const pilotSessions = await prisma.pilotSession.findMany()
    * ```
    */
  get pilotSession(): Prisma.PilotSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pilotAction`: Exposes CRUD operations for the **PilotAction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PilotActions
    * const pilotActions = await prisma.pilotAction.findMany()
    * ```
    */
  get pilotAction(): Prisma.PilotActionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pilotRun`: Exposes CRUD operations for the **PilotRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PilotRuns
    * const pilotRuns = await prisma.pilotRun.findMany()
    * ```
    */
  get pilotRun(): Prisma.PilotRunDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.jaiTool`: Exposes CRUD operations for the **JaiTool** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more JaiTools
    * const jaiTools = await prisma.jaiTool.findMany()
    * ```
    */
  get jaiTool(): Prisma.JaiToolDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sotEvent`: Exposes CRUD operations for the **SotEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SotEvents
    * const sotEvents = await prisma.sotEvent.findMany()
    * ```
    */
  get sotEvent(): Prisma.SotEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verificationToken`: Exposes CRUD operations for the **VerificationToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VerificationTokens
    * const verificationTokens = await prisma.verificationToken.findMany()
    * ```
    */
  get verificationToken(): Prisma.VerificationTokenDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.1.0
   * Query Engine version: ab635e6b9d606fa5c8fb8b1a7f909c3c3c1c98ba
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Repo: 'Repo',
    Domain: 'Domain',
    SyncRun: 'SyncRun',
    FileIndex: 'FileIndex',
    PilotSession: 'PilotSession',
    PilotAction: 'PilotAction',
    PilotRun: 'PilotRun',
    JaiTool: 'JaiTool',
    SotEvent: 'SotEvent',
    User: 'User',
    Account: 'Account',
    Session: 'Session',
    VerificationToken: 'VerificationToken'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "repo" | "domain" | "syncRun" | "fileIndex" | "pilotSession" | "pilotAction" | "pilotRun" | "jaiTool" | "sotEvent" | "user" | "account" | "session" | "verificationToken"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Repo: {
        payload: Prisma.$RepoPayload<ExtArgs>
        fields: Prisma.RepoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RepoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RepoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepoPayload>
          }
          findFirst: {
            args: Prisma.RepoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RepoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepoPayload>
          }
          findMany: {
            args: Prisma.RepoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepoPayload>[]
          }
          create: {
            args: Prisma.RepoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepoPayload>
          }
          createMany: {
            args: Prisma.RepoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RepoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepoPayload>[]
          }
          delete: {
            args: Prisma.RepoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepoPayload>
          }
          update: {
            args: Prisma.RepoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepoPayload>
          }
          deleteMany: {
            args: Prisma.RepoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RepoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RepoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepoPayload>[]
          }
          upsert: {
            args: Prisma.RepoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepoPayload>
          }
          aggregate: {
            args: Prisma.RepoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRepo>
          }
          groupBy: {
            args: Prisma.RepoGroupByArgs<ExtArgs>
            result: $Utils.Optional<RepoGroupByOutputType>[]
          }
          count: {
            args: Prisma.RepoCountArgs<ExtArgs>
            result: $Utils.Optional<RepoCountAggregateOutputType> | number
          }
        }
      }
      Domain: {
        payload: Prisma.$DomainPayload<ExtArgs>
        fields: Prisma.DomainFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DomainFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DomainFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload>
          }
          findFirst: {
            args: Prisma.DomainFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DomainFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload>
          }
          findMany: {
            args: Prisma.DomainFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload>[]
          }
          create: {
            args: Prisma.DomainCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload>
          }
          createMany: {
            args: Prisma.DomainCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DomainCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload>[]
          }
          delete: {
            args: Prisma.DomainDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload>
          }
          update: {
            args: Prisma.DomainUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload>
          }
          deleteMany: {
            args: Prisma.DomainDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DomainUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DomainUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload>[]
          }
          upsert: {
            args: Prisma.DomainUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload>
          }
          aggregate: {
            args: Prisma.DomainAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDomain>
          }
          groupBy: {
            args: Prisma.DomainGroupByArgs<ExtArgs>
            result: $Utils.Optional<DomainGroupByOutputType>[]
          }
          count: {
            args: Prisma.DomainCountArgs<ExtArgs>
            result: $Utils.Optional<DomainCountAggregateOutputType> | number
          }
        }
      }
      SyncRun: {
        payload: Prisma.$SyncRunPayload<ExtArgs>
        fields: Prisma.SyncRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SyncRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SyncRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncRunPayload>
          }
          findFirst: {
            args: Prisma.SyncRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SyncRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncRunPayload>
          }
          findMany: {
            args: Prisma.SyncRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncRunPayload>[]
          }
          create: {
            args: Prisma.SyncRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncRunPayload>
          }
          createMany: {
            args: Prisma.SyncRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SyncRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncRunPayload>[]
          }
          delete: {
            args: Prisma.SyncRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncRunPayload>
          }
          update: {
            args: Prisma.SyncRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncRunPayload>
          }
          deleteMany: {
            args: Prisma.SyncRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SyncRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SyncRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncRunPayload>[]
          }
          upsert: {
            args: Prisma.SyncRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncRunPayload>
          }
          aggregate: {
            args: Prisma.SyncRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSyncRun>
          }
          groupBy: {
            args: Prisma.SyncRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<SyncRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.SyncRunCountArgs<ExtArgs>
            result: $Utils.Optional<SyncRunCountAggregateOutputType> | number
          }
        }
      }
      FileIndex: {
        payload: Prisma.$FileIndexPayload<ExtArgs>
        fields: Prisma.FileIndexFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FileIndexFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileIndexPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FileIndexFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileIndexPayload>
          }
          findFirst: {
            args: Prisma.FileIndexFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileIndexPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FileIndexFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileIndexPayload>
          }
          findMany: {
            args: Prisma.FileIndexFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileIndexPayload>[]
          }
          create: {
            args: Prisma.FileIndexCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileIndexPayload>
          }
          createMany: {
            args: Prisma.FileIndexCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FileIndexCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileIndexPayload>[]
          }
          delete: {
            args: Prisma.FileIndexDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileIndexPayload>
          }
          update: {
            args: Prisma.FileIndexUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileIndexPayload>
          }
          deleteMany: {
            args: Prisma.FileIndexDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FileIndexUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FileIndexUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileIndexPayload>[]
          }
          upsert: {
            args: Prisma.FileIndexUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileIndexPayload>
          }
          aggregate: {
            args: Prisma.FileIndexAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFileIndex>
          }
          groupBy: {
            args: Prisma.FileIndexGroupByArgs<ExtArgs>
            result: $Utils.Optional<FileIndexGroupByOutputType>[]
          }
          count: {
            args: Prisma.FileIndexCountArgs<ExtArgs>
            result: $Utils.Optional<FileIndexCountAggregateOutputType> | number
          }
        }
      }
      PilotSession: {
        payload: Prisma.$PilotSessionPayload<ExtArgs>
        fields: Prisma.PilotSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PilotSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PilotSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotSessionPayload>
          }
          findFirst: {
            args: Prisma.PilotSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PilotSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotSessionPayload>
          }
          findMany: {
            args: Prisma.PilotSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotSessionPayload>[]
          }
          create: {
            args: Prisma.PilotSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotSessionPayload>
          }
          createMany: {
            args: Prisma.PilotSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PilotSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotSessionPayload>[]
          }
          delete: {
            args: Prisma.PilotSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotSessionPayload>
          }
          update: {
            args: Prisma.PilotSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotSessionPayload>
          }
          deleteMany: {
            args: Prisma.PilotSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PilotSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PilotSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotSessionPayload>[]
          }
          upsert: {
            args: Prisma.PilotSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotSessionPayload>
          }
          aggregate: {
            args: Prisma.PilotSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePilotSession>
          }
          groupBy: {
            args: Prisma.PilotSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PilotSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PilotSessionCountArgs<ExtArgs>
            result: $Utils.Optional<PilotSessionCountAggregateOutputType> | number
          }
        }
      }
      PilotAction: {
        payload: Prisma.$PilotActionPayload<ExtArgs>
        fields: Prisma.PilotActionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PilotActionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotActionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PilotActionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotActionPayload>
          }
          findFirst: {
            args: Prisma.PilotActionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotActionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PilotActionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotActionPayload>
          }
          findMany: {
            args: Prisma.PilotActionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotActionPayload>[]
          }
          create: {
            args: Prisma.PilotActionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotActionPayload>
          }
          createMany: {
            args: Prisma.PilotActionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PilotActionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotActionPayload>[]
          }
          delete: {
            args: Prisma.PilotActionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotActionPayload>
          }
          update: {
            args: Prisma.PilotActionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotActionPayload>
          }
          deleteMany: {
            args: Prisma.PilotActionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PilotActionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PilotActionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotActionPayload>[]
          }
          upsert: {
            args: Prisma.PilotActionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotActionPayload>
          }
          aggregate: {
            args: Prisma.PilotActionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePilotAction>
          }
          groupBy: {
            args: Prisma.PilotActionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PilotActionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PilotActionCountArgs<ExtArgs>
            result: $Utils.Optional<PilotActionCountAggregateOutputType> | number
          }
        }
      }
      PilotRun: {
        payload: Prisma.$PilotRunPayload<ExtArgs>
        fields: Prisma.PilotRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PilotRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PilotRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotRunPayload>
          }
          findFirst: {
            args: Prisma.PilotRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PilotRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotRunPayload>
          }
          findMany: {
            args: Prisma.PilotRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotRunPayload>[]
          }
          create: {
            args: Prisma.PilotRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotRunPayload>
          }
          createMany: {
            args: Prisma.PilotRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PilotRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotRunPayload>[]
          }
          delete: {
            args: Prisma.PilotRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotRunPayload>
          }
          update: {
            args: Prisma.PilotRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotRunPayload>
          }
          deleteMany: {
            args: Prisma.PilotRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PilotRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PilotRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotRunPayload>[]
          }
          upsert: {
            args: Prisma.PilotRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PilotRunPayload>
          }
          aggregate: {
            args: Prisma.PilotRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePilotRun>
          }
          groupBy: {
            args: Prisma.PilotRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<PilotRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.PilotRunCountArgs<ExtArgs>
            result: $Utils.Optional<PilotRunCountAggregateOutputType> | number
          }
        }
      }
      JaiTool: {
        payload: Prisma.$JaiToolPayload<ExtArgs>
        fields: Prisma.JaiToolFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JaiToolFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JaiToolPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JaiToolFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JaiToolPayload>
          }
          findFirst: {
            args: Prisma.JaiToolFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JaiToolPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JaiToolFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JaiToolPayload>
          }
          findMany: {
            args: Prisma.JaiToolFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JaiToolPayload>[]
          }
          create: {
            args: Prisma.JaiToolCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JaiToolPayload>
          }
          createMany: {
            args: Prisma.JaiToolCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JaiToolCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JaiToolPayload>[]
          }
          delete: {
            args: Prisma.JaiToolDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JaiToolPayload>
          }
          update: {
            args: Prisma.JaiToolUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JaiToolPayload>
          }
          deleteMany: {
            args: Prisma.JaiToolDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JaiToolUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.JaiToolUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JaiToolPayload>[]
          }
          upsert: {
            args: Prisma.JaiToolUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JaiToolPayload>
          }
          aggregate: {
            args: Prisma.JaiToolAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJaiTool>
          }
          groupBy: {
            args: Prisma.JaiToolGroupByArgs<ExtArgs>
            result: $Utils.Optional<JaiToolGroupByOutputType>[]
          }
          count: {
            args: Prisma.JaiToolCountArgs<ExtArgs>
            result: $Utils.Optional<JaiToolCountAggregateOutputType> | number
          }
        }
      }
      SotEvent: {
        payload: Prisma.$SotEventPayload<ExtArgs>
        fields: Prisma.SotEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SotEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SotEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SotEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SotEventPayload>
          }
          findFirst: {
            args: Prisma.SotEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SotEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SotEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SotEventPayload>
          }
          findMany: {
            args: Prisma.SotEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SotEventPayload>[]
          }
          create: {
            args: Prisma.SotEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SotEventPayload>
          }
          createMany: {
            args: Prisma.SotEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SotEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SotEventPayload>[]
          }
          delete: {
            args: Prisma.SotEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SotEventPayload>
          }
          update: {
            args: Prisma.SotEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SotEventPayload>
          }
          deleteMany: {
            args: Prisma.SotEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SotEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SotEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SotEventPayload>[]
          }
          upsert: {
            args: Prisma.SotEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SotEventPayload>
          }
          aggregate: {
            args: Prisma.SotEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSotEvent>
          }
          groupBy: {
            args: Prisma.SotEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<SotEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.SotEventCountArgs<ExtArgs>
            result: $Utils.Optional<SotEventCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      VerificationToken: {
        payload: Prisma.$VerificationTokenPayload<ExtArgs>
        fields: Prisma.VerificationTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findFirst: {
            args: Prisma.VerificationTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findMany: {
            args: Prisma.VerificationTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          create: {
            args: Prisma.VerificationTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          createMany: {
            args: Prisma.VerificationTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          delete: {
            args: Prisma.VerificationTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          update: {
            args: Prisma.VerificationTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          deleteMany: {
            args: Prisma.VerificationTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          upsert: {
            args: Prisma.VerificationTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          aggregate: {
            args: Prisma.VerificationTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerificationToken>
          }
          groupBy: {
            args: Prisma.VerificationTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationTokenCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    repo?: RepoOmit
    domain?: DomainOmit
    syncRun?: SyncRunOmit
    fileIndex?: FileIndexOmit
    pilotSession?: PilotSessionOmit
    pilotAction?: PilotActionOmit
    pilotRun?: PilotRunOmit
    jaiTool?: JaiToolOmit
    sotEvent?: SotEventOmit
    user?: UserOmit
    account?: AccountOmit
    session?: SessionOmit
    verificationToken?: VerificationTokenOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type RepoCountOutputType
   */

  export type RepoCountOutputType = {
    domains: number
    fileIndexes: number
    sotEvents: number
    syncRuns: number
  }

  export type RepoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    domains?: boolean | RepoCountOutputTypeCountDomainsArgs
    fileIndexes?: boolean | RepoCountOutputTypeCountFileIndexesArgs
    sotEvents?: boolean | RepoCountOutputTypeCountSotEventsArgs
    syncRuns?: boolean | RepoCountOutputTypeCountSyncRunsArgs
  }

  // Custom InputTypes
  /**
   * RepoCountOutputType without action
   */
  export type RepoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RepoCountOutputType
     */
    select?: RepoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RepoCountOutputType without action
   */
  export type RepoCountOutputTypeCountDomainsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DomainWhereInput
  }

  /**
   * RepoCountOutputType without action
   */
  export type RepoCountOutputTypeCountFileIndexesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileIndexWhereInput
  }

  /**
   * RepoCountOutputType without action
   */
  export type RepoCountOutputTypeCountSotEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SotEventWhereInput
  }

  /**
   * RepoCountOutputType without action
   */
  export type RepoCountOutputTypeCountSyncRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SyncRunWhereInput
  }


  /**
   * Count Type DomainCountOutputType
   */

  export type DomainCountOutputType = {
    sotEvents: number
  }

  export type DomainCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sotEvents?: boolean | DomainCountOutputTypeCountSotEventsArgs
  }

  // Custom InputTypes
  /**
   * DomainCountOutputType without action
   */
  export type DomainCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DomainCountOutputType
     */
    select?: DomainCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DomainCountOutputType without action
   */
  export type DomainCountOutputTypeCountSotEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SotEventWhereInput
  }


  /**
   * Count Type SyncRunCountOutputType
   */

  export type SyncRunCountOutputType = {
    fileIndexes: number
  }

  export type SyncRunCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fileIndexes?: boolean | SyncRunCountOutputTypeCountFileIndexesArgs
  }

  // Custom InputTypes
  /**
   * SyncRunCountOutputType without action
   */
  export type SyncRunCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncRunCountOutputType
     */
    select?: SyncRunCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SyncRunCountOutputType without action
   */
  export type SyncRunCountOutputTypeCountFileIndexesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileIndexWhereInput
  }


  /**
   * Count Type PilotSessionCountOutputType
   */

  export type PilotSessionCountOutputType = {
    actions: number
  }

  export type PilotSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    actions?: boolean | PilotSessionCountOutputTypeCountActionsArgs
  }

  // Custom InputTypes
  /**
   * PilotSessionCountOutputType without action
   */
  export type PilotSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotSessionCountOutputType
     */
    select?: PilotSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PilotSessionCountOutputType without action
   */
  export type PilotSessionCountOutputTypeCountActionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PilotActionWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    accounts: number
    sessions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Repo
   */

  export type AggregateRepo = {
    _count: RepoCountAggregateOutputType | null
    _avg: RepoAvgAggregateOutputType | null
    _sum: RepoSumAggregateOutputType | null
    _min: RepoMinAggregateOutputType | null
    _max: RepoMaxAggregateOutputType | null
  }

  export type RepoAvgAggregateOutputType = {
    id: number | null
  }

  export type RepoSumAggregateOutputType = {
    id: number | null
  }

  export type RepoMinAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    nhId: string | null
    name: string | null
    description: string | null
    domainPod: string | null
    engineGroup: string | null
    language: string | null
    status: string | null
    owner: string | null
    defaultBranch: string | null
    githubUrl: string | null
  }

  export type RepoMaxAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    nhId: string | null
    name: string | null
    description: string | null
    domainPod: string | null
    engineGroup: string | null
    language: string | null
    status: string | null
    owner: string | null
    defaultBranch: string | null
    githubUrl: string | null
  }

  export type RepoCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    nhId: number
    name: number
    description: number
    domainPod: number
    engineGroup: number
    language: number
    status: number
    owner: number
    defaultBranch: number
    githubUrl: number
    notes: number
    _all: number
  }


  export type RepoAvgAggregateInputType = {
    id?: true
  }

  export type RepoSumAggregateInputType = {
    id?: true
  }

  export type RepoMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    nhId?: true
    name?: true
    description?: true
    domainPod?: true
    engineGroup?: true
    language?: true
    status?: true
    owner?: true
    defaultBranch?: true
    githubUrl?: true
  }

  export type RepoMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    nhId?: true
    name?: true
    description?: true
    domainPod?: true
    engineGroup?: true
    language?: true
    status?: true
    owner?: true
    defaultBranch?: true
    githubUrl?: true
  }

  export type RepoCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    nhId?: true
    name?: true
    description?: true
    domainPod?: true
    engineGroup?: true
    language?: true
    status?: true
    owner?: true
    defaultBranch?: true
    githubUrl?: true
    notes?: true
    _all?: true
  }

  export type RepoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Repo to aggregate.
     */
    where?: RepoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Repos to fetch.
     */
    orderBy?: RepoOrderByWithRelationInput | RepoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RepoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Repos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Repos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Repos
    **/
    _count?: true | RepoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RepoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RepoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RepoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RepoMaxAggregateInputType
  }

  export type GetRepoAggregateType<T extends RepoAggregateArgs> = {
        [P in keyof T & keyof AggregateRepo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRepo[P]>
      : GetScalarType<T[P], AggregateRepo[P]>
  }




  export type RepoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RepoWhereInput
    orderBy?: RepoOrderByWithAggregationInput | RepoOrderByWithAggregationInput[]
    by: RepoScalarFieldEnum[] | RepoScalarFieldEnum
    having?: RepoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RepoCountAggregateInputType | true
    _avg?: RepoAvgAggregateInputType
    _sum?: RepoSumAggregateInputType
    _min?: RepoMinAggregateInputType
    _max?: RepoMaxAggregateInputType
  }

  export type RepoGroupByOutputType = {
    id: number
    createdAt: Date
    updatedAt: Date
    nhId: string
    name: string
    description: string | null
    domainPod: string | null
    engineGroup: string | null
    language: string | null
    status: string | null
    owner: string | null
    defaultBranch: string | null
    githubUrl: string | null
    notes: JsonValue | null
    _count: RepoCountAggregateOutputType | null
    _avg: RepoAvgAggregateOutputType | null
    _sum: RepoSumAggregateOutputType | null
    _min: RepoMinAggregateOutputType | null
    _max: RepoMaxAggregateOutputType | null
  }

  type GetRepoGroupByPayload<T extends RepoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RepoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RepoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RepoGroupByOutputType[P]>
            : GetScalarType<T[P], RepoGroupByOutputType[P]>
        }
      >
    >


  export type RepoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    nhId?: boolean
    name?: boolean
    description?: boolean
    domainPod?: boolean
    engineGroup?: boolean
    language?: boolean
    status?: boolean
    owner?: boolean
    defaultBranch?: boolean
    githubUrl?: boolean
    notes?: boolean
    domains?: boolean | Repo$domainsArgs<ExtArgs>
    fileIndexes?: boolean | Repo$fileIndexesArgs<ExtArgs>
    sotEvents?: boolean | Repo$sotEventsArgs<ExtArgs>
    syncRuns?: boolean | Repo$syncRunsArgs<ExtArgs>
    _count?: boolean | RepoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["repo"]>

  export type RepoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    nhId?: boolean
    name?: boolean
    description?: boolean
    domainPod?: boolean
    engineGroup?: boolean
    language?: boolean
    status?: boolean
    owner?: boolean
    defaultBranch?: boolean
    githubUrl?: boolean
    notes?: boolean
  }, ExtArgs["result"]["repo"]>

  export type RepoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    nhId?: boolean
    name?: boolean
    description?: boolean
    domainPod?: boolean
    engineGroup?: boolean
    language?: boolean
    status?: boolean
    owner?: boolean
    defaultBranch?: boolean
    githubUrl?: boolean
    notes?: boolean
  }, ExtArgs["result"]["repo"]>

  export type RepoSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    nhId?: boolean
    name?: boolean
    description?: boolean
    domainPod?: boolean
    engineGroup?: boolean
    language?: boolean
    status?: boolean
    owner?: boolean
    defaultBranch?: boolean
    githubUrl?: boolean
    notes?: boolean
  }

  export type RepoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "nhId" | "name" | "description" | "domainPod" | "engineGroup" | "language" | "status" | "owner" | "defaultBranch" | "githubUrl" | "notes", ExtArgs["result"]["repo"]>
  export type RepoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    domains?: boolean | Repo$domainsArgs<ExtArgs>
    fileIndexes?: boolean | Repo$fileIndexesArgs<ExtArgs>
    sotEvents?: boolean | Repo$sotEventsArgs<ExtArgs>
    syncRuns?: boolean | Repo$syncRunsArgs<ExtArgs>
    _count?: boolean | RepoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RepoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RepoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RepoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Repo"
    objects: {
      domains: Prisma.$DomainPayload<ExtArgs>[]
      fileIndexes: Prisma.$FileIndexPayload<ExtArgs>[]
      sotEvents: Prisma.$SotEventPayload<ExtArgs>[]
      syncRuns: Prisma.$SyncRunPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      createdAt: Date
      updatedAt: Date
      nhId: string
      name: string
      description: string | null
      domainPod: string | null
      engineGroup: string | null
      language: string | null
      status: string | null
      owner: string | null
      defaultBranch: string | null
      githubUrl: string | null
      notes: Prisma.JsonValue | null
    }, ExtArgs["result"]["repo"]>
    composites: {}
  }

  type RepoGetPayload<S extends boolean | null | undefined | RepoDefaultArgs> = $Result.GetResult<Prisma.$RepoPayload, S>

  type RepoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RepoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RepoCountAggregateInputType | true
    }

  export interface RepoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Repo'], meta: { name: 'Repo' } }
    /**
     * Find zero or one Repo that matches the filter.
     * @param {RepoFindUniqueArgs} args - Arguments to find a Repo
     * @example
     * // Get one Repo
     * const repo = await prisma.repo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RepoFindUniqueArgs>(args: SelectSubset<T, RepoFindUniqueArgs<ExtArgs>>): Prisma__RepoClient<$Result.GetResult<Prisma.$RepoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Repo that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RepoFindUniqueOrThrowArgs} args - Arguments to find a Repo
     * @example
     * // Get one Repo
     * const repo = await prisma.repo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RepoFindUniqueOrThrowArgs>(args: SelectSubset<T, RepoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RepoClient<$Result.GetResult<Prisma.$RepoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Repo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepoFindFirstArgs} args - Arguments to find a Repo
     * @example
     * // Get one Repo
     * const repo = await prisma.repo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RepoFindFirstArgs>(args?: SelectSubset<T, RepoFindFirstArgs<ExtArgs>>): Prisma__RepoClient<$Result.GetResult<Prisma.$RepoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Repo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepoFindFirstOrThrowArgs} args - Arguments to find a Repo
     * @example
     * // Get one Repo
     * const repo = await prisma.repo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RepoFindFirstOrThrowArgs>(args?: SelectSubset<T, RepoFindFirstOrThrowArgs<ExtArgs>>): Prisma__RepoClient<$Result.GetResult<Prisma.$RepoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Repos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Repos
     * const repos = await prisma.repo.findMany()
     * 
     * // Get first 10 Repos
     * const repos = await prisma.repo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const repoWithIdOnly = await prisma.repo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RepoFindManyArgs>(args?: SelectSubset<T, RepoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RepoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Repo.
     * @param {RepoCreateArgs} args - Arguments to create a Repo.
     * @example
     * // Create one Repo
     * const Repo = await prisma.repo.create({
     *   data: {
     *     // ... data to create a Repo
     *   }
     * })
     * 
     */
    create<T extends RepoCreateArgs>(args: SelectSubset<T, RepoCreateArgs<ExtArgs>>): Prisma__RepoClient<$Result.GetResult<Prisma.$RepoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Repos.
     * @param {RepoCreateManyArgs} args - Arguments to create many Repos.
     * @example
     * // Create many Repos
     * const repo = await prisma.repo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RepoCreateManyArgs>(args?: SelectSubset<T, RepoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Repos and returns the data saved in the database.
     * @param {RepoCreateManyAndReturnArgs} args - Arguments to create many Repos.
     * @example
     * // Create many Repos
     * const repo = await prisma.repo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Repos and only return the `id`
     * const repoWithIdOnly = await prisma.repo.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RepoCreateManyAndReturnArgs>(args?: SelectSubset<T, RepoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RepoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Repo.
     * @param {RepoDeleteArgs} args - Arguments to delete one Repo.
     * @example
     * // Delete one Repo
     * const Repo = await prisma.repo.delete({
     *   where: {
     *     // ... filter to delete one Repo
     *   }
     * })
     * 
     */
    delete<T extends RepoDeleteArgs>(args: SelectSubset<T, RepoDeleteArgs<ExtArgs>>): Prisma__RepoClient<$Result.GetResult<Prisma.$RepoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Repo.
     * @param {RepoUpdateArgs} args - Arguments to update one Repo.
     * @example
     * // Update one Repo
     * const repo = await prisma.repo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RepoUpdateArgs>(args: SelectSubset<T, RepoUpdateArgs<ExtArgs>>): Prisma__RepoClient<$Result.GetResult<Prisma.$RepoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Repos.
     * @param {RepoDeleteManyArgs} args - Arguments to filter Repos to delete.
     * @example
     * // Delete a few Repos
     * const { count } = await prisma.repo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RepoDeleteManyArgs>(args?: SelectSubset<T, RepoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Repos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Repos
     * const repo = await prisma.repo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RepoUpdateManyArgs>(args: SelectSubset<T, RepoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Repos and returns the data updated in the database.
     * @param {RepoUpdateManyAndReturnArgs} args - Arguments to update many Repos.
     * @example
     * // Update many Repos
     * const repo = await prisma.repo.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Repos and only return the `id`
     * const repoWithIdOnly = await prisma.repo.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RepoUpdateManyAndReturnArgs>(args: SelectSubset<T, RepoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RepoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Repo.
     * @param {RepoUpsertArgs} args - Arguments to update or create a Repo.
     * @example
     * // Update or create a Repo
     * const repo = await prisma.repo.upsert({
     *   create: {
     *     // ... data to create a Repo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Repo we want to update
     *   }
     * })
     */
    upsert<T extends RepoUpsertArgs>(args: SelectSubset<T, RepoUpsertArgs<ExtArgs>>): Prisma__RepoClient<$Result.GetResult<Prisma.$RepoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Repos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepoCountArgs} args - Arguments to filter Repos to count.
     * @example
     * // Count the number of Repos
     * const count = await prisma.repo.count({
     *   where: {
     *     // ... the filter for the Repos we want to count
     *   }
     * })
    **/
    count<T extends RepoCountArgs>(
      args?: Subset<T, RepoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RepoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Repo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RepoAggregateArgs>(args: Subset<T, RepoAggregateArgs>): Prisma.PrismaPromise<GetRepoAggregateType<T>>

    /**
     * Group by Repo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RepoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RepoGroupByArgs['orderBy'] }
        : { orderBy?: RepoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RepoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRepoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Repo model
   */
  readonly fields: RepoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Repo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RepoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    domains<T extends Repo$domainsArgs<ExtArgs> = {}>(args?: Subset<T, Repo$domainsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    fileIndexes<T extends Repo$fileIndexesArgs<ExtArgs> = {}>(args?: Subset<T, Repo$fileIndexesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileIndexPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sotEvents<T extends Repo$sotEventsArgs<ExtArgs> = {}>(args?: Subset<T, Repo$sotEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SotEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    syncRuns<T extends Repo$syncRunsArgs<ExtArgs> = {}>(args?: Subset<T, Repo$syncRunsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Repo model
   */
  interface RepoFieldRefs {
    readonly id: FieldRef<"Repo", 'Int'>
    readonly createdAt: FieldRef<"Repo", 'DateTime'>
    readonly updatedAt: FieldRef<"Repo", 'DateTime'>
    readonly nhId: FieldRef<"Repo", 'String'>
    readonly name: FieldRef<"Repo", 'String'>
    readonly description: FieldRef<"Repo", 'String'>
    readonly domainPod: FieldRef<"Repo", 'String'>
    readonly engineGroup: FieldRef<"Repo", 'String'>
    readonly language: FieldRef<"Repo", 'String'>
    readonly status: FieldRef<"Repo", 'String'>
    readonly owner: FieldRef<"Repo", 'String'>
    readonly defaultBranch: FieldRef<"Repo", 'String'>
    readonly githubUrl: FieldRef<"Repo", 'String'>
    readonly notes: FieldRef<"Repo", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * Repo findUnique
   */
  export type RepoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repo
     */
    select?: RepoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repo
     */
    omit?: RepoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepoInclude<ExtArgs> | null
    /**
     * Filter, which Repo to fetch.
     */
    where: RepoWhereUniqueInput
  }

  /**
   * Repo findUniqueOrThrow
   */
  export type RepoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repo
     */
    select?: RepoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repo
     */
    omit?: RepoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepoInclude<ExtArgs> | null
    /**
     * Filter, which Repo to fetch.
     */
    where: RepoWhereUniqueInput
  }

  /**
   * Repo findFirst
   */
  export type RepoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repo
     */
    select?: RepoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repo
     */
    omit?: RepoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepoInclude<ExtArgs> | null
    /**
     * Filter, which Repo to fetch.
     */
    where?: RepoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Repos to fetch.
     */
    orderBy?: RepoOrderByWithRelationInput | RepoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Repos.
     */
    cursor?: RepoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Repos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Repos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Repos.
     */
    distinct?: RepoScalarFieldEnum | RepoScalarFieldEnum[]
  }

  /**
   * Repo findFirstOrThrow
   */
  export type RepoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repo
     */
    select?: RepoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repo
     */
    omit?: RepoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepoInclude<ExtArgs> | null
    /**
     * Filter, which Repo to fetch.
     */
    where?: RepoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Repos to fetch.
     */
    orderBy?: RepoOrderByWithRelationInput | RepoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Repos.
     */
    cursor?: RepoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Repos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Repos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Repos.
     */
    distinct?: RepoScalarFieldEnum | RepoScalarFieldEnum[]
  }

  /**
   * Repo findMany
   */
  export type RepoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repo
     */
    select?: RepoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repo
     */
    omit?: RepoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepoInclude<ExtArgs> | null
    /**
     * Filter, which Repos to fetch.
     */
    where?: RepoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Repos to fetch.
     */
    orderBy?: RepoOrderByWithRelationInput | RepoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Repos.
     */
    cursor?: RepoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Repos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Repos.
     */
    skip?: number
    distinct?: RepoScalarFieldEnum | RepoScalarFieldEnum[]
  }

  /**
   * Repo create
   */
  export type RepoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repo
     */
    select?: RepoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repo
     */
    omit?: RepoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepoInclude<ExtArgs> | null
    /**
     * The data needed to create a Repo.
     */
    data: XOR<RepoCreateInput, RepoUncheckedCreateInput>
  }

  /**
   * Repo createMany
   */
  export type RepoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Repos.
     */
    data: RepoCreateManyInput | RepoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Repo createManyAndReturn
   */
  export type RepoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repo
     */
    select?: RepoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Repo
     */
    omit?: RepoOmit<ExtArgs> | null
    /**
     * The data used to create many Repos.
     */
    data: RepoCreateManyInput | RepoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Repo update
   */
  export type RepoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repo
     */
    select?: RepoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repo
     */
    omit?: RepoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepoInclude<ExtArgs> | null
    /**
     * The data needed to update a Repo.
     */
    data: XOR<RepoUpdateInput, RepoUncheckedUpdateInput>
    /**
     * Choose, which Repo to update.
     */
    where: RepoWhereUniqueInput
  }

  /**
   * Repo updateMany
   */
  export type RepoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Repos.
     */
    data: XOR<RepoUpdateManyMutationInput, RepoUncheckedUpdateManyInput>
    /**
     * Filter which Repos to update
     */
    where?: RepoWhereInput
    /**
     * Limit how many Repos to update.
     */
    limit?: number
  }

  /**
   * Repo updateManyAndReturn
   */
  export type RepoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repo
     */
    select?: RepoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Repo
     */
    omit?: RepoOmit<ExtArgs> | null
    /**
     * The data used to update Repos.
     */
    data: XOR<RepoUpdateManyMutationInput, RepoUncheckedUpdateManyInput>
    /**
     * Filter which Repos to update
     */
    where?: RepoWhereInput
    /**
     * Limit how many Repos to update.
     */
    limit?: number
  }

  /**
   * Repo upsert
   */
  export type RepoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repo
     */
    select?: RepoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repo
     */
    omit?: RepoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepoInclude<ExtArgs> | null
    /**
     * The filter to search for the Repo to update in case it exists.
     */
    where: RepoWhereUniqueInput
    /**
     * In case the Repo found by the `where` argument doesn't exist, create a new Repo with this data.
     */
    create: XOR<RepoCreateInput, RepoUncheckedCreateInput>
    /**
     * In case the Repo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RepoUpdateInput, RepoUncheckedUpdateInput>
  }

  /**
   * Repo delete
   */
  export type RepoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repo
     */
    select?: RepoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repo
     */
    omit?: RepoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepoInclude<ExtArgs> | null
    /**
     * Filter which Repo to delete.
     */
    where: RepoWhereUniqueInput
  }

  /**
   * Repo deleteMany
   */
  export type RepoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Repos to delete
     */
    where?: RepoWhereInput
    /**
     * Limit how many Repos to delete.
     */
    limit?: number
  }

  /**
   * Repo.domains
   */
  export type Repo$domainsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
    where?: DomainWhereInput
    orderBy?: DomainOrderByWithRelationInput | DomainOrderByWithRelationInput[]
    cursor?: DomainWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DomainScalarFieldEnum | DomainScalarFieldEnum[]
  }

  /**
   * Repo.fileIndexes
   */
  export type Repo$fileIndexesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileIndex
     */
    select?: FileIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileIndex
     */
    omit?: FileIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileIndexInclude<ExtArgs> | null
    where?: FileIndexWhereInput
    orderBy?: FileIndexOrderByWithRelationInput | FileIndexOrderByWithRelationInput[]
    cursor?: FileIndexWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FileIndexScalarFieldEnum | FileIndexScalarFieldEnum[]
  }

  /**
   * Repo.sotEvents
   */
  export type Repo$sotEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SotEvent
     */
    select?: SotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SotEvent
     */
    omit?: SotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SotEventInclude<ExtArgs> | null
    where?: SotEventWhereInput
    orderBy?: SotEventOrderByWithRelationInput | SotEventOrderByWithRelationInput[]
    cursor?: SotEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SotEventScalarFieldEnum | SotEventScalarFieldEnum[]
  }

  /**
   * Repo.syncRuns
   */
  export type Repo$syncRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncRun
     */
    select?: SyncRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncRun
     */
    omit?: SyncRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SyncRunInclude<ExtArgs> | null
    where?: SyncRunWhereInput
    orderBy?: SyncRunOrderByWithRelationInput | SyncRunOrderByWithRelationInput[]
    cursor?: SyncRunWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SyncRunScalarFieldEnum | SyncRunScalarFieldEnum[]
  }

  /**
   * Repo without action
   */
  export type RepoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repo
     */
    select?: RepoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repo
     */
    omit?: RepoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepoInclude<ExtArgs> | null
  }


  /**
   * Model Domain
   */

  export type AggregateDomain = {
    _count: DomainCountAggregateOutputType | null
    _avg: DomainAvgAggregateOutputType | null
    _sum: DomainSumAggregateOutputType | null
    _min: DomainMinAggregateOutputType | null
    _max: DomainMaxAggregateOutputType | null
  }

  export type DomainAvgAggregateOutputType = {
    id: number | null
    repoId: number | null
  }

  export type DomainSumAggregateOutputType = {
    id: number | null
    repoId: number | null
  }

  export type DomainMinAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    nhId: string | null
    domain: string | null
    status: string | null
    domainKey: string | null
    engineType: string | null
    env: string | null
    expiresAt: Date | null
    repoId: number | null
  }

  export type DomainMaxAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    nhId: string | null
    domain: string | null
    status: string | null
    domainKey: string | null
    engineType: string | null
    env: string | null
    expiresAt: Date | null
    repoId: number | null
  }

  export type DomainCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    nhId: number
    domain: number
    status: number
    domainKey: number
    engineType: number
    env: number
    expiresAt: number
    notes: number
    repoId: number
    _all: number
  }


  export type DomainAvgAggregateInputType = {
    id?: true
    repoId?: true
  }

  export type DomainSumAggregateInputType = {
    id?: true
    repoId?: true
  }

  export type DomainMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    nhId?: true
    domain?: true
    status?: true
    domainKey?: true
    engineType?: true
    env?: true
    expiresAt?: true
    repoId?: true
  }

  export type DomainMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    nhId?: true
    domain?: true
    status?: true
    domainKey?: true
    engineType?: true
    env?: true
    expiresAt?: true
    repoId?: true
  }

  export type DomainCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    nhId?: true
    domain?: true
    status?: true
    domainKey?: true
    engineType?: true
    env?: true
    expiresAt?: true
    notes?: true
    repoId?: true
    _all?: true
  }

  export type DomainAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Domain to aggregate.
     */
    where?: DomainWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Domains to fetch.
     */
    orderBy?: DomainOrderByWithRelationInput | DomainOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DomainWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Domains from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Domains.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Domains
    **/
    _count?: true | DomainCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DomainAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DomainSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DomainMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DomainMaxAggregateInputType
  }

  export type GetDomainAggregateType<T extends DomainAggregateArgs> = {
        [P in keyof T & keyof AggregateDomain]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDomain[P]>
      : GetScalarType<T[P], AggregateDomain[P]>
  }




  export type DomainGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DomainWhereInput
    orderBy?: DomainOrderByWithAggregationInput | DomainOrderByWithAggregationInput[]
    by: DomainScalarFieldEnum[] | DomainScalarFieldEnum
    having?: DomainScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DomainCountAggregateInputType | true
    _avg?: DomainAvgAggregateInputType
    _sum?: DomainSumAggregateInputType
    _min?: DomainMinAggregateInputType
    _max?: DomainMaxAggregateInputType
  }

  export type DomainGroupByOutputType = {
    id: number
    createdAt: Date
    updatedAt: Date
    nhId: string
    domain: string
    status: string | null
    domainKey: string | null
    engineType: string | null
    env: string | null
    expiresAt: Date | null
    notes: JsonValue | null
    repoId: number | null
    _count: DomainCountAggregateOutputType | null
    _avg: DomainAvgAggregateOutputType | null
    _sum: DomainSumAggregateOutputType | null
    _min: DomainMinAggregateOutputType | null
    _max: DomainMaxAggregateOutputType | null
  }

  type GetDomainGroupByPayload<T extends DomainGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DomainGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DomainGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DomainGroupByOutputType[P]>
            : GetScalarType<T[P], DomainGroupByOutputType[P]>
        }
      >
    >


  export type DomainSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    nhId?: boolean
    domain?: boolean
    status?: boolean
    domainKey?: boolean
    engineType?: boolean
    env?: boolean
    expiresAt?: boolean
    notes?: boolean
    repoId?: boolean
    repo?: boolean | Domain$repoArgs<ExtArgs>
    sotEvents?: boolean | Domain$sotEventsArgs<ExtArgs>
    _count?: boolean | DomainCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["domain"]>

  export type DomainSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    nhId?: boolean
    domain?: boolean
    status?: boolean
    domainKey?: boolean
    engineType?: boolean
    env?: boolean
    expiresAt?: boolean
    notes?: boolean
    repoId?: boolean
    repo?: boolean | Domain$repoArgs<ExtArgs>
  }, ExtArgs["result"]["domain"]>

  export type DomainSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    nhId?: boolean
    domain?: boolean
    status?: boolean
    domainKey?: boolean
    engineType?: boolean
    env?: boolean
    expiresAt?: boolean
    notes?: boolean
    repoId?: boolean
    repo?: boolean | Domain$repoArgs<ExtArgs>
  }, ExtArgs["result"]["domain"]>

  export type DomainSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    nhId?: boolean
    domain?: boolean
    status?: boolean
    domainKey?: boolean
    engineType?: boolean
    env?: boolean
    expiresAt?: boolean
    notes?: boolean
    repoId?: boolean
  }

  export type DomainOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "nhId" | "domain" | "status" | "domainKey" | "engineType" | "env" | "expiresAt" | "notes" | "repoId", ExtArgs["result"]["domain"]>
  export type DomainInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repo?: boolean | Domain$repoArgs<ExtArgs>
    sotEvents?: boolean | Domain$sotEventsArgs<ExtArgs>
    _count?: boolean | DomainCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DomainIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repo?: boolean | Domain$repoArgs<ExtArgs>
  }
  export type DomainIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repo?: boolean | Domain$repoArgs<ExtArgs>
  }

  export type $DomainPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Domain"
    objects: {
      repo: Prisma.$RepoPayload<ExtArgs> | null
      sotEvents: Prisma.$SotEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      createdAt: Date
      updatedAt: Date
      nhId: string
      domain: string
      status: string | null
      domainKey: string | null
      engineType: string | null
      env: string | null
      expiresAt: Date | null
      notes: Prisma.JsonValue | null
      repoId: number | null
    }, ExtArgs["result"]["domain"]>
    composites: {}
  }

  type DomainGetPayload<S extends boolean | null | undefined | DomainDefaultArgs> = $Result.GetResult<Prisma.$DomainPayload, S>

  type DomainCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DomainFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DomainCountAggregateInputType | true
    }

  export interface DomainDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Domain'], meta: { name: 'Domain' } }
    /**
     * Find zero or one Domain that matches the filter.
     * @param {DomainFindUniqueArgs} args - Arguments to find a Domain
     * @example
     * // Get one Domain
     * const domain = await prisma.domain.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DomainFindUniqueArgs>(args: SelectSubset<T, DomainFindUniqueArgs<ExtArgs>>): Prisma__DomainClient<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Domain that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DomainFindUniqueOrThrowArgs} args - Arguments to find a Domain
     * @example
     * // Get one Domain
     * const domain = await prisma.domain.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DomainFindUniqueOrThrowArgs>(args: SelectSubset<T, DomainFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DomainClient<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Domain that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DomainFindFirstArgs} args - Arguments to find a Domain
     * @example
     * // Get one Domain
     * const domain = await prisma.domain.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DomainFindFirstArgs>(args?: SelectSubset<T, DomainFindFirstArgs<ExtArgs>>): Prisma__DomainClient<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Domain that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DomainFindFirstOrThrowArgs} args - Arguments to find a Domain
     * @example
     * // Get one Domain
     * const domain = await prisma.domain.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DomainFindFirstOrThrowArgs>(args?: SelectSubset<T, DomainFindFirstOrThrowArgs<ExtArgs>>): Prisma__DomainClient<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Domains that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DomainFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Domains
     * const domains = await prisma.domain.findMany()
     * 
     * // Get first 10 Domains
     * const domains = await prisma.domain.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const domainWithIdOnly = await prisma.domain.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DomainFindManyArgs>(args?: SelectSubset<T, DomainFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Domain.
     * @param {DomainCreateArgs} args - Arguments to create a Domain.
     * @example
     * // Create one Domain
     * const Domain = await prisma.domain.create({
     *   data: {
     *     // ... data to create a Domain
     *   }
     * })
     * 
     */
    create<T extends DomainCreateArgs>(args: SelectSubset<T, DomainCreateArgs<ExtArgs>>): Prisma__DomainClient<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Domains.
     * @param {DomainCreateManyArgs} args - Arguments to create many Domains.
     * @example
     * // Create many Domains
     * const domain = await prisma.domain.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DomainCreateManyArgs>(args?: SelectSubset<T, DomainCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Domains and returns the data saved in the database.
     * @param {DomainCreateManyAndReturnArgs} args - Arguments to create many Domains.
     * @example
     * // Create many Domains
     * const domain = await prisma.domain.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Domains and only return the `id`
     * const domainWithIdOnly = await prisma.domain.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DomainCreateManyAndReturnArgs>(args?: SelectSubset<T, DomainCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Domain.
     * @param {DomainDeleteArgs} args - Arguments to delete one Domain.
     * @example
     * // Delete one Domain
     * const Domain = await prisma.domain.delete({
     *   where: {
     *     // ... filter to delete one Domain
     *   }
     * })
     * 
     */
    delete<T extends DomainDeleteArgs>(args: SelectSubset<T, DomainDeleteArgs<ExtArgs>>): Prisma__DomainClient<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Domain.
     * @param {DomainUpdateArgs} args - Arguments to update one Domain.
     * @example
     * // Update one Domain
     * const domain = await prisma.domain.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DomainUpdateArgs>(args: SelectSubset<T, DomainUpdateArgs<ExtArgs>>): Prisma__DomainClient<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Domains.
     * @param {DomainDeleteManyArgs} args - Arguments to filter Domains to delete.
     * @example
     * // Delete a few Domains
     * const { count } = await prisma.domain.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DomainDeleteManyArgs>(args?: SelectSubset<T, DomainDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Domains.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DomainUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Domains
     * const domain = await prisma.domain.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DomainUpdateManyArgs>(args: SelectSubset<T, DomainUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Domains and returns the data updated in the database.
     * @param {DomainUpdateManyAndReturnArgs} args - Arguments to update many Domains.
     * @example
     * // Update many Domains
     * const domain = await prisma.domain.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Domains and only return the `id`
     * const domainWithIdOnly = await prisma.domain.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DomainUpdateManyAndReturnArgs>(args: SelectSubset<T, DomainUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Domain.
     * @param {DomainUpsertArgs} args - Arguments to update or create a Domain.
     * @example
     * // Update or create a Domain
     * const domain = await prisma.domain.upsert({
     *   create: {
     *     // ... data to create a Domain
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Domain we want to update
     *   }
     * })
     */
    upsert<T extends DomainUpsertArgs>(args: SelectSubset<T, DomainUpsertArgs<ExtArgs>>): Prisma__DomainClient<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Domains.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DomainCountArgs} args - Arguments to filter Domains to count.
     * @example
     * // Count the number of Domains
     * const count = await prisma.domain.count({
     *   where: {
     *     // ... the filter for the Domains we want to count
     *   }
     * })
    **/
    count<T extends DomainCountArgs>(
      args?: Subset<T, DomainCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DomainCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Domain.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DomainAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DomainAggregateArgs>(args: Subset<T, DomainAggregateArgs>): Prisma.PrismaPromise<GetDomainAggregateType<T>>

    /**
     * Group by Domain.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DomainGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DomainGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DomainGroupByArgs['orderBy'] }
        : { orderBy?: DomainGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DomainGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDomainGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Domain model
   */
  readonly fields: DomainFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Domain.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DomainClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    repo<T extends Domain$repoArgs<ExtArgs> = {}>(args?: Subset<T, Domain$repoArgs<ExtArgs>>): Prisma__RepoClient<$Result.GetResult<Prisma.$RepoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    sotEvents<T extends Domain$sotEventsArgs<ExtArgs> = {}>(args?: Subset<T, Domain$sotEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SotEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Domain model
   */
  interface DomainFieldRefs {
    readonly id: FieldRef<"Domain", 'Int'>
    readonly createdAt: FieldRef<"Domain", 'DateTime'>
    readonly updatedAt: FieldRef<"Domain", 'DateTime'>
    readonly nhId: FieldRef<"Domain", 'String'>
    readonly domain: FieldRef<"Domain", 'String'>
    readonly status: FieldRef<"Domain", 'String'>
    readonly domainKey: FieldRef<"Domain", 'String'>
    readonly engineType: FieldRef<"Domain", 'String'>
    readonly env: FieldRef<"Domain", 'String'>
    readonly expiresAt: FieldRef<"Domain", 'DateTime'>
    readonly notes: FieldRef<"Domain", 'Json'>
    readonly repoId: FieldRef<"Domain", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Domain findUnique
   */
  export type DomainFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
    /**
     * Filter, which Domain to fetch.
     */
    where: DomainWhereUniqueInput
  }

  /**
   * Domain findUniqueOrThrow
   */
  export type DomainFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
    /**
     * Filter, which Domain to fetch.
     */
    where: DomainWhereUniqueInput
  }

  /**
   * Domain findFirst
   */
  export type DomainFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
    /**
     * Filter, which Domain to fetch.
     */
    where?: DomainWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Domains to fetch.
     */
    orderBy?: DomainOrderByWithRelationInput | DomainOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Domains.
     */
    cursor?: DomainWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Domains from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Domains.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Domains.
     */
    distinct?: DomainScalarFieldEnum | DomainScalarFieldEnum[]
  }

  /**
   * Domain findFirstOrThrow
   */
  export type DomainFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
    /**
     * Filter, which Domain to fetch.
     */
    where?: DomainWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Domains to fetch.
     */
    orderBy?: DomainOrderByWithRelationInput | DomainOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Domains.
     */
    cursor?: DomainWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Domains from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Domains.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Domains.
     */
    distinct?: DomainScalarFieldEnum | DomainScalarFieldEnum[]
  }

  /**
   * Domain findMany
   */
  export type DomainFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
    /**
     * Filter, which Domains to fetch.
     */
    where?: DomainWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Domains to fetch.
     */
    orderBy?: DomainOrderByWithRelationInput | DomainOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Domains.
     */
    cursor?: DomainWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Domains from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Domains.
     */
    skip?: number
    distinct?: DomainScalarFieldEnum | DomainScalarFieldEnum[]
  }

  /**
   * Domain create
   */
  export type DomainCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
    /**
     * The data needed to create a Domain.
     */
    data: XOR<DomainCreateInput, DomainUncheckedCreateInput>
  }

  /**
   * Domain createMany
   */
  export type DomainCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Domains.
     */
    data: DomainCreateManyInput | DomainCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Domain createManyAndReturn
   */
  export type DomainCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * The data used to create many Domains.
     */
    data: DomainCreateManyInput | DomainCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Domain update
   */
  export type DomainUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
    /**
     * The data needed to update a Domain.
     */
    data: XOR<DomainUpdateInput, DomainUncheckedUpdateInput>
    /**
     * Choose, which Domain to update.
     */
    where: DomainWhereUniqueInput
  }

  /**
   * Domain updateMany
   */
  export type DomainUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Domains.
     */
    data: XOR<DomainUpdateManyMutationInput, DomainUncheckedUpdateManyInput>
    /**
     * Filter which Domains to update
     */
    where?: DomainWhereInput
    /**
     * Limit how many Domains to update.
     */
    limit?: number
  }

  /**
   * Domain updateManyAndReturn
   */
  export type DomainUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * The data used to update Domains.
     */
    data: XOR<DomainUpdateManyMutationInput, DomainUncheckedUpdateManyInput>
    /**
     * Filter which Domains to update
     */
    where?: DomainWhereInput
    /**
     * Limit how many Domains to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Domain upsert
   */
  export type DomainUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
    /**
     * The filter to search for the Domain to update in case it exists.
     */
    where: DomainWhereUniqueInput
    /**
     * In case the Domain found by the `where` argument doesn't exist, create a new Domain with this data.
     */
    create: XOR<DomainCreateInput, DomainUncheckedCreateInput>
    /**
     * In case the Domain was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DomainUpdateInput, DomainUncheckedUpdateInput>
  }

  /**
   * Domain delete
   */
  export type DomainDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
    /**
     * Filter which Domain to delete.
     */
    where: DomainWhereUniqueInput
  }

  /**
   * Domain deleteMany
   */
  export type DomainDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Domains to delete
     */
    where?: DomainWhereInput
    /**
     * Limit how many Domains to delete.
     */
    limit?: number
  }

  /**
   * Domain.repo
   */
  export type Domain$repoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repo
     */
    select?: RepoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repo
     */
    omit?: RepoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepoInclude<ExtArgs> | null
    where?: RepoWhereInput
  }

  /**
   * Domain.sotEvents
   */
  export type Domain$sotEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SotEvent
     */
    select?: SotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SotEvent
     */
    omit?: SotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SotEventInclude<ExtArgs> | null
    where?: SotEventWhereInput
    orderBy?: SotEventOrderByWithRelationInput | SotEventOrderByWithRelationInput[]
    cursor?: SotEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SotEventScalarFieldEnum | SotEventScalarFieldEnum[]
  }

  /**
   * Domain without action
   */
  export type DomainDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
  }


  /**
   * Model SyncRun
   */

  export type AggregateSyncRun = {
    _count: SyncRunCountAggregateOutputType | null
    _avg: SyncRunAvgAggregateOutputType | null
    _sum: SyncRunSumAggregateOutputType | null
    _min: SyncRunMinAggregateOutputType | null
    _max: SyncRunMaxAggregateOutputType | null
  }

  export type SyncRunAvgAggregateOutputType = {
    id: number | null
    repoId: number | null
  }

  export type SyncRunSumAggregateOutputType = {
    id: number | null
    repoId: number | null
  }

  export type SyncRunMinAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    type: string | null
    status: string | null
    trigger: string | null
    startedAt: Date | null
    finishedAt: Date | null
    workflowRunUrl: string | null
    summary: string | null
    repoId: number | null
  }

  export type SyncRunMaxAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    type: string | null
    status: string | null
    trigger: string | null
    startedAt: Date | null
    finishedAt: Date | null
    workflowRunUrl: string | null
    summary: string | null
    repoId: number | null
  }

  export type SyncRunCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    type: number
    status: number
    trigger: number
    startedAt: number
    finishedAt: number
    workflowRunUrl: number
    summary: number
    payload: number
    repoId: number
    _all: number
  }


  export type SyncRunAvgAggregateInputType = {
    id?: true
    repoId?: true
  }

  export type SyncRunSumAggregateInputType = {
    id?: true
    repoId?: true
  }

  export type SyncRunMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    type?: true
    status?: true
    trigger?: true
    startedAt?: true
    finishedAt?: true
    workflowRunUrl?: true
    summary?: true
    repoId?: true
  }

  export type SyncRunMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    type?: true
    status?: true
    trigger?: true
    startedAt?: true
    finishedAt?: true
    workflowRunUrl?: true
    summary?: true
    repoId?: true
  }

  export type SyncRunCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    type?: true
    status?: true
    trigger?: true
    startedAt?: true
    finishedAt?: true
    workflowRunUrl?: true
    summary?: true
    payload?: true
    repoId?: true
    _all?: true
  }

  export type SyncRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SyncRun to aggregate.
     */
    where?: SyncRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncRuns to fetch.
     */
    orderBy?: SyncRunOrderByWithRelationInput | SyncRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SyncRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SyncRuns
    **/
    _count?: true | SyncRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SyncRunAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SyncRunSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SyncRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SyncRunMaxAggregateInputType
  }

  export type GetSyncRunAggregateType<T extends SyncRunAggregateArgs> = {
        [P in keyof T & keyof AggregateSyncRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSyncRun[P]>
      : GetScalarType<T[P], AggregateSyncRun[P]>
  }




  export type SyncRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SyncRunWhereInput
    orderBy?: SyncRunOrderByWithAggregationInput | SyncRunOrderByWithAggregationInput[]
    by: SyncRunScalarFieldEnum[] | SyncRunScalarFieldEnum
    having?: SyncRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SyncRunCountAggregateInputType | true
    _avg?: SyncRunAvgAggregateInputType
    _sum?: SyncRunSumAggregateInputType
    _min?: SyncRunMinAggregateInputType
    _max?: SyncRunMaxAggregateInputType
  }

  export type SyncRunGroupByOutputType = {
    id: number
    createdAt: Date
    updatedAt: Date
    type: string
    status: string
    trigger: string | null
    startedAt: Date
    finishedAt: Date
    workflowRunUrl: string | null
    summary: string | null
    payload: JsonValue | null
    repoId: number | null
    _count: SyncRunCountAggregateOutputType | null
    _avg: SyncRunAvgAggregateOutputType | null
    _sum: SyncRunSumAggregateOutputType | null
    _min: SyncRunMinAggregateOutputType | null
    _max: SyncRunMaxAggregateOutputType | null
  }

  type GetSyncRunGroupByPayload<T extends SyncRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SyncRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SyncRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SyncRunGroupByOutputType[P]>
            : GetScalarType<T[P], SyncRunGroupByOutputType[P]>
        }
      >
    >


  export type SyncRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    type?: boolean
    status?: boolean
    trigger?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    workflowRunUrl?: boolean
    summary?: boolean
    payload?: boolean
    repoId?: boolean
    fileIndexes?: boolean | SyncRun$fileIndexesArgs<ExtArgs>
    repo?: boolean | SyncRun$repoArgs<ExtArgs>
    _count?: boolean | SyncRunCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["syncRun"]>

  export type SyncRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    type?: boolean
    status?: boolean
    trigger?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    workflowRunUrl?: boolean
    summary?: boolean
    payload?: boolean
    repoId?: boolean
    repo?: boolean | SyncRun$repoArgs<ExtArgs>
  }, ExtArgs["result"]["syncRun"]>

  export type SyncRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    type?: boolean
    status?: boolean
    trigger?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    workflowRunUrl?: boolean
    summary?: boolean
    payload?: boolean
    repoId?: boolean
    repo?: boolean | SyncRun$repoArgs<ExtArgs>
  }, ExtArgs["result"]["syncRun"]>

  export type SyncRunSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    type?: boolean
    status?: boolean
    trigger?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    workflowRunUrl?: boolean
    summary?: boolean
    payload?: boolean
    repoId?: boolean
  }

  export type SyncRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "type" | "status" | "trigger" | "startedAt" | "finishedAt" | "workflowRunUrl" | "summary" | "payload" | "repoId", ExtArgs["result"]["syncRun"]>
  export type SyncRunInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fileIndexes?: boolean | SyncRun$fileIndexesArgs<ExtArgs>
    repo?: boolean | SyncRun$repoArgs<ExtArgs>
    _count?: boolean | SyncRunCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SyncRunIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repo?: boolean | SyncRun$repoArgs<ExtArgs>
  }
  export type SyncRunIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repo?: boolean | SyncRun$repoArgs<ExtArgs>
  }

  export type $SyncRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SyncRun"
    objects: {
      fileIndexes: Prisma.$FileIndexPayload<ExtArgs>[]
      repo: Prisma.$RepoPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      createdAt: Date
      updatedAt: Date
      type: string
      status: string
      trigger: string | null
      startedAt: Date
      finishedAt: Date
      workflowRunUrl: string | null
      summary: string | null
      payload: Prisma.JsonValue | null
      repoId: number | null
    }, ExtArgs["result"]["syncRun"]>
    composites: {}
  }

  type SyncRunGetPayload<S extends boolean | null | undefined | SyncRunDefaultArgs> = $Result.GetResult<Prisma.$SyncRunPayload, S>

  type SyncRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SyncRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SyncRunCountAggregateInputType | true
    }

  export interface SyncRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SyncRun'], meta: { name: 'SyncRun' } }
    /**
     * Find zero or one SyncRun that matches the filter.
     * @param {SyncRunFindUniqueArgs} args - Arguments to find a SyncRun
     * @example
     * // Get one SyncRun
     * const syncRun = await prisma.syncRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SyncRunFindUniqueArgs>(args: SelectSubset<T, SyncRunFindUniqueArgs<ExtArgs>>): Prisma__SyncRunClient<$Result.GetResult<Prisma.$SyncRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SyncRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SyncRunFindUniqueOrThrowArgs} args - Arguments to find a SyncRun
     * @example
     * // Get one SyncRun
     * const syncRun = await prisma.syncRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SyncRunFindUniqueOrThrowArgs>(args: SelectSubset<T, SyncRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SyncRunClient<$Result.GetResult<Prisma.$SyncRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SyncRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncRunFindFirstArgs} args - Arguments to find a SyncRun
     * @example
     * // Get one SyncRun
     * const syncRun = await prisma.syncRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SyncRunFindFirstArgs>(args?: SelectSubset<T, SyncRunFindFirstArgs<ExtArgs>>): Prisma__SyncRunClient<$Result.GetResult<Prisma.$SyncRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SyncRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncRunFindFirstOrThrowArgs} args - Arguments to find a SyncRun
     * @example
     * // Get one SyncRun
     * const syncRun = await prisma.syncRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SyncRunFindFirstOrThrowArgs>(args?: SelectSubset<T, SyncRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__SyncRunClient<$Result.GetResult<Prisma.$SyncRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SyncRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SyncRuns
     * const syncRuns = await prisma.syncRun.findMany()
     * 
     * // Get first 10 SyncRuns
     * const syncRuns = await prisma.syncRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const syncRunWithIdOnly = await prisma.syncRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SyncRunFindManyArgs>(args?: SelectSubset<T, SyncRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SyncRun.
     * @param {SyncRunCreateArgs} args - Arguments to create a SyncRun.
     * @example
     * // Create one SyncRun
     * const SyncRun = await prisma.syncRun.create({
     *   data: {
     *     // ... data to create a SyncRun
     *   }
     * })
     * 
     */
    create<T extends SyncRunCreateArgs>(args: SelectSubset<T, SyncRunCreateArgs<ExtArgs>>): Prisma__SyncRunClient<$Result.GetResult<Prisma.$SyncRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SyncRuns.
     * @param {SyncRunCreateManyArgs} args - Arguments to create many SyncRuns.
     * @example
     * // Create many SyncRuns
     * const syncRun = await prisma.syncRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SyncRunCreateManyArgs>(args?: SelectSubset<T, SyncRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SyncRuns and returns the data saved in the database.
     * @param {SyncRunCreateManyAndReturnArgs} args - Arguments to create many SyncRuns.
     * @example
     * // Create many SyncRuns
     * const syncRun = await prisma.syncRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SyncRuns and only return the `id`
     * const syncRunWithIdOnly = await prisma.syncRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SyncRunCreateManyAndReturnArgs>(args?: SelectSubset<T, SyncRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SyncRun.
     * @param {SyncRunDeleteArgs} args - Arguments to delete one SyncRun.
     * @example
     * // Delete one SyncRun
     * const SyncRun = await prisma.syncRun.delete({
     *   where: {
     *     // ... filter to delete one SyncRun
     *   }
     * })
     * 
     */
    delete<T extends SyncRunDeleteArgs>(args: SelectSubset<T, SyncRunDeleteArgs<ExtArgs>>): Prisma__SyncRunClient<$Result.GetResult<Prisma.$SyncRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SyncRun.
     * @param {SyncRunUpdateArgs} args - Arguments to update one SyncRun.
     * @example
     * // Update one SyncRun
     * const syncRun = await prisma.syncRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SyncRunUpdateArgs>(args: SelectSubset<T, SyncRunUpdateArgs<ExtArgs>>): Prisma__SyncRunClient<$Result.GetResult<Prisma.$SyncRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SyncRuns.
     * @param {SyncRunDeleteManyArgs} args - Arguments to filter SyncRuns to delete.
     * @example
     * // Delete a few SyncRuns
     * const { count } = await prisma.syncRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SyncRunDeleteManyArgs>(args?: SelectSubset<T, SyncRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SyncRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SyncRuns
     * const syncRun = await prisma.syncRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SyncRunUpdateManyArgs>(args: SelectSubset<T, SyncRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SyncRuns and returns the data updated in the database.
     * @param {SyncRunUpdateManyAndReturnArgs} args - Arguments to update many SyncRuns.
     * @example
     * // Update many SyncRuns
     * const syncRun = await prisma.syncRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SyncRuns and only return the `id`
     * const syncRunWithIdOnly = await prisma.syncRun.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SyncRunUpdateManyAndReturnArgs>(args: SelectSubset<T, SyncRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SyncRun.
     * @param {SyncRunUpsertArgs} args - Arguments to update or create a SyncRun.
     * @example
     * // Update or create a SyncRun
     * const syncRun = await prisma.syncRun.upsert({
     *   create: {
     *     // ... data to create a SyncRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SyncRun we want to update
     *   }
     * })
     */
    upsert<T extends SyncRunUpsertArgs>(args: SelectSubset<T, SyncRunUpsertArgs<ExtArgs>>): Prisma__SyncRunClient<$Result.GetResult<Prisma.$SyncRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SyncRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncRunCountArgs} args - Arguments to filter SyncRuns to count.
     * @example
     * // Count the number of SyncRuns
     * const count = await prisma.syncRun.count({
     *   where: {
     *     // ... the filter for the SyncRuns we want to count
     *   }
     * })
    **/
    count<T extends SyncRunCountArgs>(
      args?: Subset<T, SyncRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SyncRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SyncRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SyncRunAggregateArgs>(args: Subset<T, SyncRunAggregateArgs>): Prisma.PrismaPromise<GetSyncRunAggregateType<T>>

    /**
     * Group by SyncRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncRunGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SyncRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SyncRunGroupByArgs['orderBy'] }
        : { orderBy?: SyncRunGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SyncRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSyncRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SyncRun model
   */
  readonly fields: SyncRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SyncRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SyncRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    fileIndexes<T extends SyncRun$fileIndexesArgs<ExtArgs> = {}>(args?: Subset<T, SyncRun$fileIndexesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileIndexPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    repo<T extends SyncRun$repoArgs<ExtArgs> = {}>(args?: Subset<T, SyncRun$repoArgs<ExtArgs>>): Prisma__RepoClient<$Result.GetResult<Prisma.$RepoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SyncRun model
   */
  interface SyncRunFieldRefs {
    readonly id: FieldRef<"SyncRun", 'Int'>
    readonly createdAt: FieldRef<"SyncRun", 'DateTime'>
    readonly updatedAt: FieldRef<"SyncRun", 'DateTime'>
    readonly type: FieldRef<"SyncRun", 'String'>
    readonly status: FieldRef<"SyncRun", 'String'>
    readonly trigger: FieldRef<"SyncRun", 'String'>
    readonly startedAt: FieldRef<"SyncRun", 'DateTime'>
    readonly finishedAt: FieldRef<"SyncRun", 'DateTime'>
    readonly workflowRunUrl: FieldRef<"SyncRun", 'String'>
    readonly summary: FieldRef<"SyncRun", 'String'>
    readonly payload: FieldRef<"SyncRun", 'Json'>
    readonly repoId: FieldRef<"SyncRun", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * SyncRun findUnique
   */
  export type SyncRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncRun
     */
    select?: SyncRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncRun
     */
    omit?: SyncRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SyncRunInclude<ExtArgs> | null
    /**
     * Filter, which SyncRun to fetch.
     */
    where: SyncRunWhereUniqueInput
  }

  /**
   * SyncRun findUniqueOrThrow
   */
  export type SyncRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncRun
     */
    select?: SyncRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncRun
     */
    omit?: SyncRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SyncRunInclude<ExtArgs> | null
    /**
     * Filter, which SyncRun to fetch.
     */
    where: SyncRunWhereUniqueInput
  }

  /**
   * SyncRun findFirst
   */
  export type SyncRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncRun
     */
    select?: SyncRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncRun
     */
    omit?: SyncRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SyncRunInclude<ExtArgs> | null
    /**
     * Filter, which SyncRun to fetch.
     */
    where?: SyncRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncRuns to fetch.
     */
    orderBy?: SyncRunOrderByWithRelationInput | SyncRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SyncRuns.
     */
    cursor?: SyncRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SyncRuns.
     */
    distinct?: SyncRunScalarFieldEnum | SyncRunScalarFieldEnum[]
  }

  /**
   * SyncRun findFirstOrThrow
   */
  export type SyncRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncRun
     */
    select?: SyncRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncRun
     */
    omit?: SyncRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SyncRunInclude<ExtArgs> | null
    /**
     * Filter, which SyncRun to fetch.
     */
    where?: SyncRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncRuns to fetch.
     */
    orderBy?: SyncRunOrderByWithRelationInput | SyncRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SyncRuns.
     */
    cursor?: SyncRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SyncRuns.
     */
    distinct?: SyncRunScalarFieldEnum | SyncRunScalarFieldEnum[]
  }

  /**
   * SyncRun findMany
   */
  export type SyncRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncRun
     */
    select?: SyncRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncRun
     */
    omit?: SyncRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SyncRunInclude<ExtArgs> | null
    /**
     * Filter, which SyncRuns to fetch.
     */
    where?: SyncRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncRuns to fetch.
     */
    orderBy?: SyncRunOrderByWithRelationInput | SyncRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SyncRuns.
     */
    cursor?: SyncRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncRuns.
     */
    skip?: number
    distinct?: SyncRunScalarFieldEnum | SyncRunScalarFieldEnum[]
  }

  /**
   * SyncRun create
   */
  export type SyncRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncRun
     */
    select?: SyncRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncRun
     */
    omit?: SyncRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SyncRunInclude<ExtArgs> | null
    /**
     * The data needed to create a SyncRun.
     */
    data: XOR<SyncRunCreateInput, SyncRunUncheckedCreateInput>
  }

  /**
   * SyncRun createMany
   */
  export type SyncRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SyncRuns.
     */
    data: SyncRunCreateManyInput | SyncRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SyncRun createManyAndReturn
   */
  export type SyncRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncRun
     */
    select?: SyncRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SyncRun
     */
    omit?: SyncRunOmit<ExtArgs> | null
    /**
     * The data used to create many SyncRuns.
     */
    data: SyncRunCreateManyInput | SyncRunCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SyncRunIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SyncRun update
   */
  export type SyncRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncRun
     */
    select?: SyncRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncRun
     */
    omit?: SyncRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SyncRunInclude<ExtArgs> | null
    /**
     * The data needed to update a SyncRun.
     */
    data: XOR<SyncRunUpdateInput, SyncRunUncheckedUpdateInput>
    /**
     * Choose, which SyncRun to update.
     */
    where: SyncRunWhereUniqueInput
  }

  /**
   * SyncRun updateMany
   */
  export type SyncRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SyncRuns.
     */
    data: XOR<SyncRunUpdateManyMutationInput, SyncRunUncheckedUpdateManyInput>
    /**
     * Filter which SyncRuns to update
     */
    where?: SyncRunWhereInput
    /**
     * Limit how many SyncRuns to update.
     */
    limit?: number
  }

  /**
   * SyncRun updateManyAndReturn
   */
  export type SyncRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncRun
     */
    select?: SyncRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SyncRun
     */
    omit?: SyncRunOmit<ExtArgs> | null
    /**
     * The data used to update SyncRuns.
     */
    data: XOR<SyncRunUpdateManyMutationInput, SyncRunUncheckedUpdateManyInput>
    /**
     * Filter which SyncRuns to update
     */
    where?: SyncRunWhereInput
    /**
     * Limit how many SyncRuns to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SyncRunIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SyncRun upsert
   */
  export type SyncRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncRun
     */
    select?: SyncRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncRun
     */
    omit?: SyncRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SyncRunInclude<ExtArgs> | null
    /**
     * The filter to search for the SyncRun to update in case it exists.
     */
    where: SyncRunWhereUniqueInput
    /**
     * In case the SyncRun found by the `where` argument doesn't exist, create a new SyncRun with this data.
     */
    create: XOR<SyncRunCreateInput, SyncRunUncheckedCreateInput>
    /**
     * In case the SyncRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SyncRunUpdateInput, SyncRunUncheckedUpdateInput>
  }

  /**
   * SyncRun delete
   */
  export type SyncRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncRun
     */
    select?: SyncRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncRun
     */
    omit?: SyncRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SyncRunInclude<ExtArgs> | null
    /**
     * Filter which SyncRun to delete.
     */
    where: SyncRunWhereUniqueInput
  }

  /**
   * SyncRun deleteMany
   */
  export type SyncRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SyncRuns to delete
     */
    where?: SyncRunWhereInput
    /**
     * Limit how many SyncRuns to delete.
     */
    limit?: number
  }

  /**
   * SyncRun.fileIndexes
   */
  export type SyncRun$fileIndexesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileIndex
     */
    select?: FileIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileIndex
     */
    omit?: FileIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileIndexInclude<ExtArgs> | null
    where?: FileIndexWhereInput
    orderBy?: FileIndexOrderByWithRelationInput | FileIndexOrderByWithRelationInput[]
    cursor?: FileIndexWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FileIndexScalarFieldEnum | FileIndexScalarFieldEnum[]
  }

  /**
   * SyncRun.repo
   */
  export type SyncRun$repoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repo
     */
    select?: RepoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repo
     */
    omit?: RepoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepoInclude<ExtArgs> | null
    where?: RepoWhereInput
  }

  /**
   * SyncRun without action
   */
  export type SyncRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncRun
     */
    select?: SyncRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncRun
     */
    omit?: SyncRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SyncRunInclude<ExtArgs> | null
  }


  /**
   * Model FileIndex
   */

  export type AggregateFileIndex = {
    _count: FileIndexCountAggregateOutputType | null
    _avg: FileIndexAvgAggregateOutputType | null
    _sum: FileIndexSumAggregateOutputType | null
    _min: FileIndexMinAggregateOutputType | null
    _max: FileIndexMaxAggregateOutputType | null
  }

  export type FileIndexAvgAggregateOutputType = {
    id: number | null
    repoId: number | null
    syncRunId: number | null
    sizeBytes: number | null
  }

  export type FileIndexSumAggregateOutputType = {
    id: number | null
    repoId: number | null
    syncRunId: number | null
    sizeBytes: number | null
  }

  export type FileIndexMinAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    repoId: number | null
    syncRunId: number | null
    path: string | null
    dir: string | null
    filename: string | null
    extension: string | null
    sizeBytes: number | null
    sha256: string | null
    lastCommitSha: string | null
    indexedAt: Date | null
  }

  export type FileIndexMaxAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    repoId: number | null
    syncRunId: number | null
    path: string | null
    dir: string | null
    filename: string | null
    extension: string | null
    sizeBytes: number | null
    sha256: string | null
    lastCommitSha: string | null
    indexedAt: Date | null
  }

  export type FileIndexCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    repoId: number
    syncRunId: number
    path: number
    dir: number
    filename: number
    extension: number
    sizeBytes: number
    sha256: number
    lastCommitSha: number
    indexedAt: number
    _all: number
  }


  export type FileIndexAvgAggregateInputType = {
    id?: true
    repoId?: true
    syncRunId?: true
    sizeBytes?: true
  }

  export type FileIndexSumAggregateInputType = {
    id?: true
    repoId?: true
    syncRunId?: true
    sizeBytes?: true
  }

  export type FileIndexMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    repoId?: true
    syncRunId?: true
    path?: true
    dir?: true
    filename?: true
    extension?: true
    sizeBytes?: true
    sha256?: true
    lastCommitSha?: true
    indexedAt?: true
  }

  export type FileIndexMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    repoId?: true
    syncRunId?: true
    path?: true
    dir?: true
    filename?: true
    extension?: true
    sizeBytes?: true
    sha256?: true
    lastCommitSha?: true
    indexedAt?: true
  }

  export type FileIndexCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    repoId?: true
    syncRunId?: true
    path?: true
    dir?: true
    filename?: true
    extension?: true
    sizeBytes?: true
    sha256?: true
    lastCommitSha?: true
    indexedAt?: true
    _all?: true
  }

  export type FileIndexAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileIndex to aggregate.
     */
    where?: FileIndexWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileIndices to fetch.
     */
    orderBy?: FileIndexOrderByWithRelationInput | FileIndexOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FileIndexWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileIndices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileIndices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FileIndices
    **/
    _count?: true | FileIndexCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FileIndexAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FileIndexSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FileIndexMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FileIndexMaxAggregateInputType
  }

  export type GetFileIndexAggregateType<T extends FileIndexAggregateArgs> = {
        [P in keyof T & keyof AggregateFileIndex]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFileIndex[P]>
      : GetScalarType<T[P], AggregateFileIndex[P]>
  }




  export type FileIndexGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileIndexWhereInput
    orderBy?: FileIndexOrderByWithAggregationInput | FileIndexOrderByWithAggregationInput[]
    by: FileIndexScalarFieldEnum[] | FileIndexScalarFieldEnum
    having?: FileIndexScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FileIndexCountAggregateInputType | true
    _avg?: FileIndexAvgAggregateInputType
    _sum?: FileIndexSumAggregateInputType
    _min?: FileIndexMinAggregateInputType
    _max?: FileIndexMaxAggregateInputType
  }

  export type FileIndexGroupByOutputType = {
    id: number
    createdAt: Date
    updatedAt: Date
    repoId: number
    syncRunId: number | null
    path: string
    dir: string
    filename: string
    extension: string
    sizeBytes: number
    sha256: string
    lastCommitSha: string | null
    indexedAt: Date
    _count: FileIndexCountAggregateOutputType | null
    _avg: FileIndexAvgAggregateOutputType | null
    _sum: FileIndexSumAggregateOutputType | null
    _min: FileIndexMinAggregateOutputType | null
    _max: FileIndexMaxAggregateOutputType | null
  }

  type GetFileIndexGroupByPayload<T extends FileIndexGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FileIndexGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FileIndexGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FileIndexGroupByOutputType[P]>
            : GetScalarType<T[P], FileIndexGroupByOutputType[P]>
        }
      >
    >


  export type FileIndexSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    repoId?: boolean
    syncRunId?: boolean
    path?: boolean
    dir?: boolean
    filename?: boolean
    extension?: boolean
    sizeBytes?: boolean
    sha256?: boolean
    lastCommitSha?: boolean
    indexedAt?: boolean
    repo?: boolean | RepoDefaultArgs<ExtArgs>
    syncRun?: boolean | FileIndex$syncRunArgs<ExtArgs>
  }, ExtArgs["result"]["fileIndex"]>

  export type FileIndexSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    repoId?: boolean
    syncRunId?: boolean
    path?: boolean
    dir?: boolean
    filename?: boolean
    extension?: boolean
    sizeBytes?: boolean
    sha256?: boolean
    lastCommitSha?: boolean
    indexedAt?: boolean
    repo?: boolean | RepoDefaultArgs<ExtArgs>
    syncRun?: boolean | FileIndex$syncRunArgs<ExtArgs>
  }, ExtArgs["result"]["fileIndex"]>

  export type FileIndexSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    repoId?: boolean
    syncRunId?: boolean
    path?: boolean
    dir?: boolean
    filename?: boolean
    extension?: boolean
    sizeBytes?: boolean
    sha256?: boolean
    lastCommitSha?: boolean
    indexedAt?: boolean
    repo?: boolean | RepoDefaultArgs<ExtArgs>
    syncRun?: boolean | FileIndex$syncRunArgs<ExtArgs>
  }, ExtArgs["result"]["fileIndex"]>

  export type FileIndexSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    repoId?: boolean
    syncRunId?: boolean
    path?: boolean
    dir?: boolean
    filename?: boolean
    extension?: boolean
    sizeBytes?: boolean
    sha256?: boolean
    lastCommitSha?: boolean
    indexedAt?: boolean
  }

  export type FileIndexOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "repoId" | "syncRunId" | "path" | "dir" | "filename" | "extension" | "sizeBytes" | "sha256" | "lastCommitSha" | "indexedAt", ExtArgs["result"]["fileIndex"]>
  export type FileIndexInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repo?: boolean | RepoDefaultArgs<ExtArgs>
    syncRun?: boolean | FileIndex$syncRunArgs<ExtArgs>
  }
  export type FileIndexIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repo?: boolean | RepoDefaultArgs<ExtArgs>
    syncRun?: boolean | FileIndex$syncRunArgs<ExtArgs>
  }
  export type FileIndexIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repo?: boolean | RepoDefaultArgs<ExtArgs>
    syncRun?: boolean | FileIndex$syncRunArgs<ExtArgs>
  }

  export type $FileIndexPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FileIndex"
    objects: {
      repo: Prisma.$RepoPayload<ExtArgs>
      syncRun: Prisma.$SyncRunPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      createdAt: Date
      updatedAt: Date
      repoId: number
      syncRunId: number | null
      path: string
      dir: string
      filename: string
      extension: string
      sizeBytes: number
      sha256: string
      lastCommitSha: string | null
      indexedAt: Date
    }, ExtArgs["result"]["fileIndex"]>
    composites: {}
  }

  type FileIndexGetPayload<S extends boolean | null | undefined | FileIndexDefaultArgs> = $Result.GetResult<Prisma.$FileIndexPayload, S>

  type FileIndexCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FileIndexFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FileIndexCountAggregateInputType | true
    }

  export interface FileIndexDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FileIndex'], meta: { name: 'FileIndex' } }
    /**
     * Find zero or one FileIndex that matches the filter.
     * @param {FileIndexFindUniqueArgs} args - Arguments to find a FileIndex
     * @example
     * // Get one FileIndex
     * const fileIndex = await prisma.fileIndex.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FileIndexFindUniqueArgs>(args: SelectSubset<T, FileIndexFindUniqueArgs<ExtArgs>>): Prisma__FileIndexClient<$Result.GetResult<Prisma.$FileIndexPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FileIndex that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FileIndexFindUniqueOrThrowArgs} args - Arguments to find a FileIndex
     * @example
     * // Get one FileIndex
     * const fileIndex = await prisma.fileIndex.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FileIndexFindUniqueOrThrowArgs>(args: SelectSubset<T, FileIndexFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FileIndexClient<$Result.GetResult<Prisma.$FileIndexPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FileIndex that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileIndexFindFirstArgs} args - Arguments to find a FileIndex
     * @example
     * // Get one FileIndex
     * const fileIndex = await prisma.fileIndex.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FileIndexFindFirstArgs>(args?: SelectSubset<T, FileIndexFindFirstArgs<ExtArgs>>): Prisma__FileIndexClient<$Result.GetResult<Prisma.$FileIndexPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FileIndex that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileIndexFindFirstOrThrowArgs} args - Arguments to find a FileIndex
     * @example
     * // Get one FileIndex
     * const fileIndex = await prisma.fileIndex.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FileIndexFindFirstOrThrowArgs>(args?: SelectSubset<T, FileIndexFindFirstOrThrowArgs<ExtArgs>>): Prisma__FileIndexClient<$Result.GetResult<Prisma.$FileIndexPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FileIndices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileIndexFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FileIndices
     * const fileIndices = await prisma.fileIndex.findMany()
     * 
     * // Get first 10 FileIndices
     * const fileIndices = await prisma.fileIndex.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fileIndexWithIdOnly = await prisma.fileIndex.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FileIndexFindManyArgs>(args?: SelectSubset<T, FileIndexFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileIndexPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FileIndex.
     * @param {FileIndexCreateArgs} args - Arguments to create a FileIndex.
     * @example
     * // Create one FileIndex
     * const FileIndex = await prisma.fileIndex.create({
     *   data: {
     *     // ... data to create a FileIndex
     *   }
     * })
     * 
     */
    create<T extends FileIndexCreateArgs>(args: SelectSubset<T, FileIndexCreateArgs<ExtArgs>>): Prisma__FileIndexClient<$Result.GetResult<Prisma.$FileIndexPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FileIndices.
     * @param {FileIndexCreateManyArgs} args - Arguments to create many FileIndices.
     * @example
     * // Create many FileIndices
     * const fileIndex = await prisma.fileIndex.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FileIndexCreateManyArgs>(args?: SelectSubset<T, FileIndexCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FileIndices and returns the data saved in the database.
     * @param {FileIndexCreateManyAndReturnArgs} args - Arguments to create many FileIndices.
     * @example
     * // Create many FileIndices
     * const fileIndex = await prisma.fileIndex.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FileIndices and only return the `id`
     * const fileIndexWithIdOnly = await prisma.fileIndex.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FileIndexCreateManyAndReturnArgs>(args?: SelectSubset<T, FileIndexCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileIndexPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FileIndex.
     * @param {FileIndexDeleteArgs} args - Arguments to delete one FileIndex.
     * @example
     * // Delete one FileIndex
     * const FileIndex = await prisma.fileIndex.delete({
     *   where: {
     *     // ... filter to delete one FileIndex
     *   }
     * })
     * 
     */
    delete<T extends FileIndexDeleteArgs>(args: SelectSubset<T, FileIndexDeleteArgs<ExtArgs>>): Prisma__FileIndexClient<$Result.GetResult<Prisma.$FileIndexPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FileIndex.
     * @param {FileIndexUpdateArgs} args - Arguments to update one FileIndex.
     * @example
     * // Update one FileIndex
     * const fileIndex = await prisma.fileIndex.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FileIndexUpdateArgs>(args: SelectSubset<T, FileIndexUpdateArgs<ExtArgs>>): Prisma__FileIndexClient<$Result.GetResult<Prisma.$FileIndexPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FileIndices.
     * @param {FileIndexDeleteManyArgs} args - Arguments to filter FileIndices to delete.
     * @example
     * // Delete a few FileIndices
     * const { count } = await prisma.fileIndex.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FileIndexDeleteManyArgs>(args?: SelectSubset<T, FileIndexDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FileIndices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileIndexUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FileIndices
     * const fileIndex = await prisma.fileIndex.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FileIndexUpdateManyArgs>(args: SelectSubset<T, FileIndexUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FileIndices and returns the data updated in the database.
     * @param {FileIndexUpdateManyAndReturnArgs} args - Arguments to update many FileIndices.
     * @example
     * // Update many FileIndices
     * const fileIndex = await prisma.fileIndex.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FileIndices and only return the `id`
     * const fileIndexWithIdOnly = await prisma.fileIndex.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FileIndexUpdateManyAndReturnArgs>(args: SelectSubset<T, FileIndexUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileIndexPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FileIndex.
     * @param {FileIndexUpsertArgs} args - Arguments to update or create a FileIndex.
     * @example
     * // Update or create a FileIndex
     * const fileIndex = await prisma.fileIndex.upsert({
     *   create: {
     *     // ... data to create a FileIndex
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FileIndex we want to update
     *   }
     * })
     */
    upsert<T extends FileIndexUpsertArgs>(args: SelectSubset<T, FileIndexUpsertArgs<ExtArgs>>): Prisma__FileIndexClient<$Result.GetResult<Prisma.$FileIndexPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FileIndices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileIndexCountArgs} args - Arguments to filter FileIndices to count.
     * @example
     * // Count the number of FileIndices
     * const count = await prisma.fileIndex.count({
     *   where: {
     *     // ... the filter for the FileIndices we want to count
     *   }
     * })
    **/
    count<T extends FileIndexCountArgs>(
      args?: Subset<T, FileIndexCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FileIndexCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FileIndex.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileIndexAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FileIndexAggregateArgs>(args: Subset<T, FileIndexAggregateArgs>): Prisma.PrismaPromise<GetFileIndexAggregateType<T>>

    /**
     * Group by FileIndex.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileIndexGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FileIndexGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FileIndexGroupByArgs['orderBy'] }
        : { orderBy?: FileIndexGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FileIndexGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFileIndexGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FileIndex model
   */
  readonly fields: FileIndexFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FileIndex.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FileIndexClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    repo<T extends RepoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RepoDefaultArgs<ExtArgs>>): Prisma__RepoClient<$Result.GetResult<Prisma.$RepoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    syncRun<T extends FileIndex$syncRunArgs<ExtArgs> = {}>(args?: Subset<T, FileIndex$syncRunArgs<ExtArgs>>): Prisma__SyncRunClient<$Result.GetResult<Prisma.$SyncRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FileIndex model
   */
  interface FileIndexFieldRefs {
    readonly id: FieldRef<"FileIndex", 'Int'>
    readonly createdAt: FieldRef<"FileIndex", 'DateTime'>
    readonly updatedAt: FieldRef<"FileIndex", 'DateTime'>
    readonly repoId: FieldRef<"FileIndex", 'Int'>
    readonly syncRunId: FieldRef<"FileIndex", 'Int'>
    readonly path: FieldRef<"FileIndex", 'String'>
    readonly dir: FieldRef<"FileIndex", 'String'>
    readonly filename: FieldRef<"FileIndex", 'String'>
    readonly extension: FieldRef<"FileIndex", 'String'>
    readonly sizeBytes: FieldRef<"FileIndex", 'Int'>
    readonly sha256: FieldRef<"FileIndex", 'String'>
    readonly lastCommitSha: FieldRef<"FileIndex", 'String'>
    readonly indexedAt: FieldRef<"FileIndex", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FileIndex findUnique
   */
  export type FileIndexFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileIndex
     */
    select?: FileIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileIndex
     */
    omit?: FileIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileIndexInclude<ExtArgs> | null
    /**
     * Filter, which FileIndex to fetch.
     */
    where: FileIndexWhereUniqueInput
  }

  /**
   * FileIndex findUniqueOrThrow
   */
  export type FileIndexFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileIndex
     */
    select?: FileIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileIndex
     */
    omit?: FileIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileIndexInclude<ExtArgs> | null
    /**
     * Filter, which FileIndex to fetch.
     */
    where: FileIndexWhereUniqueInput
  }

  /**
   * FileIndex findFirst
   */
  export type FileIndexFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileIndex
     */
    select?: FileIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileIndex
     */
    omit?: FileIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileIndexInclude<ExtArgs> | null
    /**
     * Filter, which FileIndex to fetch.
     */
    where?: FileIndexWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileIndices to fetch.
     */
    orderBy?: FileIndexOrderByWithRelationInput | FileIndexOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileIndices.
     */
    cursor?: FileIndexWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileIndices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileIndices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileIndices.
     */
    distinct?: FileIndexScalarFieldEnum | FileIndexScalarFieldEnum[]
  }

  /**
   * FileIndex findFirstOrThrow
   */
  export type FileIndexFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileIndex
     */
    select?: FileIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileIndex
     */
    omit?: FileIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileIndexInclude<ExtArgs> | null
    /**
     * Filter, which FileIndex to fetch.
     */
    where?: FileIndexWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileIndices to fetch.
     */
    orderBy?: FileIndexOrderByWithRelationInput | FileIndexOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileIndices.
     */
    cursor?: FileIndexWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileIndices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileIndices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileIndices.
     */
    distinct?: FileIndexScalarFieldEnum | FileIndexScalarFieldEnum[]
  }

  /**
   * FileIndex findMany
   */
  export type FileIndexFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileIndex
     */
    select?: FileIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileIndex
     */
    omit?: FileIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileIndexInclude<ExtArgs> | null
    /**
     * Filter, which FileIndices to fetch.
     */
    where?: FileIndexWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileIndices to fetch.
     */
    orderBy?: FileIndexOrderByWithRelationInput | FileIndexOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FileIndices.
     */
    cursor?: FileIndexWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileIndices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileIndices.
     */
    skip?: number
    distinct?: FileIndexScalarFieldEnum | FileIndexScalarFieldEnum[]
  }

  /**
   * FileIndex create
   */
  export type FileIndexCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileIndex
     */
    select?: FileIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileIndex
     */
    omit?: FileIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileIndexInclude<ExtArgs> | null
    /**
     * The data needed to create a FileIndex.
     */
    data: XOR<FileIndexCreateInput, FileIndexUncheckedCreateInput>
  }

  /**
   * FileIndex createMany
   */
  export type FileIndexCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FileIndices.
     */
    data: FileIndexCreateManyInput | FileIndexCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FileIndex createManyAndReturn
   */
  export type FileIndexCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileIndex
     */
    select?: FileIndexSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FileIndex
     */
    omit?: FileIndexOmit<ExtArgs> | null
    /**
     * The data used to create many FileIndices.
     */
    data: FileIndexCreateManyInput | FileIndexCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileIndexIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FileIndex update
   */
  export type FileIndexUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileIndex
     */
    select?: FileIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileIndex
     */
    omit?: FileIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileIndexInclude<ExtArgs> | null
    /**
     * The data needed to update a FileIndex.
     */
    data: XOR<FileIndexUpdateInput, FileIndexUncheckedUpdateInput>
    /**
     * Choose, which FileIndex to update.
     */
    where: FileIndexWhereUniqueInput
  }

  /**
   * FileIndex updateMany
   */
  export type FileIndexUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FileIndices.
     */
    data: XOR<FileIndexUpdateManyMutationInput, FileIndexUncheckedUpdateManyInput>
    /**
     * Filter which FileIndices to update
     */
    where?: FileIndexWhereInput
    /**
     * Limit how many FileIndices to update.
     */
    limit?: number
  }

  /**
   * FileIndex updateManyAndReturn
   */
  export type FileIndexUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileIndex
     */
    select?: FileIndexSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FileIndex
     */
    omit?: FileIndexOmit<ExtArgs> | null
    /**
     * The data used to update FileIndices.
     */
    data: XOR<FileIndexUpdateManyMutationInput, FileIndexUncheckedUpdateManyInput>
    /**
     * Filter which FileIndices to update
     */
    where?: FileIndexWhereInput
    /**
     * Limit how many FileIndices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileIndexIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FileIndex upsert
   */
  export type FileIndexUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileIndex
     */
    select?: FileIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileIndex
     */
    omit?: FileIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileIndexInclude<ExtArgs> | null
    /**
     * The filter to search for the FileIndex to update in case it exists.
     */
    where: FileIndexWhereUniqueInput
    /**
     * In case the FileIndex found by the `where` argument doesn't exist, create a new FileIndex with this data.
     */
    create: XOR<FileIndexCreateInput, FileIndexUncheckedCreateInput>
    /**
     * In case the FileIndex was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FileIndexUpdateInput, FileIndexUncheckedUpdateInput>
  }

  /**
   * FileIndex delete
   */
  export type FileIndexDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileIndex
     */
    select?: FileIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileIndex
     */
    omit?: FileIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileIndexInclude<ExtArgs> | null
    /**
     * Filter which FileIndex to delete.
     */
    where: FileIndexWhereUniqueInput
  }

  /**
   * FileIndex deleteMany
   */
  export type FileIndexDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileIndices to delete
     */
    where?: FileIndexWhereInput
    /**
     * Limit how many FileIndices to delete.
     */
    limit?: number
  }

  /**
   * FileIndex.syncRun
   */
  export type FileIndex$syncRunArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncRun
     */
    select?: SyncRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncRun
     */
    omit?: SyncRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SyncRunInclude<ExtArgs> | null
    where?: SyncRunWhereInput
  }

  /**
   * FileIndex without action
   */
  export type FileIndexDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileIndex
     */
    select?: FileIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileIndex
     */
    omit?: FileIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileIndexInclude<ExtArgs> | null
  }


  /**
   * Model PilotSession
   */

  export type AggregatePilotSession = {
    _count: PilotSessionCountAggregateOutputType | null
    _avg: PilotSessionAvgAggregateOutputType | null
    _sum: PilotSessionSumAggregateOutputType | null
    _min: PilotSessionMinAggregateOutputType | null
    _max: PilotSessionMaxAggregateOutputType | null
  }

  export type PilotSessionAvgAggregateOutputType = {
    id: number | null
  }

  export type PilotSessionSumAggregateOutputType = {
    id: number | null
  }

  export type PilotSessionMinAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    projectKey: string | null
    waveLabel: string | null
    mode: string | null
    surface: string | null
    createdBy: string | null
    startedAt: Date | null
    endedAt: Date | null
  }

  export type PilotSessionMaxAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    projectKey: string | null
    waveLabel: string | null
    mode: string | null
    surface: string | null
    createdBy: string | null
    startedAt: Date | null
    endedAt: Date | null
  }

  export type PilotSessionCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    projectKey: number
    waveLabel: number
    mode: number
    surface: number
    createdBy: number
    startedAt: number
    endedAt: number
    _all: number
  }


  export type PilotSessionAvgAggregateInputType = {
    id?: true
  }

  export type PilotSessionSumAggregateInputType = {
    id?: true
  }

  export type PilotSessionMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    projectKey?: true
    waveLabel?: true
    mode?: true
    surface?: true
    createdBy?: true
    startedAt?: true
    endedAt?: true
  }

  export type PilotSessionMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    projectKey?: true
    waveLabel?: true
    mode?: true
    surface?: true
    createdBy?: true
    startedAt?: true
    endedAt?: true
  }

  export type PilotSessionCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    projectKey?: true
    waveLabel?: true
    mode?: true
    surface?: true
    createdBy?: true
    startedAt?: true
    endedAt?: true
    _all?: true
  }

  export type PilotSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PilotSession to aggregate.
     */
    where?: PilotSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PilotSessions to fetch.
     */
    orderBy?: PilotSessionOrderByWithRelationInput | PilotSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PilotSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PilotSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PilotSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PilotSessions
    **/
    _count?: true | PilotSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PilotSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PilotSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PilotSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PilotSessionMaxAggregateInputType
  }

  export type GetPilotSessionAggregateType<T extends PilotSessionAggregateArgs> = {
        [P in keyof T & keyof AggregatePilotSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePilotSession[P]>
      : GetScalarType<T[P], AggregatePilotSession[P]>
  }




  export type PilotSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PilotSessionWhereInput
    orderBy?: PilotSessionOrderByWithAggregationInput | PilotSessionOrderByWithAggregationInput[]
    by: PilotSessionScalarFieldEnum[] | PilotSessionScalarFieldEnum
    having?: PilotSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PilotSessionCountAggregateInputType | true
    _avg?: PilotSessionAvgAggregateInputType
    _sum?: PilotSessionSumAggregateInputType
    _min?: PilotSessionMinAggregateInputType
    _max?: PilotSessionMaxAggregateInputType
  }

  export type PilotSessionGroupByOutputType = {
    id: number
    createdAt: Date
    updatedAt: Date
    projectKey: string | null
    waveLabel: string | null
    mode: string
    surface: string
    createdBy: string
    startedAt: Date
    endedAt: Date | null
    _count: PilotSessionCountAggregateOutputType | null
    _avg: PilotSessionAvgAggregateOutputType | null
    _sum: PilotSessionSumAggregateOutputType | null
    _min: PilotSessionMinAggregateOutputType | null
    _max: PilotSessionMaxAggregateOutputType | null
  }

  type GetPilotSessionGroupByPayload<T extends PilotSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PilotSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PilotSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PilotSessionGroupByOutputType[P]>
            : GetScalarType<T[P], PilotSessionGroupByOutputType[P]>
        }
      >
    >


  export type PilotSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    projectKey?: boolean
    waveLabel?: boolean
    mode?: boolean
    surface?: boolean
    createdBy?: boolean
    startedAt?: boolean
    endedAt?: boolean
    actions?: boolean | PilotSession$actionsArgs<ExtArgs>
    _count?: boolean | PilotSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pilotSession"]>

  export type PilotSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    projectKey?: boolean
    waveLabel?: boolean
    mode?: boolean
    surface?: boolean
    createdBy?: boolean
    startedAt?: boolean
    endedAt?: boolean
  }, ExtArgs["result"]["pilotSession"]>

  export type PilotSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    projectKey?: boolean
    waveLabel?: boolean
    mode?: boolean
    surface?: boolean
    createdBy?: boolean
    startedAt?: boolean
    endedAt?: boolean
  }, ExtArgs["result"]["pilotSession"]>

  export type PilotSessionSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    projectKey?: boolean
    waveLabel?: boolean
    mode?: boolean
    surface?: boolean
    createdBy?: boolean
    startedAt?: boolean
    endedAt?: boolean
  }

  export type PilotSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "projectKey" | "waveLabel" | "mode" | "surface" | "createdBy" | "startedAt" | "endedAt", ExtArgs["result"]["pilotSession"]>
  export type PilotSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    actions?: boolean | PilotSession$actionsArgs<ExtArgs>
    _count?: boolean | PilotSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PilotSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PilotSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PilotSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PilotSession"
    objects: {
      actions: Prisma.$PilotActionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      createdAt: Date
      updatedAt: Date
      projectKey: string | null
      waveLabel: string | null
      mode: string
      surface: string
      createdBy: string
      startedAt: Date
      endedAt: Date | null
    }, ExtArgs["result"]["pilotSession"]>
    composites: {}
  }

  type PilotSessionGetPayload<S extends boolean | null | undefined | PilotSessionDefaultArgs> = $Result.GetResult<Prisma.$PilotSessionPayload, S>

  type PilotSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PilotSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PilotSessionCountAggregateInputType | true
    }

  export interface PilotSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PilotSession'], meta: { name: 'PilotSession' } }
    /**
     * Find zero or one PilotSession that matches the filter.
     * @param {PilotSessionFindUniqueArgs} args - Arguments to find a PilotSession
     * @example
     * // Get one PilotSession
     * const pilotSession = await prisma.pilotSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PilotSessionFindUniqueArgs>(args: SelectSubset<T, PilotSessionFindUniqueArgs<ExtArgs>>): Prisma__PilotSessionClient<$Result.GetResult<Prisma.$PilotSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PilotSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PilotSessionFindUniqueOrThrowArgs} args - Arguments to find a PilotSession
     * @example
     * // Get one PilotSession
     * const pilotSession = await prisma.pilotSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PilotSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, PilotSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PilotSessionClient<$Result.GetResult<Prisma.$PilotSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PilotSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotSessionFindFirstArgs} args - Arguments to find a PilotSession
     * @example
     * // Get one PilotSession
     * const pilotSession = await prisma.pilotSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PilotSessionFindFirstArgs>(args?: SelectSubset<T, PilotSessionFindFirstArgs<ExtArgs>>): Prisma__PilotSessionClient<$Result.GetResult<Prisma.$PilotSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PilotSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotSessionFindFirstOrThrowArgs} args - Arguments to find a PilotSession
     * @example
     * // Get one PilotSession
     * const pilotSession = await prisma.pilotSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PilotSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, PilotSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PilotSessionClient<$Result.GetResult<Prisma.$PilotSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PilotSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PilotSessions
     * const pilotSessions = await prisma.pilotSession.findMany()
     * 
     * // Get first 10 PilotSessions
     * const pilotSessions = await prisma.pilotSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pilotSessionWithIdOnly = await prisma.pilotSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PilotSessionFindManyArgs>(args?: SelectSubset<T, PilotSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PilotSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PilotSession.
     * @param {PilotSessionCreateArgs} args - Arguments to create a PilotSession.
     * @example
     * // Create one PilotSession
     * const PilotSession = await prisma.pilotSession.create({
     *   data: {
     *     // ... data to create a PilotSession
     *   }
     * })
     * 
     */
    create<T extends PilotSessionCreateArgs>(args: SelectSubset<T, PilotSessionCreateArgs<ExtArgs>>): Prisma__PilotSessionClient<$Result.GetResult<Prisma.$PilotSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PilotSessions.
     * @param {PilotSessionCreateManyArgs} args - Arguments to create many PilotSessions.
     * @example
     * // Create many PilotSessions
     * const pilotSession = await prisma.pilotSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PilotSessionCreateManyArgs>(args?: SelectSubset<T, PilotSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PilotSessions and returns the data saved in the database.
     * @param {PilotSessionCreateManyAndReturnArgs} args - Arguments to create many PilotSessions.
     * @example
     * // Create many PilotSessions
     * const pilotSession = await prisma.pilotSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PilotSessions and only return the `id`
     * const pilotSessionWithIdOnly = await prisma.pilotSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PilotSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, PilotSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PilotSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PilotSession.
     * @param {PilotSessionDeleteArgs} args - Arguments to delete one PilotSession.
     * @example
     * // Delete one PilotSession
     * const PilotSession = await prisma.pilotSession.delete({
     *   where: {
     *     // ... filter to delete one PilotSession
     *   }
     * })
     * 
     */
    delete<T extends PilotSessionDeleteArgs>(args: SelectSubset<T, PilotSessionDeleteArgs<ExtArgs>>): Prisma__PilotSessionClient<$Result.GetResult<Prisma.$PilotSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PilotSession.
     * @param {PilotSessionUpdateArgs} args - Arguments to update one PilotSession.
     * @example
     * // Update one PilotSession
     * const pilotSession = await prisma.pilotSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PilotSessionUpdateArgs>(args: SelectSubset<T, PilotSessionUpdateArgs<ExtArgs>>): Prisma__PilotSessionClient<$Result.GetResult<Prisma.$PilotSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PilotSessions.
     * @param {PilotSessionDeleteManyArgs} args - Arguments to filter PilotSessions to delete.
     * @example
     * // Delete a few PilotSessions
     * const { count } = await prisma.pilotSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PilotSessionDeleteManyArgs>(args?: SelectSubset<T, PilotSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PilotSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PilotSessions
     * const pilotSession = await prisma.pilotSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PilotSessionUpdateManyArgs>(args: SelectSubset<T, PilotSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PilotSessions and returns the data updated in the database.
     * @param {PilotSessionUpdateManyAndReturnArgs} args - Arguments to update many PilotSessions.
     * @example
     * // Update many PilotSessions
     * const pilotSession = await prisma.pilotSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PilotSessions and only return the `id`
     * const pilotSessionWithIdOnly = await prisma.pilotSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PilotSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, PilotSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PilotSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PilotSession.
     * @param {PilotSessionUpsertArgs} args - Arguments to update or create a PilotSession.
     * @example
     * // Update or create a PilotSession
     * const pilotSession = await prisma.pilotSession.upsert({
     *   create: {
     *     // ... data to create a PilotSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PilotSession we want to update
     *   }
     * })
     */
    upsert<T extends PilotSessionUpsertArgs>(args: SelectSubset<T, PilotSessionUpsertArgs<ExtArgs>>): Prisma__PilotSessionClient<$Result.GetResult<Prisma.$PilotSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PilotSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotSessionCountArgs} args - Arguments to filter PilotSessions to count.
     * @example
     * // Count the number of PilotSessions
     * const count = await prisma.pilotSession.count({
     *   where: {
     *     // ... the filter for the PilotSessions we want to count
     *   }
     * })
    **/
    count<T extends PilotSessionCountArgs>(
      args?: Subset<T, PilotSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PilotSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PilotSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PilotSessionAggregateArgs>(args: Subset<T, PilotSessionAggregateArgs>): Prisma.PrismaPromise<GetPilotSessionAggregateType<T>>

    /**
     * Group by PilotSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PilotSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PilotSessionGroupByArgs['orderBy'] }
        : { orderBy?: PilotSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PilotSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPilotSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PilotSession model
   */
  readonly fields: PilotSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PilotSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PilotSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    actions<T extends PilotSession$actionsArgs<ExtArgs> = {}>(args?: Subset<T, PilotSession$actionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PilotActionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PilotSession model
   */
  interface PilotSessionFieldRefs {
    readonly id: FieldRef<"PilotSession", 'Int'>
    readonly createdAt: FieldRef<"PilotSession", 'DateTime'>
    readonly updatedAt: FieldRef<"PilotSession", 'DateTime'>
    readonly projectKey: FieldRef<"PilotSession", 'String'>
    readonly waveLabel: FieldRef<"PilotSession", 'String'>
    readonly mode: FieldRef<"PilotSession", 'String'>
    readonly surface: FieldRef<"PilotSession", 'String'>
    readonly createdBy: FieldRef<"PilotSession", 'String'>
    readonly startedAt: FieldRef<"PilotSession", 'DateTime'>
    readonly endedAt: FieldRef<"PilotSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PilotSession findUnique
   */
  export type PilotSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotSession
     */
    select?: PilotSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotSession
     */
    omit?: PilotSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotSessionInclude<ExtArgs> | null
    /**
     * Filter, which PilotSession to fetch.
     */
    where: PilotSessionWhereUniqueInput
  }

  /**
   * PilotSession findUniqueOrThrow
   */
  export type PilotSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotSession
     */
    select?: PilotSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotSession
     */
    omit?: PilotSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotSessionInclude<ExtArgs> | null
    /**
     * Filter, which PilotSession to fetch.
     */
    where: PilotSessionWhereUniqueInput
  }

  /**
   * PilotSession findFirst
   */
  export type PilotSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotSession
     */
    select?: PilotSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotSession
     */
    omit?: PilotSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotSessionInclude<ExtArgs> | null
    /**
     * Filter, which PilotSession to fetch.
     */
    where?: PilotSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PilotSessions to fetch.
     */
    orderBy?: PilotSessionOrderByWithRelationInput | PilotSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PilotSessions.
     */
    cursor?: PilotSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PilotSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PilotSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PilotSessions.
     */
    distinct?: PilotSessionScalarFieldEnum | PilotSessionScalarFieldEnum[]
  }

  /**
   * PilotSession findFirstOrThrow
   */
  export type PilotSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotSession
     */
    select?: PilotSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotSession
     */
    omit?: PilotSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotSessionInclude<ExtArgs> | null
    /**
     * Filter, which PilotSession to fetch.
     */
    where?: PilotSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PilotSessions to fetch.
     */
    orderBy?: PilotSessionOrderByWithRelationInput | PilotSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PilotSessions.
     */
    cursor?: PilotSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PilotSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PilotSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PilotSessions.
     */
    distinct?: PilotSessionScalarFieldEnum | PilotSessionScalarFieldEnum[]
  }

  /**
   * PilotSession findMany
   */
  export type PilotSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotSession
     */
    select?: PilotSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotSession
     */
    omit?: PilotSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotSessionInclude<ExtArgs> | null
    /**
     * Filter, which PilotSessions to fetch.
     */
    where?: PilotSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PilotSessions to fetch.
     */
    orderBy?: PilotSessionOrderByWithRelationInput | PilotSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PilotSessions.
     */
    cursor?: PilotSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PilotSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PilotSessions.
     */
    skip?: number
    distinct?: PilotSessionScalarFieldEnum | PilotSessionScalarFieldEnum[]
  }

  /**
   * PilotSession create
   */
  export type PilotSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotSession
     */
    select?: PilotSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotSession
     */
    omit?: PilotSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a PilotSession.
     */
    data: XOR<PilotSessionCreateInput, PilotSessionUncheckedCreateInput>
  }

  /**
   * PilotSession createMany
   */
  export type PilotSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PilotSessions.
     */
    data: PilotSessionCreateManyInput | PilotSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PilotSession createManyAndReturn
   */
  export type PilotSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotSession
     */
    select?: PilotSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PilotSession
     */
    omit?: PilotSessionOmit<ExtArgs> | null
    /**
     * The data used to create many PilotSessions.
     */
    data: PilotSessionCreateManyInput | PilotSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PilotSession update
   */
  export type PilotSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotSession
     */
    select?: PilotSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotSession
     */
    omit?: PilotSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a PilotSession.
     */
    data: XOR<PilotSessionUpdateInput, PilotSessionUncheckedUpdateInput>
    /**
     * Choose, which PilotSession to update.
     */
    where: PilotSessionWhereUniqueInput
  }

  /**
   * PilotSession updateMany
   */
  export type PilotSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PilotSessions.
     */
    data: XOR<PilotSessionUpdateManyMutationInput, PilotSessionUncheckedUpdateManyInput>
    /**
     * Filter which PilotSessions to update
     */
    where?: PilotSessionWhereInput
    /**
     * Limit how many PilotSessions to update.
     */
    limit?: number
  }

  /**
   * PilotSession updateManyAndReturn
   */
  export type PilotSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotSession
     */
    select?: PilotSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PilotSession
     */
    omit?: PilotSessionOmit<ExtArgs> | null
    /**
     * The data used to update PilotSessions.
     */
    data: XOR<PilotSessionUpdateManyMutationInput, PilotSessionUncheckedUpdateManyInput>
    /**
     * Filter which PilotSessions to update
     */
    where?: PilotSessionWhereInput
    /**
     * Limit how many PilotSessions to update.
     */
    limit?: number
  }

  /**
   * PilotSession upsert
   */
  export type PilotSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotSession
     */
    select?: PilotSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotSession
     */
    omit?: PilotSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the PilotSession to update in case it exists.
     */
    where: PilotSessionWhereUniqueInput
    /**
     * In case the PilotSession found by the `where` argument doesn't exist, create a new PilotSession with this data.
     */
    create: XOR<PilotSessionCreateInput, PilotSessionUncheckedCreateInput>
    /**
     * In case the PilotSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PilotSessionUpdateInput, PilotSessionUncheckedUpdateInput>
  }

  /**
   * PilotSession delete
   */
  export type PilotSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotSession
     */
    select?: PilotSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotSession
     */
    omit?: PilotSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotSessionInclude<ExtArgs> | null
    /**
     * Filter which PilotSession to delete.
     */
    where: PilotSessionWhereUniqueInput
  }

  /**
   * PilotSession deleteMany
   */
  export type PilotSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PilotSessions to delete
     */
    where?: PilotSessionWhereInput
    /**
     * Limit how many PilotSessions to delete.
     */
    limit?: number
  }

  /**
   * PilotSession.actions
   */
  export type PilotSession$actionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotAction
     */
    select?: PilotActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotAction
     */
    omit?: PilotActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotActionInclude<ExtArgs> | null
    where?: PilotActionWhereInput
    orderBy?: PilotActionOrderByWithRelationInput | PilotActionOrderByWithRelationInput[]
    cursor?: PilotActionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PilotActionScalarFieldEnum | PilotActionScalarFieldEnum[]
  }

  /**
   * PilotSession without action
   */
  export type PilotSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotSession
     */
    select?: PilotSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotSession
     */
    omit?: PilotSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotSessionInclude<ExtArgs> | null
  }


  /**
   * Model PilotAction
   */

  export type AggregatePilotAction = {
    _count: PilotActionCountAggregateOutputType | null
    _avg: PilotActionAvgAggregateOutputType | null
    _sum: PilotActionSumAggregateOutputType | null
    _min: PilotActionMinAggregateOutputType | null
    _max: PilotActionMaxAggregateOutputType | null
  }

  export type PilotActionAvgAggregateOutputType = {
    id: number | null
    sessionId: number | null
  }

  export type PilotActionSumAggregateOutputType = {
    id: number | null
    sessionId: number | null
  }

  export type PilotActionMinAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    ts: Date | null
    sessionId: number | null
    mode: string | null
    targetNodeId: string | null
    actionType: string | null
    payload: string | null
    reason: string | null
  }

  export type PilotActionMaxAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    ts: Date | null
    sessionId: number | null
    mode: string | null
    targetNodeId: string | null
    actionType: string | null
    payload: string | null
    reason: string | null
  }

  export type PilotActionCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    ts: number
    sessionId: number
    mode: number
    targetNodeId: number
    actionType: number
    payload: number
    reason: number
    _all: number
  }


  export type PilotActionAvgAggregateInputType = {
    id?: true
    sessionId?: true
  }

  export type PilotActionSumAggregateInputType = {
    id?: true
    sessionId?: true
  }

  export type PilotActionMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    ts?: true
    sessionId?: true
    mode?: true
    targetNodeId?: true
    actionType?: true
    payload?: true
    reason?: true
  }

  export type PilotActionMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    ts?: true
    sessionId?: true
    mode?: true
    targetNodeId?: true
    actionType?: true
    payload?: true
    reason?: true
  }

  export type PilotActionCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    ts?: true
    sessionId?: true
    mode?: true
    targetNodeId?: true
    actionType?: true
    payload?: true
    reason?: true
    _all?: true
  }

  export type PilotActionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PilotAction to aggregate.
     */
    where?: PilotActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PilotActions to fetch.
     */
    orderBy?: PilotActionOrderByWithRelationInput | PilotActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PilotActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PilotActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PilotActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PilotActions
    **/
    _count?: true | PilotActionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PilotActionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PilotActionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PilotActionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PilotActionMaxAggregateInputType
  }

  export type GetPilotActionAggregateType<T extends PilotActionAggregateArgs> = {
        [P in keyof T & keyof AggregatePilotAction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePilotAction[P]>
      : GetScalarType<T[P], AggregatePilotAction[P]>
  }




  export type PilotActionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PilotActionWhereInput
    orderBy?: PilotActionOrderByWithAggregationInput | PilotActionOrderByWithAggregationInput[]
    by: PilotActionScalarFieldEnum[] | PilotActionScalarFieldEnum
    having?: PilotActionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PilotActionCountAggregateInputType | true
    _avg?: PilotActionAvgAggregateInputType
    _sum?: PilotActionSumAggregateInputType
    _min?: PilotActionMinAggregateInputType
    _max?: PilotActionMaxAggregateInputType
  }

  export type PilotActionGroupByOutputType = {
    id: number
    createdAt: Date
    updatedAt: Date
    ts: Date
    sessionId: number
    mode: string
    targetNodeId: string | null
    actionType: string
    payload: string | null
    reason: string
    _count: PilotActionCountAggregateOutputType | null
    _avg: PilotActionAvgAggregateOutputType | null
    _sum: PilotActionSumAggregateOutputType | null
    _min: PilotActionMinAggregateOutputType | null
    _max: PilotActionMaxAggregateOutputType | null
  }

  type GetPilotActionGroupByPayload<T extends PilotActionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PilotActionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PilotActionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PilotActionGroupByOutputType[P]>
            : GetScalarType<T[P], PilotActionGroupByOutputType[P]>
        }
      >
    >


  export type PilotActionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ts?: boolean
    sessionId?: boolean
    mode?: boolean
    targetNodeId?: boolean
    actionType?: boolean
    payload?: boolean
    reason?: boolean
    session?: boolean | PilotSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pilotAction"]>

  export type PilotActionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ts?: boolean
    sessionId?: boolean
    mode?: boolean
    targetNodeId?: boolean
    actionType?: boolean
    payload?: boolean
    reason?: boolean
    session?: boolean | PilotSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pilotAction"]>

  export type PilotActionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ts?: boolean
    sessionId?: boolean
    mode?: boolean
    targetNodeId?: boolean
    actionType?: boolean
    payload?: boolean
    reason?: boolean
    session?: boolean | PilotSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pilotAction"]>

  export type PilotActionSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ts?: boolean
    sessionId?: boolean
    mode?: boolean
    targetNodeId?: boolean
    actionType?: boolean
    payload?: boolean
    reason?: boolean
  }

  export type PilotActionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "ts" | "sessionId" | "mode" | "targetNodeId" | "actionType" | "payload" | "reason", ExtArgs["result"]["pilotAction"]>
  export type PilotActionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | PilotSessionDefaultArgs<ExtArgs>
  }
  export type PilotActionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | PilotSessionDefaultArgs<ExtArgs>
  }
  export type PilotActionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | PilotSessionDefaultArgs<ExtArgs>
  }

  export type $PilotActionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PilotAction"
    objects: {
      session: Prisma.$PilotSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      createdAt: Date
      updatedAt: Date
      ts: Date
      sessionId: number
      mode: string
      targetNodeId: string | null
      actionType: string
      payload: string | null
      reason: string
    }, ExtArgs["result"]["pilotAction"]>
    composites: {}
  }

  type PilotActionGetPayload<S extends boolean | null | undefined | PilotActionDefaultArgs> = $Result.GetResult<Prisma.$PilotActionPayload, S>

  type PilotActionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PilotActionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PilotActionCountAggregateInputType | true
    }

  export interface PilotActionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PilotAction'], meta: { name: 'PilotAction' } }
    /**
     * Find zero or one PilotAction that matches the filter.
     * @param {PilotActionFindUniqueArgs} args - Arguments to find a PilotAction
     * @example
     * // Get one PilotAction
     * const pilotAction = await prisma.pilotAction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PilotActionFindUniqueArgs>(args: SelectSubset<T, PilotActionFindUniqueArgs<ExtArgs>>): Prisma__PilotActionClient<$Result.GetResult<Prisma.$PilotActionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PilotAction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PilotActionFindUniqueOrThrowArgs} args - Arguments to find a PilotAction
     * @example
     * // Get one PilotAction
     * const pilotAction = await prisma.pilotAction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PilotActionFindUniqueOrThrowArgs>(args: SelectSubset<T, PilotActionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PilotActionClient<$Result.GetResult<Prisma.$PilotActionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PilotAction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotActionFindFirstArgs} args - Arguments to find a PilotAction
     * @example
     * // Get one PilotAction
     * const pilotAction = await prisma.pilotAction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PilotActionFindFirstArgs>(args?: SelectSubset<T, PilotActionFindFirstArgs<ExtArgs>>): Prisma__PilotActionClient<$Result.GetResult<Prisma.$PilotActionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PilotAction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotActionFindFirstOrThrowArgs} args - Arguments to find a PilotAction
     * @example
     * // Get one PilotAction
     * const pilotAction = await prisma.pilotAction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PilotActionFindFirstOrThrowArgs>(args?: SelectSubset<T, PilotActionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PilotActionClient<$Result.GetResult<Prisma.$PilotActionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PilotActions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotActionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PilotActions
     * const pilotActions = await prisma.pilotAction.findMany()
     * 
     * // Get first 10 PilotActions
     * const pilotActions = await prisma.pilotAction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pilotActionWithIdOnly = await prisma.pilotAction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PilotActionFindManyArgs>(args?: SelectSubset<T, PilotActionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PilotActionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PilotAction.
     * @param {PilotActionCreateArgs} args - Arguments to create a PilotAction.
     * @example
     * // Create one PilotAction
     * const PilotAction = await prisma.pilotAction.create({
     *   data: {
     *     // ... data to create a PilotAction
     *   }
     * })
     * 
     */
    create<T extends PilotActionCreateArgs>(args: SelectSubset<T, PilotActionCreateArgs<ExtArgs>>): Prisma__PilotActionClient<$Result.GetResult<Prisma.$PilotActionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PilotActions.
     * @param {PilotActionCreateManyArgs} args - Arguments to create many PilotActions.
     * @example
     * // Create many PilotActions
     * const pilotAction = await prisma.pilotAction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PilotActionCreateManyArgs>(args?: SelectSubset<T, PilotActionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PilotActions and returns the data saved in the database.
     * @param {PilotActionCreateManyAndReturnArgs} args - Arguments to create many PilotActions.
     * @example
     * // Create many PilotActions
     * const pilotAction = await prisma.pilotAction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PilotActions and only return the `id`
     * const pilotActionWithIdOnly = await prisma.pilotAction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PilotActionCreateManyAndReturnArgs>(args?: SelectSubset<T, PilotActionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PilotActionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PilotAction.
     * @param {PilotActionDeleteArgs} args - Arguments to delete one PilotAction.
     * @example
     * // Delete one PilotAction
     * const PilotAction = await prisma.pilotAction.delete({
     *   where: {
     *     // ... filter to delete one PilotAction
     *   }
     * })
     * 
     */
    delete<T extends PilotActionDeleteArgs>(args: SelectSubset<T, PilotActionDeleteArgs<ExtArgs>>): Prisma__PilotActionClient<$Result.GetResult<Prisma.$PilotActionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PilotAction.
     * @param {PilotActionUpdateArgs} args - Arguments to update one PilotAction.
     * @example
     * // Update one PilotAction
     * const pilotAction = await prisma.pilotAction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PilotActionUpdateArgs>(args: SelectSubset<T, PilotActionUpdateArgs<ExtArgs>>): Prisma__PilotActionClient<$Result.GetResult<Prisma.$PilotActionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PilotActions.
     * @param {PilotActionDeleteManyArgs} args - Arguments to filter PilotActions to delete.
     * @example
     * // Delete a few PilotActions
     * const { count } = await prisma.pilotAction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PilotActionDeleteManyArgs>(args?: SelectSubset<T, PilotActionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PilotActions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotActionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PilotActions
     * const pilotAction = await prisma.pilotAction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PilotActionUpdateManyArgs>(args: SelectSubset<T, PilotActionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PilotActions and returns the data updated in the database.
     * @param {PilotActionUpdateManyAndReturnArgs} args - Arguments to update many PilotActions.
     * @example
     * // Update many PilotActions
     * const pilotAction = await prisma.pilotAction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PilotActions and only return the `id`
     * const pilotActionWithIdOnly = await prisma.pilotAction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PilotActionUpdateManyAndReturnArgs>(args: SelectSubset<T, PilotActionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PilotActionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PilotAction.
     * @param {PilotActionUpsertArgs} args - Arguments to update or create a PilotAction.
     * @example
     * // Update or create a PilotAction
     * const pilotAction = await prisma.pilotAction.upsert({
     *   create: {
     *     // ... data to create a PilotAction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PilotAction we want to update
     *   }
     * })
     */
    upsert<T extends PilotActionUpsertArgs>(args: SelectSubset<T, PilotActionUpsertArgs<ExtArgs>>): Prisma__PilotActionClient<$Result.GetResult<Prisma.$PilotActionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PilotActions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotActionCountArgs} args - Arguments to filter PilotActions to count.
     * @example
     * // Count the number of PilotActions
     * const count = await prisma.pilotAction.count({
     *   where: {
     *     // ... the filter for the PilotActions we want to count
     *   }
     * })
    **/
    count<T extends PilotActionCountArgs>(
      args?: Subset<T, PilotActionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PilotActionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PilotAction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotActionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PilotActionAggregateArgs>(args: Subset<T, PilotActionAggregateArgs>): Prisma.PrismaPromise<GetPilotActionAggregateType<T>>

    /**
     * Group by PilotAction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotActionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PilotActionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PilotActionGroupByArgs['orderBy'] }
        : { orderBy?: PilotActionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PilotActionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPilotActionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PilotAction model
   */
  readonly fields: PilotActionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PilotAction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PilotActionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends PilotSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PilotSessionDefaultArgs<ExtArgs>>): Prisma__PilotSessionClient<$Result.GetResult<Prisma.$PilotSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PilotAction model
   */
  interface PilotActionFieldRefs {
    readonly id: FieldRef<"PilotAction", 'Int'>
    readonly createdAt: FieldRef<"PilotAction", 'DateTime'>
    readonly updatedAt: FieldRef<"PilotAction", 'DateTime'>
    readonly ts: FieldRef<"PilotAction", 'DateTime'>
    readonly sessionId: FieldRef<"PilotAction", 'Int'>
    readonly mode: FieldRef<"PilotAction", 'String'>
    readonly targetNodeId: FieldRef<"PilotAction", 'String'>
    readonly actionType: FieldRef<"PilotAction", 'String'>
    readonly payload: FieldRef<"PilotAction", 'String'>
    readonly reason: FieldRef<"PilotAction", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PilotAction findUnique
   */
  export type PilotActionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotAction
     */
    select?: PilotActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotAction
     */
    omit?: PilotActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotActionInclude<ExtArgs> | null
    /**
     * Filter, which PilotAction to fetch.
     */
    where: PilotActionWhereUniqueInput
  }

  /**
   * PilotAction findUniqueOrThrow
   */
  export type PilotActionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotAction
     */
    select?: PilotActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotAction
     */
    omit?: PilotActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotActionInclude<ExtArgs> | null
    /**
     * Filter, which PilotAction to fetch.
     */
    where: PilotActionWhereUniqueInput
  }

  /**
   * PilotAction findFirst
   */
  export type PilotActionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotAction
     */
    select?: PilotActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotAction
     */
    omit?: PilotActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotActionInclude<ExtArgs> | null
    /**
     * Filter, which PilotAction to fetch.
     */
    where?: PilotActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PilotActions to fetch.
     */
    orderBy?: PilotActionOrderByWithRelationInput | PilotActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PilotActions.
     */
    cursor?: PilotActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PilotActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PilotActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PilotActions.
     */
    distinct?: PilotActionScalarFieldEnum | PilotActionScalarFieldEnum[]
  }

  /**
   * PilotAction findFirstOrThrow
   */
  export type PilotActionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotAction
     */
    select?: PilotActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotAction
     */
    omit?: PilotActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotActionInclude<ExtArgs> | null
    /**
     * Filter, which PilotAction to fetch.
     */
    where?: PilotActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PilotActions to fetch.
     */
    orderBy?: PilotActionOrderByWithRelationInput | PilotActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PilotActions.
     */
    cursor?: PilotActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PilotActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PilotActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PilotActions.
     */
    distinct?: PilotActionScalarFieldEnum | PilotActionScalarFieldEnum[]
  }

  /**
   * PilotAction findMany
   */
  export type PilotActionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotAction
     */
    select?: PilotActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotAction
     */
    omit?: PilotActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotActionInclude<ExtArgs> | null
    /**
     * Filter, which PilotActions to fetch.
     */
    where?: PilotActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PilotActions to fetch.
     */
    orderBy?: PilotActionOrderByWithRelationInput | PilotActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PilotActions.
     */
    cursor?: PilotActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PilotActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PilotActions.
     */
    skip?: number
    distinct?: PilotActionScalarFieldEnum | PilotActionScalarFieldEnum[]
  }

  /**
   * PilotAction create
   */
  export type PilotActionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotAction
     */
    select?: PilotActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotAction
     */
    omit?: PilotActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotActionInclude<ExtArgs> | null
    /**
     * The data needed to create a PilotAction.
     */
    data: XOR<PilotActionCreateInput, PilotActionUncheckedCreateInput>
  }

  /**
   * PilotAction createMany
   */
  export type PilotActionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PilotActions.
     */
    data: PilotActionCreateManyInput | PilotActionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PilotAction createManyAndReturn
   */
  export type PilotActionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotAction
     */
    select?: PilotActionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PilotAction
     */
    omit?: PilotActionOmit<ExtArgs> | null
    /**
     * The data used to create many PilotActions.
     */
    data: PilotActionCreateManyInput | PilotActionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotActionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PilotAction update
   */
  export type PilotActionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotAction
     */
    select?: PilotActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotAction
     */
    omit?: PilotActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotActionInclude<ExtArgs> | null
    /**
     * The data needed to update a PilotAction.
     */
    data: XOR<PilotActionUpdateInput, PilotActionUncheckedUpdateInput>
    /**
     * Choose, which PilotAction to update.
     */
    where: PilotActionWhereUniqueInput
  }

  /**
   * PilotAction updateMany
   */
  export type PilotActionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PilotActions.
     */
    data: XOR<PilotActionUpdateManyMutationInput, PilotActionUncheckedUpdateManyInput>
    /**
     * Filter which PilotActions to update
     */
    where?: PilotActionWhereInput
    /**
     * Limit how many PilotActions to update.
     */
    limit?: number
  }

  /**
   * PilotAction updateManyAndReturn
   */
  export type PilotActionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotAction
     */
    select?: PilotActionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PilotAction
     */
    omit?: PilotActionOmit<ExtArgs> | null
    /**
     * The data used to update PilotActions.
     */
    data: XOR<PilotActionUpdateManyMutationInput, PilotActionUncheckedUpdateManyInput>
    /**
     * Filter which PilotActions to update
     */
    where?: PilotActionWhereInput
    /**
     * Limit how many PilotActions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotActionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PilotAction upsert
   */
  export type PilotActionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotAction
     */
    select?: PilotActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotAction
     */
    omit?: PilotActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotActionInclude<ExtArgs> | null
    /**
     * The filter to search for the PilotAction to update in case it exists.
     */
    where: PilotActionWhereUniqueInput
    /**
     * In case the PilotAction found by the `where` argument doesn't exist, create a new PilotAction with this data.
     */
    create: XOR<PilotActionCreateInput, PilotActionUncheckedCreateInput>
    /**
     * In case the PilotAction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PilotActionUpdateInput, PilotActionUncheckedUpdateInput>
  }

  /**
   * PilotAction delete
   */
  export type PilotActionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotAction
     */
    select?: PilotActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotAction
     */
    omit?: PilotActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotActionInclude<ExtArgs> | null
    /**
     * Filter which PilotAction to delete.
     */
    where: PilotActionWhereUniqueInput
  }

  /**
   * PilotAction deleteMany
   */
  export type PilotActionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PilotActions to delete
     */
    where?: PilotActionWhereInput
    /**
     * Limit how many PilotActions to delete.
     */
    limit?: number
  }

  /**
   * PilotAction without action
   */
  export type PilotActionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotAction
     */
    select?: PilotActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotAction
     */
    omit?: PilotActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PilotActionInclude<ExtArgs> | null
  }


  /**
   * Model PilotRun
   */

  export type AggregatePilotRun = {
    _count: PilotRunCountAggregateOutputType | null
    _avg: PilotRunAvgAggregateOutputType | null
    _sum: PilotRunSumAggregateOutputType | null
    _min: PilotRunMinAggregateOutputType | null
    _max: PilotRunMaxAggregateOutputType | null
  }

  export type PilotRunAvgAggregateOutputType = {
    id: number | null
  }

  export type PilotRunSumAggregateOutputType = {
    id: number | null
  }

  export type PilotRunMinAggregateOutputType = {
    id: number | null
    kind: string | null
    status: string | null
    startedAt: Date | null
    finishedAt: Date | null
    summary: string | null
    artifactDir: string | null
    stdoutPath: string | null
    stderrPath: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PilotRunMaxAggregateOutputType = {
    id: number | null
    kind: string | null
    status: string | null
    startedAt: Date | null
    finishedAt: Date | null
    summary: string | null
    artifactDir: string | null
    stdoutPath: string | null
    stderrPath: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PilotRunCountAggregateOutputType = {
    id: number
    kind: number
    status: number
    startedAt: number
    finishedAt: number
    summary: number
    artifactDir: number
    stdoutPath: number
    stderrPath: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PilotRunAvgAggregateInputType = {
    id?: true
  }

  export type PilotRunSumAggregateInputType = {
    id?: true
  }

  export type PilotRunMinAggregateInputType = {
    id?: true
    kind?: true
    status?: true
    startedAt?: true
    finishedAt?: true
    summary?: true
    artifactDir?: true
    stdoutPath?: true
    stderrPath?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PilotRunMaxAggregateInputType = {
    id?: true
    kind?: true
    status?: true
    startedAt?: true
    finishedAt?: true
    summary?: true
    artifactDir?: true
    stdoutPath?: true
    stderrPath?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PilotRunCountAggregateInputType = {
    id?: true
    kind?: true
    status?: true
    startedAt?: true
    finishedAt?: true
    summary?: true
    artifactDir?: true
    stdoutPath?: true
    stderrPath?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PilotRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PilotRun to aggregate.
     */
    where?: PilotRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PilotRuns to fetch.
     */
    orderBy?: PilotRunOrderByWithRelationInput | PilotRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PilotRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PilotRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PilotRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PilotRuns
    **/
    _count?: true | PilotRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PilotRunAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PilotRunSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PilotRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PilotRunMaxAggregateInputType
  }

  export type GetPilotRunAggregateType<T extends PilotRunAggregateArgs> = {
        [P in keyof T & keyof AggregatePilotRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePilotRun[P]>
      : GetScalarType<T[P], AggregatePilotRun[P]>
  }




  export type PilotRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PilotRunWhereInput
    orderBy?: PilotRunOrderByWithAggregationInput | PilotRunOrderByWithAggregationInput[]
    by: PilotRunScalarFieldEnum[] | PilotRunScalarFieldEnum
    having?: PilotRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PilotRunCountAggregateInputType | true
    _avg?: PilotRunAvgAggregateInputType
    _sum?: PilotRunSumAggregateInputType
    _min?: PilotRunMinAggregateInputType
    _max?: PilotRunMaxAggregateInputType
  }

  export type PilotRunGroupByOutputType = {
    id: number
    kind: string
    status: string
    startedAt: Date
    finishedAt: Date | null
    summary: string | null
    artifactDir: string | null
    stdoutPath: string | null
    stderrPath: string | null
    createdAt: Date
    updatedAt: Date
    _count: PilotRunCountAggregateOutputType | null
    _avg: PilotRunAvgAggregateOutputType | null
    _sum: PilotRunSumAggregateOutputType | null
    _min: PilotRunMinAggregateOutputType | null
    _max: PilotRunMaxAggregateOutputType | null
  }

  type GetPilotRunGroupByPayload<T extends PilotRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PilotRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PilotRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PilotRunGroupByOutputType[P]>
            : GetScalarType<T[P], PilotRunGroupByOutputType[P]>
        }
      >
    >


  export type PilotRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kind?: boolean
    status?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    summary?: boolean
    artifactDir?: boolean
    stdoutPath?: boolean
    stderrPath?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["pilotRun"]>

  export type PilotRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kind?: boolean
    status?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    summary?: boolean
    artifactDir?: boolean
    stdoutPath?: boolean
    stderrPath?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["pilotRun"]>

  export type PilotRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kind?: boolean
    status?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    summary?: boolean
    artifactDir?: boolean
    stdoutPath?: boolean
    stderrPath?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["pilotRun"]>

  export type PilotRunSelectScalar = {
    id?: boolean
    kind?: boolean
    status?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    summary?: boolean
    artifactDir?: boolean
    stdoutPath?: boolean
    stderrPath?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PilotRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "kind" | "status" | "startedAt" | "finishedAt" | "summary" | "artifactDir" | "stdoutPath" | "stderrPath" | "createdAt" | "updatedAt", ExtArgs["result"]["pilotRun"]>

  export type $PilotRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PilotRun"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      kind: string
      status: string
      startedAt: Date
      finishedAt: Date | null
      summary: string | null
      artifactDir: string | null
      stdoutPath: string | null
      stderrPath: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["pilotRun"]>
    composites: {}
  }

  type PilotRunGetPayload<S extends boolean | null | undefined | PilotRunDefaultArgs> = $Result.GetResult<Prisma.$PilotRunPayload, S>

  type PilotRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PilotRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PilotRunCountAggregateInputType | true
    }

  export interface PilotRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PilotRun'], meta: { name: 'PilotRun' } }
    /**
     * Find zero or one PilotRun that matches the filter.
     * @param {PilotRunFindUniqueArgs} args - Arguments to find a PilotRun
     * @example
     * // Get one PilotRun
     * const pilotRun = await prisma.pilotRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PilotRunFindUniqueArgs>(args: SelectSubset<T, PilotRunFindUniqueArgs<ExtArgs>>): Prisma__PilotRunClient<$Result.GetResult<Prisma.$PilotRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PilotRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PilotRunFindUniqueOrThrowArgs} args - Arguments to find a PilotRun
     * @example
     * // Get one PilotRun
     * const pilotRun = await prisma.pilotRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PilotRunFindUniqueOrThrowArgs>(args: SelectSubset<T, PilotRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PilotRunClient<$Result.GetResult<Prisma.$PilotRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PilotRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotRunFindFirstArgs} args - Arguments to find a PilotRun
     * @example
     * // Get one PilotRun
     * const pilotRun = await prisma.pilotRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PilotRunFindFirstArgs>(args?: SelectSubset<T, PilotRunFindFirstArgs<ExtArgs>>): Prisma__PilotRunClient<$Result.GetResult<Prisma.$PilotRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PilotRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotRunFindFirstOrThrowArgs} args - Arguments to find a PilotRun
     * @example
     * // Get one PilotRun
     * const pilotRun = await prisma.pilotRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PilotRunFindFirstOrThrowArgs>(args?: SelectSubset<T, PilotRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__PilotRunClient<$Result.GetResult<Prisma.$PilotRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PilotRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PilotRuns
     * const pilotRuns = await prisma.pilotRun.findMany()
     * 
     * // Get first 10 PilotRuns
     * const pilotRuns = await prisma.pilotRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pilotRunWithIdOnly = await prisma.pilotRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PilotRunFindManyArgs>(args?: SelectSubset<T, PilotRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PilotRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PilotRun.
     * @param {PilotRunCreateArgs} args - Arguments to create a PilotRun.
     * @example
     * // Create one PilotRun
     * const PilotRun = await prisma.pilotRun.create({
     *   data: {
     *     // ... data to create a PilotRun
     *   }
     * })
     * 
     */
    create<T extends PilotRunCreateArgs>(args: SelectSubset<T, PilotRunCreateArgs<ExtArgs>>): Prisma__PilotRunClient<$Result.GetResult<Prisma.$PilotRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PilotRuns.
     * @param {PilotRunCreateManyArgs} args - Arguments to create many PilotRuns.
     * @example
     * // Create many PilotRuns
     * const pilotRun = await prisma.pilotRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PilotRunCreateManyArgs>(args?: SelectSubset<T, PilotRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PilotRuns and returns the data saved in the database.
     * @param {PilotRunCreateManyAndReturnArgs} args - Arguments to create many PilotRuns.
     * @example
     * // Create many PilotRuns
     * const pilotRun = await prisma.pilotRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PilotRuns and only return the `id`
     * const pilotRunWithIdOnly = await prisma.pilotRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PilotRunCreateManyAndReturnArgs>(args?: SelectSubset<T, PilotRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PilotRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PilotRun.
     * @param {PilotRunDeleteArgs} args - Arguments to delete one PilotRun.
     * @example
     * // Delete one PilotRun
     * const PilotRun = await prisma.pilotRun.delete({
     *   where: {
     *     // ... filter to delete one PilotRun
     *   }
     * })
     * 
     */
    delete<T extends PilotRunDeleteArgs>(args: SelectSubset<T, PilotRunDeleteArgs<ExtArgs>>): Prisma__PilotRunClient<$Result.GetResult<Prisma.$PilotRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PilotRun.
     * @param {PilotRunUpdateArgs} args - Arguments to update one PilotRun.
     * @example
     * // Update one PilotRun
     * const pilotRun = await prisma.pilotRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PilotRunUpdateArgs>(args: SelectSubset<T, PilotRunUpdateArgs<ExtArgs>>): Prisma__PilotRunClient<$Result.GetResult<Prisma.$PilotRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PilotRuns.
     * @param {PilotRunDeleteManyArgs} args - Arguments to filter PilotRuns to delete.
     * @example
     * // Delete a few PilotRuns
     * const { count } = await prisma.pilotRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PilotRunDeleteManyArgs>(args?: SelectSubset<T, PilotRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PilotRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PilotRuns
     * const pilotRun = await prisma.pilotRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PilotRunUpdateManyArgs>(args: SelectSubset<T, PilotRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PilotRuns and returns the data updated in the database.
     * @param {PilotRunUpdateManyAndReturnArgs} args - Arguments to update many PilotRuns.
     * @example
     * // Update many PilotRuns
     * const pilotRun = await prisma.pilotRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PilotRuns and only return the `id`
     * const pilotRunWithIdOnly = await prisma.pilotRun.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PilotRunUpdateManyAndReturnArgs>(args: SelectSubset<T, PilotRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PilotRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PilotRun.
     * @param {PilotRunUpsertArgs} args - Arguments to update or create a PilotRun.
     * @example
     * // Update or create a PilotRun
     * const pilotRun = await prisma.pilotRun.upsert({
     *   create: {
     *     // ... data to create a PilotRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PilotRun we want to update
     *   }
     * })
     */
    upsert<T extends PilotRunUpsertArgs>(args: SelectSubset<T, PilotRunUpsertArgs<ExtArgs>>): Prisma__PilotRunClient<$Result.GetResult<Prisma.$PilotRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PilotRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotRunCountArgs} args - Arguments to filter PilotRuns to count.
     * @example
     * // Count the number of PilotRuns
     * const count = await prisma.pilotRun.count({
     *   where: {
     *     // ... the filter for the PilotRuns we want to count
     *   }
     * })
    **/
    count<T extends PilotRunCountArgs>(
      args?: Subset<T, PilotRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PilotRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PilotRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PilotRunAggregateArgs>(args: Subset<T, PilotRunAggregateArgs>): Prisma.PrismaPromise<GetPilotRunAggregateType<T>>

    /**
     * Group by PilotRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PilotRunGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PilotRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PilotRunGroupByArgs['orderBy'] }
        : { orderBy?: PilotRunGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PilotRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPilotRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PilotRun model
   */
  readonly fields: PilotRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PilotRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PilotRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PilotRun model
   */
  interface PilotRunFieldRefs {
    readonly id: FieldRef<"PilotRun", 'Int'>
    readonly kind: FieldRef<"PilotRun", 'String'>
    readonly status: FieldRef<"PilotRun", 'String'>
    readonly startedAt: FieldRef<"PilotRun", 'DateTime'>
    readonly finishedAt: FieldRef<"PilotRun", 'DateTime'>
    readonly summary: FieldRef<"PilotRun", 'String'>
    readonly artifactDir: FieldRef<"PilotRun", 'String'>
    readonly stdoutPath: FieldRef<"PilotRun", 'String'>
    readonly stderrPath: FieldRef<"PilotRun", 'String'>
    readonly createdAt: FieldRef<"PilotRun", 'DateTime'>
    readonly updatedAt: FieldRef<"PilotRun", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PilotRun findUnique
   */
  export type PilotRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotRun
     */
    select?: PilotRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotRun
     */
    omit?: PilotRunOmit<ExtArgs> | null
    /**
     * Filter, which PilotRun to fetch.
     */
    where: PilotRunWhereUniqueInput
  }

  /**
   * PilotRun findUniqueOrThrow
   */
  export type PilotRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotRun
     */
    select?: PilotRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotRun
     */
    omit?: PilotRunOmit<ExtArgs> | null
    /**
     * Filter, which PilotRun to fetch.
     */
    where: PilotRunWhereUniqueInput
  }

  /**
   * PilotRun findFirst
   */
  export type PilotRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotRun
     */
    select?: PilotRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotRun
     */
    omit?: PilotRunOmit<ExtArgs> | null
    /**
     * Filter, which PilotRun to fetch.
     */
    where?: PilotRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PilotRuns to fetch.
     */
    orderBy?: PilotRunOrderByWithRelationInput | PilotRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PilotRuns.
     */
    cursor?: PilotRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PilotRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PilotRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PilotRuns.
     */
    distinct?: PilotRunScalarFieldEnum | PilotRunScalarFieldEnum[]
  }

  /**
   * PilotRun findFirstOrThrow
   */
  export type PilotRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotRun
     */
    select?: PilotRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotRun
     */
    omit?: PilotRunOmit<ExtArgs> | null
    /**
     * Filter, which PilotRun to fetch.
     */
    where?: PilotRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PilotRuns to fetch.
     */
    orderBy?: PilotRunOrderByWithRelationInput | PilotRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PilotRuns.
     */
    cursor?: PilotRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PilotRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PilotRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PilotRuns.
     */
    distinct?: PilotRunScalarFieldEnum | PilotRunScalarFieldEnum[]
  }

  /**
   * PilotRun findMany
   */
  export type PilotRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotRun
     */
    select?: PilotRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotRun
     */
    omit?: PilotRunOmit<ExtArgs> | null
    /**
     * Filter, which PilotRuns to fetch.
     */
    where?: PilotRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PilotRuns to fetch.
     */
    orderBy?: PilotRunOrderByWithRelationInput | PilotRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PilotRuns.
     */
    cursor?: PilotRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PilotRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PilotRuns.
     */
    skip?: number
    distinct?: PilotRunScalarFieldEnum | PilotRunScalarFieldEnum[]
  }

  /**
   * PilotRun create
   */
  export type PilotRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotRun
     */
    select?: PilotRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotRun
     */
    omit?: PilotRunOmit<ExtArgs> | null
    /**
     * The data needed to create a PilotRun.
     */
    data: XOR<PilotRunCreateInput, PilotRunUncheckedCreateInput>
  }

  /**
   * PilotRun createMany
   */
  export type PilotRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PilotRuns.
     */
    data: PilotRunCreateManyInput | PilotRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PilotRun createManyAndReturn
   */
  export type PilotRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotRun
     */
    select?: PilotRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PilotRun
     */
    omit?: PilotRunOmit<ExtArgs> | null
    /**
     * The data used to create many PilotRuns.
     */
    data: PilotRunCreateManyInput | PilotRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PilotRun update
   */
  export type PilotRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotRun
     */
    select?: PilotRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotRun
     */
    omit?: PilotRunOmit<ExtArgs> | null
    /**
     * The data needed to update a PilotRun.
     */
    data: XOR<PilotRunUpdateInput, PilotRunUncheckedUpdateInput>
    /**
     * Choose, which PilotRun to update.
     */
    where: PilotRunWhereUniqueInput
  }

  /**
   * PilotRun updateMany
   */
  export type PilotRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PilotRuns.
     */
    data: XOR<PilotRunUpdateManyMutationInput, PilotRunUncheckedUpdateManyInput>
    /**
     * Filter which PilotRuns to update
     */
    where?: PilotRunWhereInput
    /**
     * Limit how many PilotRuns to update.
     */
    limit?: number
  }

  /**
   * PilotRun updateManyAndReturn
   */
  export type PilotRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotRun
     */
    select?: PilotRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PilotRun
     */
    omit?: PilotRunOmit<ExtArgs> | null
    /**
     * The data used to update PilotRuns.
     */
    data: XOR<PilotRunUpdateManyMutationInput, PilotRunUncheckedUpdateManyInput>
    /**
     * Filter which PilotRuns to update
     */
    where?: PilotRunWhereInput
    /**
     * Limit how many PilotRuns to update.
     */
    limit?: number
  }

  /**
   * PilotRun upsert
   */
  export type PilotRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotRun
     */
    select?: PilotRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotRun
     */
    omit?: PilotRunOmit<ExtArgs> | null
    /**
     * The filter to search for the PilotRun to update in case it exists.
     */
    where: PilotRunWhereUniqueInput
    /**
     * In case the PilotRun found by the `where` argument doesn't exist, create a new PilotRun with this data.
     */
    create: XOR<PilotRunCreateInput, PilotRunUncheckedCreateInput>
    /**
     * In case the PilotRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PilotRunUpdateInput, PilotRunUncheckedUpdateInput>
  }

  /**
   * PilotRun delete
   */
  export type PilotRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotRun
     */
    select?: PilotRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotRun
     */
    omit?: PilotRunOmit<ExtArgs> | null
    /**
     * Filter which PilotRun to delete.
     */
    where: PilotRunWhereUniqueInput
  }

  /**
   * PilotRun deleteMany
   */
  export type PilotRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PilotRuns to delete
     */
    where?: PilotRunWhereInput
    /**
     * Limit how many PilotRuns to delete.
     */
    limit?: number
  }

  /**
   * PilotRun without action
   */
  export type PilotRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PilotRun
     */
    select?: PilotRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PilotRun
     */
    omit?: PilotRunOmit<ExtArgs> | null
  }


  /**
   * Model JaiTool
   */

  export type AggregateJaiTool = {
    _count: JaiToolCountAggregateOutputType | null
    _avg: JaiToolAvgAggregateOutputType | null
    _sum: JaiToolSumAggregateOutputType | null
    _min: JaiToolMinAggregateOutputType | null
    _max: JaiToolMaxAggregateOutputType | null
  }

  export type JaiToolAvgAggregateOutputType = {
    id: number | null
  }

  export type JaiToolSumAggregateOutputType = {
    id: number | null
  }

  export type JaiToolMinAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    version: string | null
    description: string | null
    scope: string | null
    status: string | null
  }

  export type JaiToolMaxAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    version: string | null
    description: string | null
    scope: string | null
    status: string | null
  }

  export type JaiToolCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    name: number
    version: number
    description: number
    scope: number
    status: number
    inputSchema: number
    outputSchema: number
    _all: number
  }


  export type JaiToolAvgAggregateInputType = {
    id?: true
  }

  export type JaiToolSumAggregateInputType = {
    id?: true
  }

  export type JaiToolMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    version?: true
    description?: true
    scope?: true
    status?: true
  }

  export type JaiToolMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    version?: true
    description?: true
    scope?: true
    status?: true
  }

  export type JaiToolCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    version?: true
    description?: true
    scope?: true
    status?: true
    inputSchema?: true
    outputSchema?: true
    _all?: true
  }

  export type JaiToolAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JaiTool to aggregate.
     */
    where?: JaiToolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JaiTools to fetch.
     */
    orderBy?: JaiToolOrderByWithRelationInput | JaiToolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JaiToolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JaiTools from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JaiTools.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned JaiTools
    **/
    _count?: true | JaiToolCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: JaiToolAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: JaiToolSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JaiToolMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JaiToolMaxAggregateInputType
  }

  export type GetJaiToolAggregateType<T extends JaiToolAggregateArgs> = {
        [P in keyof T & keyof AggregateJaiTool]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJaiTool[P]>
      : GetScalarType<T[P], AggregateJaiTool[P]>
  }




  export type JaiToolGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JaiToolWhereInput
    orderBy?: JaiToolOrderByWithAggregationInput | JaiToolOrderByWithAggregationInput[]
    by: JaiToolScalarFieldEnum[] | JaiToolScalarFieldEnum
    having?: JaiToolScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JaiToolCountAggregateInputType | true
    _avg?: JaiToolAvgAggregateInputType
    _sum?: JaiToolSumAggregateInputType
    _min?: JaiToolMinAggregateInputType
    _max?: JaiToolMaxAggregateInputType
  }

  export type JaiToolGroupByOutputType = {
    id: number
    createdAt: Date
    updatedAt: Date
    name: string
    version: string | null
    description: string | null
    scope: string | null
    status: string | null
    inputSchema: JsonValue | null
    outputSchema: JsonValue | null
    _count: JaiToolCountAggregateOutputType | null
    _avg: JaiToolAvgAggregateOutputType | null
    _sum: JaiToolSumAggregateOutputType | null
    _min: JaiToolMinAggregateOutputType | null
    _max: JaiToolMaxAggregateOutputType | null
  }

  type GetJaiToolGroupByPayload<T extends JaiToolGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JaiToolGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JaiToolGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JaiToolGroupByOutputType[P]>
            : GetScalarType<T[P], JaiToolGroupByOutputType[P]>
        }
      >
    >


  export type JaiToolSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    version?: boolean
    description?: boolean
    scope?: boolean
    status?: boolean
    inputSchema?: boolean
    outputSchema?: boolean
  }, ExtArgs["result"]["jaiTool"]>

  export type JaiToolSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    version?: boolean
    description?: boolean
    scope?: boolean
    status?: boolean
    inputSchema?: boolean
    outputSchema?: boolean
  }, ExtArgs["result"]["jaiTool"]>

  export type JaiToolSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    version?: boolean
    description?: boolean
    scope?: boolean
    status?: boolean
    inputSchema?: boolean
    outputSchema?: boolean
  }, ExtArgs["result"]["jaiTool"]>

  export type JaiToolSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    version?: boolean
    description?: boolean
    scope?: boolean
    status?: boolean
    inputSchema?: boolean
    outputSchema?: boolean
  }

  export type JaiToolOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "name" | "version" | "description" | "scope" | "status" | "inputSchema" | "outputSchema", ExtArgs["result"]["jaiTool"]>

  export type $JaiToolPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "JaiTool"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      createdAt: Date
      updatedAt: Date
      name: string
      version: string | null
      description: string | null
      scope: string | null
      status: string | null
      inputSchema: Prisma.JsonValue | null
      outputSchema: Prisma.JsonValue | null
    }, ExtArgs["result"]["jaiTool"]>
    composites: {}
  }

  type JaiToolGetPayload<S extends boolean | null | undefined | JaiToolDefaultArgs> = $Result.GetResult<Prisma.$JaiToolPayload, S>

  type JaiToolCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JaiToolFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JaiToolCountAggregateInputType | true
    }

  export interface JaiToolDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['JaiTool'], meta: { name: 'JaiTool' } }
    /**
     * Find zero or one JaiTool that matches the filter.
     * @param {JaiToolFindUniqueArgs} args - Arguments to find a JaiTool
     * @example
     * // Get one JaiTool
     * const jaiTool = await prisma.jaiTool.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JaiToolFindUniqueArgs>(args: SelectSubset<T, JaiToolFindUniqueArgs<ExtArgs>>): Prisma__JaiToolClient<$Result.GetResult<Prisma.$JaiToolPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one JaiTool that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JaiToolFindUniqueOrThrowArgs} args - Arguments to find a JaiTool
     * @example
     * // Get one JaiTool
     * const jaiTool = await prisma.jaiTool.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JaiToolFindUniqueOrThrowArgs>(args: SelectSubset<T, JaiToolFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JaiToolClient<$Result.GetResult<Prisma.$JaiToolPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JaiTool that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JaiToolFindFirstArgs} args - Arguments to find a JaiTool
     * @example
     * // Get one JaiTool
     * const jaiTool = await prisma.jaiTool.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JaiToolFindFirstArgs>(args?: SelectSubset<T, JaiToolFindFirstArgs<ExtArgs>>): Prisma__JaiToolClient<$Result.GetResult<Prisma.$JaiToolPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JaiTool that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JaiToolFindFirstOrThrowArgs} args - Arguments to find a JaiTool
     * @example
     * // Get one JaiTool
     * const jaiTool = await prisma.jaiTool.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JaiToolFindFirstOrThrowArgs>(args?: SelectSubset<T, JaiToolFindFirstOrThrowArgs<ExtArgs>>): Prisma__JaiToolClient<$Result.GetResult<Prisma.$JaiToolPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more JaiTools that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JaiToolFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all JaiTools
     * const jaiTools = await prisma.jaiTool.findMany()
     * 
     * // Get first 10 JaiTools
     * const jaiTools = await prisma.jaiTool.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const jaiToolWithIdOnly = await prisma.jaiTool.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JaiToolFindManyArgs>(args?: SelectSubset<T, JaiToolFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JaiToolPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a JaiTool.
     * @param {JaiToolCreateArgs} args - Arguments to create a JaiTool.
     * @example
     * // Create one JaiTool
     * const JaiTool = await prisma.jaiTool.create({
     *   data: {
     *     // ... data to create a JaiTool
     *   }
     * })
     * 
     */
    create<T extends JaiToolCreateArgs>(args: SelectSubset<T, JaiToolCreateArgs<ExtArgs>>): Prisma__JaiToolClient<$Result.GetResult<Prisma.$JaiToolPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many JaiTools.
     * @param {JaiToolCreateManyArgs} args - Arguments to create many JaiTools.
     * @example
     * // Create many JaiTools
     * const jaiTool = await prisma.jaiTool.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JaiToolCreateManyArgs>(args?: SelectSubset<T, JaiToolCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many JaiTools and returns the data saved in the database.
     * @param {JaiToolCreateManyAndReturnArgs} args - Arguments to create many JaiTools.
     * @example
     * // Create many JaiTools
     * const jaiTool = await prisma.jaiTool.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many JaiTools and only return the `id`
     * const jaiToolWithIdOnly = await prisma.jaiTool.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JaiToolCreateManyAndReturnArgs>(args?: SelectSubset<T, JaiToolCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JaiToolPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a JaiTool.
     * @param {JaiToolDeleteArgs} args - Arguments to delete one JaiTool.
     * @example
     * // Delete one JaiTool
     * const JaiTool = await prisma.jaiTool.delete({
     *   where: {
     *     // ... filter to delete one JaiTool
     *   }
     * })
     * 
     */
    delete<T extends JaiToolDeleteArgs>(args: SelectSubset<T, JaiToolDeleteArgs<ExtArgs>>): Prisma__JaiToolClient<$Result.GetResult<Prisma.$JaiToolPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one JaiTool.
     * @param {JaiToolUpdateArgs} args - Arguments to update one JaiTool.
     * @example
     * // Update one JaiTool
     * const jaiTool = await prisma.jaiTool.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JaiToolUpdateArgs>(args: SelectSubset<T, JaiToolUpdateArgs<ExtArgs>>): Prisma__JaiToolClient<$Result.GetResult<Prisma.$JaiToolPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more JaiTools.
     * @param {JaiToolDeleteManyArgs} args - Arguments to filter JaiTools to delete.
     * @example
     * // Delete a few JaiTools
     * const { count } = await prisma.jaiTool.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JaiToolDeleteManyArgs>(args?: SelectSubset<T, JaiToolDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JaiTools.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JaiToolUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many JaiTools
     * const jaiTool = await prisma.jaiTool.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JaiToolUpdateManyArgs>(args: SelectSubset<T, JaiToolUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JaiTools and returns the data updated in the database.
     * @param {JaiToolUpdateManyAndReturnArgs} args - Arguments to update many JaiTools.
     * @example
     * // Update many JaiTools
     * const jaiTool = await prisma.jaiTool.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more JaiTools and only return the `id`
     * const jaiToolWithIdOnly = await prisma.jaiTool.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends JaiToolUpdateManyAndReturnArgs>(args: SelectSubset<T, JaiToolUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JaiToolPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one JaiTool.
     * @param {JaiToolUpsertArgs} args - Arguments to update or create a JaiTool.
     * @example
     * // Update or create a JaiTool
     * const jaiTool = await prisma.jaiTool.upsert({
     *   create: {
     *     // ... data to create a JaiTool
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the JaiTool we want to update
     *   }
     * })
     */
    upsert<T extends JaiToolUpsertArgs>(args: SelectSubset<T, JaiToolUpsertArgs<ExtArgs>>): Prisma__JaiToolClient<$Result.GetResult<Prisma.$JaiToolPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of JaiTools.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JaiToolCountArgs} args - Arguments to filter JaiTools to count.
     * @example
     * // Count the number of JaiTools
     * const count = await prisma.jaiTool.count({
     *   where: {
     *     // ... the filter for the JaiTools we want to count
     *   }
     * })
    **/
    count<T extends JaiToolCountArgs>(
      args?: Subset<T, JaiToolCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JaiToolCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a JaiTool.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JaiToolAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JaiToolAggregateArgs>(args: Subset<T, JaiToolAggregateArgs>): Prisma.PrismaPromise<GetJaiToolAggregateType<T>>

    /**
     * Group by JaiTool.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JaiToolGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JaiToolGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JaiToolGroupByArgs['orderBy'] }
        : { orderBy?: JaiToolGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JaiToolGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJaiToolGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the JaiTool model
   */
  readonly fields: JaiToolFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for JaiTool.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JaiToolClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the JaiTool model
   */
  interface JaiToolFieldRefs {
    readonly id: FieldRef<"JaiTool", 'Int'>
    readonly createdAt: FieldRef<"JaiTool", 'DateTime'>
    readonly updatedAt: FieldRef<"JaiTool", 'DateTime'>
    readonly name: FieldRef<"JaiTool", 'String'>
    readonly version: FieldRef<"JaiTool", 'String'>
    readonly description: FieldRef<"JaiTool", 'String'>
    readonly scope: FieldRef<"JaiTool", 'String'>
    readonly status: FieldRef<"JaiTool", 'String'>
    readonly inputSchema: FieldRef<"JaiTool", 'Json'>
    readonly outputSchema: FieldRef<"JaiTool", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * JaiTool findUnique
   */
  export type JaiToolFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JaiTool
     */
    select?: JaiToolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JaiTool
     */
    omit?: JaiToolOmit<ExtArgs> | null
    /**
     * Filter, which JaiTool to fetch.
     */
    where: JaiToolWhereUniqueInput
  }

  /**
   * JaiTool findUniqueOrThrow
   */
  export type JaiToolFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JaiTool
     */
    select?: JaiToolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JaiTool
     */
    omit?: JaiToolOmit<ExtArgs> | null
    /**
     * Filter, which JaiTool to fetch.
     */
    where: JaiToolWhereUniqueInput
  }

  /**
   * JaiTool findFirst
   */
  export type JaiToolFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JaiTool
     */
    select?: JaiToolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JaiTool
     */
    omit?: JaiToolOmit<ExtArgs> | null
    /**
     * Filter, which JaiTool to fetch.
     */
    where?: JaiToolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JaiTools to fetch.
     */
    orderBy?: JaiToolOrderByWithRelationInput | JaiToolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JaiTools.
     */
    cursor?: JaiToolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JaiTools from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JaiTools.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JaiTools.
     */
    distinct?: JaiToolScalarFieldEnum | JaiToolScalarFieldEnum[]
  }

  /**
   * JaiTool findFirstOrThrow
   */
  export type JaiToolFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JaiTool
     */
    select?: JaiToolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JaiTool
     */
    omit?: JaiToolOmit<ExtArgs> | null
    /**
     * Filter, which JaiTool to fetch.
     */
    where?: JaiToolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JaiTools to fetch.
     */
    orderBy?: JaiToolOrderByWithRelationInput | JaiToolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JaiTools.
     */
    cursor?: JaiToolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JaiTools from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JaiTools.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JaiTools.
     */
    distinct?: JaiToolScalarFieldEnum | JaiToolScalarFieldEnum[]
  }

  /**
   * JaiTool findMany
   */
  export type JaiToolFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JaiTool
     */
    select?: JaiToolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JaiTool
     */
    omit?: JaiToolOmit<ExtArgs> | null
    /**
     * Filter, which JaiTools to fetch.
     */
    where?: JaiToolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JaiTools to fetch.
     */
    orderBy?: JaiToolOrderByWithRelationInput | JaiToolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing JaiTools.
     */
    cursor?: JaiToolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JaiTools from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JaiTools.
     */
    skip?: number
    distinct?: JaiToolScalarFieldEnum | JaiToolScalarFieldEnum[]
  }

  /**
   * JaiTool create
   */
  export type JaiToolCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JaiTool
     */
    select?: JaiToolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JaiTool
     */
    omit?: JaiToolOmit<ExtArgs> | null
    /**
     * The data needed to create a JaiTool.
     */
    data: XOR<JaiToolCreateInput, JaiToolUncheckedCreateInput>
  }

  /**
   * JaiTool createMany
   */
  export type JaiToolCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many JaiTools.
     */
    data: JaiToolCreateManyInput | JaiToolCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * JaiTool createManyAndReturn
   */
  export type JaiToolCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JaiTool
     */
    select?: JaiToolSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JaiTool
     */
    omit?: JaiToolOmit<ExtArgs> | null
    /**
     * The data used to create many JaiTools.
     */
    data: JaiToolCreateManyInput | JaiToolCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * JaiTool update
   */
  export type JaiToolUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JaiTool
     */
    select?: JaiToolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JaiTool
     */
    omit?: JaiToolOmit<ExtArgs> | null
    /**
     * The data needed to update a JaiTool.
     */
    data: XOR<JaiToolUpdateInput, JaiToolUncheckedUpdateInput>
    /**
     * Choose, which JaiTool to update.
     */
    where: JaiToolWhereUniqueInput
  }

  /**
   * JaiTool updateMany
   */
  export type JaiToolUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update JaiTools.
     */
    data: XOR<JaiToolUpdateManyMutationInput, JaiToolUncheckedUpdateManyInput>
    /**
     * Filter which JaiTools to update
     */
    where?: JaiToolWhereInput
    /**
     * Limit how many JaiTools to update.
     */
    limit?: number
  }

  /**
   * JaiTool updateManyAndReturn
   */
  export type JaiToolUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JaiTool
     */
    select?: JaiToolSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JaiTool
     */
    omit?: JaiToolOmit<ExtArgs> | null
    /**
     * The data used to update JaiTools.
     */
    data: XOR<JaiToolUpdateManyMutationInput, JaiToolUncheckedUpdateManyInput>
    /**
     * Filter which JaiTools to update
     */
    where?: JaiToolWhereInput
    /**
     * Limit how many JaiTools to update.
     */
    limit?: number
  }

  /**
   * JaiTool upsert
   */
  export type JaiToolUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JaiTool
     */
    select?: JaiToolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JaiTool
     */
    omit?: JaiToolOmit<ExtArgs> | null
    /**
     * The filter to search for the JaiTool to update in case it exists.
     */
    where: JaiToolWhereUniqueInput
    /**
     * In case the JaiTool found by the `where` argument doesn't exist, create a new JaiTool with this data.
     */
    create: XOR<JaiToolCreateInput, JaiToolUncheckedCreateInput>
    /**
     * In case the JaiTool was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JaiToolUpdateInput, JaiToolUncheckedUpdateInput>
  }

  /**
   * JaiTool delete
   */
  export type JaiToolDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JaiTool
     */
    select?: JaiToolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JaiTool
     */
    omit?: JaiToolOmit<ExtArgs> | null
    /**
     * Filter which JaiTool to delete.
     */
    where: JaiToolWhereUniqueInput
  }

  /**
   * JaiTool deleteMany
   */
  export type JaiToolDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JaiTools to delete
     */
    where?: JaiToolWhereInput
    /**
     * Limit how many JaiTools to delete.
     */
    limit?: number
  }

  /**
   * JaiTool without action
   */
  export type JaiToolDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JaiTool
     */
    select?: JaiToolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JaiTool
     */
    omit?: JaiToolOmit<ExtArgs> | null
  }


  /**
   * Model SotEvent
   */

  export type AggregateSotEvent = {
    _count: SotEventCountAggregateOutputType | null
    _avg: SotEventAvgAggregateOutputType | null
    _sum: SotEventSumAggregateOutputType | null
    _min: SotEventMinAggregateOutputType | null
    _max: SotEventMaxAggregateOutputType | null
  }

  export type SotEventAvgAggregateOutputType = {
    id: number | null
    repoId: number | null
    domainId: number | null
  }

  export type SotEventSumAggregateOutputType = {
    id: number | null
    repoId: number | null
    domainId: number | null
  }

  export type SotEventMinAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    ts: Date | null
    source: string | null
    kind: string | null
    nhId: string | null
    summary: string | null
    repoId: number | null
    domainId: number | null
  }

  export type SotEventMaxAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    updatedAt: Date | null
    ts: Date | null
    source: string | null
    kind: string | null
    nhId: string | null
    summary: string | null
    repoId: number | null
    domainId: number | null
  }

  export type SotEventCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    ts: number
    source: number
    kind: number
    nhId: number
    summary: number
    payload: number
    repoId: number
    domainId: number
    _all: number
  }


  export type SotEventAvgAggregateInputType = {
    id?: true
    repoId?: true
    domainId?: true
  }

  export type SotEventSumAggregateInputType = {
    id?: true
    repoId?: true
    domainId?: true
  }

  export type SotEventMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    ts?: true
    source?: true
    kind?: true
    nhId?: true
    summary?: true
    repoId?: true
    domainId?: true
  }

  export type SotEventMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    ts?: true
    source?: true
    kind?: true
    nhId?: true
    summary?: true
    repoId?: true
    domainId?: true
  }

  export type SotEventCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    ts?: true
    source?: true
    kind?: true
    nhId?: true
    summary?: true
    payload?: true
    repoId?: true
    domainId?: true
    _all?: true
  }

  export type SotEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SotEvent to aggregate.
     */
    where?: SotEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SotEvents to fetch.
     */
    orderBy?: SotEventOrderByWithRelationInput | SotEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SotEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SotEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SotEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SotEvents
    **/
    _count?: true | SotEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SotEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SotEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SotEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SotEventMaxAggregateInputType
  }

  export type GetSotEventAggregateType<T extends SotEventAggregateArgs> = {
        [P in keyof T & keyof AggregateSotEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSotEvent[P]>
      : GetScalarType<T[P], AggregateSotEvent[P]>
  }




  export type SotEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SotEventWhereInput
    orderBy?: SotEventOrderByWithAggregationInput | SotEventOrderByWithAggregationInput[]
    by: SotEventScalarFieldEnum[] | SotEventScalarFieldEnum
    having?: SotEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SotEventCountAggregateInputType | true
    _avg?: SotEventAvgAggregateInputType
    _sum?: SotEventSumAggregateInputType
    _min?: SotEventMinAggregateInputType
    _max?: SotEventMaxAggregateInputType
  }

  export type SotEventGroupByOutputType = {
    id: number
    createdAt: Date
    updatedAt: Date
    ts: Date
    source: string
    kind: string
    nhId: string
    summary: string | null
    payload: JsonValue | null
    repoId: number | null
    domainId: number | null
    _count: SotEventCountAggregateOutputType | null
    _avg: SotEventAvgAggregateOutputType | null
    _sum: SotEventSumAggregateOutputType | null
    _min: SotEventMinAggregateOutputType | null
    _max: SotEventMaxAggregateOutputType | null
  }

  type GetSotEventGroupByPayload<T extends SotEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SotEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SotEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SotEventGroupByOutputType[P]>
            : GetScalarType<T[P], SotEventGroupByOutputType[P]>
        }
      >
    >


  export type SotEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ts?: boolean
    source?: boolean
    kind?: boolean
    nhId?: boolean
    summary?: boolean
    payload?: boolean
    repoId?: boolean
    domainId?: boolean
    domain?: boolean | SotEvent$domainArgs<ExtArgs>
    repo?: boolean | SotEvent$repoArgs<ExtArgs>
  }, ExtArgs["result"]["sotEvent"]>

  export type SotEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ts?: boolean
    source?: boolean
    kind?: boolean
    nhId?: boolean
    summary?: boolean
    payload?: boolean
    repoId?: boolean
    domainId?: boolean
    domain?: boolean | SotEvent$domainArgs<ExtArgs>
    repo?: boolean | SotEvent$repoArgs<ExtArgs>
  }, ExtArgs["result"]["sotEvent"]>

  export type SotEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ts?: boolean
    source?: boolean
    kind?: boolean
    nhId?: boolean
    summary?: boolean
    payload?: boolean
    repoId?: boolean
    domainId?: boolean
    domain?: boolean | SotEvent$domainArgs<ExtArgs>
    repo?: boolean | SotEvent$repoArgs<ExtArgs>
  }, ExtArgs["result"]["sotEvent"]>

  export type SotEventSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ts?: boolean
    source?: boolean
    kind?: boolean
    nhId?: boolean
    summary?: boolean
    payload?: boolean
    repoId?: boolean
    domainId?: boolean
  }

  export type SotEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "ts" | "source" | "kind" | "nhId" | "summary" | "payload" | "repoId" | "domainId", ExtArgs["result"]["sotEvent"]>
  export type SotEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    domain?: boolean | SotEvent$domainArgs<ExtArgs>
    repo?: boolean | SotEvent$repoArgs<ExtArgs>
  }
  export type SotEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    domain?: boolean | SotEvent$domainArgs<ExtArgs>
    repo?: boolean | SotEvent$repoArgs<ExtArgs>
  }
  export type SotEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    domain?: boolean | SotEvent$domainArgs<ExtArgs>
    repo?: boolean | SotEvent$repoArgs<ExtArgs>
  }

  export type $SotEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SotEvent"
    objects: {
      domain: Prisma.$DomainPayload<ExtArgs> | null
      repo: Prisma.$RepoPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      createdAt: Date
      updatedAt: Date
      /**
       * When the event actually happened (not when we ingested it)
       */
      ts: Date
      /**
       * High-level source: chatgpt | github | notion | manual | jai-format | etc.
       */
      source: string
      /**
       * Logical type: conversation | decision | task | design_note | sync | etc.
       */
      kind: string
      /**
       * Optional NH marker for this event in your hierarchy (e.g. "2.1.3.5")
       */
      nhId: string
      /**
       * Short human-readable summary for dashboards
       */
      summary: string | null
      /**
       * Full canonical blob (usually jai-format or raw export)
       */
      payload: Prisma.JsonValue | null
      /**
       * Optional links into repo/domain registries
       */
      repoId: number | null
      domainId: number | null
    }, ExtArgs["result"]["sotEvent"]>
    composites: {}
  }

  type SotEventGetPayload<S extends boolean | null | undefined | SotEventDefaultArgs> = $Result.GetResult<Prisma.$SotEventPayload, S>

  type SotEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SotEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SotEventCountAggregateInputType | true
    }

  export interface SotEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SotEvent'], meta: { name: 'SotEvent' } }
    /**
     * Find zero or one SotEvent that matches the filter.
     * @param {SotEventFindUniqueArgs} args - Arguments to find a SotEvent
     * @example
     * // Get one SotEvent
     * const sotEvent = await prisma.sotEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SotEventFindUniqueArgs>(args: SelectSubset<T, SotEventFindUniqueArgs<ExtArgs>>): Prisma__SotEventClient<$Result.GetResult<Prisma.$SotEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SotEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SotEventFindUniqueOrThrowArgs} args - Arguments to find a SotEvent
     * @example
     * // Get one SotEvent
     * const sotEvent = await prisma.sotEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SotEventFindUniqueOrThrowArgs>(args: SelectSubset<T, SotEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SotEventClient<$Result.GetResult<Prisma.$SotEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SotEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SotEventFindFirstArgs} args - Arguments to find a SotEvent
     * @example
     * // Get one SotEvent
     * const sotEvent = await prisma.sotEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SotEventFindFirstArgs>(args?: SelectSubset<T, SotEventFindFirstArgs<ExtArgs>>): Prisma__SotEventClient<$Result.GetResult<Prisma.$SotEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SotEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SotEventFindFirstOrThrowArgs} args - Arguments to find a SotEvent
     * @example
     * // Get one SotEvent
     * const sotEvent = await prisma.sotEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SotEventFindFirstOrThrowArgs>(args?: SelectSubset<T, SotEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__SotEventClient<$Result.GetResult<Prisma.$SotEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SotEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SotEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SotEvents
     * const sotEvents = await prisma.sotEvent.findMany()
     * 
     * // Get first 10 SotEvents
     * const sotEvents = await prisma.sotEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sotEventWithIdOnly = await prisma.sotEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SotEventFindManyArgs>(args?: SelectSubset<T, SotEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SotEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SotEvent.
     * @param {SotEventCreateArgs} args - Arguments to create a SotEvent.
     * @example
     * // Create one SotEvent
     * const SotEvent = await prisma.sotEvent.create({
     *   data: {
     *     // ... data to create a SotEvent
     *   }
     * })
     * 
     */
    create<T extends SotEventCreateArgs>(args: SelectSubset<T, SotEventCreateArgs<ExtArgs>>): Prisma__SotEventClient<$Result.GetResult<Prisma.$SotEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SotEvents.
     * @param {SotEventCreateManyArgs} args - Arguments to create many SotEvents.
     * @example
     * // Create many SotEvents
     * const sotEvent = await prisma.sotEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SotEventCreateManyArgs>(args?: SelectSubset<T, SotEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SotEvents and returns the data saved in the database.
     * @param {SotEventCreateManyAndReturnArgs} args - Arguments to create many SotEvents.
     * @example
     * // Create many SotEvents
     * const sotEvent = await prisma.sotEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SotEvents and only return the `id`
     * const sotEventWithIdOnly = await prisma.sotEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SotEventCreateManyAndReturnArgs>(args?: SelectSubset<T, SotEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SotEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SotEvent.
     * @param {SotEventDeleteArgs} args - Arguments to delete one SotEvent.
     * @example
     * // Delete one SotEvent
     * const SotEvent = await prisma.sotEvent.delete({
     *   where: {
     *     // ... filter to delete one SotEvent
     *   }
     * })
     * 
     */
    delete<T extends SotEventDeleteArgs>(args: SelectSubset<T, SotEventDeleteArgs<ExtArgs>>): Prisma__SotEventClient<$Result.GetResult<Prisma.$SotEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SotEvent.
     * @param {SotEventUpdateArgs} args - Arguments to update one SotEvent.
     * @example
     * // Update one SotEvent
     * const sotEvent = await prisma.sotEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SotEventUpdateArgs>(args: SelectSubset<T, SotEventUpdateArgs<ExtArgs>>): Prisma__SotEventClient<$Result.GetResult<Prisma.$SotEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SotEvents.
     * @param {SotEventDeleteManyArgs} args - Arguments to filter SotEvents to delete.
     * @example
     * // Delete a few SotEvents
     * const { count } = await prisma.sotEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SotEventDeleteManyArgs>(args?: SelectSubset<T, SotEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SotEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SotEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SotEvents
     * const sotEvent = await prisma.sotEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SotEventUpdateManyArgs>(args: SelectSubset<T, SotEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SotEvents and returns the data updated in the database.
     * @param {SotEventUpdateManyAndReturnArgs} args - Arguments to update many SotEvents.
     * @example
     * // Update many SotEvents
     * const sotEvent = await prisma.sotEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SotEvents and only return the `id`
     * const sotEventWithIdOnly = await prisma.sotEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SotEventUpdateManyAndReturnArgs>(args: SelectSubset<T, SotEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SotEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SotEvent.
     * @param {SotEventUpsertArgs} args - Arguments to update or create a SotEvent.
     * @example
     * // Update or create a SotEvent
     * const sotEvent = await prisma.sotEvent.upsert({
     *   create: {
     *     // ... data to create a SotEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SotEvent we want to update
     *   }
     * })
     */
    upsert<T extends SotEventUpsertArgs>(args: SelectSubset<T, SotEventUpsertArgs<ExtArgs>>): Prisma__SotEventClient<$Result.GetResult<Prisma.$SotEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SotEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SotEventCountArgs} args - Arguments to filter SotEvents to count.
     * @example
     * // Count the number of SotEvents
     * const count = await prisma.sotEvent.count({
     *   where: {
     *     // ... the filter for the SotEvents we want to count
     *   }
     * })
    **/
    count<T extends SotEventCountArgs>(
      args?: Subset<T, SotEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SotEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SotEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SotEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SotEventAggregateArgs>(args: Subset<T, SotEventAggregateArgs>): Prisma.PrismaPromise<GetSotEventAggregateType<T>>

    /**
     * Group by SotEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SotEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SotEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SotEventGroupByArgs['orderBy'] }
        : { orderBy?: SotEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SotEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSotEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SotEvent model
   */
  readonly fields: SotEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SotEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SotEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    domain<T extends SotEvent$domainArgs<ExtArgs> = {}>(args?: Subset<T, SotEvent$domainArgs<ExtArgs>>): Prisma__DomainClient<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    repo<T extends SotEvent$repoArgs<ExtArgs> = {}>(args?: Subset<T, SotEvent$repoArgs<ExtArgs>>): Prisma__RepoClient<$Result.GetResult<Prisma.$RepoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SotEvent model
   */
  interface SotEventFieldRefs {
    readonly id: FieldRef<"SotEvent", 'Int'>
    readonly createdAt: FieldRef<"SotEvent", 'DateTime'>
    readonly updatedAt: FieldRef<"SotEvent", 'DateTime'>
    readonly ts: FieldRef<"SotEvent", 'DateTime'>
    readonly source: FieldRef<"SotEvent", 'String'>
    readonly kind: FieldRef<"SotEvent", 'String'>
    readonly nhId: FieldRef<"SotEvent", 'String'>
    readonly summary: FieldRef<"SotEvent", 'String'>
    readonly payload: FieldRef<"SotEvent", 'Json'>
    readonly repoId: FieldRef<"SotEvent", 'Int'>
    readonly domainId: FieldRef<"SotEvent", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * SotEvent findUnique
   */
  export type SotEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SotEvent
     */
    select?: SotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SotEvent
     */
    omit?: SotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SotEventInclude<ExtArgs> | null
    /**
     * Filter, which SotEvent to fetch.
     */
    where: SotEventWhereUniqueInput
  }

  /**
   * SotEvent findUniqueOrThrow
   */
  export type SotEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SotEvent
     */
    select?: SotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SotEvent
     */
    omit?: SotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SotEventInclude<ExtArgs> | null
    /**
     * Filter, which SotEvent to fetch.
     */
    where: SotEventWhereUniqueInput
  }

  /**
   * SotEvent findFirst
   */
  export type SotEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SotEvent
     */
    select?: SotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SotEvent
     */
    omit?: SotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SotEventInclude<ExtArgs> | null
    /**
     * Filter, which SotEvent to fetch.
     */
    where?: SotEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SotEvents to fetch.
     */
    orderBy?: SotEventOrderByWithRelationInput | SotEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SotEvents.
     */
    cursor?: SotEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SotEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SotEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SotEvents.
     */
    distinct?: SotEventScalarFieldEnum | SotEventScalarFieldEnum[]
  }

  /**
   * SotEvent findFirstOrThrow
   */
  export type SotEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SotEvent
     */
    select?: SotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SotEvent
     */
    omit?: SotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SotEventInclude<ExtArgs> | null
    /**
     * Filter, which SotEvent to fetch.
     */
    where?: SotEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SotEvents to fetch.
     */
    orderBy?: SotEventOrderByWithRelationInput | SotEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SotEvents.
     */
    cursor?: SotEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SotEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SotEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SotEvents.
     */
    distinct?: SotEventScalarFieldEnum | SotEventScalarFieldEnum[]
  }

  /**
   * SotEvent findMany
   */
  export type SotEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SotEvent
     */
    select?: SotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SotEvent
     */
    omit?: SotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SotEventInclude<ExtArgs> | null
    /**
     * Filter, which SotEvents to fetch.
     */
    where?: SotEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SotEvents to fetch.
     */
    orderBy?: SotEventOrderByWithRelationInput | SotEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SotEvents.
     */
    cursor?: SotEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SotEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SotEvents.
     */
    skip?: number
    distinct?: SotEventScalarFieldEnum | SotEventScalarFieldEnum[]
  }

  /**
   * SotEvent create
   */
  export type SotEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SotEvent
     */
    select?: SotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SotEvent
     */
    omit?: SotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SotEventInclude<ExtArgs> | null
    /**
     * The data needed to create a SotEvent.
     */
    data: XOR<SotEventCreateInput, SotEventUncheckedCreateInput>
  }

  /**
   * SotEvent createMany
   */
  export type SotEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SotEvents.
     */
    data: SotEventCreateManyInput | SotEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SotEvent createManyAndReturn
   */
  export type SotEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SotEvent
     */
    select?: SotEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SotEvent
     */
    omit?: SotEventOmit<ExtArgs> | null
    /**
     * The data used to create many SotEvents.
     */
    data: SotEventCreateManyInput | SotEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SotEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SotEvent update
   */
  export type SotEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SotEvent
     */
    select?: SotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SotEvent
     */
    omit?: SotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SotEventInclude<ExtArgs> | null
    /**
     * The data needed to update a SotEvent.
     */
    data: XOR<SotEventUpdateInput, SotEventUncheckedUpdateInput>
    /**
     * Choose, which SotEvent to update.
     */
    where: SotEventWhereUniqueInput
  }

  /**
   * SotEvent updateMany
   */
  export type SotEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SotEvents.
     */
    data: XOR<SotEventUpdateManyMutationInput, SotEventUncheckedUpdateManyInput>
    /**
     * Filter which SotEvents to update
     */
    where?: SotEventWhereInput
    /**
     * Limit how many SotEvents to update.
     */
    limit?: number
  }

  /**
   * SotEvent updateManyAndReturn
   */
  export type SotEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SotEvent
     */
    select?: SotEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SotEvent
     */
    omit?: SotEventOmit<ExtArgs> | null
    /**
     * The data used to update SotEvents.
     */
    data: XOR<SotEventUpdateManyMutationInput, SotEventUncheckedUpdateManyInput>
    /**
     * Filter which SotEvents to update
     */
    where?: SotEventWhereInput
    /**
     * Limit how many SotEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SotEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SotEvent upsert
   */
  export type SotEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SotEvent
     */
    select?: SotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SotEvent
     */
    omit?: SotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SotEventInclude<ExtArgs> | null
    /**
     * The filter to search for the SotEvent to update in case it exists.
     */
    where: SotEventWhereUniqueInput
    /**
     * In case the SotEvent found by the `where` argument doesn't exist, create a new SotEvent with this data.
     */
    create: XOR<SotEventCreateInput, SotEventUncheckedCreateInput>
    /**
     * In case the SotEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SotEventUpdateInput, SotEventUncheckedUpdateInput>
  }

  /**
   * SotEvent delete
   */
  export type SotEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SotEvent
     */
    select?: SotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SotEvent
     */
    omit?: SotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SotEventInclude<ExtArgs> | null
    /**
     * Filter which SotEvent to delete.
     */
    where: SotEventWhereUniqueInput
  }

  /**
   * SotEvent deleteMany
   */
  export type SotEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SotEvents to delete
     */
    where?: SotEventWhereInput
    /**
     * Limit how many SotEvents to delete.
     */
    limit?: number
  }

  /**
   * SotEvent.domain
   */
  export type SotEvent$domainArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
    where?: DomainWhereInput
  }

  /**
   * SotEvent.repo
   */
  export type SotEvent$repoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repo
     */
    select?: RepoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repo
     */
    omit?: RepoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepoInclude<ExtArgs> | null
    where?: RepoWhereInput
  }

  /**
   * SotEvent without action
   */
  export type SotEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SotEvent
     */
    select?: SotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SotEvent
     */
    omit?: SotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SotEventInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    role: $Enums.Role | null
    passwordHash: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    role: $Enums.Role | null
    passwordHash: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    name: number
    email: number
    emailVerified: number
    image: number
    role: number
    passwordHash: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    role?: true
    passwordHash?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    role?: true
    passwordHash?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    role?: true
    passwordHash?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    name: string | null
    email: string
    emailVerified: Date | null
    image: string | null
    role: $Enums.Role
    passwordHash: string | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    passwordHash?: boolean
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    passwordHash?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    passwordHash?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    passwordHash?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "name" | "email" | "emailVerified" | "image" | "role" | "passwordHash", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      name: string | null
      email: string
      emailVerified: Date | null
      image: string | null
      role: $Enums.Role
      passwordHash: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'DateTime'>
    readonly image: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly passwordHash: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountSumAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    provider: number
    providerAccountId: number
    refresh_token: number
    access_token: number
    expires_at: number
    token_type: number
    scope: number
    id_token: number
    session_state: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    expires_at?: true
  }

  export type AccountSumAggregateInputType = {
    expires_at?: true
  }

  export type AccountMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "provider" | "providerAccountId" | "refresh_token" | "access_token" | "expires_at" | "token_type" | "scope" | "id_token" | "session_state", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      provider: string
      providerAccountId: string
      refresh_token: string | null
      access_token: string | null
      expires_at: number | null
      token_type: string | null
      scope: string | null
      id_token: string | null
      session_state: string | null
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly type: FieldRef<"Account", 'String'>
    readonly provider: FieldRef<"Account", 'String'>
    readonly providerAccountId: FieldRef<"Account", 'String'>
    readonly refresh_token: FieldRef<"Account", 'String'>
    readonly access_token: FieldRef<"Account", 'String'>
    readonly expires_at: FieldRef<"Account", 'Int'>
    readonly token_type: FieldRef<"Account", 'String'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly id_token: FieldRef<"Account", 'String'>
    readonly session_state: FieldRef<"Account", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    sessionToken: number
    userId: number
    expires: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    sessionToken: string
    userId: string
    expires: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionToken" | "userId" | "expires", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionToken: string
      userId: string
      expires: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly sessionToken: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly expires: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model VerificationToken
   */

  export type AggregateVerificationToken = {
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  export type VerificationTokenMinAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenMaxAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenCountAggregateOutputType = {
    identifier: number
    token: number
    expires: number
    _all: number
  }


  export type VerificationTokenMinAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenMaxAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenCountAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
    _all?: true
  }

  export type VerificationTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationToken to aggregate.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VerificationTokens
    **/
    _count?: true | VerificationTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type GetVerificationTokenAggregateType<T extends VerificationTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateVerificationToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerificationToken[P]>
      : GetScalarType<T[P], AggregateVerificationToken[P]>
  }




  export type VerificationTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationTokenWhereInput
    orderBy?: VerificationTokenOrderByWithAggregationInput | VerificationTokenOrderByWithAggregationInput[]
    by: VerificationTokenScalarFieldEnum[] | VerificationTokenScalarFieldEnum
    having?: VerificationTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationTokenCountAggregateInputType | true
    _min?: VerificationTokenMinAggregateInputType
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type VerificationTokenGroupByOutputType = {
    identifier: string
    token: string
    expires: Date
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  type GetVerificationTokenGroupByPayload<T extends VerificationTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
        }
      >
    >


  export type VerificationTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectScalar = {
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }

  export type VerificationTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"identifier" | "token" | "expires", ExtArgs["result"]["verificationToken"]>

  export type $VerificationTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VerificationToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      identifier: string
      token: string
      expires: Date
    }, ExtArgs["result"]["verificationToken"]>
    composites: {}
  }

  type VerificationTokenGetPayload<S extends boolean | null | undefined | VerificationTokenDefaultArgs> = $Result.GetResult<Prisma.$VerificationTokenPayload, S>

  type VerificationTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationTokenCountAggregateInputType | true
    }

  export interface VerificationTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VerificationToken'], meta: { name: 'VerificationToken' } }
    /**
     * Find zero or one VerificationToken that matches the filter.
     * @param {VerificationTokenFindUniqueArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationTokenFindUniqueArgs>(args: SelectSubset<T, VerificationTokenFindUniqueArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VerificationToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationTokenFindUniqueOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationTokenFindFirstArgs>(args?: SelectSubset<T, VerificationTokenFindFirstArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VerificationTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany()
     * 
     * // Get first 10 VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany({ take: 10 })
     * 
     * // Only select the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.findMany({ select: { identifier: true } })
     * 
     */
    findMany<T extends VerificationTokenFindManyArgs>(args?: SelectSubset<T, VerificationTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VerificationToken.
     * @param {VerificationTokenCreateArgs} args - Arguments to create a VerificationToken.
     * @example
     * // Create one VerificationToken
     * const VerificationToken = await prisma.verificationToken.create({
     *   data: {
     *     // ... data to create a VerificationToken
     *   }
     * })
     * 
     */
    create<T extends VerificationTokenCreateArgs>(args: SelectSubset<T, VerificationTokenCreateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VerificationTokens.
     * @param {VerificationTokenCreateManyArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationTokenCreateManyArgs>(args?: SelectSubset<T, VerificationTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VerificationTokens and returns the data saved in the database.
     * @param {VerificationTokenCreateManyAndReturnArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.createManyAndReturn({
     *   select: { identifier: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VerificationToken.
     * @param {VerificationTokenDeleteArgs} args - Arguments to delete one VerificationToken.
     * @example
     * // Delete one VerificationToken
     * const VerificationToken = await prisma.verificationToken.delete({
     *   where: {
     *     // ... filter to delete one VerificationToken
     *   }
     * })
     * 
     */
    delete<T extends VerificationTokenDeleteArgs>(args: SelectSubset<T, VerificationTokenDeleteArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VerificationToken.
     * @param {VerificationTokenUpdateArgs} args - Arguments to update one VerificationToken.
     * @example
     * // Update one VerificationToken
     * const verificationToken = await prisma.verificationToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationTokenUpdateArgs>(args: SelectSubset<T, VerificationTokenUpdateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VerificationTokens.
     * @param {VerificationTokenDeleteManyArgs} args - Arguments to filter VerificationTokens to delete.
     * @example
     * // Delete a few VerificationTokens
     * const { count } = await prisma.verificationToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationTokenDeleteManyArgs>(args?: SelectSubset<T, VerificationTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationTokenUpdateManyArgs>(args: SelectSubset<T, VerificationTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens and returns the data updated in the database.
     * @param {VerificationTokenUpdateManyAndReturnArgs} args - Arguments to update many VerificationTokens.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.updateManyAndReturn({
     *   select: { identifier: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VerificationTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VerificationToken.
     * @param {VerificationTokenUpsertArgs} args - Arguments to update or create a VerificationToken.
     * @example
     * // Update or create a VerificationToken
     * const verificationToken = await prisma.verificationToken.upsert({
     *   create: {
     *     // ... data to create a VerificationToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VerificationToken we want to update
     *   }
     * })
     */
    upsert<T extends VerificationTokenUpsertArgs>(args: SelectSubset<T, VerificationTokenUpsertArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenCountArgs} args - Arguments to filter VerificationTokens to count.
     * @example
     * // Count the number of VerificationTokens
     * const count = await prisma.verificationToken.count({
     *   where: {
     *     // ... the filter for the VerificationTokens we want to count
     *   }
     * })
    **/
    count<T extends VerificationTokenCountArgs>(
      args?: Subset<T, VerificationTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VerificationTokenAggregateArgs>(args: Subset<T, VerificationTokenAggregateArgs>): Prisma.PrismaPromise<GetVerificationTokenAggregateType<T>>

    /**
     * Group by VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VerificationTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationTokenGroupByArgs['orderBy'] }
        : { orderBy?: VerificationTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VerificationTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VerificationToken model
   */
  readonly fields: VerificationTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VerificationToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VerificationToken model
   */
  interface VerificationTokenFieldRefs {
    readonly identifier: FieldRef<"VerificationToken", 'String'>
    readonly token: FieldRef<"VerificationToken", 'String'>
    readonly expires: FieldRef<"VerificationToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VerificationToken findUnique
   */
  export type VerificationTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findUniqueOrThrow
   */
  export type VerificationTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findFirst
   */
  export type VerificationTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findFirstOrThrow
   */
  export type VerificationTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findMany
   */
  export type VerificationTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationTokens to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken create
   */
  export type VerificationTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to create a VerificationToken.
     */
    data: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
  }

  /**
   * VerificationToken createMany
   */
  export type VerificationTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken createManyAndReturn
   */
  export type VerificationTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken update
   */
  export type VerificationTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to update a VerificationToken.
     */
    data: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
    /**
     * Choose, which VerificationToken to update.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken updateMany
   */
  export type VerificationTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to update.
     */
    limit?: number
  }

  /**
   * VerificationToken updateManyAndReturn
   */
  export type VerificationTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to update.
     */
    limit?: number
  }

  /**
   * VerificationToken upsert
   */
  export type VerificationTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The filter to search for the VerificationToken to update in case it exists.
     */
    where: VerificationTokenWhereUniqueInput
    /**
     * In case the VerificationToken found by the `where` argument doesn't exist, create a new VerificationToken with this data.
     */
    create: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
    /**
     * In case the VerificationToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
  }

  /**
   * VerificationToken delete
   */
  export type VerificationTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter which VerificationToken to delete.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken deleteMany
   */
  export type VerificationTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationTokens to delete
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to delete.
     */
    limit?: number
  }

  /**
   * VerificationToken without action
   */
  export type VerificationTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const RepoScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    nhId: 'nhId',
    name: 'name',
    description: 'description',
    domainPod: 'domainPod',
    engineGroup: 'engineGroup',
    language: 'language',
    status: 'status',
    owner: 'owner',
    defaultBranch: 'defaultBranch',
    githubUrl: 'githubUrl',
    notes: 'notes'
  };

  export type RepoScalarFieldEnum = (typeof RepoScalarFieldEnum)[keyof typeof RepoScalarFieldEnum]


  export const DomainScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    nhId: 'nhId',
    domain: 'domain',
    status: 'status',
    domainKey: 'domainKey',
    engineType: 'engineType',
    env: 'env',
    expiresAt: 'expiresAt',
    notes: 'notes',
    repoId: 'repoId'
  };

  export type DomainScalarFieldEnum = (typeof DomainScalarFieldEnum)[keyof typeof DomainScalarFieldEnum]


  export const SyncRunScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    type: 'type',
    status: 'status',
    trigger: 'trigger',
    startedAt: 'startedAt',
    finishedAt: 'finishedAt',
    workflowRunUrl: 'workflowRunUrl',
    summary: 'summary',
    payload: 'payload',
    repoId: 'repoId'
  };

  export type SyncRunScalarFieldEnum = (typeof SyncRunScalarFieldEnum)[keyof typeof SyncRunScalarFieldEnum]


  export const FileIndexScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    repoId: 'repoId',
    syncRunId: 'syncRunId',
    path: 'path',
    dir: 'dir',
    filename: 'filename',
    extension: 'extension',
    sizeBytes: 'sizeBytes',
    sha256: 'sha256',
    lastCommitSha: 'lastCommitSha',
    indexedAt: 'indexedAt'
  };

  export type FileIndexScalarFieldEnum = (typeof FileIndexScalarFieldEnum)[keyof typeof FileIndexScalarFieldEnum]


  export const PilotSessionScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    projectKey: 'projectKey',
    waveLabel: 'waveLabel',
    mode: 'mode',
    surface: 'surface',
    createdBy: 'createdBy',
    startedAt: 'startedAt',
    endedAt: 'endedAt'
  };

  export type PilotSessionScalarFieldEnum = (typeof PilotSessionScalarFieldEnum)[keyof typeof PilotSessionScalarFieldEnum]


  export const PilotActionScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    ts: 'ts',
    sessionId: 'sessionId',
    mode: 'mode',
    targetNodeId: 'targetNodeId',
    actionType: 'actionType',
    payload: 'payload',
    reason: 'reason'
  };

  export type PilotActionScalarFieldEnum = (typeof PilotActionScalarFieldEnum)[keyof typeof PilotActionScalarFieldEnum]


  export const PilotRunScalarFieldEnum: {
    id: 'id',
    kind: 'kind',
    status: 'status',
    startedAt: 'startedAt',
    finishedAt: 'finishedAt',
    summary: 'summary',
    artifactDir: 'artifactDir',
    stdoutPath: 'stdoutPath',
    stderrPath: 'stderrPath',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PilotRunScalarFieldEnum = (typeof PilotRunScalarFieldEnum)[keyof typeof PilotRunScalarFieldEnum]


  export const JaiToolScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    name: 'name',
    version: 'version',
    description: 'description',
    scope: 'scope',
    status: 'status',
    inputSchema: 'inputSchema',
    outputSchema: 'outputSchema'
  };

  export type JaiToolScalarFieldEnum = (typeof JaiToolScalarFieldEnum)[keyof typeof JaiToolScalarFieldEnum]


  export const SotEventScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    ts: 'ts',
    source: 'source',
    kind: 'kind',
    nhId: 'nhId',
    summary: 'summary',
    payload: 'payload',
    repoId: 'repoId',
    domainId: 'domainId'
  };

  export type SotEventScalarFieldEnum = (typeof SotEventScalarFieldEnum)[keyof typeof SotEventScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    role: 'role',
    passwordHash: 'passwordHash'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires_at: 'expires_at',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    sessionToken: 'sessionToken',
    userId: 'userId',
    expires: 'expires'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const VerificationTokenScalarFieldEnum: {
    identifier: 'identifier',
    token: 'token',
    expires: 'expires'
  };

  export type VerificationTokenScalarFieldEnum = (typeof VerificationTokenScalarFieldEnum)[keyof typeof VerificationTokenScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type RepoWhereInput = {
    AND?: RepoWhereInput | RepoWhereInput[]
    OR?: RepoWhereInput[]
    NOT?: RepoWhereInput | RepoWhereInput[]
    id?: IntFilter<"Repo"> | number
    createdAt?: DateTimeFilter<"Repo"> | Date | string
    updatedAt?: DateTimeFilter<"Repo"> | Date | string
    nhId?: StringFilter<"Repo"> | string
    name?: StringFilter<"Repo"> | string
    description?: StringNullableFilter<"Repo"> | string | null
    domainPod?: StringNullableFilter<"Repo"> | string | null
    engineGroup?: StringNullableFilter<"Repo"> | string | null
    language?: StringNullableFilter<"Repo"> | string | null
    status?: StringNullableFilter<"Repo"> | string | null
    owner?: StringNullableFilter<"Repo"> | string | null
    defaultBranch?: StringNullableFilter<"Repo"> | string | null
    githubUrl?: StringNullableFilter<"Repo"> | string | null
    notes?: JsonNullableFilter<"Repo">
    domains?: DomainListRelationFilter
    fileIndexes?: FileIndexListRelationFilter
    sotEvents?: SotEventListRelationFilter
    syncRuns?: SyncRunListRelationFilter
  }

  export type RepoOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    nhId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    domainPod?: SortOrderInput | SortOrder
    engineGroup?: SortOrderInput | SortOrder
    language?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    owner?: SortOrderInput | SortOrder
    defaultBranch?: SortOrderInput | SortOrder
    githubUrl?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    domains?: DomainOrderByRelationAggregateInput
    fileIndexes?: FileIndexOrderByRelationAggregateInput
    sotEvents?: SotEventOrderByRelationAggregateInput
    syncRuns?: SyncRunOrderByRelationAggregateInput
  }

  export type RepoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    AND?: RepoWhereInput | RepoWhereInput[]
    OR?: RepoWhereInput[]
    NOT?: RepoWhereInput | RepoWhereInput[]
    createdAt?: DateTimeFilter<"Repo"> | Date | string
    updatedAt?: DateTimeFilter<"Repo"> | Date | string
    nhId?: StringFilter<"Repo"> | string
    description?: StringNullableFilter<"Repo"> | string | null
    domainPod?: StringNullableFilter<"Repo"> | string | null
    engineGroup?: StringNullableFilter<"Repo"> | string | null
    language?: StringNullableFilter<"Repo"> | string | null
    status?: StringNullableFilter<"Repo"> | string | null
    owner?: StringNullableFilter<"Repo"> | string | null
    defaultBranch?: StringNullableFilter<"Repo"> | string | null
    githubUrl?: StringNullableFilter<"Repo"> | string | null
    notes?: JsonNullableFilter<"Repo">
    domains?: DomainListRelationFilter
    fileIndexes?: FileIndexListRelationFilter
    sotEvents?: SotEventListRelationFilter
    syncRuns?: SyncRunListRelationFilter
  }, "id" | "name">

  export type RepoOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    nhId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    domainPod?: SortOrderInput | SortOrder
    engineGroup?: SortOrderInput | SortOrder
    language?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    owner?: SortOrderInput | SortOrder
    defaultBranch?: SortOrderInput | SortOrder
    githubUrl?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    _count?: RepoCountOrderByAggregateInput
    _avg?: RepoAvgOrderByAggregateInput
    _max?: RepoMaxOrderByAggregateInput
    _min?: RepoMinOrderByAggregateInput
    _sum?: RepoSumOrderByAggregateInput
  }

  export type RepoScalarWhereWithAggregatesInput = {
    AND?: RepoScalarWhereWithAggregatesInput | RepoScalarWhereWithAggregatesInput[]
    OR?: RepoScalarWhereWithAggregatesInput[]
    NOT?: RepoScalarWhereWithAggregatesInput | RepoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Repo"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Repo"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Repo"> | Date | string
    nhId?: StringWithAggregatesFilter<"Repo"> | string
    name?: StringWithAggregatesFilter<"Repo"> | string
    description?: StringNullableWithAggregatesFilter<"Repo"> | string | null
    domainPod?: StringNullableWithAggregatesFilter<"Repo"> | string | null
    engineGroup?: StringNullableWithAggregatesFilter<"Repo"> | string | null
    language?: StringNullableWithAggregatesFilter<"Repo"> | string | null
    status?: StringNullableWithAggregatesFilter<"Repo"> | string | null
    owner?: StringNullableWithAggregatesFilter<"Repo"> | string | null
    defaultBranch?: StringNullableWithAggregatesFilter<"Repo"> | string | null
    githubUrl?: StringNullableWithAggregatesFilter<"Repo"> | string | null
    notes?: JsonNullableWithAggregatesFilter<"Repo">
  }

  export type DomainWhereInput = {
    AND?: DomainWhereInput | DomainWhereInput[]
    OR?: DomainWhereInput[]
    NOT?: DomainWhereInput | DomainWhereInput[]
    id?: IntFilter<"Domain"> | number
    createdAt?: DateTimeFilter<"Domain"> | Date | string
    updatedAt?: DateTimeFilter<"Domain"> | Date | string
    nhId?: StringFilter<"Domain"> | string
    domain?: StringFilter<"Domain"> | string
    status?: StringNullableFilter<"Domain"> | string | null
    domainKey?: StringNullableFilter<"Domain"> | string | null
    engineType?: StringNullableFilter<"Domain"> | string | null
    env?: StringNullableFilter<"Domain"> | string | null
    expiresAt?: DateTimeNullableFilter<"Domain"> | Date | string | null
    notes?: JsonNullableFilter<"Domain">
    repoId?: IntNullableFilter<"Domain"> | number | null
    repo?: XOR<RepoNullableScalarRelationFilter, RepoWhereInput> | null
    sotEvents?: SotEventListRelationFilter
  }

  export type DomainOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    nhId?: SortOrder
    domain?: SortOrder
    status?: SortOrderInput | SortOrder
    domainKey?: SortOrderInput | SortOrder
    engineType?: SortOrderInput | SortOrder
    env?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    repoId?: SortOrderInput | SortOrder
    repo?: RepoOrderByWithRelationInput
    sotEvents?: SotEventOrderByRelationAggregateInput
  }

  export type DomainWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    domain?: string
    AND?: DomainWhereInput | DomainWhereInput[]
    OR?: DomainWhereInput[]
    NOT?: DomainWhereInput | DomainWhereInput[]
    createdAt?: DateTimeFilter<"Domain"> | Date | string
    updatedAt?: DateTimeFilter<"Domain"> | Date | string
    nhId?: StringFilter<"Domain"> | string
    status?: StringNullableFilter<"Domain"> | string | null
    domainKey?: StringNullableFilter<"Domain"> | string | null
    engineType?: StringNullableFilter<"Domain"> | string | null
    env?: StringNullableFilter<"Domain"> | string | null
    expiresAt?: DateTimeNullableFilter<"Domain"> | Date | string | null
    notes?: JsonNullableFilter<"Domain">
    repoId?: IntNullableFilter<"Domain"> | number | null
    repo?: XOR<RepoNullableScalarRelationFilter, RepoWhereInput> | null
    sotEvents?: SotEventListRelationFilter
  }, "id" | "domain">

  export type DomainOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    nhId?: SortOrder
    domain?: SortOrder
    status?: SortOrderInput | SortOrder
    domainKey?: SortOrderInput | SortOrder
    engineType?: SortOrderInput | SortOrder
    env?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    repoId?: SortOrderInput | SortOrder
    _count?: DomainCountOrderByAggregateInput
    _avg?: DomainAvgOrderByAggregateInput
    _max?: DomainMaxOrderByAggregateInput
    _min?: DomainMinOrderByAggregateInput
    _sum?: DomainSumOrderByAggregateInput
  }

  export type DomainScalarWhereWithAggregatesInput = {
    AND?: DomainScalarWhereWithAggregatesInput | DomainScalarWhereWithAggregatesInput[]
    OR?: DomainScalarWhereWithAggregatesInput[]
    NOT?: DomainScalarWhereWithAggregatesInput | DomainScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Domain"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Domain"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Domain"> | Date | string
    nhId?: StringWithAggregatesFilter<"Domain"> | string
    domain?: StringWithAggregatesFilter<"Domain"> | string
    status?: StringNullableWithAggregatesFilter<"Domain"> | string | null
    domainKey?: StringNullableWithAggregatesFilter<"Domain"> | string | null
    engineType?: StringNullableWithAggregatesFilter<"Domain"> | string | null
    env?: StringNullableWithAggregatesFilter<"Domain"> | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"Domain"> | Date | string | null
    notes?: JsonNullableWithAggregatesFilter<"Domain">
    repoId?: IntNullableWithAggregatesFilter<"Domain"> | number | null
  }

  export type SyncRunWhereInput = {
    AND?: SyncRunWhereInput | SyncRunWhereInput[]
    OR?: SyncRunWhereInput[]
    NOT?: SyncRunWhereInput | SyncRunWhereInput[]
    id?: IntFilter<"SyncRun"> | number
    createdAt?: DateTimeFilter<"SyncRun"> | Date | string
    updatedAt?: DateTimeFilter<"SyncRun"> | Date | string
    type?: StringFilter<"SyncRun"> | string
    status?: StringFilter<"SyncRun"> | string
    trigger?: StringNullableFilter<"SyncRun"> | string | null
    startedAt?: DateTimeFilter<"SyncRun"> | Date | string
    finishedAt?: DateTimeFilter<"SyncRun"> | Date | string
    workflowRunUrl?: StringNullableFilter<"SyncRun"> | string | null
    summary?: StringNullableFilter<"SyncRun"> | string | null
    payload?: JsonNullableFilter<"SyncRun">
    repoId?: IntNullableFilter<"SyncRun"> | number | null
    fileIndexes?: FileIndexListRelationFilter
    repo?: XOR<RepoNullableScalarRelationFilter, RepoWhereInput> | null
  }

  export type SyncRunOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    type?: SortOrder
    status?: SortOrder
    trigger?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
    workflowRunUrl?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    payload?: SortOrderInput | SortOrder
    repoId?: SortOrderInput | SortOrder
    fileIndexes?: FileIndexOrderByRelationAggregateInput
    repo?: RepoOrderByWithRelationInput
  }

  export type SyncRunWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: SyncRunWhereInput | SyncRunWhereInput[]
    OR?: SyncRunWhereInput[]
    NOT?: SyncRunWhereInput | SyncRunWhereInput[]
    createdAt?: DateTimeFilter<"SyncRun"> | Date | string
    updatedAt?: DateTimeFilter<"SyncRun"> | Date | string
    type?: StringFilter<"SyncRun"> | string
    status?: StringFilter<"SyncRun"> | string
    trigger?: StringNullableFilter<"SyncRun"> | string | null
    startedAt?: DateTimeFilter<"SyncRun"> | Date | string
    finishedAt?: DateTimeFilter<"SyncRun"> | Date | string
    workflowRunUrl?: StringNullableFilter<"SyncRun"> | string | null
    summary?: StringNullableFilter<"SyncRun"> | string | null
    payload?: JsonNullableFilter<"SyncRun">
    repoId?: IntNullableFilter<"SyncRun"> | number | null
    fileIndexes?: FileIndexListRelationFilter
    repo?: XOR<RepoNullableScalarRelationFilter, RepoWhereInput> | null
  }, "id">

  export type SyncRunOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    type?: SortOrder
    status?: SortOrder
    trigger?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
    workflowRunUrl?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    payload?: SortOrderInput | SortOrder
    repoId?: SortOrderInput | SortOrder
    _count?: SyncRunCountOrderByAggregateInput
    _avg?: SyncRunAvgOrderByAggregateInput
    _max?: SyncRunMaxOrderByAggregateInput
    _min?: SyncRunMinOrderByAggregateInput
    _sum?: SyncRunSumOrderByAggregateInput
  }

  export type SyncRunScalarWhereWithAggregatesInput = {
    AND?: SyncRunScalarWhereWithAggregatesInput | SyncRunScalarWhereWithAggregatesInput[]
    OR?: SyncRunScalarWhereWithAggregatesInput[]
    NOT?: SyncRunScalarWhereWithAggregatesInput | SyncRunScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SyncRun"> | number
    createdAt?: DateTimeWithAggregatesFilter<"SyncRun"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SyncRun"> | Date | string
    type?: StringWithAggregatesFilter<"SyncRun"> | string
    status?: StringWithAggregatesFilter<"SyncRun"> | string
    trigger?: StringNullableWithAggregatesFilter<"SyncRun"> | string | null
    startedAt?: DateTimeWithAggregatesFilter<"SyncRun"> | Date | string
    finishedAt?: DateTimeWithAggregatesFilter<"SyncRun"> | Date | string
    workflowRunUrl?: StringNullableWithAggregatesFilter<"SyncRun"> | string | null
    summary?: StringNullableWithAggregatesFilter<"SyncRun"> | string | null
    payload?: JsonNullableWithAggregatesFilter<"SyncRun">
    repoId?: IntNullableWithAggregatesFilter<"SyncRun"> | number | null
  }

  export type FileIndexWhereInput = {
    AND?: FileIndexWhereInput | FileIndexWhereInput[]
    OR?: FileIndexWhereInput[]
    NOT?: FileIndexWhereInput | FileIndexWhereInput[]
    id?: IntFilter<"FileIndex"> | number
    createdAt?: DateTimeFilter<"FileIndex"> | Date | string
    updatedAt?: DateTimeFilter<"FileIndex"> | Date | string
    repoId?: IntFilter<"FileIndex"> | number
    syncRunId?: IntNullableFilter<"FileIndex"> | number | null
    path?: StringFilter<"FileIndex"> | string
    dir?: StringFilter<"FileIndex"> | string
    filename?: StringFilter<"FileIndex"> | string
    extension?: StringFilter<"FileIndex"> | string
    sizeBytes?: IntFilter<"FileIndex"> | number
    sha256?: StringFilter<"FileIndex"> | string
    lastCommitSha?: StringNullableFilter<"FileIndex"> | string | null
    indexedAt?: DateTimeFilter<"FileIndex"> | Date | string
    repo?: XOR<RepoScalarRelationFilter, RepoWhereInput>
    syncRun?: XOR<SyncRunNullableScalarRelationFilter, SyncRunWhereInput> | null
  }

  export type FileIndexOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    repoId?: SortOrder
    syncRunId?: SortOrderInput | SortOrder
    path?: SortOrder
    dir?: SortOrder
    filename?: SortOrder
    extension?: SortOrder
    sizeBytes?: SortOrder
    sha256?: SortOrder
    lastCommitSha?: SortOrderInput | SortOrder
    indexedAt?: SortOrder
    repo?: RepoOrderByWithRelationInput
    syncRun?: SyncRunOrderByWithRelationInput
  }

  export type FileIndexWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    repoId_path?: FileIndexRepoIdPathCompoundUniqueInput
    AND?: FileIndexWhereInput | FileIndexWhereInput[]
    OR?: FileIndexWhereInput[]
    NOT?: FileIndexWhereInput | FileIndexWhereInput[]
    createdAt?: DateTimeFilter<"FileIndex"> | Date | string
    updatedAt?: DateTimeFilter<"FileIndex"> | Date | string
    repoId?: IntFilter<"FileIndex"> | number
    syncRunId?: IntNullableFilter<"FileIndex"> | number | null
    path?: StringFilter<"FileIndex"> | string
    dir?: StringFilter<"FileIndex"> | string
    filename?: StringFilter<"FileIndex"> | string
    extension?: StringFilter<"FileIndex"> | string
    sizeBytes?: IntFilter<"FileIndex"> | number
    sha256?: StringFilter<"FileIndex"> | string
    lastCommitSha?: StringNullableFilter<"FileIndex"> | string | null
    indexedAt?: DateTimeFilter<"FileIndex"> | Date | string
    repo?: XOR<RepoScalarRelationFilter, RepoWhereInput>
    syncRun?: XOR<SyncRunNullableScalarRelationFilter, SyncRunWhereInput> | null
  }, "id" | "repoId_path">

  export type FileIndexOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    repoId?: SortOrder
    syncRunId?: SortOrderInput | SortOrder
    path?: SortOrder
    dir?: SortOrder
    filename?: SortOrder
    extension?: SortOrder
    sizeBytes?: SortOrder
    sha256?: SortOrder
    lastCommitSha?: SortOrderInput | SortOrder
    indexedAt?: SortOrder
    _count?: FileIndexCountOrderByAggregateInput
    _avg?: FileIndexAvgOrderByAggregateInput
    _max?: FileIndexMaxOrderByAggregateInput
    _min?: FileIndexMinOrderByAggregateInput
    _sum?: FileIndexSumOrderByAggregateInput
  }

  export type FileIndexScalarWhereWithAggregatesInput = {
    AND?: FileIndexScalarWhereWithAggregatesInput | FileIndexScalarWhereWithAggregatesInput[]
    OR?: FileIndexScalarWhereWithAggregatesInput[]
    NOT?: FileIndexScalarWhereWithAggregatesInput | FileIndexScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"FileIndex"> | number
    createdAt?: DateTimeWithAggregatesFilter<"FileIndex"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FileIndex"> | Date | string
    repoId?: IntWithAggregatesFilter<"FileIndex"> | number
    syncRunId?: IntNullableWithAggregatesFilter<"FileIndex"> | number | null
    path?: StringWithAggregatesFilter<"FileIndex"> | string
    dir?: StringWithAggregatesFilter<"FileIndex"> | string
    filename?: StringWithAggregatesFilter<"FileIndex"> | string
    extension?: StringWithAggregatesFilter<"FileIndex"> | string
    sizeBytes?: IntWithAggregatesFilter<"FileIndex"> | number
    sha256?: StringWithAggregatesFilter<"FileIndex"> | string
    lastCommitSha?: StringNullableWithAggregatesFilter<"FileIndex"> | string | null
    indexedAt?: DateTimeWithAggregatesFilter<"FileIndex"> | Date | string
  }

  export type PilotSessionWhereInput = {
    AND?: PilotSessionWhereInput | PilotSessionWhereInput[]
    OR?: PilotSessionWhereInput[]
    NOT?: PilotSessionWhereInput | PilotSessionWhereInput[]
    id?: IntFilter<"PilotSession"> | number
    createdAt?: DateTimeFilter<"PilotSession"> | Date | string
    updatedAt?: DateTimeFilter<"PilotSession"> | Date | string
    projectKey?: StringNullableFilter<"PilotSession"> | string | null
    waveLabel?: StringNullableFilter<"PilotSession"> | string | null
    mode?: StringFilter<"PilotSession"> | string
    surface?: StringFilter<"PilotSession"> | string
    createdBy?: StringFilter<"PilotSession"> | string
    startedAt?: DateTimeFilter<"PilotSession"> | Date | string
    endedAt?: DateTimeNullableFilter<"PilotSession"> | Date | string | null
    actions?: PilotActionListRelationFilter
  }

  export type PilotSessionOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projectKey?: SortOrderInput | SortOrder
    waveLabel?: SortOrderInput | SortOrder
    mode?: SortOrder
    surface?: SortOrder
    createdBy?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    actions?: PilotActionOrderByRelationAggregateInput
  }

  export type PilotSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PilotSessionWhereInput | PilotSessionWhereInput[]
    OR?: PilotSessionWhereInput[]
    NOT?: PilotSessionWhereInput | PilotSessionWhereInput[]
    createdAt?: DateTimeFilter<"PilotSession"> | Date | string
    updatedAt?: DateTimeFilter<"PilotSession"> | Date | string
    projectKey?: StringNullableFilter<"PilotSession"> | string | null
    waveLabel?: StringNullableFilter<"PilotSession"> | string | null
    mode?: StringFilter<"PilotSession"> | string
    surface?: StringFilter<"PilotSession"> | string
    createdBy?: StringFilter<"PilotSession"> | string
    startedAt?: DateTimeFilter<"PilotSession"> | Date | string
    endedAt?: DateTimeNullableFilter<"PilotSession"> | Date | string | null
    actions?: PilotActionListRelationFilter
  }, "id">

  export type PilotSessionOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projectKey?: SortOrderInput | SortOrder
    waveLabel?: SortOrderInput | SortOrder
    mode?: SortOrder
    surface?: SortOrder
    createdBy?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    _count?: PilotSessionCountOrderByAggregateInput
    _avg?: PilotSessionAvgOrderByAggregateInput
    _max?: PilotSessionMaxOrderByAggregateInput
    _min?: PilotSessionMinOrderByAggregateInput
    _sum?: PilotSessionSumOrderByAggregateInput
  }

  export type PilotSessionScalarWhereWithAggregatesInput = {
    AND?: PilotSessionScalarWhereWithAggregatesInput | PilotSessionScalarWhereWithAggregatesInput[]
    OR?: PilotSessionScalarWhereWithAggregatesInput[]
    NOT?: PilotSessionScalarWhereWithAggregatesInput | PilotSessionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PilotSession"> | number
    createdAt?: DateTimeWithAggregatesFilter<"PilotSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PilotSession"> | Date | string
    projectKey?: StringNullableWithAggregatesFilter<"PilotSession"> | string | null
    waveLabel?: StringNullableWithAggregatesFilter<"PilotSession"> | string | null
    mode?: StringWithAggregatesFilter<"PilotSession"> | string
    surface?: StringWithAggregatesFilter<"PilotSession"> | string
    createdBy?: StringWithAggregatesFilter<"PilotSession"> | string
    startedAt?: DateTimeWithAggregatesFilter<"PilotSession"> | Date | string
    endedAt?: DateTimeNullableWithAggregatesFilter<"PilotSession"> | Date | string | null
  }

  export type PilotActionWhereInput = {
    AND?: PilotActionWhereInput | PilotActionWhereInput[]
    OR?: PilotActionWhereInput[]
    NOT?: PilotActionWhereInput | PilotActionWhereInput[]
    id?: IntFilter<"PilotAction"> | number
    createdAt?: DateTimeFilter<"PilotAction"> | Date | string
    updatedAt?: DateTimeFilter<"PilotAction"> | Date | string
    ts?: DateTimeFilter<"PilotAction"> | Date | string
    sessionId?: IntFilter<"PilotAction"> | number
    mode?: StringFilter<"PilotAction"> | string
    targetNodeId?: StringNullableFilter<"PilotAction"> | string | null
    actionType?: StringFilter<"PilotAction"> | string
    payload?: StringNullableFilter<"PilotAction"> | string | null
    reason?: StringFilter<"PilotAction"> | string
    session?: XOR<PilotSessionScalarRelationFilter, PilotSessionWhereInput>
  }

  export type PilotActionOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ts?: SortOrder
    sessionId?: SortOrder
    mode?: SortOrder
    targetNodeId?: SortOrderInput | SortOrder
    actionType?: SortOrder
    payload?: SortOrderInput | SortOrder
    reason?: SortOrder
    session?: PilotSessionOrderByWithRelationInput
  }

  export type PilotActionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PilotActionWhereInput | PilotActionWhereInput[]
    OR?: PilotActionWhereInput[]
    NOT?: PilotActionWhereInput | PilotActionWhereInput[]
    createdAt?: DateTimeFilter<"PilotAction"> | Date | string
    updatedAt?: DateTimeFilter<"PilotAction"> | Date | string
    ts?: DateTimeFilter<"PilotAction"> | Date | string
    sessionId?: IntFilter<"PilotAction"> | number
    mode?: StringFilter<"PilotAction"> | string
    targetNodeId?: StringNullableFilter<"PilotAction"> | string | null
    actionType?: StringFilter<"PilotAction"> | string
    payload?: StringNullableFilter<"PilotAction"> | string | null
    reason?: StringFilter<"PilotAction"> | string
    session?: XOR<PilotSessionScalarRelationFilter, PilotSessionWhereInput>
  }, "id">

  export type PilotActionOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ts?: SortOrder
    sessionId?: SortOrder
    mode?: SortOrder
    targetNodeId?: SortOrderInput | SortOrder
    actionType?: SortOrder
    payload?: SortOrderInput | SortOrder
    reason?: SortOrder
    _count?: PilotActionCountOrderByAggregateInput
    _avg?: PilotActionAvgOrderByAggregateInput
    _max?: PilotActionMaxOrderByAggregateInput
    _min?: PilotActionMinOrderByAggregateInput
    _sum?: PilotActionSumOrderByAggregateInput
  }

  export type PilotActionScalarWhereWithAggregatesInput = {
    AND?: PilotActionScalarWhereWithAggregatesInput | PilotActionScalarWhereWithAggregatesInput[]
    OR?: PilotActionScalarWhereWithAggregatesInput[]
    NOT?: PilotActionScalarWhereWithAggregatesInput | PilotActionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PilotAction"> | number
    createdAt?: DateTimeWithAggregatesFilter<"PilotAction"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PilotAction"> | Date | string
    ts?: DateTimeWithAggregatesFilter<"PilotAction"> | Date | string
    sessionId?: IntWithAggregatesFilter<"PilotAction"> | number
    mode?: StringWithAggregatesFilter<"PilotAction"> | string
    targetNodeId?: StringNullableWithAggregatesFilter<"PilotAction"> | string | null
    actionType?: StringWithAggregatesFilter<"PilotAction"> | string
    payload?: StringNullableWithAggregatesFilter<"PilotAction"> | string | null
    reason?: StringWithAggregatesFilter<"PilotAction"> | string
  }

  export type PilotRunWhereInput = {
    AND?: PilotRunWhereInput | PilotRunWhereInput[]
    OR?: PilotRunWhereInput[]
    NOT?: PilotRunWhereInput | PilotRunWhereInput[]
    id?: IntFilter<"PilotRun"> | number
    kind?: StringFilter<"PilotRun"> | string
    status?: StringFilter<"PilotRun"> | string
    startedAt?: DateTimeFilter<"PilotRun"> | Date | string
    finishedAt?: DateTimeNullableFilter<"PilotRun"> | Date | string | null
    summary?: StringNullableFilter<"PilotRun"> | string | null
    artifactDir?: StringNullableFilter<"PilotRun"> | string | null
    stdoutPath?: StringNullableFilter<"PilotRun"> | string | null
    stderrPath?: StringNullableFilter<"PilotRun"> | string | null
    createdAt?: DateTimeFilter<"PilotRun"> | Date | string
    updatedAt?: DateTimeFilter<"PilotRun"> | Date | string
  }

  export type PilotRunOrderByWithRelationInput = {
    id?: SortOrder
    kind?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    artifactDir?: SortOrderInput | SortOrder
    stdoutPath?: SortOrderInput | SortOrder
    stderrPath?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PilotRunWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PilotRunWhereInput | PilotRunWhereInput[]
    OR?: PilotRunWhereInput[]
    NOT?: PilotRunWhereInput | PilotRunWhereInput[]
    kind?: StringFilter<"PilotRun"> | string
    status?: StringFilter<"PilotRun"> | string
    startedAt?: DateTimeFilter<"PilotRun"> | Date | string
    finishedAt?: DateTimeNullableFilter<"PilotRun"> | Date | string | null
    summary?: StringNullableFilter<"PilotRun"> | string | null
    artifactDir?: StringNullableFilter<"PilotRun"> | string | null
    stdoutPath?: StringNullableFilter<"PilotRun"> | string | null
    stderrPath?: StringNullableFilter<"PilotRun"> | string | null
    createdAt?: DateTimeFilter<"PilotRun"> | Date | string
    updatedAt?: DateTimeFilter<"PilotRun"> | Date | string
  }, "id">

  export type PilotRunOrderByWithAggregationInput = {
    id?: SortOrder
    kind?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    artifactDir?: SortOrderInput | SortOrder
    stdoutPath?: SortOrderInput | SortOrder
    stderrPath?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PilotRunCountOrderByAggregateInput
    _avg?: PilotRunAvgOrderByAggregateInput
    _max?: PilotRunMaxOrderByAggregateInput
    _min?: PilotRunMinOrderByAggregateInput
    _sum?: PilotRunSumOrderByAggregateInput
  }

  export type PilotRunScalarWhereWithAggregatesInput = {
    AND?: PilotRunScalarWhereWithAggregatesInput | PilotRunScalarWhereWithAggregatesInput[]
    OR?: PilotRunScalarWhereWithAggregatesInput[]
    NOT?: PilotRunScalarWhereWithAggregatesInput | PilotRunScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PilotRun"> | number
    kind?: StringWithAggregatesFilter<"PilotRun"> | string
    status?: StringWithAggregatesFilter<"PilotRun"> | string
    startedAt?: DateTimeWithAggregatesFilter<"PilotRun"> | Date | string
    finishedAt?: DateTimeNullableWithAggregatesFilter<"PilotRun"> | Date | string | null
    summary?: StringNullableWithAggregatesFilter<"PilotRun"> | string | null
    artifactDir?: StringNullableWithAggregatesFilter<"PilotRun"> | string | null
    stdoutPath?: StringNullableWithAggregatesFilter<"PilotRun"> | string | null
    stderrPath?: StringNullableWithAggregatesFilter<"PilotRun"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PilotRun"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PilotRun"> | Date | string
  }

  export type JaiToolWhereInput = {
    AND?: JaiToolWhereInput | JaiToolWhereInput[]
    OR?: JaiToolWhereInput[]
    NOT?: JaiToolWhereInput | JaiToolWhereInput[]
    id?: IntFilter<"JaiTool"> | number
    createdAt?: DateTimeFilter<"JaiTool"> | Date | string
    updatedAt?: DateTimeFilter<"JaiTool"> | Date | string
    name?: StringFilter<"JaiTool"> | string
    version?: StringNullableFilter<"JaiTool"> | string | null
    description?: StringNullableFilter<"JaiTool"> | string | null
    scope?: StringNullableFilter<"JaiTool"> | string | null
    status?: StringNullableFilter<"JaiTool"> | string | null
    inputSchema?: JsonNullableFilter<"JaiTool">
    outputSchema?: JsonNullableFilter<"JaiTool">
  }

  export type JaiToolOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    version?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    inputSchema?: SortOrderInput | SortOrder
    outputSchema?: SortOrderInput | SortOrder
  }

  export type JaiToolWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: JaiToolWhereInput | JaiToolWhereInput[]
    OR?: JaiToolWhereInput[]
    NOT?: JaiToolWhereInput | JaiToolWhereInput[]
    createdAt?: DateTimeFilter<"JaiTool"> | Date | string
    updatedAt?: DateTimeFilter<"JaiTool"> | Date | string
    name?: StringFilter<"JaiTool"> | string
    version?: StringNullableFilter<"JaiTool"> | string | null
    description?: StringNullableFilter<"JaiTool"> | string | null
    scope?: StringNullableFilter<"JaiTool"> | string | null
    status?: StringNullableFilter<"JaiTool"> | string | null
    inputSchema?: JsonNullableFilter<"JaiTool">
    outputSchema?: JsonNullableFilter<"JaiTool">
  }, "id">

  export type JaiToolOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    version?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    inputSchema?: SortOrderInput | SortOrder
    outputSchema?: SortOrderInput | SortOrder
    _count?: JaiToolCountOrderByAggregateInput
    _avg?: JaiToolAvgOrderByAggregateInput
    _max?: JaiToolMaxOrderByAggregateInput
    _min?: JaiToolMinOrderByAggregateInput
    _sum?: JaiToolSumOrderByAggregateInput
  }

  export type JaiToolScalarWhereWithAggregatesInput = {
    AND?: JaiToolScalarWhereWithAggregatesInput | JaiToolScalarWhereWithAggregatesInput[]
    OR?: JaiToolScalarWhereWithAggregatesInput[]
    NOT?: JaiToolScalarWhereWithAggregatesInput | JaiToolScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"JaiTool"> | number
    createdAt?: DateTimeWithAggregatesFilter<"JaiTool"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"JaiTool"> | Date | string
    name?: StringWithAggregatesFilter<"JaiTool"> | string
    version?: StringNullableWithAggregatesFilter<"JaiTool"> | string | null
    description?: StringNullableWithAggregatesFilter<"JaiTool"> | string | null
    scope?: StringNullableWithAggregatesFilter<"JaiTool"> | string | null
    status?: StringNullableWithAggregatesFilter<"JaiTool"> | string | null
    inputSchema?: JsonNullableWithAggregatesFilter<"JaiTool">
    outputSchema?: JsonNullableWithAggregatesFilter<"JaiTool">
  }

  export type SotEventWhereInput = {
    AND?: SotEventWhereInput | SotEventWhereInput[]
    OR?: SotEventWhereInput[]
    NOT?: SotEventWhereInput | SotEventWhereInput[]
    id?: IntFilter<"SotEvent"> | number
    createdAt?: DateTimeFilter<"SotEvent"> | Date | string
    updatedAt?: DateTimeFilter<"SotEvent"> | Date | string
    ts?: DateTimeFilter<"SotEvent"> | Date | string
    source?: StringFilter<"SotEvent"> | string
    kind?: StringFilter<"SotEvent"> | string
    nhId?: StringFilter<"SotEvent"> | string
    summary?: StringNullableFilter<"SotEvent"> | string | null
    payload?: JsonNullableFilter<"SotEvent">
    repoId?: IntNullableFilter<"SotEvent"> | number | null
    domainId?: IntNullableFilter<"SotEvent"> | number | null
    domain?: XOR<DomainNullableScalarRelationFilter, DomainWhereInput> | null
    repo?: XOR<RepoNullableScalarRelationFilter, RepoWhereInput> | null
  }

  export type SotEventOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ts?: SortOrder
    source?: SortOrder
    kind?: SortOrder
    nhId?: SortOrder
    summary?: SortOrderInput | SortOrder
    payload?: SortOrderInput | SortOrder
    repoId?: SortOrderInput | SortOrder
    domainId?: SortOrderInput | SortOrder
    domain?: DomainOrderByWithRelationInput
    repo?: RepoOrderByWithRelationInput
  }

  export type SotEventWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: SotEventWhereInput | SotEventWhereInput[]
    OR?: SotEventWhereInput[]
    NOT?: SotEventWhereInput | SotEventWhereInput[]
    createdAt?: DateTimeFilter<"SotEvent"> | Date | string
    updatedAt?: DateTimeFilter<"SotEvent"> | Date | string
    ts?: DateTimeFilter<"SotEvent"> | Date | string
    source?: StringFilter<"SotEvent"> | string
    kind?: StringFilter<"SotEvent"> | string
    nhId?: StringFilter<"SotEvent"> | string
    summary?: StringNullableFilter<"SotEvent"> | string | null
    payload?: JsonNullableFilter<"SotEvent">
    repoId?: IntNullableFilter<"SotEvent"> | number | null
    domainId?: IntNullableFilter<"SotEvent"> | number | null
    domain?: XOR<DomainNullableScalarRelationFilter, DomainWhereInput> | null
    repo?: XOR<RepoNullableScalarRelationFilter, RepoWhereInput> | null
  }, "id">

  export type SotEventOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ts?: SortOrder
    source?: SortOrder
    kind?: SortOrder
    nhId?: SortOrder
    summary?: SortOrderInput | SortOrder
    payload?: SortOrderInput | SortOrder
    repoId?: SortOrderInput | SortOrder
    domainId?: SortOrderInput | SortOrder
    _count?: SotEventCountOrderByAggregateInput
    _avg?: SotEventAvgOrderByAggregateInput
    _max?: SotEventMaxOrderByAggregateInput
    _min?: SotEventMinOrderByAggregateInput
    _sum?: SotEventSumOrderByAggregateInput
  }

  export type SotEventScalarWhereWithAggregatesInput = {
    AND?: SotEventScalarWhereWithAggregatesInput | SotEventScalarWhereWithAggregatesInput[]
    OR?: SotEventScalarWhereWithAggregatesInput[]
    NOT?: SotEventScalarWhereWithAggregatesInput | SotEventScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SotEvent"> | number
    createdAt?: DateTimeWithAggregatesFilter<"SotEvent"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SotEvent"> | Date | string
    ts?: DateTimeWithAggregatesFilter<"SotEvent"> | Date | string
    source?: StringWithAggregatesFilter<"SotEvent"> | string
    kind?: StringWithAggregatesFilter<"SotEvent"> | string
    nhId?: StringWithAggregatesFilter<"SotEvent"> | string
    summary?: StringNullableWithAggregatesFilter<"SotEvent"> | string | null
    payload?: JsonNullableWithAggregatesFilter<"SotEvent">
    repoId?: IntNullableWithAggregatesFilter<"SotEvent"> | number | null
    domainId?: IntNullableWithAggregatesFilter<"SotEvent"> | number | null
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    name?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    passwordHash?: StringNullableFilter<"User"> | string | null
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    role?: SortOrder
    passwordHash?: SortOrderInput | SortOrder
    accounts?: AccountOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    name?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    passwordHash?: StringNullableFilter<"User"> | string | null
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    role?: SortOrder
    passwordHash?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    passwordHash?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_providerAccountId?: AccountProviderProviderAccountIdCompoundUniqueInput
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "provider_providerAccountId">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    _count?: AccountCountOrderByAggregateInput
    _avg?: AccountAvgOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
    _sum?: AccountSumOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    type?: StringWithAggregatesFilter<"Account"> | string
    provider?: StringWithAggregatesFilter<"Account"> | string
    providerAccountId?: StringWithAggregatesFilter<"Account"> | string
    refresh_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    access_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    expires_at?: IntNullableWithAggregatesFilter<"Account"> | number | null
    token_type?: StringNullableWithAggregatesFilter<"Account"> | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    id_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    session_state?: StringNullableWithAggregatesFilter<"Account"> | string | null
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionToken?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "sessionToken">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    sessionToken?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    expires?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type VerificationTokenWhereInput = {
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    token?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }

  export type VerificationTokenOrderByWithRelationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenWhereUniqueInput = Prisma.AtLeast<{
    token?: string
    identifier_token?: VerificationTokenIdentifierTokenCompoundUniqueInput
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }, "token" | "identifier_token">

  export type VerificationTokenOrderByWithAggregationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
    _count?: VerificationTokenCountOrderByAggregateInput
    _max?: VerificationTokenMaxOrderByAggregateInput
    _min?: VerificationTokenMinOrderByAggregateInput
  }

  export type VerificationTokenScalarWhereWithAggregatesInput = {
    AND?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    OR?: VerificationTokenScalarWhereWithAggregatesInput[]
    NOT?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    identifier?: StringWithAggregatesFilter<"VerificationToken"> | string
    token?: StringWithAggregatesFilter<"VerificationToken"> | string
    expires?: DateTimeWithAggregatesFilter<"VerificationToken"> | Date | string
  }

  export type RepoCreateInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    nhId?: string
    name: string
    description?: string | null
    domainPod?: string | null
    engineGroup?: string | null
    language?: string | null
    status?: string | null
    owner?: string | null
    defaultBranch?: string | null
    githubUrl?: string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    domains?: DomainCreateNestedManyWithoutRepoInput
    fileIndexes?: FileIndexCreateNestedManyWithoutRepoInput
    sotEvents?: SotEventCreateNestedManyWithoutRepoInput
    syncRuns?: SyncRunCreateNestedManyWithoutRepoInput
  }

  export type RepoUncheckedCreateInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    nhId?: string
    name: string
    description?: string | null
    domainPod?: string | null
    engineGroup?: string | null
    language?: string | null
    status?: string | null
    owner?: string | null
    defaultBranch?: string | null
    githubUrl?: string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    domains?: DomainUncheckedCreateNestedManyWithoutRepoInput
    fileIndexes?: FileIndexUncheckedCreateNestedManyWithoutRepoInput
    sotEvents?: SotEventUncheckedCreateNestedManyWithoutRepoInput
    syncRuns?: SyncRunUncheckedCreateNestedManyWithoutRepoInput
  }

  export type RepoUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    domainPod?: NullableStringFieldUpdateOperationsInput | string | null
    engineGroup?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    defaultBranch?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    domains?: DomainUpdateManyWithoutRepoNestedInput
    fileIndexes?: FileIndexUpdateManyWithoutRepoNestedInput
    sotEvents?: SotEventUpdateManyWithoutRepoNestedInput
    syncRuns?: SyncRunUpdateManyWithoutRepoNestedInput
  }

  export type RepoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    domainPod?: NullableStringFieldUpdateOperationsInput | string | null
    engineGroup?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    defaultBranch?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    domains?: DomainUncheckedUpdateManyWithoutRepoNestedInput
    fileIndexes?: FileIndexUncheckedUpdateManyWithoutRepoNestedInput
    sotEvents?: SotEventUncheckedUpdateManyWithoutRepoNestedInput
    syncRuns?: SyncRunUncheckedUpdateManyWithoutRepoNestedInput
  }

  export type RepoCreateManyInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    nhId?: string
    name: string
    description?: string | null
    domainPod?: string | null
    engineGroup?: string | null
    language?: string | null
    status?: string | null
    owner?: string | null
    defaultBranch?: string | null
    githubUrl?: string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RepoUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    domainPod?: NullableStringFieldUpdateOperationsInput | string | null
    engineGroup?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    defaultBranch?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RepoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    domainPod?: NullableStringFieldUpdateOperationsInput | string | null
    engineGroup?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    defaultBranch?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
  }

  export type DomainCreateInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    nhId?: string
    domain: string
    status?: string | null
    domainKey?: string | null
    engineType?: string | null
    env?: string | null
    expiresAt?: Date | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    repo?: RepoCreateNestedOneWithoutDomainsInput
    sotEvents?: SotEventCreateNestedManyWithoutDomainInput
  }

  export type DomainUncheckedCreateInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    nhId?: string
    domain: string
    status?: string | null
    domainKey?: string | null
    engineType?: string | null
    env?: string | null
    expiresAt?: Date | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    repoId?: number | null
    sotEvents?: SotEventUncheckedCreateNestedManyWithoutDomainInput
  }

  export type DomainUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    domainKey?: NullableStringFieldUpdateOperationsInput | string | null
    engineType?: NullableStringFieldUpdateOperationsInput | string | null
    env?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    repo?: RepoUpdateOneWithoutDomainsNestedInput
    sotEvents?: SotEventUpdateManyWithoutDomainNestedInput
  }

  export type DomainUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    domainKey?: NullableStringFieldUpdateOperationsInput | string | null
    engineType?: NullableStringFieldUpdateOperationsInput | string | null
    env?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    repoId?: NullableIntFieldUpdateOperationsInput | number | null
    sotEvents?: SotEventUncheckedUpdateManyWithoutDomainNestedInput
  }

  export type DomainCreateManyInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    nhId?: string
    domain: string
    status?: string | null
    domainKey?: string | null
    engineType?: string | null
    env?: string | null
    expiresAt?: Date | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    repoId?: number | null
  }

  export type DomainUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    domainKey?: NullableStringFieldUpdateOperationsInput | string | null
    engineType?: NullableStringFieldUpdateOperationsInput | string | null
    env?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
  }

  export type DomainUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    domainKey?: NullableStringFieldUpdateOperationsInput | string | null
    engineType?: NullableStringFieldUpdateOperationsInput | string | null
    env?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    repoId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type SyncRunCreateInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    type: string
    status: string
    trigger?: string | null
    startedAt: Date | string
    finishedAt: Date | string
    workflowRunUrl?: string | null
    summary?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    fileIndexes?: FileIndexCreateNestedManyWithoutSyncRunInput
    repo?: RepoCreateNestedOneWithoutSyncRunsInput
  }

  export type SyncRunUncheckedCreateInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    type: string
    status: string
    trigger?: string | null
    startedAt: Date | string
    finishedAt: Date | string
    workflowRunUrl?: string | null
    summary?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    repoId?: number | null
    fileIndexes?: FileIndexUncheckedCreateNestedManyWithoutSyncRunInput
  }

  export type SyncRunUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    trigger?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflowRunUrl?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    fileIndexes?: FileIndexUpdateManyWithoutSyncRunNestedInput
    repo?: RepoUpdateOneWithoutSyncRunsNestedInput
  }

  export type SyncRunUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    trigger?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflowRunUrl?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    repoId?: NullableIntFieldUpdateOperationsInput | number | null
    fileIndexes?: FileIndexUncheckedUpdateManyWithoutSyncRunNestedInput
  }

  export type SyncRunCreateManyInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    type: string
    status: string
    trigger?: string | null
    startedAt: Date | string
    finishedAt: Date | string
    workflowRunUrl?: string | null
    summary?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    repoId?: number | null
  }

  export type SyncRunUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    trigger?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflowRunUrl?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
  }

  export type SyncRunUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    trigger?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflowRunUrl?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    repoId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type FileIndexCreateInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    path: string
    dir: string
    filename: string
    extension: string
    sizeBytes: number
    sha256: string
    lastCommitSha?: string | null
    indexedAt?: Date | string
    repo: RepoCreateNestedOneWithoutFileIndexesInput
    syncRun?: SyncRunCreateNestedOneWithoutFileIndexesInput
  }

  export type FileIndexUncheckedCreateInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    repoId: number
    syncRunId?: number | null
    path: string
    dir: string
    filename: string
    extension: string
    sizeBytes: number
    sha256: string
    lastCommitSha?: string | null
    indexedAt?: Date | string
  }

  export type FileIndexUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    path?: StringFieldUpdateOperationsInput | string
    dir?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    extension?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    sha256?: StringFieldUpdateOperationsInput | string
    lastCommitSha?: NullableStringFieldUpdateOperationsInput | string | null
    indexedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repo?: RepoUpdateOneRequiredWithoutFileIndexesNestedInput
    syncRun?: SyncRunUpdateOneWithoutFileIndexesNestedInput
  }

  export type FileIndexUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repoId?: IntFieldUpdateOperationsInput | number
    syncRunId?: NullableIntFieldUpdateOperationsInput | number | null
    path?: StringFieldUpdateOperationsInput | string
    dir?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    extension?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    sha256?: StringFieldUpdateOperationsInput | string
    lastCommitSha?: NullableStringFieldUpdateOperationsInput | string | null
    indexedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileIndexCreateManyInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    repoId: number
    syncRunId?: number | null
    path: string
    dir: string
    filename: string
    extension: string
    sizeBytes: number
    sha256: string
    lastCommitSha?: string | null
    indexedAt?: Date | string
  }

  export type FileIndexUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    path?: StringFieldUpdateOperationsInput | string
    dir?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    extension?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    sha256?: StringFieldUpdateOperationsInput | string
    lastCommitSha?: NullableStringFieldUpdateOperationsInput | string | null
    indexedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileIndexUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repoId?: IntFieldUpdateOperationsInput | number
    syncRunId?: NullableIntFieldUpdateOperationsInput | number | null
    path?: StringFieldUpdateOperationsInput | string
    dir?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    extension?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    sha256?: StringFieldUpdateOperationsInput | string
    lastCommitSha?: NullableStringFieldUpdateOperationsInput | string | null
    indexedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PilotSessionCreateInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    projectKey?: string | null
    waveLabel?: string | null
    mode: string
    surface: string
    createdBy: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    actions?: PilotActionCreateNestedManyWithoutSessionInput
  }

  export type PilotSessionUncheckedCreateInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    projectKey?: string | null
    waveLabel?: string | null
    mode: string
    surface: string
    createdBy: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    actions?: PilotActionUncheckedCreateNestedManyWithoutSessionInput
  }

  export type PilotSessionUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectKey?: NullableStringFieldUpdateOperationsInput | string | null
    waveLabel?: NullableStringFieldUpdateOperationsInput | string | null
    mode?: StringFieldUpdateOperationsInput | string
    surface?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actions?: PilotActionUpdateManyWithoutSessionNestedInput
  }

  export type PilotSessionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectKey?: NullableStringFieldUpdateOperationsInput | string | null
    waveLabel?: NullableStringFieldUpdateOperationsInput | string | null
    mode?: StringFieldUpdateOperationsInput | string
    surface?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actions?: PilotActionUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type PilotSessionCreateManyInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    projectKey?: string | null
    waveLabel?: string | null
    mode: string
    surface: string
    createdBy: string
    startedAt?: Date | string
    endedAt?: Date | string | null
  }

  export type PilotSessionUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectKey?: NullableStringFieldUpdateOperationsInput | string | null
    waveLabel?: NullableStringFieldUpdateOperationsInput | string | null
    mode?: StringFieldUpdateOperationsInput | string
    surface?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PilotSessionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectKey?: NullableStringFieldUpdateOperationsInput | string | null
    waveLabel?: NullableStringFieldUpdateOperationsInput | string | null
    mode?: StringFieldUpdateOperationsInput | string
    surface?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PilotActionCreateInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    ts?: Date | string
    mode: string
    targetNodeId?: string | null
    actionType: string
    payload?: string | null
    reason: string
    session: PilotSessionCreateNestedOneWithoutActionsInput
  }

  export type PilotActionUncheckedCreateInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ts?: Date | string
    sessionId: number
    mode: string
    targetNodeId?: string | null
    actionType: string
    payload?: string | null
    reason: string
  }

  export type PilotActionUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ts?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: StringFieldUpdateOperationsInput | string
    targetNodeId?: NullableStringFieldUpdateOperationsInput | string | null
    actionType?: StringFieldUpdateOperationsInput | string
    payload?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
    session?: PilotSessionUpdateOneRequiredWithoutActionsNestedInput
  }

  export type PilotActionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ts?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionId?: IntFieldUpdateOperationsInput | number
    mode?: StringFieldUpdateOperationsInput | string
    targetNodeId?: NullableStringFieldUpdateOperationsInput | string | null
    actionType?: StringFieldUpdateOperationsInput | string
    payload?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
  }

  export type PilotActionCreateManyInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ts?: Date | string
    sessionId: number
    mode: string
    targetNodeId?: string | null
    actionType: string
    payload?: string | null
    reason: string
  }

  export type PilotActionUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ts?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: StringFieldUpdateOperationsInput | string
    targetNodeId?: NullableStringFieldUpdateOperationsInput | string | null
    actionType?: StringFieldUpdateOperationsInput | string
    payload?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
  }

  export type PilotActionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ts?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionId?: IntFieldUpdateOperationsInput | number
    mode?: StringFieldUpdateOperationsInput | string
    targetNodeId?: NullableStringFieldUpdateOperationsInput | string | null
    actionType?: StringFieldUpdateOperationsInput | string
    payload?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
  }

  export type PilotRunCreateInput = {
    kind: string
    status: string
    startedAt?: Date | string
    finishedAt?: Date | string | null
    summary?: string | null
    artifactDir?: string | null
    stdoutPath?: string | null
    stderrPath?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PilotRunUncheckedCreateInput = {
    id?: number
    kind: string
    status: string
    startedAt?: Date | string
    finishedAt?: Date | string | null
    summary?: string | null
    artifactDir?: string | null
    stdoutPath?: string | null
    stderrPath?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PilotRunUpdateInput = {
    kind?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    artifactDir?: NullableStringFieldUpdateOperationsInput | string | null
    stdoutPath?: NullableStringFieldUpdateOperationsInput | string | null
    stderrPath?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PilotRunUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    kind?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    artifactDir?: NullableStringFieldUpdateOperationsInput | string | null
    stdoutPath?: NullableStringFieldUpdateOperationsInput | string | null
    stderrPath?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PilotRunCreateManyInput = {
    id?: number
    kind: string
    status: string
    startedAt?: Date | string
    finishedAt?: Date | string | null
    summary?: string | null
    artifactDir?: string | null
    stdoutPath?: string | null
    stderrPath?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PilotRunUpdateManyMutationInput = {
    kind?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    artifactDir?: NullableStringFieldUpdateOperationsInput | string | null
    stdoutPath?: NullableStringFieldUpdateOperationsInput | string | null
    stderrPath?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PilotRunUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    kind?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    artifactDir?: NullableStringFieldUpdateOperationsInput | string | null
    stdoutPath?: NullableStringFieldUpdateOperationsInput | string | null
    stderrPath?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JaiToolCreateInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    version?: string | null
    description?: string | null
    scope?: string | null
    status?: string | null
    inputSchema?: NullableJsonNullValueInput | InputJsonValue
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
  }

  export type JaiToolUncheckedCreateInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    version?: string | null
    description?: string | null
    scope?: string | null
    status?: string | null
    inputSchema?: NullableJsonNullValueInput | InputJsonValue
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
  }

  export type JaiToolUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    version?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    inputSchema?: NullableJsonNullValueInput | InputJsonValue
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
  }

  export type JaiToolUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    version?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    inputSchema?: NullableJsonNullValueInput | InputJsonValue
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
  }

  export type JaiToolCreateManyInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    version?: string | null
    description?: string | null
    scope?: string | null
    status?: string | null
    inputSchema?: NullableJsonNullValueInput | InputJsonValue
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
  }

  export type JaiToolUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    version?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    inputSchema?: NullableJsonNullValueInput | InputJsonValue
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
  }

  export type JaiToolUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    version?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    inputSchema?: NullableJsonNullValueInput | InputJsonValue
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
  }

  export type SotEventCreateInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    ts: Date | string
    source: string
    kind: string
    nhId?: string
    summary?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    domain?: DomainCreateNestedOneWithoutSotEventsInput
    repo?: RepoCreateNestedOneWithoutSotEventsInput
  }

  export type SotEventUncheckedCreateInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ts: Date | string
    source: string
    kind: string
    nhId?: string
    summary?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    repoId?: number | null
    domainId?: number | null
  }

  export type SotEventUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ts?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    nhId?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    domain?: DomainUpdateOneWithoutSotEventsNestedInput
    repo?: RepoUpdateOneWithoutSotEventsNestedInput
  }

  export type SotEventUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ts?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    nhId?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    repoId?: NullableIntFieldUpdateOperationsInput | number | null
    domainId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type SotEventCreateManyInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ts: Date | string
    source: string
    kind: string
    nhId?: string
    summary?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    repoId?: number | null
    domainId?: number | null
  }

  export type SotEventUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ts?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    nhId?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
  }

  export type SotEventUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ts?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    nhId?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    repoId?: NullableIntFieldUpdateOperationsInput | number | null
    domainId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type UserCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    role?: $Enums.Role
    passwordHash?: string | null
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    role?: $Enums.Role
    passwordHash?: string | null
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    role?: $Enums.Role
    passwordHash?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountCreateInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountCreateManyInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionCreateInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUncheckedCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateManyInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateManyMutationInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateManyInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DomainListRelationFilter = {
    every?: DomainWhereInput
    some?: DomainWhereInput
    none?: DomainWhereInput
  }

  export type FileIndexListRelationFilter = {
    every?: FileIndexWhereInput
    some?: FileIndexWhereInput
    none?: FileIndexWhereInput
  }

  export type SotEventListRelationFilter = {
    every?: SotEventWhereInput
    some?: SotEventWhereInput
    none?: SotEventWhereInput
  }

  export type SyncRunListRelationFilter = {
    every?: SyncRunWhereInput
    some?: SyncRunWhereInput
    none?: SyncRunWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DomainOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FileIndexOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SotEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SyncRunOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RepoCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    nhId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    domainPod?: SortOrder
    engineGroup?: SortOrder
    language?: SortOrder
    status?: SortOrder
    owner?: SortOrder
    defaultBranch?: SortOrder
    githubUrl?: SortOrder
    notes?: SortOrder
  }

  export type RepoAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type RepoMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    nhId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    domainPod?: SortOrder
    engineGroup?: SortOrder
    language?: SortOrder
    status?: SortOrder
    owner?: SortOrder
    defaultBranch?: SortOrder
    githubUrl?: SortOrder
  }

  export type RepoMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    nhId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    domainPod?: SortOrder
    engineGroup?: SortOrder
    language?: SortOrder
    status?: SortOrder
    owner?: SortOrder
    defaultBranch?: SortOrder
    githubUrl?: SortOrder
  }

  export type RepoSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type RepoNullableScalarRelationFilter = {
    is?: RepoWhereInput | null
    isNot?: RepoWhereInput | null
  }

  export type DomainCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    nhId?: SortOrder
    domain?: SortOrder
    status?: SortOrder
    domainKey?: SortOrder
    engineType?: SortOrder
    env?: SortOrder
    expiresAt?: SortOrder
    notes?: SortOrder
    repoId?: SortOrder
  }

  export type DomainAvgOrderByAggregateInput = {
    id?: SortOrder
    repoId?: SortOrder
  }

  export type DomainMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    nhId?: SortOrder
    domain?: SortOrder
    status?: SortOrder
    domainKey?: SortOrder
    engineType?: SortOrder
    env?: SortOrder
    expiresAt?: SortOrder
    repoId?: SortOrder
  }

  export type DomainMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    nhId?: SortOrder
    domain?: SortOrder
    status?: SortOrder
    domainKey?: SortOrder
    engineType?: SortOrder
    env?: SortOrder
    expiresAt?: SortOrder
    repoId?: SortOrder
  }

  export type DomainSumOrderByAggregateInput = {
    id?: SortOrder
    repoId?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type SyncRunCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    type?: SortOrder
    status?: SortOrder
    trigger?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
    workflowRunUrl?: SortOrder
    summary?: SortOrder
    payload?: SortOrder
    repoId?: SortOrder
  }

  export type SyncRunAvgOrderByAggregateInput = {
    id?: SortOrder
    repoId?: SortOrder
  }

  export type SyncRunMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    type?: SortOrder
    status?: SortOrder
    trigger?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
    workflowRunUrl?: SortOrder
    summary?: SortOrder
    repoId?: SortOrder
  }

  export type SyncRunMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    type?: SortOrder
    status?: SortOrder
    trigger?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
    workflowRunUrl?: SortOrder
    summary?: SortOrder
    repoId?: SortOrder
  }

  export type SyncRunSumOrderByAggregateInput = {
    id?: SortOrder
    repoId?: SortOrder
  }

  export type RepoScalarRelationFilter = {
    is?: RepoWhereInput
    isNot?: RepoWhereInput
  }

  export type SyncRunNullableScalarRelationFilter = {
    is?: SyncRunWhereInput | null
    isNot?: SyncRunWhereInput | null
  }

  export type FileIndexRepoIdPathCompoundUniqueInput = {
    repoId: number
    path: string
  }

  export type FileIndexCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    repoId?: SortOrder
    syncRunId?: SortOrder
    path?: SortOrder
    dir?: SortOrder
    filename?: SortOrder
    extension?: SortOrder
    sizeBytes?: SortOrder
    sha256?: SortOrder
    lastCommitSha?: SortOrder
    indexedAt?: SortOrder
  }

  export type FileIndexAvgOrderByAggregateInput = {
    id?: SortOrder
    repoId?: SortOrder
    syncRunId?: SortOrder
    sizeBytes?: SortOrder
  }

  export type FileIndexMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    repoId?: SortOrder
    syncRunId?: SortOrder
    path?: SortOrder
    dir?: SortOrder
    filename?: SortOrder
    extension?: SortOrder
    sizeBytes?: SortOrder
    sha256?: SortOrder
    lastCommitSha?: SortOrder
    indexedAt?: SortOrder
  }

  export type FileIndexMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    repoId?: SortOrder
    syncRunId?: SortOrder
    path?: SortOrder
    dir?: SortOrder
    filename?: SortOrder
    extension?: SortOrder
    sizeBytes?: SortOrder
    sha256?: SortOrder
    lastCommitSha?: SortOrder
    indexedAt?: SortOrder
  }

  export type FileIndexSumOrderByAggregateInput = {
    id?: SortOrder
    repoId?: SortOrder
    syncRunId?: SortOrder
    sizeBytes?: SortOrder
  }

  export type PilotActionListRelationFilter = {
    every?: PilotActionWhereInput
    some?: PilotActionWhereInput
    none?: PilotActionWhereInput
  }

  export type PilotActionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PilotSessionCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projectKey?: SortOrder
    waveLabel?: SortOrder
    mode?: SortOrder
    surface?: SortOrder
    createdBy?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
  }

  export type PilotSessionAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PilotSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projectKey?: SortOrder
    waveLabel?: SortOrder
    mode?: SortOrder
    surface?: SortOrder
    createdBy?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
  }

  export type PilotSessionMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projectKey?: SortOrder
    waveLabel?: SortOrder
    mode?: SortOrder
    surface?: SortOrder
    createdBy?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
  }

  export type PilotSessionSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PilotSessionScalarRelationFilter = {
    is?: PilotSessionWhereInput
    isNot?: PilotSessionWhereInput
  }

  export type PilotActionCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ts?: SortOrder
    sessionId?: SortOrder
    mode?: SortOrder
    targetNodeId?: SortOrder
    actionType?: SortOrder
    payload?: SortOrder
    reason?: SortOrder
  }

  export type PilotActionAvgOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
  }

  export type PilotActionMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ts?: SortOrder
    sessionId?: SortOrder
    mode?: SortOrder
    targetNodeId?: SortOrder
    actionType?: SortOrder
    payload?: SortOrder
    reason?: SortOrder
  }

  export type PilotActionMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ts?: SortOrder
    sessionId?: SortOrder
    mode?: SortOrder
    targetNodeId?: SortOrder
    actionType?: SortOrder
    payload?: SortOrder
    reason?: SortOrder
  }

  export type PilotActionSumOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
  }

  export type PilotRunCountOrderByAggregateInput = {
    id?: SortOrder
    kind?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
    summary?: SortOrder
    artifactDir?: SortOrder
    stdoutPath?: SortOrder
    stderrPath?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PilotRunAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PilotRunMaxOrderByAggregateInput = {
    id?: SortOrder
    kind?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
    summary?: SortOrder
    artifactDir?: SortOrder
    stdoutPath?: SortOrder
    stderrPath?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PilotRunMinOrderByAggregateInput = {
    id?: SortOrder
    kind?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
    summary?: SortOrder
    artifactDir?: SortOrder
    stdoutPath?: SortOrder
    stderrPath?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PilotRunSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type JaiToolCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    version?: SortOrder
    description?: SortOrder
    scope?: SortOrder
    status?: SortOrder
    inputSchema?: SortOrder
    outputSchema?: SortOrder
  }

  export type JaiToolAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type JaiToolMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    version?: SortOrder
    description?: SortOrder
    scope?: SortOrder
    status?: SortOrder
  }

  export type JaiToolMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    version?: SortOrder
    description?: SortOrder
    scope?: SortOrder
    status?: SortOrder
  }

  export type JaiToolSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DomainNullableScalarRelationFilter = {
    is?: DomainWhereInput | null
    isNot?: DomainWhereInput | null
  }

  export type SotEventCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ts?: SortOrder
    source?: SortOrder
    kind?: SortOrder
    nhId?: SortOrder
    summary?: SortOrder
    payload?: SortOrder
    repoId?: SortOrder
    domainId?: SortOrder
  }

  export type SotEventAvgOrderByAggregateInput = {
    id?: SortOrder
    repoId?: SortOrder
    domainId?: SortOrder
  }

  export type SotEventMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ts?: SortOrder
    source?: SortOrder
    kind?: SortOrder
    nhId?: SortOrder
    summary?: SortOrder
    repoId?: SortOrder
    domainId?: SortOrder
  }

  export type SotEventMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ts?: SortOrder
    source?: SortOrder
    kind?: SortOrder
    nhId?: SortOrder
    summary?: SortOrder
    repoId?: SortOrder
    domainId?: SortOrder
  }

  export type SotEventSumOrderByAggregateInput = {
    id?: SortOrder
    repoId?: SortOrder
    domainId?: SortOrder
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    role?: SortOrder
    passwordHash?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    role?: SortOrder
    passwordHash?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    role?: SortOrder
    passwordHash?: SortOrder
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type AccountProviderProviderAccountIdCompoundUniqueInput = {
    provider: string
    providerAccountId: string
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountAvgOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountSumOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenIdentifierTokenCompoundUniqueInput = {
    identifier: string
    token: string
  }

  export type VerificationTokenCountOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMaxOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMinOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type DomainCreateNestedManyWithoutRepoInput = {
    create?: XOR<DomainCreateWithoutRepoInput, DomainUncheckedCreateWithoutRepoInput> | DomainCreateWithoutRepoInput[] | DomainUncheckedCreateWithoutRepoInput[]
    connectOrCreate?: DomainCreateOrConnectWithoutRepoInput | DomainCreateOrConnectWithoutRepoInput[]
    createMany?: DomainCreateManyRepoInputEnvelope
    connect?: DomainWhereUniqueInput | DomainWhereUniqueInput[]
  }

  export type FileIndexCreateNestedManyWithoutRepoInput = {
    create?: XOR<FileIndexCreateWithoutRepoInput, FileIndexUncheckedCreateWithoutRepoInput> | FileIndexCreateWithoutRepoInput[] | FileIndexUncheckedCreateWithoutRepoInput[]
    connectOrCreate?: FileIndexCreateOrConnectWithoutRepoInput | FileIndexCreateOrConnectWithoutRepoInput[]
    createMany?: FileIndexCreateManyRepoInputEnvelope
    connect?: FileIndexWhereUniqueInput | FileIndexWhereUniqueInput[]
  }

  export type SotEventCreateNestedManyWithoutRepoInput = {
    create?: XOR<SotEventCreateWithoutRepoInput, SotEventUncheckedCreateWithoutRepoInput> | SotEventCreateWithoutRepoInput[] | SotEventUncheckedCreateWithoutRepoInput[]
    connectOrCreate?: SotEventCreateOrConnectWithoutRepoInput | SotEventCreateOrConnectWithoutRepoInput[]
    createMany?: SotEventCreateManyRepoInputEnvelope
    connect?: SotEventWhereUniqueInput | SotEventWhereUniqueInput[]
  }

  export type SyncRunCreateNestedManyWithoutRepoInput = {
    create?: XOR<SyncRunCreateWithoutRepoInput, SyncRunUncheckedCreateWithoutRepoInput> | SyncRunCreateWithoutRepoInput[] | SyncRunUncheckedCreateWithoutRepoInput[]
    connectOrCreate?: SyncRunCreateOrConnectWithoutRepoInput | SyncRunCreateOrConnectWithoutRepoInput[]
    createMany?: SyncRunCreateManyRepoInputEnvelope
    connect?: SyncRunWhereUniqueInput | SyncRunWhereUniqueInput[]
  }

  export type DomainUncheckedCreateNestedManyWithoutRepoInput = {
    create?: XOR<DomainCreateWithoutRepoInput, DomainUncheckedCreateWithoutRepoInput> | DomainCreateWithoutRepoInput[] | DomainUncheckedCreateWithoutRepoInput[]
    connectOrCreate?: DomainCreateOrConnectWithoutRepoInput | DomainCreateOrConnectWithoutRepoInput[]
    createMany?: DomainCreateManyRepoInputEnvelope
    connect?: DomainWhereUniqueInput | DomainWhereUniqueInput[]
  }

  export type FileIndexUncheckedCreateNestedManyWithoutRepoInput = {
    create?: XOR<FileIndexCreateWithoutRepoInput, FileIndexUncheckedCreateWithoutRepoInput> | FileIndexCreateWithoutRepoInput[] | FileIndexUncheckedCreateWithoutRepoInput[]
    connectOrCreate?: FileIndexCreateOrConnectWithoutRepoInput | FileIndexCreateOrConnectWithoutRepoInput[]
    createMany?: FileIndexCreateManyRepoInputEnvelope
    connect?: FileIndexWhereUniqueInput | FileIndexWhereUniqueInput[]
  }

  export type SotEventUncheckedCreateNestedManyWithoutRepoInput = {
    create?: XOR<SotEventCreateWithoutRepoInput, SotEventUncheckedCreateWithoutRepoInput> | SotEventCreateWithoutRepoInput[] | SotEventUncheckedCreateWithoutRepoInput[]
    connectOrCreate?: SotEventCreateOrConnectWithoutRepoInput | SotEventCreateOrConnectWithoutRepoInput[]
    createMany?: SotEventCreateManyRepoInputEnvelope
    connect?: SotEventWhereUniqueInput | SotEventWhereUniqueInput[]
  }

  export type SyncRunUncheckedCreateNestedManyWithoutRepoInput = {
    create?: XOR<SyncRunCreateWithoutRepoInput, SyncRunUncheckedCreateWithoutRepoInput> | SyncRunCreateWithoutRepoInput[] | SyncRunUncheckedCreateWithoutRepoInput[]
    connectOrCreate?: SyncRunCreateOrConnectWithoutRepoInput | SyncRunCreateOrConnectWithoutRepoInput[]
    createMany?: SyncRunCreateManyRepoInputEnvelope
    connect?: SyncRunWhereUniqueInput | SyncRunWhereUniqueInput[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DomainUpdateManyWithoutRepoNestedInput = {
    create?: XOR<DomainCreateWithoutRepoInput, DomainUncheckedCreateWithoutRepoInput> | DomainCreateWithoutRepoInput[] | DomainUncheckedCreateWithoutRepoInput[]
    connectOrCreate?: DomainCreateOrConnectWithoutRepoInput | DomainCreateOrConnectWithoutRepoInput[]
    upsert?: DomainUpsertWithWhereUniqueWithoutRepoInput | DomainUpsertWithWhereUniqueWithoutRepoInput[]
    createMany?: DomainCreateManyRepoInputEnvelope
    set?: DomainWhereUniqueInput | DomainWhereUniqueInput[]
    disconnect?: DomainWhereUniqueInput | DomainWhereUniqueInput[]
    delete?: DomainWhereUniqueInput | DomainWhereUniqueInput[]
    connect?: DomainWhereUniqueInput | DomainWhereUniqueInput[]
    update?: DomainUpdateWithWhereUniqueWithoutRepoInput | DomainUpdateWithWhereUniqueWithoutRepoInput[]
    updateMany?: DomainUpdateManyWithWhereWithoutRepoInput | DomainUpdateManyWithWhereWithoutRepoInput[]
    deleteMany?: DomainScalarWhereInput | DomainScalarWhereInput[]
  }

  export type FileIndexUpdateManyWithoutRepoNestedInput = {
    create?: XOR<FileIndexCreateWithoutRepoInput, FileIndexUncheckedCreateWithoutRepoInput> | FileIndexCreateWithoutRepoInput[] | FileIndexUncheckedCreateWithoutRepoInput[]
    connectOrCreate?: FileIndexCreateOrConnectWithoutRepoInput | FileIndexCreateOrConnectWithoutRepoInput[]
    upsert?: FileIndexUpsertWithWhereUniqueWithoutRepoInput | FileIndexUpsertWithWhereUniqueWithoutRepoInput[]
    createMany?: FileIndexCreateManyRepoInputEnvelope
    set?: FileIndexWhereUniqueInput | FileIndexWhereUniqueInput[]
    disconnect?: FileIndexWhereUniqueInput | FileIndexWhereUniqueInput[]
    delete?: FileIndexWhereUniqueInput | FileIndexWhereUniqueInput[]
    connect?: FileIndexWhereUniqueInput | FileIndexWhereUniqueInput[]
    update?: FileIndexUpdateWithWhereUniqueWithoutRepoInput | FileIndexUpdateWithWhereUniqueWithoutRepoInput[]
    updateMany?: FileIndexUpdateManyWithWhereWithoutRepoInput | FileIndexUpdateManyWithWhereWithoutRepoInput[]
    deleteMany?: FileIndexScalarWhereInput | FileIndexScalarWhereInput[]
  }

  export type SotEventUpdateManyWithoutRepoNestedInput = {
    create?: XOR<SotEventCreateWithoutRepoInput, SotEventUncheckedCreateWithoutRepoInput> | SotEventCreateWithoutRepoInput[] | SotEventUncheckedCreateWithoutRepoInput[]
    connectOrCreate?: SotEventCreateOrConnectWithoutRepoInput | SotEventCreateOrConnectWithoutRepoInput[]
    upsert?: SotEventUpsertWithWhereUniqueWithoutRepoInput | SotEventUpsertWithWhereUniqueWithoutRepoInput[]
    createMany?: SotEventCreateManyRepoInputEnvelope
    set?: SotEventWhereUniqueInput | SotEventWhereUniqueInput[]
    disconnect?: SotEventWhereUniqueInput | SotEventWhereUniqueInput[]
    delete?: SotEventWhereUniqueInput | SotEventWhereUniqueInput[]
    connect?: SotEventWhereUniqueInput | SotEventWhereUniqueInput[]
    update?: SotEventUpdateWithWhereUniqueWithoutRepoInput | SotEventUpdateWithWhereUniqueWithoutRepoInput[]
    updateMany?: SotEventUpdateManyWithWhereWithoutRepoInput | SotEventUpdateManyWithWhereWithoutRepoInput[]
    deleteMany?: SotEventScalarWhereInput | SotEventScalarWhereInput[]
  }

  export type SyncRunUpdateManyWithoutRepoNestedInput = {
    create?: XOR<SyncRunCreateWithoutRepoInput, SyncRunUncheckedCreateWithoutRepoInput> | SyncRunCreateWithoutRepoInput[] | SyncRunUncheckedCreateWithoutRepoInput[]
    connectOrCreate?: SyncRunCreateOrConnectWithoutRepoInput | SyncRunCreateOrConnectWithoutRepoInput[]
    upsert?: SyncRunUpsertWithWhereUniqueWithoutRepoInput | SyncRunUpsertWithWhereUniqueWithoutRepoInput[]
    createMany?: SyncRunCreateManyRepoInputEnvelope
    set?: SyncRunWhereUniqueInput | SyncRunWhereUniqueInput[]
    disconnect?: SyncRunWhereUniqueInput | SyncRunWhereUniqueInput[]
    delete?: SyncRunWhereUniqueInput | SyncRunWhereUniqueInput[]
    connect?: SyncRunWhereUniqueInput | SyncRunWhereUniqueInput[]
    update?: SyncRunUpdateWithWhereUniqueWithoutRepoInput | SyncRunUpdateWithWhereUniqueWithoutRepoInput[]
    updateMany?: SyncRunUpdateManyWithWhereWithoutRepoInput | SyncRunUpdateManyWithWhereWithoutRepoInput[]
    deleteMany?: SyncRunScalarWhereInput | SyncRunScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DomainUncheckedUpdateManyWithoutRepoNestedInput = {
    create?: XOR<DomainCreateWithoutRepoInput, DomainUncheckedCreateWithoutRepoInput> | DomainCreateWithoutRepoInput[] | DomainUncheckedCreateWithoutRepoInput[]
    connectOrCreate?: DomainCreateOrConnectWithoutRepoInput | DomainCreateOrConnectWithoutRepoInput[]
    upsert?: DomainUpsertWithWhereUniqueWithoutRepoInput | DomainUpsertWithWhereUniqueWithoutRepoInput[]
    createMany?: DomainCreateManyRepoInputEnvelope
    set?: DomainWhereUniqueInput | DomainWhereUniqueInput[]
    disconnect?: DomainWhereUniqueInput | DomainWhereUniqueInput[]
    delete?: DomainWhereUniqueInput | DomainWhereUniqueInput[]
    connect?: DomainWhereUniqueInput | DomainWhereUniqueInput[]
    update?: DomainUpdateWithWhereUniqueWithoutRepoInput | DomainUpdateWithWhereUniqueWithoutRepoInput[]
    updateMany?: DomainUpdateManyWithWhereWithoutRepoInput | DomainUpdateManyWithWhereWithoutRepoInput[]
    deleteMany?: DomainScalarWhereInput | DomainScalarWhereInput[]
  }

  export type FileIndexUncheckedUpdateManyWithoutRepoNestedInput = {
    create?: XOR<FileIndexCreateWithoutRepoInput, FileIndexUncheckedCreateWithoutRepoInput> | FileIndexCreateWithoutRepoInput[] | FileIndexUncheckedCreateWithoutRepoInput[]
    connectOrCreate?: FileIndexCreateOrConnectWithoutRepoInput | FileIndexCreateOrConnectWithoutRepoInput[]
    upsert?: FileIndexUpsertWithWhereUniqueWithoutRepoInput | FileIndexUpsertWithWhereUniqueWithoutRepoInput[]
    createMany?: FileIndexCreateManyRepoInputEnvelope
    set?: FileIndexWhereUniqueInput | FileIndexWhereUniqueInput[]
    disconnect?: FileIndexWhereUniqueInput | FileIndexWhereUniqueInput[]
    delete?: FileIndexWhereUniqueInput | FileIndexWhereUniqueInput[]
    connect?: FileIndexWhereUniqueInput | FileIndexWhereUniqueInput[]
    update?: FileIndexUpdateWithWhereUniqueWithoutRepoInput | FileIndexUpdateWithWhereUniqueWithoutRepoInput[]
    updateMany?: FileIndexUpdateManyWithWhereWithoutRepoInput | FileIndexUpdateManyWithWhereWithoutRepoInput[]
    deleteMany?: FileIndexScalarWhereInput | FileIndexScalarWhereInput[]
  }

  export type SotEventUncheckedUpdateManyWithoutRepoNestedInput = {
    create?: XOR<SotEventCreateWithoutRepoInput, SotEventUncheckedCreateWithoutRepoInput> | SotEventCreateWithoutRepoInput[] | SotEventUncheckedCreateWithoutRepoInput[]
    connectOrCreate?: SotEventCreateOrConnectWithoutRepoInput | SotEventCreateOrConnectWithoutRepoInput[]
    upsert?: SotEventUpsertWithWhereUniqueWithoutRepoInput | SotEventUpsertWithWhereUniqueWithoutRepoInput[]
    createMany?: SotEventCreateManyRepoInputEnvelope
    set?: SotEventWhereUniqueInput | SotEventWhereUniqueInput[]
    disconnect?: SotEventWhereUniqueInput | SotEventWhereUniqueInput[]
    delete?: SotEventWhereUniqueInput | SotEventWhereUniqueInput[]
    connect?: SotEventWhereUniqueInput | SotEventWhereUniqueInput[]
    update?: SotEventUpdateWithWhereUniqueWithoutRepoInput | SotEventUpdateWithWhereUniqueWithoutRepoInput[]
    updateMany?: SotEventUpdateManyWithWhereWithoutRepoInput | SotEventUpdateManyWithWhereWithoutRepoInput[]
    deleteMany?: SotEventScalarWhereInput | SotEventScalarWhereInput[]
  }

  export type SyncRunUncheckedUpdateManyWithoutRepoNestedInput = {
    create?: XOR<SyncRunCreateWithoutRepoInput, SyncRunUncheckedCreateWithoutRepoInput> | SyncRunCreateWithoutRepoInput[] | SyncRunUncheckedCreateWithoutRepoInput[]
    connectOrCreate?: SyncRunCreateOrConnectWithoutRepoInput | SyncRunCreateOrConnectWithoutRepoInput[]
    upsert?: SyncRunUpsertWithWhereUniqueWithoutRepoInput | SyncRunUpsertWithWhereUniqueWithoutRepoInput[]
    createMany?: SyncRunCreateManyRepoInputEnvelope
    set?: SyncRunWhereUniqueInput | SyncRunWhereUniqueInput[]
    disconnect?: SyncRunWhereUniqueInput | SyncRunWhereUniqueInput[]
    delete?: SyncRunWhereUniqueInput | SyncRunWhereUniqueInput[]
    connect?: SyncRunWhereUniqueInput | SyncRunWhereUniqueInput[]
    update?: SyncRunUpdateWithWhereUniqueWithoutRepoInput | SyncRunUpdateWithWhereUniqueWithoutRepoInput[]
    updateMany?: SyncRunUpdateManyWithWhereWithoutRepoInput | SyncRunUpdateManyWithWhereWithoutRepoInput[]
    deleteMany?: SyncRunScalarWhereInput | SyncRunScalarWhereInput[]
  }

  export type RepoCreateNestedOneWithoutDomainsInput = {
    create?: XOR<RepoCreateWithoutDomainsInput, RepoUncheckedCreateWithoutDomainsInput>
    connectOrCreate?: RepoCreateOrConnectWithoutDomainsInput
    connect?: RepoWhereUniqueInput
  }

  export type SotEventCreateNestedManyWithoutDomainInput = {
    create?: XOR<SotEventCreateWithoutDomainInput, SotEventUncheckedCreateWithoutDomainInput> | SotEventCreateWithoutDomainInput[] | SotEventUncheckedCreateWithoutDomainInput[]
    connectOrCreate?: SotEventCreateOrConnectWithoutDomainInput | SotEventCreateOrConnectWithoutDomainInput[]
    createMany?: SotEventCreateManyDomainInputEnvelope
    connect?: SotEventWhereUniqueInput | SotEventWhereUniqueInput[]
  }

  export type SotEventUncheckedCreateNestedManyWithoutDomainInput = {
    create?: XOR<SotEventCreateWithoutDomainInput, SotEventUncheckedCreateWithoutDomainInput> | SotEventCreateWithoutDomainInput[] | SotEventUncheckedCreateWithoutDomainInput[]
    connectOrCreate?: SotEventCreateOrConnectWithoutDomainInput | SotEventCreateOrConnectWithoutDomainInput[]
    createMany?: SotEventCreateManyDomainInputEnvelope
    connect?: SotEventWhereUniqueInput | SotEventWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type RepoUpdateOneWithoutDomainsNestedInput = {
    create?: XOR<RepoCreateWithoutDomainsInput, RepoUncheckedCreateWithoutDomainsInput>
    connectOrCreate?: RepoCreateOrConnectWithoutDomainsInput
    upsert?: RepoUpsertWithoutDomainsInput
    disconnect?: RepoWhereInput | boolean
    delete?: RepoWhereInput | boolean
    connect?: RepoWhereUniqueInput
    update?: XOR<XOR<RepoUpdateToOneWithWhereWithoutDomainsInput, RepoUpdateWithoutDomainsInput>, RepoUncheckedUpdateWithoutDomainsInput>
  }

  export type SotEventUpdateManyWithoutDomainNestedInput = {
    create?: XOR<SotEventCreateWithoutDomainInput, SotEventUncheckedCreateWithoutDomainInput> | SotEventCreateWithoutDomainInput[] | SotEventUncheckedCreateWithoutDomainInput[]
    connectOrCreate?: SotEventCreateOrConnectWithoutDomainInput | SotEventCreateOrConnectWithoutDomainInput[]
    upsert?: SotEventUpsertWithWhereUniqueWithoutDomainInput | SotEventUpsertWithWhereUniqueWithoutDomainInput[]
    createMany?: SotEventCreateManyDomainInputEnvelope
    set?: SotEventWhereUniqueInput | SotEventWhereUniqueInput[]
    disconnect?: SotEventWhereUniqueInput | SotEventWhereUniqueInput[]
    delete?: SotEventWhereUniqueInput | SotEventWhereUniqueInput[]
    connect?: SotEventWhereUniqueInput | SotEventWhereUniqueInput[]
    update?: SotEventUpdateWithWhereUniqueWithoutDomainInput | SotEventUpdateWithWhereUniqueWithoutDomainInput[]
    updateMany?: SotEventUpdateManyWithWhereWithoutDomainInput | SotEventUpdateManyWithWhereWithoutDomainInput[]
    deleteMany?: SotEventScalarWhereInput | SotEventScalarWhereInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SotEventUncheckedUpdateManyWithoutDomainNestedInput = {
    create?: XOR<SotEventCreateWithoutDomainInput, SotEventUncheckedCreateWithoutDomainInput> | SotEventCreateWithoutDomainInput[] | SotEventUncheckedCreateWithoutDomainInput[]
    connectOrCreate?: SotEventCreateOrConnectWithoutDomainInput | SotEventCreateOrConnectWithoutDomainInput[]
    upsert?: SotEventUpsertWithWhereUniqueWithoutDomainInput | SotEventUpsertWithWhereUniqueWithoutDomainInput[]
    createMany?: SotEventCreateManyDomainInputEnvelope
    set?: SotEventWhereUniqueInput | SotEventWhereUniqueInput[]
    disconnect?: SotEventWhereUniqueInput | SotEventWhereUniqueInput[]
    delete?: SotEventWhereUniqueInput | SotEventWhereUniqueInput[]
    connect?: SotEventWhereUniqueInput | SotEventWhereUniqueInput[]
    update?: SotEventUpdateWithWhereUniqueWithoutDomainInput | SotEventUpdateWithWhereUniqueWithoutDomainInput[]
    updateMany?: SotEventUpdateManyWithWhereWithoutDomainInput | SotEventUpdateManyWithWhereWithoutDomainInput[]
    deleteMany?: SotEventScalarWhereInput | SotEventScalarWhereInput[]
  }

  export type FileIndexCreateNestedManyWithoutSyncRunInput = {
    create?: XOR<FileIndexCreateWithoutSyncRunInput, FileIndexUncheckedCreateWithoutSyncRunInput> | FileIndexCreateWithoutSyncRunInput[] | FileIndexUncheckedCreateWithoutSyncRunInput[]
    connectOrCreate?: FileIndexCreateOrConnectWithoutSyncRunInput | FileIndexCreateOrConnectWithoutSyncRunInput[]
    createMany?: FileIndexCreateManySyncRunInputEnvelope
    connect?: FileIndexWhereUniqueInput | FileIndexWhereUniqueInput[]
  }

  export type RepoCreateNestedOneWithoutSyncRunsInput = {
    create?: XOR<RepoCreateWithoutSyncRunsInput, RepoUncheckedCreateWithoutSyncRunsInput>
    connectOrCreate?: RepoCreateOrConnectWithoutSyncRunsInput
    connect?: RepoWhereUniqueInput
  }

  export type FileIndexUncheckedCreateNestedManyWithoutSyncRunInput = {
    create?: XOR<FileIndexCreateWithoutSyncRunInput, FileIndexUncheckedCreateWithoutSyncRunInput> | FileIndexCreateWithoutSyncRunInput[] | FileIndexUncheckedCreateWithoutSyncRunInput[]
    connectOrCreate?: FileIndexCreateOrConnectWithoutSyncRunInput | FileIndexCreateOrConnectWithoutSyncRunInput[]
    createMany?: FileIndexCreateManySyncRunInputEnvelope
    connect?: FileIndexWhereUniqueInput | FileIndexWhereUniqueInput[]
  }

  export type FileIndexUpdateManyWithoutSyncRunNestedInput = {
    create?: XOR<FileIndexCreateWithoutSyncRunInput, FileIndexUncheckedCreateWithoutSyncRunInput> | FileIndexCreateWithoutSyncRunInput[] | FileIndexUncheckedCreateWithoutSyncRunInput[]
    connectOrCreate?: FileIndexCreateOrConnectWithoutSyncRunInput | FileIndexCreateOrConnectWithoutSyncRunInput[]
    upsert?: FileIndexUpsertWithWhereUniqueWithoutSyncRunInput | FileIndexUpsertWithWhereUniqueWithoutSyncRunInput[]
    createMany?: FileIndexCreateManySyncRunInputEnvelope
    set?: FileIndexWhereUniqueInput | FileIndexWhereUniqueInput[]
    disconnect?: FileIndexWhereUniqueInput | FileIndexWhereUniqueInput[]
    delete?: FileIndexWhereUniqueInput | FileIndexWhereUniqueInput[]
    connect?: FileIndexWhereUniqueInput | FileIndexWhereUniqueInput[]
    update?: FileIndexUpdateWithWhereUniqueWithoutSyncRunInput | FileIndexUpdateWithWhereUniqueWithoutSyncRunInput[]
    updateMany?: FileIndexUpdateManyWithWhereWithoutSyncRunInput | FileIndexUpdateManyWithWhereWithoutSyncRunInput[]
    deleteMany?: FileIndexScalarWhereInput | FileIndexScalarWhereInput[]
  }

  export type RepoUpdateOneWithoutSyncRunsNestedInput = {
    create?: XOR<RepoCreateWithoutSyncRunsInput, RepoUncheckedCreateWithoutSyncRunsInput>
    connectOrCreate?: RepoCreateOrConnectWithoutSyncRunsInput
    upsert?: RepoUpsertWithoutSyncRunsInput
    disconnect?: RepoWhereInput | boolean
    delete?: RepoWhereInput | boolean
    connect?: RepoWhereUniqueInput
    update?: XOR<XOR<RepoUpdateToOneWithWhereWithoutSyncRunsInput, RepoUpdateWithoutSyncRunsInput>, RepoUncheckedUpdateWithoutSyncRunsInput>
  }

  export type FileIndexUncheckedUpdateManyWithoutSyncRunNestedInput = {
    create?: XOR<FileIndexCreateWithoutSyncRunInput, FileIndexUncheckedCreateWithoutSyncRunInput> | FileIndexCreateWithoutSyncRunInput[] | FileIndexUncheckedCreateWithoutSyncRunInput[]
    connectOrCreate?: FileIndexCreateOrConnectWithoutSyncRunInput | FileIndexCreateOrConnectWithoutSyncRunInput[]
    upsert?: FileIndexUpsertWithWhereUniqueWithoutSyncRunInput | FileIndexUpsertWithWhereUniqueWithoutSyncRunInput[]
    createMany?: FileIndexCreateManySyncRunInputEnvelope
    set?: FileIndexWhereUniqueInput | FileIndexWhereUniqueInput[]
    disconnect?: FileIndexWhereUniqueInput | FileIndexWhereUniqueInput[]
    delete?: FileIndexWhereUniqueInput | FileIndexWhereUniqueInput[]
    connect?: FileIndexWhereUniqueInput | FileIndexWhereUniqueInput[]
    update?: FileIndexUpdateWithWhereUniqueWithoutSyncRunInput | FileIndexUpdateWithWhereUniqueWithoutSyncRunInput[]
    updateMany?: FileIndexUpdateManyWithWhereWithoutSyncRunInput | FileIndexUpdateManyWithWhereWithoutSyncRunInput[]
    deleteMany?: FileIndexScalarWhereInput | FileIndexScalarWhereInput[]
  }

  export type RepoCreateNestedOneWithoutFileIndexesInput = {
    create?: XOR<RepoCreateWithoutFileIndexesInput, RepoUncheckedCreateWithoutFileIndexesInput>
    connectOrCreate?: RepoCreateOrConnectWithoutFileIndexesInput
    connect?: RepoWhereUniqueInput
  }

  export type SyncRunCreateNestedOneWithoutFileIndexesInput = {
    create?: XOR<SyncRunCreateWithoutFileIndexesInput, SyncRunUncheckedCreateWithoutFileIndexesInput>
    connectOrCreate?: SyncRunCreateOrConnectWithoutFileIndexesInput
    connect?: SyncRunWhereUniqueInput
  }

  export type RepoUpdateOneRequiredWithoutFileIndexesNestedInput = {
    create?: XOR<RepoCreateWithoutFileIndexesInput, RepoUncheckedCreateWithoutFileIndexesInput>
    connectOrCreate?: RepoCreateOrConnectWithoutFileIndexesInput
    upsert?: RepoUpsertWithoutFileIndexesInput
    connect?: RepoWhereUniqueInput
    update?: XOR<XOR<RepoUpdateToOneWithWhereWithoutFileIndexesInput, RepoUpdateWithoutFileIndexesInput>, RepoUncheckedUpdateWithoutFileIndexesInput>
  }

  export type SyncRunUpdateOneWithoutFileIndexesNestedInput = {
    create?: XOR<SyncRunCreateWithoutFileIndexesInput, SyncRunUncheckedCreateWithoutFileIndexesInput>
    connectOrCreate?: SyncRunCreateOrConnectWithoutFileIndexesInput
    upsert?: SyncRunUpsertWithoutFileIndexesInput
    disconnect?: SyncRunWhereInput | boolean
    delete?: SyncRunWhereInput | boolean
    connect?: SyncRunWhereUniqueInput
    update?: XOR<XOR<SyncRunUpdateToOneWithWhereWithoutFileIndexesInput, SyncRunUpdateWithoutFileIndexesInput>, SyncRunUncheckedUpdateWithoutFileIndexesInput>
  }

  export type PilotActionCreateNestedManyWithoutSessionInput = {
    create?: XOR<PilotActionCreateWithoutSessionInput, PilotActionUncheckedCreateWithoutSessionInput> | PilotActionCreateWithoutSessionInput[] | PilotActionUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: PilotActionCreateOrConnectWithoutSessionInput | PilotActionCreateOrConnectWithoutSessionInput[]
    createMany?: PilotActionCreateManySessionInputEnvelope
    connect?: PilotActionWhereUniqueInput | PilotActionWhereUniqueInput[]
  }

  export type PilotActionUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<PilotActionCreateWithoutSessionInput, PilotActionUncheckedCreateWithoutSessionInput> | PilotActionCreateWithoutSessionInput[] | PilotActionUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: PilotActionCreateOrConnectWithoutSessionInput | PilotActionCreateOrConnectWithoutSessionInput[]
    createMany?: PilotActionCreateManySessionInputEnvelope
    connect?: PilotActionWhereUniqueInput | PilotActionWhereUniqueInput[]
  }

  export type PilotActionUpdateManyWithoutSessionNestedInput = {
    create?: XOR<PilotActionCreateWithoutSessionInput, PilotActionUncheckedCreateWithoutSessionInput> | PilotActionCreateWithoutSessionInput[] | PilotActionUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: PilotActionCreateOrConnectWithoutSessionInput | PilotActionCreateOrConnectWithoutSessionInput[]
    upsert?: PilotActionUpsertWithWhereUniqueWithoutSessionInput | PilotActionUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: PilotActionCreateManySessionInputEnvelope
    set?: PilotActionWhereUniqueInput | PilotActionWhereUniqueInput[]
    disconnect?: PilotActionWhereUniqueInput | PilotActionWhereUniqueInput[]
    delete?: PilotActionWhereUniqueInput | PilotActionWhereUniqueInput[]
    connect?: PilotActionWhereUniqueInput | PilotActionWhereUniqueInput[]
    update?: PilotActionUpdateWithWhereUniqueWithoutSessionInput | PilotActionUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: PilotActionUpdateManyWithWhereWithoutSessionInput | PilotActionUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: PilotActionScalarWhereInput | PilotActionScalarWhereInput[]
  }

  export type PilotActionUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<PilotActionCreateWithoutSessionInput, PilotActionUncheckedCreateWithoutSessionInput> | PilotActionCreateWithoutSessionInput[] | PilotActionUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: PilotActionCreateOrConnectWithoutSessionInput | PilotActionCreateOrConnectWithoutSessionInput[]
    upsert?: PilotActionUpsertWithWhereUniqueWithoutSessionInput | PilotActionUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: PilotActionCreateManySessionInputEnvelope
    set?: PilotActionWhereUniqueInput | PilotActionWhereUniqueInput[]
    disconnect?: PilotActionWhereUniqueInput | PilotActionWhereUniqueInput[]
    delete?: PilotActionWhereUniqueInput | PilotActionWhereUniqueInput[]
    connect?: PilotActionWhereUniqueInput | PilotActionWhereUniqueInput[]
    update?: PilotActionUpdateWithWhereUniqueWithoutSessionInput | PilotActionUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: PilotActionUpdateManyWithWhereWithoutSessionInput | PilotActionUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: PilotActionScalarWhereInput | PilotActionScalarWhereInput[]
  }

  export type PilotSessionCreateNestedOneWithoutActionsInput = {
    create?: XOR<PilotSessionCreateWithoutActionsInput, PilotSessionUncheckedCreateWithoutActionsInput>
    connectOrCreate?: PilotSessionCreateOrConnectWithoutActionsInput
    connect?: PilotSessionWhereUniqueInput
  }

  export type PilotSessionUpdateOneRequiredWithoutActionsNestedInput = {
    create?: XOR<PilotSessionCreateWithoutActionsInput, PilotSessionUncheckedCreateWithoutActionsInput>
    connectOrCreate?: PilotSessionCreateOrConnectWithoutActionsInput
    upsert?: PilotSessionUpsertWithoutActionsInput
    connect?: PilotSessionWhereUniqueInput
    update?: XOR<XOR<PilotSessionUpdateToOneWithWhereWithoutActionsInput, PilotSessionUpdateWithoutActionsInput>, PilotSessionUncheckedUpdateWithoutActionsInput>
  }

  export type DomainCreateNestedOneWithoutSotEventsInput = {
    create?: XOR<DomainCreateWithoutSotEventsInput, DomainUncheckedCreateWithoutSotEventsInput>
    connectOrCreate?: DomainCreateOrConnectWithoutSotEventsInput
    connect?: DomainWhereUniqueInput
  }

  export type RepoCreateNestedOneWithoutSotEventsInput = {
    create?: XOR<RepoCreateWithoutSotEventsInput, RepoUncheckedCreateWithoutSotEventsInput>
    connectOrCreate?: RepoCreateOrConnectWithoutSotEventsInput
    connect?: RepoWhereUniqueInput
  }

  export type DomainUpdateOneWithoutSotEventsNestedInput = {
    create?: XOR<DomainCreateWithoutSotEventsInput, DomainUncheckedCreateWithoutSotEventsInput>
    connectOrCreate?: DomainCreateOrConnectWithoutSotEventsInput
    upsert?: DomainUpsertWithoutSotEventsInput
    disconnect?: DomainWhereInput | boolean
    delete?: DomainWhereInput | boolean
    connect?: DomainWhereUniqueInput
    update?: XOR<XOR<DomainUpdateToOneWithWhereWithoutSotEventsInput, DomainUpdateWithoutSotEventsInput>, DomainUncheckedUpdateWithoutSotEventsInput>
  }

  export type RepoUpdateOneWithoutSotEventsNestedInput = {
    create?: XOR<RepoCreateWithoutSotEventsInput, RepoUncheckedCreateWithoutSotEventsInput>
    connectOrCreate?: RepoCreateOrConnectWithoutSotEventsInput
    upsert?: RepoUpsertWithoutSotEventsInput
    disconnect?: RepoWhereInput | boolean
    delete?: RepoWhereInput | boolean
    connect?: RepoWhereUniqueInput
    update?: XOR<XOR<RepoUpdateToOneWithWhereWithoutSotEventsInput, RepoUpdateWithoutSotEventsInput>, RepoUncheckedUpdateWithoutSotEventsInput>
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type DomainCreateWithoutRepoInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    nhId?: string
    domain: string
    status?: string | null
    domainKey?: string | null
    engineType?: string | null
    env?: string | null
    expiresAt?: Date | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    sotEvents?: SotEventCreateNestedManyWithoutDomainInput
  }

  export type DomainUncheckedCreateWithoutRepoInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    nhId?: string
    domain: string
    status?: string | null
    domainKey?: string | null
    engineType?: string | null
    env?: string | null
    expiresAt?: Date | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    sotEvents?: SotEventUncheckedCreateNestedManyWithoutDomainInput
  }

  export type DomainCreateOrConnectWithoutRepoInput = {
    where: DomainWhereUniqueInput
    create: XOR<DomainCreateWithoutRepoInput, DomainUncheckedCreateWithoutRepoInput>
  }

  export type DomainCreateManyRepoInputEnvelope = {
    data: DomainCreateManyRepoInput | DomainCreateManyRepoInput[]
    skipDuplicates?: boolean
  }

  export type FileIndexCreateWithoutRepoInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    path: string
    dir: string
    filename: string
    extension: string
    sizeBytes: number
    sha256: string
    lastCommitSha?: string | null
    indexedAt?: Date | string
    syncRun?: SyncRunCreateNestedOneWithoutFileIndexesInput
  }

  export type FileIndexUncheckedCreateWithoutRepoInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    syncRunId?: number | null
    path: string
    dir: string
    filename: string
    extension: string
    sizeBytes: number
    sha256: string
    lastCommitSha?: string | null
    indexedAt?: Date | string
  }

  export type FileIndexCreateOrConnectWithoutRepoInput = {
    where: FileIndexWhereUniqueInput
    create: XOR<FileIndexCreateWithoutRepoInput, FileIndexUncheckedCreateWithoutRepoInput>
  }

  export type FileIndexCreateManyRepoInputEnvelope = {
    data: FileIndexCreateManyRepoInput | FileIndexCreateManyRepoInput[]
    skipDuplicates?: boolean
  }

  export type SotEventCreateWithoutRepoInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    ts: Date | string
    source: string
    kind: string
    nhId?: string
    summary?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    domain?: DomainCreateNestedOneWithoutSotEventsInput
  }

  export type SotEventUncheckedCreateWithoutRepoInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ts: Date | string
    source: string
    kind: string
    nhId?: string
    summary?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    domainId?: number | null
  }

  export type SotEventCreateOrConnectWithoutRepoInput = {
    where: SotEventWhereUniqueInput
    create: XOR<SotEventCreateWithoutRepoInput, SotEventUncheckedCreateWithoutRepoInput>
  }

  export type SotEventCreateManyRepoInputEnvelope = {
    data: SotEventCreateManyRepoInput | SotEventCreateManyRepoInput[]
    skipDuplicates?: boolean
  }

  export type SyncRunCreateWithoutRepoInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    type: string
    status: string
    trigger?: string | null
    startedAt: Date | string
    finishedAt: Date | string
    workflowRunUrl?: string | null
    summary?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    fileIndexes?: FileIndexCreateNestedManyWithoutSyncRunInput
  }

  export type SyncRunUncheckedCreateWithoutRepoInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    type: string
    status: string
    trigger?: string | null
    startedAt: Date | string
    finishedAt: Date | string
    workflowRunUrl?: string | null
    summary?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    fileIndexes?: FileIndexUncheckedCreateNestedManyWithoutSyncRunInput
  }

  export type SyncRunCreateOrConnectWithoutRepoInput = {
    where: SyncRunWhereUniqueInput
    create: XOR<SyncRunCreateWithoutRepoInput, SyncRunUncheckedCreateWithoutRepoInput>
  }

  export type SyncRunCreateManyRepoInputEnvelope = {
    data: SyncRunCreateManyRepoInput | SyncRunCreateManyRepoInput[]
    skipDuplicates?: boolean
  }

  export type DomainUpsertWithWhereUniqueWithoutRepoInput = {
    where: DomainWhereUniqueInput
    update: XOR<DomainUpdateWithoutRepoInput, DomainUncheckedUpdateWithoutRepoInput>
    create: XOR<DomainCreateWithoutRepoInput, DomainUncheckedCreateWithoutRepoInput>
  }

  export type DomainUpdateWithWhereUniqueWithoutRepoInput = {
    where: DomainWhereUniqueInput
    data: XOR<DomainUpdateWithoutRepoInput, DomainUncheckedUpdateWithoutRepoInput>
  }

  export type DomainUpdateManyWithWhereWithoutRepoInput = {
    where: DomainScalarWhereInput
    data: XOR<DomainUpdateManyMutationInput, DomainUncheckedUpdateManyWithoutRepoInput>
  }

  export type DomainScalarWhereInput = {
    AND?: DomainScalarWhereInput | DomainScalarWhereInput[]
    OR?: DomainScalarWhereInput[]
    NOT?: DomainScalarWhereInput | DomainScalarWhereInput[]
    id?: IntFilter<"Domain"> | number
    createdAt?: DateTimeFilter<"Domain"> | Date | string
    updatedAt?: DateTimeFilter<"Domain"> | Date | string
    nhId?: StringFilter<"Domain"> | string
    domain?: StringFilter<"Domain"> | string
    status?: StringNullableFilter<"Domain"> | string | null
    domainKey?: StringNullableFilter<"Domain"> | string | null
    engineType?: StringNullableFilter<"Domain"> | string | null
    env?: StringNullableFilter<"Domain"> | string | null
    expiresAt?: DateTimeNullableFilter<"Domain"> | Date | string | null
    notes?: JsonNullableFilter<"Domain">
    repoId?: IntNullableFilter<"Domain"> | number | null
  }

  export type FileIndexUpsertWithWhereUniqueWithoutRepoInput = {
    where: FileIndexWhereUniqueInput
    update: XOR<FileIndexUpdateWithoutRepoInput, FileIndexUncheckedUpdateWithoutRepoInput>
    create: XOR<FileIndexCreateWithoutRepoInput, FileIndexUncheckedCreateWithoutRepoInput>
  }

  export type FileIndexUpdateWithWhereUniqueWithoutRepoInput = {
    where: FileIndexWhereUniqueInput
    data: XOR<FileIndexUpdateWithoutRepoInput, FileIndexUncheckedUpdateWithoutRepoInput>
  }

  export type FileIndexUpdateManyWithWhereWithoutRepoInput = {
    where: FileIndexScalarWhereInput
    data: XOR<FileIndexUpdateManyMutationInput, FileIndexUncheckedUpdateManyWithoutRepoInput>
  }

  export type FileIndexScalarWhereInput = {
    AND?: FileIndexScalarWhereInput | FileIndexScalarWhereInput[]
    OR?: FileIndexScalarWhereInput[]
    NOT?: FileIndexScalarWhereInput | FileIndexScalarWhereInput[]
    id?: IntFilter<"FileIndex"> | number
    createdAt?: DateTimeFilter<"FileIndex"> | Date | string
    updatedAt?: DateTimeFilter<"FileIndex"> | Date | string
    repoId?: IntFilter<"FileIndex"> | number
    syncRunId?: IntNullableFilter<"FileIndex"> | number | null
    path?: StringFilter<"FileIndex"> | string
    dir?: StringFilter<"FileIndex"> | string
    filename?: StringFilter<"FileIndex"> | string
    extension?: StringFilter<"FileIndex"> | string
    sizeBytes?: IntFilter<"FileIndex"> | number
    sha256?: StringFilter<"FileIndex"> | string
    lastCommitSha?: StringNullableFilter<"FileIndex"> | string | null
    indexedAt?: DateTimeFilter<"FileIndex"> | Date | string
  }

  export type SotEventUpsertWithWhereUniqueWithoutRepoInput = {
    where: SotEventWhereUniqueInput
    update: XOR<SotEventUpdateWithoutRepoInput, SotEventUncheckedUpdateWithoutRepoInput>
    create: XOR<SotEventCreateWithoutRepoInput, SotEventUncheckedCreateWithoutRepoInput>
  }

  export type SotEventUpdateWithWhereUniqueWithoutRepoInput = {
    where: SotEventWhereUniqueInput
    data: XOR<SotEventUpdateWithoutRepoInput, SotEventUncheckedUpdateWithoutRepoInput>
  }

  export type SotEventUpdateManyWithWhereWithoutRepoInput = {
    where: SotEventScalarWhereInput
    data: XOR<SotEventUpdateManyMutationInput, SotEventUncheckedUpdateManyWithoutRepoInput>
  }

  export type SotEventScalarWhereInput = {
    AND?: SotEventScalarWhereInput | SotEventScalarWhereInput[]
    OR?: SotEventScalarWhereInput[]
    NOT?: SotEventScalarWhereInput | SotEventScalarWhereInput[]
    id?: IntFilter<"SotEvent"> | number
    createdAt?: DateTimeFilter<"SotEvent"> | Date | string
    updatedAt?: DateTimeFilter<"SotEvent"> | Date | string
    ts?: DateTimeFilter<"SotEvent"> | Date | string
    source?: StringFilter<"SotEvent"> | string
    kind?: StringFilter<"SotEvent"> | string
    nhId?: StringFilter<"SotEvent"> | string
    summary?: StringNullableFilter<"SotEvent"> | string | null
    payload?: JsonNullableFilter<"SotEvent">
    repoId?: IntNullableFilter<"SotEvent"> | number | null
    domainId?: IntNullableFilter<"SotEvent"> | number | null
  }

  export type SyncRunUpsertWithWhereUniqueWithoutRepoInput = {
    where: SyncRunWhereUniqueInput
    update: XOR<SyncRunUpdateWithoutRepoInput, SyncRunUncheckedUpdateWithoutRepoInput>
    create: XOR<SyncRunCreateWithoutRepoInput, SyncRunUncheckedCreateWithoutRepoInput>
  }

  export type SyncRunUpdateWithWhereUniqueWithoutRepoInput = {
    where: SyncRunWhereUniqueInput
    data: XOR<SyncRunUpdateWithoutRepoInput, SyncRunUncheckedUpdateWithoutRepoInput>
  }

  export type SyncRunUpdateManyWithWhereWithoutRepoInput = {
    where: SyncRunScalarWhereInput
    data: XOR<SyncRunUpdateManyMutationInput, SyncRunUncheckedUpdateManyWithoutRepoInput>
  }

  export type SyncRunScalarWhereInput = {
    AND?: SyncRunScalarWhereInput | SyncRunScalarWhereInput[]
    OR?: SyncRunScalarWhereInput[]
    NOT?: SyncRunScalarWhereInput | SyncRunScalarWhereInput[]
    id?: IntFilter<"SyncRun"> | number
    createdAt?: DateTimeFilter<"SyncRun"> | Date | string
    updatedAt?: DateTimeFilter<"SyncRun"> | Date | string
    type?: StringFilter<"SyncRun"> | string
    status?: StringFilter<"SyncRun"> | string
    trigger?: StringNullableFilter<"SyncRun"> | string | null
    startedAt?: DateTimeFilter<"SyncRun"> | Date | string
    finishedAt?: DateTimeFilter<"SyncRun"> | Date | string
    workflowRunUrl?: StringNullableFilter<"SyncRun"> | string | null
    summary?: StringNullableFilter<"SyncRun"> | string | null
    payload?: JsonNullableFilter<"SyncRun">
    repoId?: IntNullableFilter<"SyncRun"> | number | null
  }

  export type RepoCreateWithoutDomainsInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    nhId?: string
    name: string
    description?: string | null
    domainPod?: string | null
    engineGroup?: string | null
    language?: string | null
    status?: string | null
    owner?: string | null
    defaultBranch?: string | null
    githubUrl?: string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    fileIndexes?: FileIndexCreateNestedManyWithoutRepoInput
    sotEvents?: SotEventCreateNestedManyWithoutRepoInput
    syncRuns?: SyncRunCreateNestedManyWithoutRepoInput
  }

  export type RepoUncheckedCreateWithoutDomainsInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    nhId?: string
    name: string
    description?: string | null
    domainPod?: string | null
    engineGroup?: string | null
    language?: string | null
    status?: string | null
    owner?: string | null
    defaultBranch?: string | null
    githubUrl?: string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    fileIndexes?: FileIndexUncheckedCreateNestedManyWithoutRepoInput
    sotEvents?: SotEventUncheckedCreateNestedManyWithoutRepoInput
    syncRuns?: SyncRunUncheckedCreateNestedManyWithoutRepoInput
  }

  export type RepoCreateOrConnectWithoutDomainsInput = {
    where: RepoWhereUniqueInput
    create: XOR<RepoCreateWithoutDomainsInput, RepoUncheckedCreateWithoutDomainsInput>
  }

  export type SotEventCreateWithoutDomainInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    ts: Date | string
    source: string
    kind: string
    nhId?: string
    summary?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    repo?: RepoCreateNestedOneWithoutSotEventsInput
  }

  export type SotEventUncheckedCreateWithoutDomainInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ts: Date | string
    source: string
    kind: string
    nhId?: string
    summary?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    repoId?: number | null
  }

  export type SotEventCreateOrConnectWithoutDomainInput = {
    where: SotEventWhereUniqueInput
    create: XOR<SotEventCreateWithoutDomainInput, SotEventUncheckedCreateWithoutDomainInput>
  }

  export type SotEventCreateManyDomainInputEnvelope = {
    data: SotEventCreateManyDomainInput | SotEventCreateManyDomainInput[]
    skipDuplicates?: boolean
  }

  export type RepoUpsertWithoutDomainsInput = {
    update: XOR<RepoUpdateWithoutDomainsInput, RepoUncheckedUpdateWithoutDomainsInput>
    create: XOR<RepoCreateWithoutDomainsInput, RepoUncheckedCreateWithoutDomainsInput>
    where?: RepoWhereInput
  }

  export type RepoUpdateToOneWithWhereWithoutDomainsInput = {
    where?: RepoWhereInput
    data: XOR<RepoUpdateWithoutDomainsInput, RepoUncheckedUpdateWithoutDomainsInput>
  }

  export type RepoUpdateWithoutDomainsInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    domainPod?: NullableStringFieldUpdateOperationsInput | string | null
    engineGroup?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    defaultBranch?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    fileIndexes?: FileIndexUpdateManyWithoutRepoNestedInput
    sotEvents?: SotEventUpdateManyWithoutRepoNestedInput
    syncRuns?: SyncRunUpdateManyWithoutRepoNestedInput
  }

  export type RepoUncheckedUpdateWithoutDomainsInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    domainPod?: NullableStringFieldUpdateOperationsInput | string | null
    engineGroup?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    defaultBranch?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    fileIndexes?: FileIndexUncheckedUpdateManyWithoutRepoNestedInput
    sotEvents?: SotEventUncheckedUpdateManyWithoutRepoNestedInput
    syncRuns?: SyncRunUncheckedUpdateManyWithoutRepoNestedInput
  }

  export type SotEventUpsertWithWhereUniqueWithoutDomainInput = {
    where: SotEventWhereUniqueInput
    update: XOR<SotEventUpdateWithoutDomainInput, SotEventUncheckedUpdateWithoutDomainInput>
    create: XOR<SotEventCreateWithoutDomainInput, SotEventUncheckedCreateWithoutDomainInput>
  }

  export type SotEventUpdateWithWhereUniqueWithoutDomainInput = {
    where: SotEventWhereUniqueInput
    data: XOR<SotEventUpdateWithoutDomainInput, SotEventUncheckedUpdateWithoutDomainInput>
  }

  export type SotEventUpdateManyWithWhereWithoutDomainInput = {
    where: SotEventScalarWhereInput
    data: XOR<SotEventUpdateManyMutationInput, SotEventUncheckedUpdateManyWithoutDomainInput>
  }

  export type FileIndexCreateWithoutSyncRunInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    path: string
    dir: string
    filename: string
    extension: string
    sizeBytes: number
    sha256: string
    lastCommitSha?: string | null
    indexedAt?: Date | string
    repo: RepoCreateNestedOneWithoutFileIndexesInput
  }

  export type FileIndexUncheckedCreateWithoutSyncRunInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    repoId: number
    path: string
    dir: string
    filename: string
    extension: string
    sizeBytes: number
    sha256: string
    lastCommitSha?: string | null
    indexedAt?: Date | string
  }

  export type FileIndexCreateOrConnectWithoutSyncRunInput = {
    where: FileIndexWhereUniqueInput
    create: XOR<FileIndexCreateWithoutSyncRunInput, FileIndexUncheckedCreateWithoutSyncRunInput>
  }

  export type FileIndexCreateManySyncRunInputEnvelope = {
    data: FileIndexCreateManySyncRunInput | FileIndexCreateManySyncRunInput[]
    skipDuplicates?: boolean
  }

  export type RepoCreateWithoutSyncRunsInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    nhId?: string
    name: string
    description?: string | null
    domainPod?: string | null
    engineGroup?: string | null
    language?: string | null
    status?: string | null
    owner?: string | null
    defaultBranch?: string | null
    githubUrl?: string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    domains?: DomainCreateNestedManyWithoutRepoInput
    fileIndexes?: FileIndexCreateNestedManyWithoutRepoInput
    sotEvents?: SotEventCreateNestedManyWithoutRepoInput
  }

  export type RepoUncheckedCreateWithoutSyncRunsInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    nhId?: string
    name: string
    description?: string | null
    domainPod?: string | null
    engineGroup?: string | null
    language?: string | null
    status?: string | null
    owner?: string | null
    defaultBranch?: string | null
    githubUrl?: string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    domains?: DomainUncheckedCreateNestedManyWithoutRepoInput
    fileIndexes?: FileIndexUncheckedCreateNestedManyWithoutRepoInput
    sotEvents?: SotEventUncheckedCreateNestedManyWithoutRepoInput
  }

  export type RepoCreateOrConnectWithoutSyncRunsInput = {
    where: RepoWhereUniqueInput
    create: XOR<RepoCreateWithoutSyncRunsInput, RepoUncheckedCreateWithoutSyncRunsInput>
  }

  export type FileIndexUpsertWithWhereUniqueWithoutSyncRunInput = {
    where: FileIndexWhereUniqueInput
    update: XOR<FileIndexUpdateWithoutSyncRunInput, FileIndexUncheckedUpdateWithoutSyncRunInput>
    create: XOR<FileIndexCreateWithoutSyncRunInput, FileIndexUncheckedCreateWithoutSyncRunInput>
  }

  export type FileIndexUpdateWithWhereUniqueWithoutSyncRunInput = {
    where: FileIndexWhereUniqueInput
    data: XOR<FileIndexUpdateWithoutSyncRunInput, FileIndexUncheckedUpdateWithoutSyncRunInput>
  }

  export type FileIndexUpdateManyWithWhereWithoutSyncRunInput = {
    where: FileIndexScalarWhereInput
    data: XOR<FileIndexUpdateManyMutationInput, FileIndexUncheckedUpdateManyWithoutSyncRunInput>
  }

  export type RepoUpsertWithoutSyncRunsInput = {
    update: XOR<RepoUpdateWithoutSyncRunsInput, RepoUncheckedUpdateWithoutSyncRunsInput>
    create: XOR<RepoCreateWithoutSyncRunsInput, RepoUncheckedCreateWithoutSyncRunsInput>
    where?: RepoWhereInput
  }

  export type RepoUpdateToOneWithWhereWithoutSyncRunsInput = {
    where?: RepoWhereInput
    data: XOR<RepoUpdateWithoutSyncRunsInput, RepoUncheckedUpdateWithoutSyncRunsInput>
  }

  export type RepoUpdateWithoutSyncRunsInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    domainPod?: NullableStringFieldUpdateOperationsInput | string | null
    engineGroup?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    defaultBranch?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    domains?: DomainUpdateManyWithoutRepoNestedInput
    fileIndexes?: FileIndexUpdateManyWithoutRepoNestedInput
    sotEvents?: SotEventUpdateManyWithoutRepoNestedInput
  }

  export type RepoUncheckedUpdateWithoutSyncRunsInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    domainPod?: NullableStringFieldUpdateOperationsInput | string | null
    engineGroup?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    defaultBranch?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    domains?: DomainUncheckedUpdateManyWithoutRepoNestedInput
    fileIndexes?: FileIndexUncheckedUpdateManyWithoutRepoNestedInput
    sotEvents?: SotEventUncheckedUpdateManyWithoutRepoNestedInput
  }

  export type RepoCreateWithoutFileIndexesInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    nhId?: string
    name: string
    description?: string | null
    domainPod?: string | null
    engineGroup?: string | null
    language?: string | null
    status?: string | null
    owner?: string | null
    defaultBranch?: string | null
    githubUrl?: string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    domains?: DomainCreateNestedManyWithoutRepoInput
    sotEvents?: SotEventCreateNestedManyWithoutRepoInput
    syncRuns?: SyncRunCreateNestedManyWithoutRepoInput
  }

  export type RepoUncheckedCreateWithoutFileIndexesInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    nhId?: string
    name: string
    description?: string | null
    domainPod?: string | null
    engineGroup?: string | null
    language?: string | null
    status?: string | null
    owner?: string | null
    defaultBranch?: string | null
    githubUrl?: string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    domains?: DomainUncheckedCreateNestedManyWithoutRepoInput
    sotEvents?: SotEventUncheckedCreateNestedManyWithoutRepoInput
    syncRuns?: SyncRunUncheckedCreateNestedManyWithoutRepoInput
  }

  export type RepoCreateOrConnectWithoutFileIndexesInput = {
    where: RepoWhereUniqueInput
    create: XOR<RepoCreateWithoutFileIndexesInput, RepoUncheckedCreateWithoutFileIndexesInput>
  }

  export type SyncRunCreateWithoutFileIndexesInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    type: string
    status: string
    trigger?: string | null
    startedAt: Date | string
    finishedAt: Date | string
    workflowRunUrl?: string | null
    summary?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    repo?: RepoCreateNestedOneWithoutSyncRunsInput
  }

  export type SyncRunUncheckedCreateWithoutFileIndexesInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    type: string
    status: string
    trigger?: string | null
    startedAt: Date | string
    finishedAt: Date | string
    workflowRunUrl?: string | null
    summary?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    repoId?: number | null
  }

  export type SyncRunCreateOrConnectWithoutFileIndexesInput = {
    where: SyncRunWhereUniqueInput
    create: XOR<SyncRunCreateWithoutFileIndexesInput, SyncRunUncheckedCreateWithoutFileIndexesInput>
  }

  export type RepoUpsertWithoutFileIndexesInput = {
    update: XOR<RepoUpdateWithoutFileIndexesInput, RepoUncheckedUpdateWithoutFileIndexesInput>
    create: XOR<RepoCreateWithoutFileIndexesInput, RepoUncheckedCreateWithoutFileIndexesInput>
    where?: RepoWhereInput
  }

  export type RepoUpdateToOneWithWhereWithoutFileIndexesInput = {
    where?: RepoWhereInput
    data: XOR<RepoUpdateWithoutFileIndexesInput, RepoUncheckedUpdateWithoutFileIndexesInput>
  }

  export type RepoUpdateWithoutFileIndexesInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    domainPod?: NullableStringFieldUpdateOperationsInput | string | null
    engineGroup?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    defaultBranch?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    domains?: DomainUpdateManyWithoutRepoNestedInput
    sotEvents?: SotEventUpdateManyWithoutRepoNestedInput
    syncRuns?: SyncRunUpdateManyWithoutRepoNestedInput
  }

  export type RepoUncheckedUpdateWithoutFileIndexesInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    domainPod?: NullableStringFieldUpdateOperationsInput | string | null
    engineGroup?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    defaultBranch?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    domains?: DomainUncheckedUpdateManyWithoutRepoNestedInput
    sotEvents?: SotEventUncheckedUpdateManyWithoutRepoNestedInput
    syncRuns?: SyncRunUncheckedUpdateManyWithoutRepoNestedInput
  }

  export type SyncRunUpsertWithoutFileIndexesInput = {
    update: XOR<SyncRunUpdateWithoutFileIndexesInput, SyncRunUncheckedUpdateWithoutFileIndexesInput>
    create: XOR<SyncRunCreateWithoutFileIndexesInput, SyncRunUncheckedCreateWithoutFileIndexesInput>
    where?: SyncRunWhereInput
  }

  export type SyncRunUpdateToOneWithWhereWithoutFileIndexesInput = {
    where?: SyncRunWhereInput
    data: XOR<SyncRunUpdateWithoutFileIndexesInput, SyncRunUncheckedUpdateWithoutFileIndexesInput>
  }

  export type SyncRunUpdateWithoutFileIndexesInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    trigger?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflowRunUrl?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    repo?: RepoUpdateOneWithoutSyncRunsNestedInput
  }

  export type SyncRunUncheckedUpdateWithoutFileIndexesInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    trigger?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflowRunUrl?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    repoId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type PilotActionCreateWithoutSessionInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    ts?: Date | string
    mode: string
    targetNodeId?: string | null
    actionType: string
    payload?: string | null
    reason: string
  }

  export type PilotActionUncheckedCreateWithoutSessionInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ts?: Date | string
    mode: string
    targetNodeId?: string | null
    actionType: string
    payload?: string | null
    reason: string
  }

  export type PilotActionCreateOrConnectWithoutSessionInput = {
    where: PilotActionWhereUniqueInput
    create: XOR<PilotActionCreateWithoutSessionInput, PilotActionUncheckedCreateWithoutSessionInput>
  }

  export type PilotActionCreateManySessionInputEnvelope = {
    data: PilotActionCreateManySessionInput | PilotActionCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type PilotActionUpsertWithWhereUniqueWithoutSessionInput = {
    where: PilotActionWhereUniqueInput
    update: XOR<PilotActionUpdateWithoutSessionInput, PilotActionUncheckedUpdateWithoutSessionInput>
    create: XOR<PilotActionCreateWithoutSessionInput, PilotActionUncheckedCreateWithoutSessionInput>
  }

  export type PilotActionUpdateWithWhereUniqueWithoutSessionInput = {
    where: PilotActionWhereUniqueInput
    data: XOR<PilotActionUpdateWithoutSessionInput, PilotActionUncheckedUpdateWithoutSessionInput>
  }

  export type PilotActionUpdateManyWithWhereWithoutSessionInput = {
    where: PilotActionScalarWhereInput
    data: XOR<PilotActionUpdateManyMutationInput, PilotActionUncheckedUpdateManyWithoutSessionInput>
  }

  export type PilotActionScalarWhereInput = {
    AND?: PilotActionScalarWhereInput | PilotActionScalarWhereInput[]
    OR?: PilotActionScalarWhereInput[]
    NOT?: PilotActionScalarWhereInput | PilotActionScalarWhereInput[]
    id?: IntFilter<"PilotAction"> | number
    createdAt?: DateTimeFilter<"PilotAction"> | Date | string
    updatedAt?: DateTimeFilter<"PilotAction"> | Date | string
    ts?: DateTimeFilter<"PilotAction"> | Date | string
    sessionId?: IntFilter<"PilotAction"> | number
    mode?: StringFilter<"PilotAction"> | string
    targetNodeId?: StringNullableFilter<"PilotAction"> | string | null
    actionType?: StringFilter<"PilotAction"> | string
    payload?: StringNullableFilter<"PilotAction"> | string | null
    reason?: StringFilter<"PilotAction"> | string
  }

  export type PilotSessionCreateWithoutActionsInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    projectKey?: string | null
    waveLabel?: string | null
    mode: string
    surface: string
    createdBy: string
    startedAt?: Date | string
    endedAt?: Date | string | null
  }

  export type PilotSessionUncheckedCreateWithoutActionsInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    projectKey?: string | null
    waveLabel?: string | null
    mode: string
    surface: string
    createdBy: string
    startedAt?: Date | string
    endedAt?: Date | string | null
  }

  export type PilotSessionCreateOrConnectWithoutActionsInput = {
    where: PilotSessionWhereUniqueInput
    create: XOR<PilotSessionCreateWithoutActionsInput, PilotSessionUncheckedCreateWithoutActionsInput>
  }

  export type PilotSessionUpsertWithoutActionsInput = {
    update: XOR<PilotSessionUpdateWithoutActionsInput, PilotSessionUncheckedUpdateWithoutActionsInput>
    create: XOR<PilotSessionCreateWithoutActionsInput, PilotSessionUncheckedCreateWithoutActionsInput>
    where?: PilotSessionWhereInput
  }

  export type PilotSessionUpdateToOneWithWhereWithoutActionsInput = {
    where?: PilotSessionWhereInput
    data: XOR<PilotSessionUpdateWithoutActionsInput, PilotSessionUncheckedUpdateWithoutActionsInput>
  }

  export type PilotSessionUpdateWithoutActionsInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectKey?: NullableStringFieldUpdateOperationsInput | string | null
    waveLabel?: NullableStringFieldUpdateOperationsInput | string | null
    mode?: StringFieldUpdateOperationsInput | string
    surface?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PilotSessionUncheckedUpdateWithoutActionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectKey?: NullableStringFieldUpdateOperationsInput | string | null
    waveLabel?: NullableStringFieldUpdateOperationsInput | string | null
    mode?: StringFieldUpdateOperationsInput | string
    surface?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DomainCreateWithoutSotEventsInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    nhId?: string
    domain: string
    status?: string | null
    domainKey?: string | null
    engineType?: string | null
    env?: string | null
    expiresAt?: Date | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    repo?: RepoCreateNestedOneWithoutDomainsInput
  }

  export type DomainUncheckedCreateWithoutSotEventsInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    nhId?: string
    domain: string
    status?: string | null
    domainKey?: string | null
    engineType?: string | null
    env?: string | null
    expiresAt?: Date | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    repoId?: number | null
  }

  export type DomainCreateOrConnectWithoutSotEventsInput = {
    where: DomainWhereUniqueInput
    create: XOR<DomainCreateWithoutSotEventsInput, DomainUncheckedCreateWithoutSotEventsInput>
  }

  export type RepoCreateWithoutSotEventsInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    nhId?: string
    name: string
    description?: string | null
    domainPod?: string | null
    engineGroup?: string | null
    language?: string | null
    status?: string | null
    owner?: string | null
    defaultBranch?: string | null
    githubUrl?: string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    domains?: DomainCreateNestedManyWithoutRepoInput
    fileIndexes?: FileIndexCreateNestedManyWithoutRepoInput
    syncRuns?: SyncRunCreateNestedManyWithoutRepoInput
  }

  export type RepoUncheckedCreateWithoutSotEventsInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    nhId?: string
    name: string
    description?: string | null
    domainPod?: string | null
    engineGroup?: string | null
    language?: string | null
    status?: string | null
    owner?: string | null
    defaultBranch?: string | null
    githubUrl?: string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    domains?: DomainUncheckedCreateNestedManyWithoutRepoInput
    fileIndexes?: FileIndexUncheckedCreateNestedManyWithoutRepoInput
    syncRuns?: SyncRunUncheckedCreateNestedManyWithoutRepoInput
  }

  export type RepoCreateOrConnectWithoutSotEventsInput = {
    where: RepoWhereUniqueInput
    create: XOR<RepoCreateWithoutSotEventsInput, RepoUncheckedCreateWithoutSotEventsInput>
  }

  export type DomainUpsertWithoutSotEventsInput = {
    update: XOR<DomainUpdateWithoutSotEventsInput, DomainUncheckedUpdateWithoutSotEventsInput>
    create: XOR<DomainCreateWithoutSotEventsInput, DomainUncheckedCreateWithoutSotEventsInput>
    where?: DomainWhereInput
  }

  export type DomainUpdateToOneWithWhereWithoutSotEventsInput = {
    where?: DomainWhereInput
    data: XOR<DomainUpdateWithoutSotEventsInput, DomainUncheckedUpdateWithoutSotEventsInput>
  }

  export type DomainUpdateWithoutSotEventsInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    domainKey?: NullableStringFieldUpdateOperationsInput | string | null
    engineType?: NullableStringFieldUpdateOperationsInput | string | null
    env?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    repo?: RepoUpdateOneWithoutDomainsNestedInput
  }

  export type DomainUncheckedUpdateWithoutSotEventsInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    domainKey?: NullableStringFieldUpdateOperationsInput | string | null
    engineType?: NullableStringFieldUpdateOperationsInput | string | null
    env?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    repoId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type RepoUpsertWithoutSotEventsInput = {
    update: XOR<RepoUpdateWithoutSotEventsInput, RepoUncheckedUpdateWithoutSotEventsInput>
    create: XOR<RepoCreateWithoutSotEventsInput, RepoUncheckedCreateWithoutSotEventsInput>
    where?: RepoWhereInput
  }

  export type RepoUpdateToOneWithWhereWithoutSotEventsInput = {
    where?: RepoWhereInput
    data: XOR<RepoUpdateWithoutSotEventsInput, RepoUncheckedUpdateWithoutSotEventsInput>
  }

  export type RepoUpdateWithoutSotEventsInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    domainPod?: NullableStringFieldUpdateOperationsInput | string | null
    engineGroup?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    defaultBranch?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    domains?: DomainUpdateManyWithoutRepoNestedInput
    fileIndexes?: FileIndexUpdateManyWithoutRepoNestedInput
    syncRuns?: SyncRunUpdateManyWithoutRepoNestedInput
  }

  export type RepoUncheckedUpdateWithoutSotEventsInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    domainPod?: NullableStringFieldUpdateOperationsInput | string | null
    engineGroup?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    defaultBranch?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    domains?: DomainUncheckedUpdateManyWithoutRepoNestedInput
    fileIndexes?: FileIndexUncheckedUpdateManyWithoutRepoNestedInput
    syncRuns?: SyncRunUncheckedUpdateManyWithoutRepoNestedInput
  }

  export type AccountCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    role?: $Enums.Role
    passwordHash?: string | null
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    role?: $Enums.Role
    passwordHash?: string | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    role?: $Enums.Role
    passwordHash?: string | null
    accounts?: AccountCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    role?: $Enums.Role
    passwordHash?: string | null
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    accounts?: AccountUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DomainCreateManyRepoInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    nhId?: string
    domain: string
    status?: string | null
    domainKey?: string | null
    engineType?: string | null
    env?: string | null
    expiresAt?: Date | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
  }

  export type FileIndexCreateManyRepoInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    syncRunId?: number | null
    path: string
    dir: string
    filename: string
    extension: string
    sizeBytes: number
    sha256: string
    lastCommitSha?: string | null
    indexedAt?: Date | string
  }

  export type SotEventCreateManyRepoInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ts: Date | string
    source: string
    kind: string
    nhId?: string
    summary?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    domainId?: number | null
  }

  export type SyncRunCreateManyRepoInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    type: string
    status: string
    trigger?: string | null
    startedAt: Date | string
    finishedAt: Date | string
    workflowRunUrl?: string | null
    summary?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
  }

  export type DomainUpdateWithoutRepoInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    domainKey?: NullableStringFieldUpdateOperationsInput | string | null
    engineType?: NullableStringFieldUpdateOperationsInput | string | null
    env?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    sotEvents?: SotEventUpdateManyWithoutDomainNestedInput
  }

  export type DomainUncheckedUpdateWithoutRepoInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    domainKey?: NullableStringFieldUpdateOperationsInput | string | null
    engineType?: NullableStringFieldUpdateOperationsInput | string | null
    env?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
    sotEvents?: SotEventUncheckedUpdateManyWithoutDomainNestedInput
  }

  export type DomainUncheckedUpdateManyWithoutRepoInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nhId?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    domainKey?: NullableStringFieldUpdateOperationsInput | string | null
    engineType?: NullableStringFieldUpdateOperationsInput | string | null
    env?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableJsonNullValueInput | InputJsonValue
  }

  export type FileIndexUpdateWithoutRepoInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    path?: StringFieldUpdateOperationsInput | string
    dir?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    extension?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    sha256?: StringFieldUpdateOperationsInput | string
    lastCommitSha?: NullableStringFieldUpdateOperationsInput | string | null
    indexedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    syncRun?: SyncRunUpdateOneWithoutFileIndexesNestedInput
  }

  export type FileIndexUncheckedUpdateWithoutRepoInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    syncRunId?: NullableIntFieldUpdateOperationsInput | number | null
    path?: StringFieldUpdateOperationsInput | string
    dir?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    extension?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    sha256?: StringFieldUpdateOperationsInput | string
    lastCommitSha?: NullableStringFieldUpdateOperationsInput | string | null
    indexedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileIndexUncheckedUpdateManyWithoutRepoInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    syncRunId?: NullableIntFieldUpdateOperationsInput | number | null
    path?: StringFieldUpdateOperationsInput | string
    dir?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    extension?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    sha256?: StringFieldUpdateOperationsInput | string
    lastCommitSha?: NullableStringFieldUpdateOperationsInput | string | null
    indexedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SotEventUpdateWithoutRepoInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ts?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    nhId?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    domain?: DomainUpdateOneWithoutSotEventsNestedInput
  }

  export type SotEventUncheckedUpdateWithoutRepoInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ts?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    nhId?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    domainId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type SotEventUncheckedUpdateManyWithoutRepoInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ts?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    nhId?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    domainId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type SyncRunUpdateWithoutRepoInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    trigger?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflowRunUrl?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    fileIndexes?: FileIndexUpdateManyWithoutSyncRunNestedInput
  }

  export type SyncRunUncheckedUpdateWithoutRepoInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    trigger?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflowRunUrl?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    fileIndexes?: FileIndexUncheckedUpdateManyWithoutSyncRunNestedInput
  }

  export type SyncRunUncheckedUpdateManyWithoutRepoInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    trigger?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflowRunUrl?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
  }

  export type SotEventCreateManyDomainInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ts: Date | string
    source: string
    kind: string
    nhId?: string
    summary?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    repoId?: number | null
  }

  export type SotEventUpdateWithoutDomainInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ts?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    nhId?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    repo?: RepoUpdateOneWithoutSotEventsNestedInput
  }

  export type SotEventUncheckedUpdateWithoutDomainInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ts?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    nhId?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    repoId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type SotEventUncheckedUpdateManyWithoutDomainInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ts?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    nhId?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    repoId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type FileIndexCreateManySyncRunInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    repoId: number
    path: string
    dir: string
    filename: string
    extension: string
    sizeBytes: number
    sha256: string
    lastCommitSha?: string | null
    indexedAt?: Date | string
  }

  export type FileIndexUpdateWithoutSyncRunInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    path?: StringFieldUpdateOperationsInput | string
    dir?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    extension?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    sha256?: StringFieldUpdateOperationsInput | string
    lastCommitSha?: NullableStringFieldUpdateOperationsInput | string | null
    indexedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repo?: RepoUpdateOneRequiredWithoutFileIndexesNestedInput
  }

  export type FileIndexUncheckedUpdateWithoutSyncRunInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repoId?: IntFieldUpdateOperationsInput | number
    path?: StringFieldUpdateOperationsInput | string
    dir?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    extension?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    sha256?: StringFieldUpdateOperationsInput | string
    lastCommitSha?: NullableStringFieldUpdateOperationsInput | string | null
    indexedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileIndexUncheckedUpdateManyWithoutSyncRunInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repoId?: IntFieldUpdateOperationsInput | number
    path?: StringFieldUpdateOperationsInput | string
    dir?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    extension?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    sha256?: StringFieldUpdateOperationsInput | string
    lastCommitSha?: NullableStringFieldUpdateOperationsInput | string | null
    indexedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PilotActionCreateManySessionInput = {
    id?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ts?: Date | string
    mode: string
    targetNodeId?: string | null
    actionType: string
    payload?: string | null
    reason: string
  }

  export type PilotActionUpdateWithoutSessionInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ts?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: StringFieldUpdateOperationsInput | string
    targetNodeId?: NullableStringFieldUpdateOperationsInput | string | null
    actionType?: StringFieldUpdateOperationsInput | string
    payload?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
  }

  export type PilotActionUncheckedUpdateWithoutSessionInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ts?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: StringFieldUpdateOperationsInput | string
    targetNodeId?: NullableStringFieldUpdateOperationsInput | string | null
    actionType?: StringFieldUpdateOperationsInput | string
    payload?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
  }

  export type PilotActionUncheckedUpdateManyWithoutSessionInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ts?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: StringFieldUpdateOperationsInput | string
    targetNodeId?: NullableStringFieldUpdateOperationsInput | string | null
    actionType?: StringFieldUpdateOperationsInput | string
    payload?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
  }

  export type AccountCreateManyUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type SessionCreateManyUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}