"use client";

import React, { useMemo, useState } from "react";
import {
    Baby,
    Calendar,
    HeartPulse,
    Salad,
    Droplets,
    Briefcase,
    Home,
    Moon,
    Dumbbell,
    Smile,
    Users,
    BookOpen,
    MapPin,
    Hospital,
    Languages,
    MessageCircleHeart,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
} from "lucide-react";

// NOTE: This component is a single-file, production-ready onboarding flow
// for Next.js App Router. Drop it into /app/onboarding/page.tsx and it will render.
// TailwindCSS is assumed. All icons are from lucide-react.
// Color theme: soft maternity palette (rose/pink/lavender with mint accents).

const PILL = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-rose-700 ring-1 ring-rose-100">
        {children}
    </span>
);

const SectionCard = ({
    icon: Icon,
    title,
    subtitle,
    children,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) => (
    <div className="w-full max-w-2xl rounded-2xl border border-pink-100 bg-white/80 p-6 shadow-sm backdrop-blur">
        <div className="mb-4 flex items-start gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-rose-100 to-pink-50 p-3 ring-1 ring-rose-100">
                <Icon className="h-6 w-6 text-rose-600" />
            </div>
            <div>
                <h2 className="text-xl font-semibold text-rose-900">{title}</h2>
                {subtitle && (
                    <p className="mt-1 text-sm text-rose-700/80">{subtitle}</p>
                )}
            </div>
        </div>
        {children}
    </div>
);

const Progress = ({ step, total }: { step: number; total: number }) => {
    const pct = Math.round(((step + 1) / total) * 100);
    return (
        <div className="w-full max-w-2xl">
            <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Baby className="h-5 w-5 text-rose-600" />
                    <span className="text-sm font-medium text-rose-800">Your Pregnancy Profile</span>
                </div>
                <span className="text-xs text-rose-700/70">{pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-rose-100">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500 transition-all"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
};

interface OnboardingPageProps {
    onComplete?: () => void;
}

// Define proper types for form data
interface FormState {
    // Basic Profile
    name?: string;
    weeks?: number;
    firstPregnancy?: string;
    pastComplications?: string;

    // Medical & Health
    conditions?: string[];
    meds?: string;
    recentSymptoms?: string;
    checkupsOnTime?: string;

    // Diet & Hydration
    dietType?: string;
    allergies?: string;
    waterIntake?: number;
    cravings?: string;

    // Lifestyle
    workType?: string;
    sleepHours?: number;
    exerciseFreq?: string;
    stressLevel?: number;
    stressors?: string[];


    // Allow for additional fields
    [key: string]: string | number | string[] | undefined;
}

// Define field types
interface FieldBase {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    options?: string[];
}

interface TextField extends FieldBase {
    type: 'text' | 'number' | 'textarea';
}

interface SelectField extends FieldBase {
    type: 'select' | 'radio' | 'multiselect';
    options: string[];
}

type FormField = TextField | SelectField;

// Define step structure
interface Step {
    key: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle: string;
    fields: FormField[];
}

export default function OnboardingPage({ onComplete }: OnboardingPageProps = {}) {
    const steps: Step[] = useMemo(
        () =>
            [
                {
                    key: "profile",
                    icon: Calendar,
                    title: "Basic Pregnancy Profile",
                    subtitle: "Helps us personalize week-by-week guidance",
                    fields: [
                        { name: "name", label: "Your name", type: "text", placeholder: "e.g., Ananya" },
                        { name: "weeks", label: "How many weeks pregnant?", type: "number", placeholder: "e.g., 18" },
                        { name: "firstPregnancy", label: "Is this your first pregnancy?", type: "radio", options: ["Yes", "No"] },
                        { name: "pastComplications", label: "Any previous complications? (optional)", type: "textarea", placeholder: "e.g., preeclampsia in 2022" },
                    ],
                },
                {
                    key: "medical",
                    icon: HeartPulse,
                    title: "Medical & Health Background",
                    subtitle: "Only share what you&apos;re comfortable with",
                    fields: [
                        { name: "conditions", label: "Existing conditions", type: "multiselect", options: ["None", "Diabetes", "High blood pressure", "Thyroid", "Anemia", "PCOS"] },
                        { name: "meds", label: "Current medicines/supplements", type: "textarea", placeholder: "e.g., Folic acid 400 mcg, Iron, Calcium" },
                        { name: "recentSymptoms", label: "Any symptoms worrying you?", type: "textarea", placeholder: "e.g., severe swelling, headaches" },
                        { name: "checkupsOnTime", label: "Are your checkups on schedule?", type: "radio", options: ["Yes", "Sometimes", "No"] },
                    ],
                },
                {
                    key: "diet",
                    icon: Salad,
                    title: "Diet & Hydration",
                    subtitle: "We’ll tailor nutrition targets and recipes",
                    fields: [
                        { name: "dietType", label: "Diet preference", type: "select", options: ["Vegetarian", "Non-vegetarian", "Vegan", "Other"] },
                        { name: "allergies", label: "Food allergies/restrictions", type: "text", placeholder: "e.g., lactose, gluten" },
                        { name: "mealsPerDay", label: "Meals per day (approx)", type: "number", placeholder: "e.g., 3" },
                        { name: "hydration", label: "Do you meet daily water goals?", type: "radio", options: ["Yes", "No", "Not sure"] },
                    ],
                },
                {
                    key: "routine",
                    icon: Briefcase,
                    title: "Work & Daily Routine",
                    subtitle: "Balance activity and rest for your stage",
                    fields: [
                        { name: "workType", label: "Your routine", type: "select", options: ["Office job", "Work from home", "Shift work", "Homemaker", "Student"] },
                        { name: "sleepHours", label: "Night sleep (hours)", type: "number", placeholder: "e.g., 7" },
                        { name: "exercise", label: "Physical activity level", type: "select", options: ["None", "Light", "Moderate"] },
                    ],
                },
                {
                    key: "emotional",
                    icon: Smile,
                    title: "Emotional Health & Support",
                    subtitle: "We can help reduce stress and keep you motivated",
                    fields: [
                        { name: "stressors", label: "Top sources of stress", type: "multiselect", options: ["Health", "Work/Studies", "Finances", "Relationships", "Family", "Other"] },
                        { name: "support", label: "Who supports you most?", type: "select", options: ["Partner", "Parents", "Friends", "No one", "Other"] },
                        { name: "motivation", label: "Receive daily motivation stories?", type: "radio", options: ["Yes", "No"] },
                    ],
                },
                {
                    key: "access",
                    icon: MapPin,
                    title: "Location & Care Access",
                    subtitle: "Localize foods, clinics, and language",
                    fields: [
                        { name: "location", label: "City & country", type: "text", placeholder: "e.g., Kathmandu, Nepal" },
                       ],
                },
                {
                    key: "review",
                    icon: CheckCircle2,
                    title: "Review & Finish",
                    subtitle: "You can edit anything before saving",
                    fields: [],
                },
            ] as const,
        []
    );

    const [stepIndex, setStepIndex] = useState(0);
    const [form, setForm] = useState<FormState>({ conditions: [], stressors: [] });
    const [saving, setSaving] = useState(false);

    const step = steps[stepIndex];
    const totalSteps = steps.length;

    const handleChange = (name: string, value: string | number | string[]) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const next = () => setStepIndex((s) => Math.min(s + 1, totalSteps - 1));
    const back = () => setStepIndex((s) => Math.max(s - 1, 0));

    const canContinue = useMemo(() => {
        // light required fields for early steps
        if (step.key === "profile") {
            return Boolean(form.name && form.weeks);
        }
        if (step.key === "review") return true;
        return true; // keep it friendly; add stricter validation later
    }, [step.key, form.name, form.weeks]);

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                throw new Error('Failed to save profile');
            }

            const userName = form.name || 'there';
            alert(`Profile saved! Welcome to your personalized pregnancy journey, ${userName}! ✨`);
            if (onComplete) {
                onComplete();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50">
            {/* Top bar */}
            <header className="sticky top-0 z-10 border-b border-rose-100/70 bg-white/60 backdrop-blur">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-sm">
                            <MessageCircleHeart className="h-5 w-5" />
                        </div>
                        <span className="font-semibold tracking-tight text-rose-900">Create Your Pregnancy Profile.</span>
                        {/* <PILL>Pregnancy Companion</PILL> */}
                    </div>
                    <div className="hidden text-sm text-rose-700/70 md:block">Step {stepIndex + 1} of {totalSteps}</div>
                </div>
            </header>

            {/* Main */}
            <main className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-8 md:py-12">
                <Progress step={stepIndex} total={totalSteps} />

                {/* Step Card */}
                <SectionCard icon={step.icon} title={step.title} subtitle={step.subtitle}>
                    {step.key !== "review" ? (
                        <div className="grid gap-5">
                            {step.fields.map((f) => (
                                <Field
                                    key={f.name}
                                    field={f as FormField}
                                    value={form[f.name]}
                                    onChange={(v) => handleChange(f.name, v)}
                                />
                            ))}
                        </div>
                    ) : (
                        <Review form={form} />
                    )}

                    <div className="mt-6 flex items-center justify-between">
                        <button
                            onClick={back}
                            disabled={stepIndex === 0}
                            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2 text-rose-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4" /> Back
                        </button>

                        {step.key !== "review" ? (
                            <button
                                onClick={next}
                                disabled={!canContinue}
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-2 font-medium text-white shadow-md transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Next <ChevronRight className="h-4 w-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2 font-medium text-white shadow-md transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? "Saving..." : "Finish & Save"}
                            </button>
                        )}
                    </div>
                </SectionCard>

                {/* Reassurance */}
                <div className="max-w-2xl text-center text-xs text-rose-700/70">
                    Your data is encrypted in transit and stored securely. You can edit or delete it anytime from Settings.
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-rose-100/70 bg-white/60 py-6 text-center text-xs text-rose-700/70 backdrop-blur">
                Built with love for mothers • MamaGuide © {new Date().getFullYear()}
            </footer>
        </div>
    );
}

/** ------------------------------------------------------
 * Form Field Components
 * -------------------------------------------------------*/

function Field({
    field,
    value,
    onChange,
}: {
    field: FormField;
    value: string | number | string[] | undefined;
    onChange: (v: string | number | string[]) => void;
}) {
    const baseLabel = "mb-2 block text-sm font-medium text-rose-900";
    const baseInput =
        "w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-rose-900 placeholder:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300";

    switch (field.type) {
        case "text":
            return (
                <div>
                    <label className={baseLabel}>{field.label}</label>
                    <input
                        type="text"
                        className={baseInput}
                        placeholder={field.placeholder}
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
            );

        case "number":
            return (
                <div>
                    <label className={baseLabel}>{field.label}</label>
                    <input
                        type="number"
                        className={baseInput}
                        placeholder={field.placeholder}
                        value={value ?? ""}
                        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                </div>
            );

        case "textarea":
            return (
                <div>
                    <label className={baseLabel}>{field.label}</label>
                    <textarea
                        rows={3}
                        className={baseInput}
                        placeholder={field.placeholder}
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
            );

        case "radio":
            return (
                <div>
                    <span className={baseLabel}>{field.label}</span>
                    <div className="flex flex-wrap gap-2">
                        {field.options.map((opt: string) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => onChange(opt)}
                                className={`rounded-xl border px-3 py-2 text-sm shadow-sm transition ${value === opt
                                    ? "border-rose-500 bg-rose-50 text-rose-800"
                                    : "border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
                                    }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            );

        case "select":
            return (
                <div>
                    <label className={baseLabel}>{field.label}</label>
                    <select
                        className={`${baseInput} pr-8`}
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                    >
                        <option value="" disabled>
                            Select an option
                        </option>
                        {field.options.map((opt: string) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </div>
            );

        case "multiselect":
            return (
                <div>
                    <label className={baseLabel}>{field.label}</label>
                    <div className="flex flex-wrap gap-2">
                        {field.options.map((opt: string) => {
                            const selected = Array.isArray(value) && value.includes(opt);
                            return (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                        if (!Array.isArray(value)) return onChange([opt]);
                                        if (selected) onChange(value.filter((v: string) => v !== opt));
                                        else onChange([...value, opt]);
                                    }}
                                    className={`rounded-xl border px-3 py-2 text-sm shadow-sm transition ${selected
                                        ? "border-rose-500 bg-rose-50 text-rose-800"
                                        : "border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
                                        }`}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>
            );

        default:
            return null;
    }
}

function Row({ label, value }: { label: string; value: string | number | string[] | undefined }) {
    return (
        <div className="grid grid-cols-3 items-start gap-3 rounded-xl border border-rose-100 bg-white/70 p-3 text-sm">
            <div className="col-span-1 text-rose-700/80">{label}</div>
            <div className="col-span-2 font-medium text-rose-900">
                {value && typeof value === "object" ? JSON.stringify(value) : String(value ?? "—")}
            </div>
        </div>
    );
}

function Review({ form }: { form: FormState }) {
    return (
        <div className="space-y-4">
            <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-900">
                <p className="font-medium">Quick check:</p>
                <ul className="mt-2 list-inside list-disc text-rose-800/80">
                    <li>We’ll personalize tips by week and diet preferences.</li>
                    <li>AI assistant will consider your medical history and stressors.</li>
                    <li>You can edit answers anytime in Settings → Profile.</li>
                </ul>
            </div>

            <div className="grid gap-3">
                <Row label="Name" value={form.name} />
                <Row label="Weeks pregnant" value={form.weeks} />
                <Row label="First pregnancy" value={form.firstPregnancy} />
                <Row label="Past complications" value={form.pastComplications} />
                <Row label="Conditions" value={form.conditions?.join?.(", ") || form.conditions} />
                <Row label="Medicines/Supplements" value={form.meds} />
                <Row label="Recent symptoms" value={form.recentSymptoms} />
                <Row label="Checkups on time" value={form.checkupsOnTime} />
                <Row label="Diet type" value={form.dietType} />
                <Row label="Allergies" value={form.allergies} />
                <Row label="Meals/day" value={form.mealsPerDay} />
                <Row label="Hydration" value={form.hydration} />
                <Row label="Routine" value={form.workType} />
                <Row label="Sleep hours" value={form.sleepHours} />
                <Row label="Exercise" value={form.exercise} />
                <Row label="Stressors" value={form.stressors?.join?.(", ") || form.stressors} />
                <Row label="Support" value={form.support} />
                <Row label="Motivation stories" value={form.motivation} />
                <Row label="Location" value={form.location} />
            </div>
        </div>
    );
}
