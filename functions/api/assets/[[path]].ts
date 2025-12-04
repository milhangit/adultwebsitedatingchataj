interface Env {
    R2: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env, params } = context;

    // params.path is an array because of [[path]] syntax
    const pathArray = params.path as string[];
    const key = pathArray.join('/');

    if (!key) {
        return new Response('Missing key', { status: 400 });
    }

    try {
        const object = await env.R2.get(key);

        if (!object) {
            return new Response('Object Not Found', { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);

        return new Response(object.body, {
            headers,
        });

    } catch (error: any) {
        console.error('Asset Fetch Error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};
