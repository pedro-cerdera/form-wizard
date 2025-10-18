import { FormConfig } from "../types/form";

export const homeForm: FormConfig = {
    steps: [
        {
            id: "personal-info",
            title: "Informações Pessoais (Home)",
            fields: [
                { id: "name", label: "Nome", type: "text", required: true },
                { id: "income", label: "Renda Mensal", type: "number" },
            ],
            actions: [
                {
                    type: "mutation",
                    mutation: "createLead",
                    inputMap: { name: "$name", income: "$income" },
                    actions: [
                        { type: "store", key: "id", from: "id" },
                        { type: "redirect", step: "property-info" },
                    ],
                },
            ],
        },
        {
            id: "property-info",
            title: "Informações do Imóvel",
            fields: [{ id: "address", label: "Endereço", type: "text" }],
            actions: [
                {
                    type: "mutation",
                    mutation: "updateLead",
                    inputMap: {
                        id: "$cookie:id",
                        data: { address: "$address" },
                    },
                },
            ],
        },
    ],
};
