"use client";

import { useEffect, useRef, useState } from "react";
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

function useCountUp(target, duration = 1600) {
    const [val, setVal] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            obs.disconnect();
            let start;
            const step = (ts) => {
                if (!start) start = ts;
                const p = Math.min((ts - start) / duration, 1);
                setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
                if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        }, { threshold: 0.3 });
        obs.observe(el);
        return () => obs.disconnect();
    }, [target, duration]);
    return [val, ref];
}

const STATS = [
    { target: 10000, suffix: "+", label: "عميل سعيد", desc: "استمتعوا بتجارب سفر استثنائية معنا" },
    { target: 120, suffix: "+", label: "وجهة سياحية", desc: "وجهات مختارة بعناية حول العالم" },
    { target: 15, suffix: "", label: "سنة خبرة", desc: "خبرة واحترافية في تنظيم الرحلات" },
    { target: 98, suffix: "%", label: "نسبة الرضا", desc: "التزام بتقديم أفضل الخدمات" },
];

function StatCard({ stat }) {
    const [val, ref] = useCountUp(stat.target);
    const fmt = new Intl.NumberFormat("ar-DZ-u-nu-latn");
    return (
        <div ref={ref} className="group text-center transition-transform duration-100 hover:scale-105">
            <b className="block font-[family-name:var(--font-amiri)] text-4xl font-bold text-[#C9A876] tabular-nums md:text-5xl">
                {fmt.format(val)}{stat.suffix}
            </b>
            <span className="mt-1 block text-base font-bold text-[#FAF6F0]">{stat.label}</span>
            <p className="mt-1 text-sm font-light text-[#FAF6F0]/65">{stat.desc}</p>
        </div>
    );
}

export default function TravelStats() {
    return (
        <section
            dir="rtl"
            className={`${amiri.variable} ${tajawal.variable} relative overflow-hidden bg-[#5C4732] py-20 font-[family-name:var(--font-tajawal)] text-[#FAF6F0]`}
        >
            <IslamicPattern id="pat-stats" className="absolute inset-0 h-full w-full animate-pattern-drift text-[#C9A876]/30" />
            <div className="relative h-1 bg-gradient-to-l from-transparent via-[#C9A876] to-transparent" />

            <div className="relative px-[6%] pt-12">
                <div className="mb-14 text-center">
                    <span className="mb-4 inline-block rounded-full bg-[#FAF6F0]/10 px-4 py-1.5 text-xs font-bold tracking-widest text-[#C9A876]">
                        ✦ أرقامنا تتحدث
                    </span>
                    <h2 className="font-[family-name:var(--font-amiri)] text-4xl font-bold md:text-5xl">إنجازاتنا بالأرقام</h2>
                </div>

                <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
                    {STATS.map((s) => <StatCard key={s.label} stat={s} />)}
                </div>
            </div>

            <div className="relative mt-12 h-1 bg-gradient-to-l from-transparent via-[#C9A876] to-transparent" />
        </section>
    );
}
