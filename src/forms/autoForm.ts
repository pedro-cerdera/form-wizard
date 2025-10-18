import { FormConfig } from "../types/form";

export const autoForm: FormConfig = {
    steps: [
        {
            id: "personal-info",
            title: "Dados Pessoais",
            fields: [
                { id: "name", label: "Nome completo", type: "text", required: true },
                { id: "email", label: "E-mail", type: "email", required: true },
                { id: "loan_amount", label: "Valor do empréstimo", type: "number", required: true },
                { id: "phone", label: "Telefone", type: "tel" },
                { id: "cpf", label: "CPF", type: "text", required: true },
            ],
            actions: [
                {
                    type: "mutation",
                    mutation: "createLead",
                    inputMap: {
                        data: {
                            cpf: "$cpf",
                            name: "$name",
                            email: "$email",
                            phone: "$phone",
                            loan_amount: "$loan_amount",
                        },
                    },
                    actions: [
                        { type: "store", key: "id", from: "id", storage: "cookies" },
                        { type: "store", key: "name", from: "name", storage: "cookies" },
                    ],
                },
                {
                    type: "mutation",
                    mutation: "resolveJourney",
                    inputMap: {
                        cpf: "$cpf",
                    },
                    actions: [
                        {
                            type: "decision",
                            cases: [
                                {
                                    when: { field: "journeyType", equals: "returning" },
                                    actions: [{ type: "redirect", step: "returning-lead" }],
                                },
                                {
                                    when: { field: "journeyType", equals: "new" },
                                    actions: [{ type: "redirect", step: "professional-info" }],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: "returning-lead",
            title: "Já encontramos sua simulação",
            fields: [
                {
                    id: "decision",
                    label: "Deseja seguir com a simulação anterior?",
                    type: "select",
                    options: ["Sim", "Não"],
                },
            ],
            actions: [
                {
                    type: "mutation",
                    mutation: "updateLead",
                    inputMap: {
                        data: {
                            decision: "$decision",
                        },
                        id: "$cookie:id",
                    },
                },
                {
                    type: "mutation",
                    mutation: "completeLead",
                    inputMap: {
                        id: "$cookie:id",
                    },
                },
            ],
        },
        {
            id: "professional-info",
            title: "Situação Profissional e Civil",
            fields: [
                {
                    id: "job_status",
                    label: "Situação profissional",
                    type: "select",
                    options: ["CLT", "Autônomo", "Desempregado"],
                },
                {
                    id: "marital_status",
                    label: "Estado civil",
                    type: "select",
                    options: ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)"],
                },
            ],
            actions: [
                {
                    type: "mutation",
                    mutation: "updateLead",
                    inputMap: {
                        data: {
                            job_status: "$job_status",
                            marital_status: "$marital_status",
                        },
                        id: "$cookie:id",
                    },
                },
                { type: "redirect", step: "vehicle-info" },
            ],
        },
        {
            id: "vehicle-info",
            title: "Informações do Veículo",
            fields: [
                { id: "plate", label: "Placa do veículo", type: "text" },
                { id: "remaining_value", label: "Quanto falta pagar", type: "number" },
                { id: "owner_name", label: "Em nome de quem está o carro", type: "text" },
            ],
            actions: [
                {
                    type: "mutation",
                    mutation: "updateLead",
                    inputMap: {
                        data: {
                            plate: "$plate",
                            remaining_value: "$remaining_value",
                            owner_name: "$owner_name",
                        },
                        id: "$cookie:id",
                    },
                },
                { type: "mutation", mutation: "completeLead", inputMap: { id: "$cookie:id" } },
            ],
        },
    ],
};
