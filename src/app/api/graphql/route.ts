import { createYoga } from "@graphql-yoga/node";
import { schema } from "@/graphql/schema";

const yoga = createYoga({
    graphqlEndpoint: '/api/graphql',
    schema,
    fetchAPI: { Response: Response, Request: Request },
});

function corsHeaders(origin: string | null) {
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", origin || "*");
    headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return headers;
}

export async function OPTIONS(req: Request) {
    const origin = req.headers.get("origin");
    return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
    });
}

export async function GET(request: Request) {
    request.headers.set("Access-Control-Allow-Origin", "*");
    return yoga(request);
}

export async function POST(request: Request) {
    request.headers.set("Access-Control-Allow-Origin", "*");
    return yoga(request);
}
