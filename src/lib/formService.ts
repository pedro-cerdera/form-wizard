import { FormConfig, Step } from "@/types/form";
import { autoForm } from "@/forms/autoForm";
import { homeForm } from "@/forms/homeForm";

const forms: Record<string, FormConfig> = {
    auto: autoForm,
    home: homeForm
};

export function getStep(formType: string, stepId: string): Step | null {
    const form = forms[formType];
    if (!form) return null;
    return form.steps.find((s) => s.id === stepId) ?? null;
}
