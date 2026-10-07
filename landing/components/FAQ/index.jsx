"use client";

import { useState } from "react";
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

const faqs = [
    {
        question: "كيف يمكنني حجز رحلة؟",
        answer: "عملية الحجز سهلة وميسرة. يمكنك البدء بتعبئة نموذج الاستفسار عبر موقعنا أو التواصل معنا عبر الواتساب. سيقوم فريقنا بمساعدتك في اختيار وتصميم رحلتك المثالية."
    },
    {
        question: "هل يمكنني تخصيص الباقات السياحية؟",
        answer: "بالتأكيد. جميع رحلاتنا يمكن تخصيصها بالكامل لتناسب احتياجاتكم. نحن نقدم مرونة عالية في اختيار الفنادق والمزارات السياحية والجولات الميدانية."
    },
    {
        question: "هل تتوفر خدمات للحج والعمرة؟",
        answer: "نعم، نقدم برامج متميزة للحج والعمرة مع إقامة مريحة في فنادق قريبة من الحرم المكي والمسجد النبوي، مع توفير كافة سبل الراحة والطمأنينة."
    },
    {
        question: "ما هي طرق الدفع المتاحة؟",
        answer: "نقبل مجموعة واسعة من طرق الدفع الآمنة، بما في ذلك البطاقات الائتمانية، التحويلات البنكية، وبوابات الدفع الإلكترونية المعتمدة."
    },
    {
        question: "هل تقدمون دعماً أثناء الرحلة؟",
        answer: "نعم، فريق MelGo Travel متاح لدعمكم ومتابعتكم طوال فترة الرحلة لضمان سير الأمور بسلاسة ومعالجة أي استفسارات أو احتياجات قد تطرأ."
    }
];

export default function FAQ() {
    const [open, setOpen] = useState(null);

    return (
        <section
            dir="rtl"
            className={`${amiri.variable} ${tajawal.variable} relative overflow-hidden bg-[#FAF6F0] py-20 font-[family-name:var(--font-tajawal)] text-[#5C4732]`}
        >
            <IslamicPattern id="pat-faq" className="absolute inset-0 h-full w-full animate-pattern-drift text-[#8B6F52]/35" />

            <div className="relative grid gap-12 px-[6%] lg:grid-cols-[1fr_1.6fr]">
                {/* Sidebar */}
                <div className="lg:sticky lg:top-8 lg:self-start">
                    <span className="mb-4 inline-block rounded-full bg-[#F1E8DC] px-4 py-1.5 text-xs font-bold tracking-widest text-[#8B6F52]">
                        ✦ الأسئلة الشائعة
                    </span>
                    <h2 className="mb-4 font-[family-name:var(--font-amiri)] text-3xl font-bold leading-snug md:text-4xl">
                        أسئلة يسألها عملاؤنا كثيراً
                    </h2>
                    <p className="font-light leading-relaxed text-[#8B6F52]">
                        هل لديك استفسار حول رحلتك القادمة؟ إليك إجابات سريعة على أكثر الأسئلة شيوعاً.
                    </p>

                    <a href="#"
                        className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#8B6F52] px-7 py-3.5 text-sm font-bold text-[#FAF6F0] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#5C4732] hover:shadow-lg">
                        تواصل معنا ←
                    </a>
                </div>

                {/* Accordion */}
                <div className="space-y-3">
                    {faqs.map((faq, idx) => {
                        const isOpen = open === idx;
                        return (
                            <div
                                key={idx}
                                className={`overflow-hidden rounded-2xl border transition-all duration-150 ${isOpen ? "border-[#C9A876] bg-white shadow-md" : "border-[#F1E8DC] bg-white hover:border-[#C9A876]/50"}`}
                            >
                                <button
                                    onClick={() => setOpen(isOpen ? null : idx)}
                                    className="flex w-full items-center justify-between px-6 py-4 text-right"
                                    aria-expanded={isOpen}
                                >
                                    <h3 className="text-base font-bold">{faq.question}</h3>
                                    <span className={`mr-4 shrink-0 text-[#8B6F52] transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </span>
                                </button>

                                <div
                                    className="grid transition-all duration-200"
                                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                                >
                                    <div className="overflow-hidden">
                                        <p className="px-6 pb-5 text-sm font-light leading-relaxed text-[#8B6F52]">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
