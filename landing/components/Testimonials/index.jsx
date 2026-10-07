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

const testimonials = [
    {
        name: "Khireddine Lilia",
        country: "الجزائر",
        rating: 5,
        initials: "KL",
        text: "شكراً على استقبالكم وحسن معاملتكم، ماشاء الله على خدمتكم الله يبارك لكم في عملكم."
    },
    {
        name: "Behaz Said",
        country: "الجزائر",
        rating: 5,
        initials: "BS",
        text: "كل الشكر والتقدير لطاقم الوكالة، حسن استقبال وتوجيه، ماشاء الله بالتوفيق."
    },
    {
        name: "Soltani Amina",
        country: "الجزائر",
        rating: 5,
        initials: "SA",
        text: "وكالة في القمة اللهم بارك، استقبال مميز وتسهيلات للزبائن، مشكورين على مجهوداتكم."
    },
];

export default function Testimonials() {
    return (
        <section
            dir="rtl"
            className={`${amiri.variable} ${tajawal.variable} relative overflow-hidden bg-[#FAF6F0] py-20 font-[family-name:var(--font-tajawal)] text-[#5C4732]`}
        >
            <IslamicPattern id="pat-test" className="absolute inset-0 h-full w-full animate-pattern-drift text-[#8B6F52]/35" />

            {/* Header */}
            <div className="relative mb-14 px-[6%] text-center">
                <span className="mb-4 inline-block rounded-full bg-[#F1E8DC] px-4 py-1.5 text-xs font-bold tracking-widest text-[#8B6F52]">
                    ✦ آراء عملائنا
                </span>
                <h2 className="font-[family-name:var(--font-amiri)] text-4xl font-bold md:text-5xl">ماذا يقول عملاؤنا</h2>
                <p className="mt-3 font-light text-[#8B6F52]">تجارب حقيقية من عملاء استمتعوا برحلاتهم معنا</p>
            </div>

            {/* Cards */}
            <div className="relative grid gap-6 px-[6%] md:grid-cols-3">
                {testimonials.map((t, i) => (
                    <div
                        key={i}
                        className="group flex flex-col gap-5 rounded-2xl border border-[#F1E8DC] bg-white p-7 shadow-sm transition-all duration-150 hover:-translate-y-1 hover:border-[#C9A876]/50 hover:shadow-lg hover:shadow-[#5C4732]/10"
                    >
                        {/* Quote icon */}
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C9A876" strokeWidth="1.5" strokeOpacity="0.5" className="shrink-0">
                            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v4c0 1.25.75 2 2 2h4c0 4-4 6-4 6M14 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v4c0 1.25.75 2 2 2h4c0 4-4 6-4 6" />
                        </svg>

                        <p className="flex-1 text-sm font-light leading-loose text-[#5C4732]">"{t.text}"</p>

                        {/* Stars */}
                        <div className="flex gap-0.5">
                            {[...Array(t.rating)].map((_, idx) => (
                                <svg key={idx} width="16" height="16" viewBox="0 0 24 24" fill="#C9A876" stroke="#C9A876">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                            ))}
                        </div>

                        {/* Profile */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#A98B6F] to-[#5C4732] text-sm font-bold text-[#FAF6F0]">
                                {t.initials}
                            </div>
                            <div>
                                <p className="text-sm font-bold">{t.name}</p>
                                <p className="text-xs text-[#A98B6F]">{t.country}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
