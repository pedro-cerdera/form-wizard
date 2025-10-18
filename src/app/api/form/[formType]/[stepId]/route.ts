import { NextResponse } from "next/server";
import { getStep } from "@/lib/formService";

export async function GET(_req: Request, context: { params: Promise<{ formType: string; stepId: string }> }) {
    const { formType, stepId } = await context.params;

    const step = getStep(formType, stepId);
    if (!step) {
        return NextResponse.json({ error: "Step not found" }, { status: 404 });
    }

    return NextResponse.json(step);
}
