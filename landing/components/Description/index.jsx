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

export default function Description() {
    return (
        <section
            dir="rtl"
            className={`${amiri.variable} ${tajawal.variable} relative overflow-hidden bg-[#5C4732] py-24 font-[family-name:var(--font-tajawal)] text-[#FAF6F0]`}
        >
            <IslamicPattern id="pat-desc" className="absolute inset-0 h-full w-full animate-pattern-drift text-[#C9A876]/30" />

            <div className="relative px-[6%]">
                <div className="mx-auto max-w-4xl text-center">
                    <span className="mb-6 inline-block rounded-full bg-[#FAF6F0]/10 px-4 py-1.5 text-xs font-bold tracking-widest text-[#C9A876]">
                        ✦ وكالتنا
                    </span>

                    <h2 className="mb-8 font-[family-name:var(--font-amiri)] text-4xl font-bold leading-snug md:text-6xl md:leading-snug">
                        اكتشف العالم مع{" "}
                        <span className="relative inline-block text-[#C9A876]">
                            MelGo Travel
                            <svg className="absolute -bottom-2 right-0 w-full" height="8" viewBox="0 0 200 8" preserveAspectRatio="none">
                                <path d="M0 6 Q50 0 100 5 T200 4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h2>

                    <p className="mx-auto mb-10 max-w-2xl text-lg font-light leading-loose text-[#FAF6F0]/80">
                        في وكالتنا نؤمن أن السفر ليس مجرد انتقال من مكان إلى آخر، بل هو تجربة تصنع أجمل الذكريات. نقدم لكم أفضل العروض السياحية والفندقية المختارة بعناية لتوفير الراحة، الجودة، والأسعار المناسبة.
                    </p>

                    <a
                        href="#"
                        className="group relative inline-block overflow-hidden rounded-full bg-[#C9A876] px-12 py-4 text-base font-bold text-[#5C4732] transition-all duration-150 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30"
                    >
                        <span className="relative z-10">اكتشف المزيد ←</span>
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-l from-transparent via-white/30 to-transparent transition-transform duration-400 group-hover:translate-x-full" />
                    </a>
                </div>

                {/* Stat strip */}
                <div className="mt-20 grid grid-cols-2 gap-6 border-t border-[#FAF6F0]/15 pt-12 md:grid-cols-4">
                    {[
                        ["15+", "سنة من الخبرة"],
                        ["10,000+", "عميل سعيد"],
                        ["120+", "وجهة سياحية"],
                        ["98%", "نسبة الرضا"],
                    ].map(([num, label]) => (
                        <div key={label} className="text-center transition-transform duration-100 hover:scale-105">
                            <b className="block font-[family-name:var(--font-amiri)] text-3xl text-[#C9A876] tabular-nums md:text-4xl">{num}</b>
                            <span className="mt-1 block text-sm tracking-wide text-[#FAF6F0]/70">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
