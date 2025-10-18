export async function runGraphQL<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json(); // agora deve ter JSON válido
    if (json.errors) throw new Error(JSON.stringify(json.errors));
    return json.data;
}
