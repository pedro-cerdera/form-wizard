import StepExecutor from "@/components/StepExecutor";
import { autoForm } from "@/forms/autoForm";
import { homeForm } from "@/forms/homeForm";
import { FormConfig } from "@/types/form";

async function getStepData(formType: string, stepId: string) {
    const res = await fetch(`http://localhost:3000/api/form/${formType}/${stepId}`, {
        cache: "no-store"
    });
    if (!res.ok) throw new Error("Erro ao buscar o step");
    return res.json();
}

const formMap: Record<string, FormConfig> = {
    auto: autoForm,
    home: homeForm,
};

export async function generateStaticParams() {
    const params = Object.entries(formMap).flatMap(([formType, form]) =>
        form.steps.map((s) => ({
            formType,
            stepId: s.id,
        }))
    );

    return params;
}


export default async function FormStepPage({
    params,
}: {
    params: Promise<{ formType: string; stepId: string }>;
}) {
    const { formType, stepId } = await params;

    let step;
    try {
        step = await getStepData(formType, stepId);
    } catch (error) {
        return (
            <div className="text-center mt-10 text-red-500">
                Erro ao carregar a etapa do formulário.
            </div>
        );
    }

    if (!step) {
        return (
            <div className="text-center mt-10 text-red-500">
                Etapa não encontrada.
            </div>
        );
    }

    return <StepExecutor step={step} />;
}