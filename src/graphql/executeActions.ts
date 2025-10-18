import Cookies from "js-cookie";
import { runGraphQL } from "./runGraphQL";
import { Action } from "./types";

function resolveInputMap(map: any, context: Record<string, any>): any {
    if (typeof map === "string") {
        if (map.startsWith("$cookie:")) {
            const cookieKey = map.slice(8);
            const cookieValue = Cookies.get(cookieKey);
            if (!cookieValue) throw new Error(`Cookie ${cookieKey} not found`);
            return cookieValue;
        }
        if (map.startsWith("$")) {
            const contextKey = map.slice(1);
            const contextValue = context[contextKey];
            if (contextValue === undefined)
                throw new Error(`Context key ${contextKey} not found`);
            return contextValue;
        }
        return map;
    } else if (Array.isArray(map)) {
        return map.map((v) => resolveInputMap(v, context));
    } else if (typeof map === "object" && map !== null) {
        return Object.fromEntries(
            Object.entries(map).map(([k, v]) => [k, resolveInputMap(v, context)])
        );
    }
    return map;
}


export const actionHandlers: Record<
    Action["type"],
    (
        action: Action,
        context: Record<string, any>,
        execute: typeof executeActions
    ) => Promise<Record<string, any>>
> = {
    mutation: async (action, context, execute) => {
        const { mutation, inputMap } = action;
        const resolvedVars = inputMap ? resolveInputMap(inputMap, context) : {};

        let gqlQuery = "";
        let variablesToSend: Record<string, any> = {};

        // Seleciona automaticamente o tipo da mutation conforme os campos resolvidos
        if ("id" in resolvedVars && "data" in resolvedVars) {
            gqlQuery = `mutation ${mutation}($id: ID!, $data: JSON!) {
        ${mutation}(id: $id, data: $data) { id data status }
      }`;
            variablesToSend = { id: resolvedVars.id, data: resolvedVars.data };
        } else if ("id" in resolvedVars) {
            gqlQuery = `mutation ${mutation}($id: ID!) {
        ${mutation}(id: $id) { id data status }
      }`;
            variablesToSend = { id: resolvedVars.id };
        } else if ("cpf" in resolvedVars) {
            gqlQuery = `mutation ${mutation}($cpf: String!) {
        ${mutation}(cpf: $cpf) { journeyType }
      }`;
            variablesToSend = { cpf: resolvedVars.cpf };
        } else {
            gqlQuery = `mutation ${mutation}($data: JSON!) {
        ${mutation}(data: $data) { id data status }
      }`;
            variablesToSend = { data: resolvedVars.data };
        }

        try {
            const data = await runGraphQL(gqlQuery, variablesToSend);
            const result = data?.[mutation];
            if (!result)
                throw new Error(`GraphQL mutation '${mutation}' returned no data`);

            const newContext = { ...context, ...result };



            if (action.actions?.length) {
                return execute(action.actions, newContext);
            }

            return newContext;
        } catch (err) {
            throw err;
        }
    },

    decision: async (action, context, execute) => {
        if (!action.cases) return context;

        for (const decisionCase of action.cases) {
            const { field, equals } = decisionCase.when;
            if (context[field] === equals) {
                console.log(`✅ Decision matched: ${field} === ${equals}`);
                const nestedActions = decisionCase.actions || [];
                return execute(nestedActions, context);
            }
        }

        return context;
    },

    redirect: async (action, context) => {
        const formType = context.formType || "auto"; // fallback
        const target = `/form/${formType}/${action.step}`;

        if (typeof window !== "undefined") {
            window.location.href = target;
        } else {
            console.warn("Redirect attempted in non-browser environment:", target);
        }

        return {};
    },

    store: async (action, context) => {
        const { key, from, storage = "cookies" } = action;

        const value = from.split(".").reduce((acc, part) => acc?.[part], context);

        if (value === undefined)
            throw new Error(`store action: value for '${from}' not found in context`);

        if (storage === "cookies") {
            Cookies.set(key, value, { path: "/" });
        } else {
            throw new Error(`Unsupported storage type: ${storage}`);
        }

        return { ...context, [key]: value };
    },
};

export async function executeActions(
    actions: Action[],
    context: Record<string, any>,
): Promise<Record<string, any>> {
    let currentContext = { ...context };

    console.log("Executing actions:", actions);


    for (const action of actions) {
        const handler = actionHandlers[action.type];
        if (!handler)
            throw new Error(`Handler for action type '${action.type}' not found`);
        currentContext = await handler(
            action,
            currentContext,
            executeActions
        );
    }

    return currentContext;
}
