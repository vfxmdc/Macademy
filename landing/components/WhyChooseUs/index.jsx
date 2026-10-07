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

const features = [
    {
        title: "أفضل الأسعار",
        description: "نقدم أفضل الأسعار التنافسية التي تناسب جميع الميزانيات.",
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
            </svg>
        )
    },
    {
        title: "خدمات الحج والعمرة",
        description: "خدمات متكاملة لتنظيم رحلات الحج والعمرة بأفضل جودة وراحة.",
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        )
    },
    {
        title: "حجوزات فنادق وطيران",
        description: "نقوم بحجز الفنادق وتذاكر الطيران والرحلات البحرية بكل سهولة وموثوقية.",
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
        )
    },
    {
        title: "تقديم ملفات التأشيرة",
        description: "مساعدة في تجهيز وتقديم ملفات التأشيرة لجميع أنواع الرحلات.",
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" />
            </svg>
        )
    },
    {
        title: "دعم قبل وأثناء الرحلة",
        description: "فريقنا معك دائماً لضمان راحتك قبل وأثناء الرحلة.",
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        title: "برامج سياحية متنوعة",
        description: "برامج سياحية مختارة بعناية لتناسب جميع الأذواق والميزانيات.",
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        )
    }
];

export default function WhyChooseUs() {
    return (
        <section
            dir="rtl"
            className={`${amiri.variable} ${tajawal.variable} relative overflow-hidden bg-[#FAF6F0] py-20 font-[family-name:var(--font-tajawal)] text-[#5C4732]`}
        >
            <IslamicPattern id="pat-why" className="absolute inset-0 h-full w-full animate-pattern-drift text-[#8B6F52]/35" />

            <div className="relative mb-14 px-[6%] text-center">
                <span className="mb-4 inline-block rounded-full bg-[#F1E8DC] px-4 py-1.5 text-xs font-bold tracking-widest text-[#8B6F52]">
                    ✦ لماذا تختارنا
                </span>
                <h2 className="font-[family-name:var(--font-amiri)] text-4xl font-bold md:text-5xl">لماذا تختار MelGo Travel؟</h2>
                <p className="mt-3 font-light text-[#8B6F52]">
                    نقدم لكم خدمات سفر استثنائية بمعايير عالية لضمان تجربة تتجاوز توقعاتكم.
                </p>
            </div>

            <div className="relative grid gap-6 px-[6%] sm:grid-cols-2 lg:grid-cols-3">
                {features.map((f, i) => (
                    <div
                        key={i}
                        className="group flex flex-col gap-4 rounded-2xl border border-[#F1E8DC] bg-white p-7 shadow-sm shadow-[#5C4732]/5 transition-all duration-150 hover:-translate-y-1 hover:border-[#C9A876] hover:shadow-lg hover:shadow-[#5C4732]/10"
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F1E8DC] text-[#8B6F52] transition-all duration-150 group-hover:bg-[#8B6F52] group-hover:text-[#FAF6F0]">
                            {f.icon}
                        </div>
                        <h3 className="font-[family-name:var(--font-amiri)] text-xl font-bold">{f.title}</h3>
                        <p className="text-sm font-light leading-relaxed text-[#8B6F52]">{f.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
