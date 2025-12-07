interface Env {
    DB: D1Database;
    AI: any;
    R2: R2Bucket;
}

type PluginData = Record<string, unknown>;

type PagesFunction<
    Env = unknown,
    Params extends string = any,
    Data extends Record<string, unknown> = Record<string, unknown>
> = (context: EventContext<Env, Params, Data>) => Response | Promise<Response>;
