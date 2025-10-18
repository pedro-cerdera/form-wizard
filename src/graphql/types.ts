export type MutationAction = {
    type: "mutation";
    mutation: string;
    inputMap?: Record<string, string>;
    actions?: Action[];
};

export type DecisionAction = {
    type: "decision";
    cases: {
        when: { field: string; equals: any };
        actions?: Action[];
    }[];
};

export type RedirectAction = {
    type: "redirect";
    step: string;
};

export type StoreAction = {
    type: "store";
    key: string;
    from: string;
    storage?: "cookies";
};

export type Action = MutationAction | DecisionAction | RedirectAction | StoreAction;

export type Step = {
    id: string;
    title: string;
    fields: {
        id: string;
        label: string;
        type: string;
        required?: boolean;
        options?: string[];
    }[];
    actions?: Action[];
};

export type FormConfig = { steps: Step[] };
