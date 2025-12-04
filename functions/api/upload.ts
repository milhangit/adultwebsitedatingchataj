interface Env {
    R2: R2Bucket;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
        }

        const filename = file.name;
        const extension = filename.split('.').pop();
        const uniqueId = crypto.randomUUID();
        const key = `images/${uniqueId}.${extension}`;

        await env.R2.put(key, file);

        // Return the URL that will be served by our assets worker
        const url = `/api/assets/${key}`;

        return new Response(JSON.stringify({ url, key }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Upload Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
