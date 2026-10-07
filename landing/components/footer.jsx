"use client";

import { Amiri, Tajawal } from "next/font/google";

const amiri = Amiri({ subsets: ["arabic"], weight: ["700"], variable: "--font-amiri" });
const tajawal = Tajawal({ subsets: ["arabic"], weight: ["300", "400", "500", "700"], variable: "--font-tajawal" });

/* ── زخرفة "النجمة والصليب" ─────────────────────────────── */
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

const SOCIALS = [
    { label: "إنستغرام", href: "https://www.instagram.com/melgo_tourisme_et_voyages_llc/" },
    { label: "فيسبوك", href: "https://www.facebook.com/melakhsouvoyages/?locale=fr_FR" },
    { label: "تيك توك", href: "https://www.tiktok.com/@melgo2025" },
];

const NAV_LINKS = [
    { label: "الرئيسية", href: "/" },
    { label: "باقات العمرة", href: "/umrah" },
    { label: "باقات الحج", href: "/#hajj" },
    { label: "التأشيرات", href: "/#visas" },
    { label: "اتصل بنا", href: "/#contact" },
];

export default function Footer() {
    return (
        <footer
            dir="rtl"
            className={`${amiri.variable} ${tajawal.variable} relative overflow-hidden bg-[#5C4732] font-[family-name:var(--font-tajawal)] text-[#FAF6F0]`}
        >
            <IslamicPattern id="pat-footer" className="absolute inset-0 h-full w-full animate-pattern-drift text-[#C9A876]/30" />

            {/* شريط ذهبي علوي */}
            <div className="relative h-1 bg-gradient-to-l from-transparent via-[#C9A876] to-transparent" />

            <div className="relative px-[6%] py-16">

                {/* ── دعوة كبيرة للتواصل ── */}
                <div className="mb-14 text-center">
                    <a
                        href="#"
                        dir="ltr"
                        className="group relative mb-6 inline-block overflow-hidden rounded-2xl bg-black px-6 py-2.5 font-[family-name:var(--font-amiri)] text-4xl font-bold transition-all duration-150 hover:scale-105 hover:shadow-lg hover:shadow-black/30"
                    >
                        <span className="inline-block text-white transition-colors duration-300 group-hover:text-[#A98B6F]">Mel</span>
                        <span className="inline-block text-[#A98B6F] transition-all duration-300 group-hover:-translate-y-1 group-hover:text-white">Go</span>
                    </a>

                    <h2 className="font-[family-name:var(--font-amiri)] text-4xl font-bold leading-snug md:text-6xl">
                        مستعد لرحلتك{" "}
                        <span className="relative inline-block text-[#C9A876]">
                            القادمة؟
                            <svg className="absolute -bottom-2 right-0 w-full text-[#C9A876]" height="8" viewBox="0 0 200 8" preserveAspectRatio="none">
                                <path d="M0 6 Q50 0 100 5 T200 4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h2>

                    <a
                        href="#"
                        className="group relative mt-10 inline-block overflow-hidden rounded-full bg-[#C9A876] px-12 py-5 text-lg font-bold text-[#5C4732] transition-all duration-150 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30"
                    >
                        <span className="relative z-10">تواصل معنا ←</span>
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-l from-transparent via-white/30 to-transparent transition-transform duration-400 group-hover:translate-x-full" />
                    </a>
                </div>

                {/* ── شبكة المعلومات والمحتوى ── */}
                <div className="mb-14 grid gap-10 border-t border-b border-[#FAF6F0]/15 py-12 md:grid-cols-3">
                    
                    {/* عن الوكالة */}
                    <div>
                        <h3 className="mb-4 font-[family-name:var(--font-amiri)] text-2xl font-bold text-[#C9A876]">وكالة MelGo للسياحة والأسفار</h3>
                        <p className="text-sm font-light leading-relaxed text-[#FAF6F0]/80">
                            وكالة جزائرية معتمدة متخصصة في تنظيم رحلات الحج والعمرة والأسفار السياحية، مع تقديم أفضل خدمات الإقامة والتأشيرات والتأطير الروحاني المتميز.
                        </p>
                    </div>

                    {/* روابط سريعة */}
                    <div className="flex flex-col items-start md:items-center">
                        <h3 className="mb-4 font-[family-name:var(--font-amiri)] text-2xl font-bold text-[#C9A876]">روابط سريعة</h3>
                        <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-[#FAF6F0]/80">
                            {NAV_LINKS.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="transition-colors hover:text-[#C9A876]">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* وسائل التواصل الاجتماعي والمعلومات */}
                    <div>
                        <h3 className="mb-4 font-[family-name:var(--font-amiri)] text-2xl font-bold text-[#C9A876]">تابعنا على</h3>
                        <div className="flex flex-wrap gap-3">
                            {SOCIALS.map((soc) => (
                                <a
                                    key={soc.label}
                                    href={soc.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full border border-[#C9A876]/40 px-5 py-2 text-xs font-medium text-[#FAF6F0] transition-all duration-300 hover:border-[#C9A876] hover:bg-[#C9A876] hover:text-[#5C4732]"
                                >
                                    {soc.label}
                                </a>
                            ))}
                        </div>
                    </div>

                </div>

                {/* ── أسفل الفوتر / الحقوق ── */}
                <div className="flex flex-col items-center justify-between gap-4 text-xs font-light text-[#FAF6F0]/60 sm:flex-row">
                    <p>© {new Date().getFullYear()} MelGo Travel & Tourism. جميع الحقوق محفوظة.</p>
                    <p>صُمم بأعلى معايير الجودة والروحانية ✦</p>
                </div>

            </div>
        </footer>
    );
}
