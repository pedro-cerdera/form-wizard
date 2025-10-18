import { createYoga } from "@graphql-yoga/node";
import { schema } from "@/graphql/schema";

const yoga = createYoga({
    graphqlEndpoint: '/api/graphql',
    schema,
    fetchAPI: { Response: Response, Request: Request },
});

export const GET = yoga;
export const POST = yoga;
