import { createYoga } from "@graphql-yoga/node";
import { schema } from "@/graphql/schema";

const yoga = createYoga({
    graphqlEndpoint: '/api/graphql',
    schema,
    fetchAPI: { Response: Response, Request: Request },
});

export async function GET(request: Request) {
    return yoga(request);
}

export async function POST(request: Request) {
    return yoga(request);
}
