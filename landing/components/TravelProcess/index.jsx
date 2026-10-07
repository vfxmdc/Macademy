"use client";

import { Amiri, Tajawal } from "next/font/google";

const amiri = Amiri({ subsets: ["arabic"], weight: ["700"], variable: "--font-amiri" });
const tajawal = Tajawal({ subsets: ["arabic"], weight: ["300", "400", "500", "700"], variable: "--font-tajawal" });

const STAR =
    "M25 0 L9.7 4.02 L17.68 17.68 L4.02 9.7 L0 25 L-4.02 9.7 L-17.68 17.68 " +
    "L-9.7 4.02 L-25 0 L-9.7 -4.02 L-17.68 -17.68 L-4.02 -9.7 L0 -25 " +
    "L4.02 -9.7 L17.68 -17.68 L9.7 -4.02 Z";

function IslamicPattern({ id, className }) {
    return (
        <svg className={className} aria-hidden="true">
            <defs>
                <pattern id={id} width="80" height="80" patternUnits="userSpaceOnUse">
                    {[[0, 0], [80, 0], [0, 80], [80, 80], [40, 40]].map(([x, y], i) => (
                        <g key={i} transform={`translate(${x} ${y})`}>
                            <path d={STAR} fill="currentColor" fillOpacity=".22" stroke="currentColor" strokeWidth="1.2" />
                            <path d={STAR} transform="scale(.55)" fill="none" stroke="currentColor" strokeWidth="1" />
                            <circle r="3" fill="currentColor" />
                        </g>
                    ))}
                    {[[40, 0], [0, 40], [80, 40], [40, 80]].map(([x, y], i) => (
                        <circle key={i} cx={x} cy={y} r="2.5" fill="currentColor" fillOpacity=".8" />
                    ))}
                </pattern>
            </defs>
            <rect width="200%" height="200%" fill={`url(#${id})`} />
        </svg>
    );
}

const steps = [
    {
        number: "01",
        title: "أخبرنا بوجهتك",
        description: "شاركنا وجهتك المفضلة ومواعيدك وميزانيتك مع فريقنا المتخصص.",
        icon: "🗺️",
    },
    {
        number: "02",
        title: "احصل على العرض",
        description: "نقدم لك أفضل العروض الفندقية والسياحية المناسبة لاحتياجاتك.",
        icon: "📋",
    },
    {
        number: "03",
        title: "أكد حجزك",
        description: "وافق على العرض وأكد حجزك بكل سهولة وأمان.",
        icon: "✅",
    },
    {
        number: "04",
        title: "استمتع برحلتك",
        description: "انطلق في رحلتك مع دعمنا المتواصل قبل وأثناء السفر.",
        icon: "✈️",
    },
];

export default function TravelProcess() {
    return (
        <section
            dir="rtl"
            className={`${amiri.variable} ${tajawal.variable} relative overflow-hidden bg-[#F1E8DC]/50 py-20 font-[family-name:var(--font-tajawal)] text-[#5C4732]`}
        >
            <IslamicPattern id="pat-process" className="absolute inset-0 h-full w-full animate-pattern-drift text-[#8B6F52]/35" />

            {/* Header */}
            <div className="relative mb-16 px-[6%] text-center">
                <span className="mb-4 inline-block rounded-full bg-[#FAF6F0] px-4 py-1.5 text-xs font-bold tracking-widest text-[#8B6F52]">
                    ✦ كيف نعمل
                </span>
                <h2 className="font-[family-name:var(--font-amiri)] text-4xl font-bold md:text-5xl">عملية الحجز خطوة بخطوة</h2>
                <p className="mt-3 font-light text-[#8B6F52]">عملية سلسة ومريحة مصممة لتحقيق رحلة أحلامك</p>
            </div>

            {/* Steps */}
            <div className="relative grid gap-8 px-[6%] sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((step, i) => (
                    <div key={i} className="group relative">
                        {/* Connector line (desktop only) */}
                        {i < steps.length - 1 && (
                            <div className="absolute left-0 top-7 hidden h-0.5 w-full -translate-y-1/2 bg-gradient-to-l from-[#C9A876] to-[#F1E8DC] lg:block" style={{ left: "50%", width: "100%" }} />
                        )}

                        <div className="relative flex flex-col items-center text-center">
                            {/* Number badge */}
                            <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#8B6F52] text-lg font-bold text-[#FAF6F0] shadow-lg shadow-[#5C4732]/20 transition-all duration-150 group-hover:scale-110 group-hover:bg-[#5C4732]">
                                <span>{step.number}</span>
                                <div className="absolute -inset-1.5 rounded-full border border-[#C9A876]/40" />
                            </div>

                            <div className="mb-3 text-3xl">{step.icon}</div>
                            <h3 className="mb-2 font-[family-name:var(--font-amiri)] text-xl font-bold">{step.title}</h3>
                            <p className="text-sm font-light leading-relaxed text-[#8B6F52]">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
