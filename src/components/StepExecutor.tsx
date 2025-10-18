"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { executeActions } from "@/graphql/executeActions";
import { Step } from "@/graphql/types";

export default function StepExecutor({ step, initialContext }: { step: Step; initialContext?: Record<string, any> }) {
    const router = useRouter();
    const pathname = usePathname();


    const [values, setValues] = useState<Record<string, any>>({ ...initialContext });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onChange = (id: string, v: any) => setValues(prev => ({ ...prev, [id]: v }));

    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await executeActions(step.actions ?? [], values);
        } catch (err: any) {
            setError(err.message || String(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="form-wrapper">
            <div className="form-card fade-in">
                <div className="step-header">
                    <h2 className="step-title">{step.title}</h2>
                    <p className="step-sub">Preencha as informações abaixo</p>
                </div>

                <form onSubmit={handleNext} className="space-y-6">
                    {step.fields.map(field => (
                        <div className="field" key={field.id}>
                            <label className="field-label">{field.label}</label>

                            {field.type === "select" ? (
                                <select
                                    className="form-select"
                                    value={values[field.id] ?? ""}
                                    onChange={(e) => onChange(field.id, e.target.value)}
                                >
                                    <option value="">Selecione</option>
                                    {(field.options ?? []).map(opt => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    className="form-input"
                                    type={field.type === "number" ? "number" : field.type}
                                    value={values[field.id] ?? ""}
                                    onChange={(e) =>
                                        onChange(field.id, field.type === "number" ? Number(e.target.value) : e.target.value)
                                    }
                                    placeholder={field.label}
                                />
                            )}
                        </div>
                    ))}

                    {error && <div className="error">{error}</div>}

                    <div className="flex items-center justify-between pt-4">
                        <button type="button" className="btn-secondary" onClick={() => router.back()} disabled={loading}>
                            Voltar
                        </button>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Enviando..." : "Continuar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
