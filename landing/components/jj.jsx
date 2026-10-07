"use client";

import { useEffect, useRef, useState } from "react";
import { Amiri, Tajawal } from "next/font/google";

const amiri = Amiri({ subsets: ["arabic"], weight: ["700"], variable: "--font-amiri" });
const tajawal = Tajawal({ subsets: ["arabic"], weight: ["300", "400", "500", "700"], variable: "--font-tajawal" });

/* ── تصحيح يدوي للوقت: +1 ساعة (ضعه 0 لإلغاء التصحيح) ──── */
const TIME_OFFSET_MS = 60 * 60 * 1000;
const getNow = () => new Date(Date.now() + TIME_OFFSET_MS);

/* ── الساعات الحية ─────────────────────────────────────── */
const fmtOpts = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
const fmtDZ = new Intl.DateTimeFormat("ar-DZ-u-nu-latn", { ...fmtOpts, timeZone: "Africa/Algiers" });
const fmtSA = new Intl.DateTimeFormat("ar-SA-u-nu-latn", { ...fmtOpts, timeZone: "Asia/Riyadh" });
const fmtHijri = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Riyadh",
});
const fmtGreg = new Intl.DateTimeFormat("ar-DZ-u-nu-latn", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Algiers",
});

function useClocks() {
    const [t, setT] = useState({ dz: "--:--:--", sa: "--:--:--", hijri: "...", greg: "..." });
    useEffect(() => {
        const tick = () => {
            const now = getNow();
            setT({
                dz: fmtDZ.format(now),
                sa: fmtSA.format(now),
                hijri: fmtHijri.format(now),
                greg: fmtGreg.format(now),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);
    return t;
}

/* ── مواقيت الصلاة في مكة (Aladhan API — مجاني بدون مفتاح) ── */
const PRAYERS = [
    ["Fajr", "الفجر"],
    ["Dhuhr", "الظهر"],
    ["Asr", "العصر"],
    ["Maghrib", "المغرب"],
    ["Isha", "العشاء"],
];
const PRAYING_WINDOW = 25; // دقائق بعد الأذان تُعتبر "وقت صلاة"

function usePrayerTimes() {
    const [times, setTimes] = useState(null);
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("https://api.aladhan.com/v1/timingsByCity?city=Makkah&country=Saudi%20Arabia&method=4");
                const json = await res.json();
                setTimes(json?.data?.timings ?? null);
            } catch { /* يبقى الشريط بدون مواقيت */ }
        })();
    }, []);
    return times;
}

/* حالة الصلاة: هل يُصلّى الآن؟ وإلا ما هي الصلاة القادمة وبعد كم؟ */
function prayerStatus(timings, timeZone) {
    if (!timings) return null;
    const [h, m] = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit", minute: "2-digit", hour12: false, timeZone,
    }).format(getNow()).split(":").map(Number);
    const nowMin = h * 60 + m;

    const list = PRAYERS.map(([key, ar]) => {
        const [ph, pm] = timings[key].split(":").map(Number);
        return { ar, min: ph * 60 + pm };
    });

    for (const p of list) {
        if (nowMin >= p.min && nowMin < p.min + PRAYING_WINDOW) return { praying: true, name: p.ar };
    }
    const next = list.find((p) => p.min > nowMin) ?? { ...list[0], min: list[0].min + 1440 };
    const diff = next.min - nowMin;
    const hh = Math.floor(diff / 60), mm = diff % 60;
    return { praying: false, name: next.ar, remaining: hh > 0 ? `${hh} س ${mm} د` : `${mm} د` };
}

/* ── عدّاد متحرك للإحصائيات ────────────────────────────── */
function useCountUp(target, duration = 1800) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        let start;
        const step = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration]);
    return val;
}

/* ── زخرفة "النجمة والصليب" (خاتم) — نجوم ثمانية متشابكة ── */
const STAR =
    "M25 0 L9.7 4.02 L17.68 17.68 L4.02 9.7 L0 25 L-4.02 9.7 L-17.68 17.68 " +
    "L-9.7 4.02 L-25 0 L-9.7 -4.02 L-17.68 -17.68 L-4.02 -9.7 L0 -25 " +
    "L4.02 -9.7 L17.68 -17.68 L9.7 -4.02 Z";

function IslamicPattern({ id, className, animate = false }) {
    return (
        <svg className={`${className} ${animate ? "animate-pattern-drift" : ""}`} aria-hidden="true">
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

/* ── المكوّن الرئيسي ───────────────────────────────────── */
export default function HeroSection() {
    const { dz, sa, hijri, greg } = useClocks();
    const prayerTimes = usePrayerTimes();
    const [menuOpen, setMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const heroRef = useRef(null);
    const cardRef = useRef(null);

    useEffect(() => setMounted(true), []);

    /* ── تأثير الإمالة الثلاثية الأبعاد للبطاقة عند تحريك الماوس (Tilted Card Effect) ── */
    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -18; // 18 degree tilt
            const rotateY = ((x - centerX) / centerX) * 18;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        };

        const handleMouseLeave = () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        };

        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            card.removeEventListener("mousemove", handleMouseMove);
            card.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    /* تُحسب مع كل ثانية (المكوّن يعيد التصيير بسبب الساعة) */
    const saPrayer = prayerStatus(prayerTimes, "Asia/Riyadh");

    const years = useCountUp(15);
    const pilgrims = useCountUp(20);
    const visa = useCountUp(100);

    const navLinks = [
        { label: "الرئيسية", href: "/" },
        { label: "باقات الحج", href: "/#hajj" },
        { label: "باقات العمرة", href: "/umrah" },
        { label: "التأشيرات", href: "/#visas" },
        { label: "اتصل بنا", href: "/#contact" },
    ];
    const reveal = (delay) =>
        `transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`
        + ` [transition-delay:${delay}ms]`;

    return (
        <div id="hero" dir="rtl" className={`${amiri.variable} ${tajawal.variable} bg-[#FAF6F0] font-[family-name:var(--font-tajawal)] text-[#5C4732]`}>

            <style>{`
        @keyframes pattern-drift { from { transform: translate(0,0); } to { transform: translate(-80px,-80px); } }
        .animate-pattern-drift { animation: pattern-drift 60s linear infinite; will-change: transform; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 0 0 rgba(139,111,82,.45); } 50% { box-shadow: 0 0 0 12px rgba(139,111,82,0); } }
        @keyframes pray-pulse { 0%,100% { opacity: 1; } 50% { opacity: .65; } }
      `}</style>

            {/* ── الشريط العلوي: الساعات والتواريخ ومواقيت مكة في سطر واحد ── */}
            <div className="relative overflow-hidden bg-[#5C4732] text-[#FAF6F0]">
                <IslamicPattern id="pat-top" className="absolute inset-0 h-full w-full text-[#C9A876]/30" animate />
                <div className="relative flex flex-wrap items-center justify-center gap-x-10 gap-y-1 px-4 py-2 text-sm tracking-wide">
                    <div className="flex items-center gap-2">
                        <span>🇩🇿</span>
                        <span className="font-medium text-[#C9A876]">الجزائر</span>
                        <span className="font-bold tabular-nums" dir="ltr">{dz}</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium text-[#C9A876]">
                        <span className="animate-pulse">☪</span>
                        <span suppressHydrationWarning>{hijri}</span>
                        <span className="text-[#FAF6F0]/40">|</span>
                        <span suppressHydrationWarning className="text-[#FAF6F0]/90">{greg}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>🇸🇦</span>
                        <span className="font-medium text-[#C9A876]">السعودية</span>
                        <span className="font-bold tabular-nums" dir="ltr">{sa}</span>
                    </div>
                    {saPrayer && (
                        saPrayer.praying ? (
                            <div className="flex items-center gap-1.5 rounded-full bg-[#C9A876] px-3 py-0.5 text-xs font-bold text-[#5C4732] [animation:pray-pulse_1.5s_ease-in-out_infinite]">
                                🕌 يُصلّى الآن في مكة: صلاة {saPrayer.name}
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 text-xs">
                                <span className="text-[#C9A876]">🕌 الصلاة القادمة في مكة:</span>
                                <span className="font-bold">{saPrayer.name}</span>
                                <span className="text-[#FAF6F0]/70">بعد {saPrayer.remaining}</span>
                            </div>
                        )
                    )}
                </div>
                <div className="relative h-1 bg-gradient-to-l from-transparent via-[#C9A876] to-transparent" />
            </div>

            {/* ── شريط التنقل: الأزرار يمين، الشعار يسار ── */}
            <nav className="sticky top-0 z-50 border-b border-[#F1E8DC] bg-[#FAF6F0]/95 backdrop-blur">
                <div className="flex items-center justify-between px-[6%] py-4">
                    {/* الأزرار (أول عنصر = أقصى اليمين في RTL) */}
                    <div className="hidden items-center gap-3 lg:flex">
                        <a href="/umrah" className="rounded-full bg-[#8B6F52] px-6 py-2.5 text-sm font-bold text-[#FAF6F0] transition-all duration-150 hover:scale-105 hover:bg-[#5C4732] [animation:glow_2.5s_ease-in-out_infinite]">
                            احجز الآن
                        </a>
                        <a href="/#contact" className="rounded-full border-[1.5px] border-[#A98B6F] px-6 py-2.5 text-sm font-bold transition-all duration-150 hover:scale-105 hover:bg-[#A98B6F] hover:text-[#FAF6F0]">
                            اتصل بنا
                        </a>
                    </div>

                    {/* الروابط في الوسط */}
                    <ul className="hidden items-center gap-8 lg:flex">
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <a href={link.href} className="group relative pb-1 text-sm font-medium text-[#8B6F52] transition-colors duration-150 hover:text-[#5C4732]">
                                    {link.label}
                                    <span className="absolute bottom-0 right-0 h-0.5 w-0 bg-[#C9A876] transition-all duration-150 group-hover:w-full" />
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* الشعار (آخر عنصر = أقصى اليسار في RTL) */}
                    <a
                        href="/"
                        dir="ltr"
                        className="group relative overflow-hidden rounded-2xl bg-black px-5 py-2 font-[family-name:var(--font-amiri)] text-4xl font-bold transition-all duration-150 hover:scale-105 hover:shadow-lg hover:shadow-black/30"
                    >
                        <span className="inline-block text-white transition-colors duration-150 group-hover:text-[#A98B6F]">Mel</span>
                        <span className="inline-block text-[#A98B6F] transition-all duration-150 group-hover:-translate-y-1 group-hover:text-white">Go</span>
                        <span className="absolute bottom-1 left-5 right-5 h-0.5 w-0 bg-[#C9A876] transition-all duration-150 group-hover:w-[calc(100%-2.5rem)]" />
                    </a>

                    {/* زر القائمة للجوال */}
                    <button onClick={() => setMenuOpen(!menuOpen)} className="flex flex-col gap-1.5 lg:hidden" aria-label="القائمة">
                        <span className={`h-0.5 w-6 bg-[#5C4732] transition-all duration-150 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
                        <span className={`h-0.5 w-6 bg-[#5C4732] transition-all duration-150 ${menuOpen ? "opacity-0" : ""}`} />
                        <span className={`h-0.5 w-6 bg-[#5C4732] transition-all duration-150 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
                    </button>
                </div>

                {/* قائمة الجوال المنسدلة */}
                <div className={`grid overflow-hidden transition-all duration-200 lg:hidden ${menuOpen ? "grid-rows-[1fr] border-t border-[#F1E8DC]" : "grid-rows-[0fr]"}`}>
                    <ul className="min-h-0 space-y-1 overflow-hidden px-[6%]">
                        {navLinks.map((link, i) => (
                            <li key={link.label} className={`transition-all duration-150 ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`} style={{ transitionDelay: `${i * 40}ms` }}>
                                <a href={link.href} onClick={() => setMenuOpen(false)} className="block py-3 font-medium text-[#8B6F52] hover:text-[#5C4732]">{link.label}</a>
                            </li>
                        ))}
                        <li className="flex gap-3 py-4">
                            <a href="/umrah" onClick={() => setMenuOpen(false)} className="flex-1 rounded-full bg-[#8B6F52] px-5 py-2.5 text-center text-sm font-bold text-[#FAF6F0]">احجز الآن</a>
                            <a href="/#contact" onClick={() => setMenuOpen(false)} className="flex-1 rounded-full border border-[#A98B6F] px-5 py-2.5 text-center text-sm font-bold">اتصل بنا</a>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* ── قسم البطل ── */}
            <section ref={heroRef} className="relative overflow-hidden">
                <IslamicPattern
                    id="pat-hero"
                    className="absolute inset-0 h-full w-full text-[#8B6F52]/[0.13] [mask-image:radial-gradient(ellipse_60%_60%_at_35%_45%,transparent_20%,black_75%)]"
                />

                <div className="relative grid min-h-[78vh] items-center gap-12 px-[6%] py-16 lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                        <span className={`mb-6 inline-block rounded-full bg-[#F1E8DC] px-4 py-1.5 text-xs font-bold tracking-widest text-[#8B6F52] ${reveal(0)}`}>
                            ✦ وكالة موثوقة للحج والعمرة
                        </span>
                        <h1 className={`mb-5 font-[family-name:var(--font-amiri)] text-4xl font-bold leading-snug md:text-6xl md:leading-snug ${reveal(150)}`}>
                            رحلتك المباركة إلى{" "}
                            <span className="relative text-[#A98B6F]">
                                مكة والمدينة
                                <svg className="absolute -bottom-2 right-0 w-full text-[#C9A876]" height="8" viewBox="0 0 200 8" preserveAspectRatio="none">
                                    <path d="M0 6 Q50 0 100 5 T200 4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                            </span>{" "}
                            تبدأ من هنا
                        </h1>
                        <p className={`mb-9 max-w-lg font-light leading-loose text-[#8B6F52] ${reveal(300)}`}>
                            من الجزائر إلى الديار المقدسة — نتكفل بتأشيرتك، تذاكر الطيران، الفنادق القريبة من الحرم،
                            وبرامج روحانية بإشراف مرشدين، لتتفرغ تماماً لعبادتك.
                        </p>
                        <div className={`flex flex-wrap gap-4 ${reveal(450)}`}>
                            <a href="/umrah" className="group relative overflow-hidden rounded-full bg-[#8B6F52] px-9 py-4 font-bold text-[#FAF6F0] transition-all duration-150 hover:-translate-y-1 hover:bg-[#5C4732] hover:shadow-xl hover:shadow-[#5C4732]/30">
                                <span className="relative z-10">احجز الآن ←</span>
                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-l from-transparent via-white/20 to-transparent transition-transform duration-400 group-hover:translate-x-full" />
                            </a>
                            <a href="#contact" className="rounded-full border-[1.5px] border-[#A98B6F] px-9 py-4 font-bold transition-all duration-150 hover:-translate-y-1 hover:bg-[#A98B6F] hover:text-[#FAF6F0] hover:shadow-lg">
                                اتصل بنا
                            </a>
                        </div>

                        <div className={`mt-12 flex gap-10 ${reveal(600)}`}>
                            {[
                                [`${years}+`, "سنة من الخبرة"],
                                [`${pilgrims} ألف+`, "معتمر وحاج"],
                                [`${visa}٪`, "نجاح التأشيرات"],
                            ].map(([num, label]) => (
                                <div key={label} className="transition-transform duration-100 hover:scale-110">
                                    <b className="block font-[family-name:var(--font-amiri)] text-3xl tabular-nums">{num}</b>
                                    <small className="text-xs tracking-wide text-[#A98B6F]">{label}</small>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* البطاقة المرئية — ميلان أقوى */}
                    <div
                        ref={cardRef}
                        className={`relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-b-3xl rounded-t-full bg-gradient-to-br from-[#A98B6F] to-[#5C4732] text-[#FAF6F0] shadow-2xl shadow-[#5C4732]/25 transition-transform duration-200 ease-out will-change-transform lg:min-h-[460px] ${reveal(300)}`}
                    >
                        <img
                            src="/hajj.jpg"
                            onError={(e) => { e.currentTarget.src = "/hajj.jfif"; }}
                            alt="الحج والعمرة"
                            className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-overlay"
                        />
                        <IslamicPattern id="pat-card" className="absolute inset-0 h-full w-full text-[#C9A876]/35" animate />
                        <div className="absolute inset-3.5 rounded-b-2xl rounded-t-full border border-[#FAF6F0]/35" />
                        <div className="relative font-[family-name:var(--font-amiri)] text-5xl text-[#C9A876] drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] [animation:float_5s_ease-in-out_infinite]">
                            لبيك اللهم لبيك
                        </div>
                        <div className="relative mt-4 text-sm tracking-[4px] opacity-90 drop-shadow">حج · عمرة · زيارة</div>
                    </div>
                </div>
            </section>

            {/* ── قسم باقات الحج (موسم مكتمل مع بيانات توضيحية) ── */}
            <section id="hajj" className="relative overflow-hidden bg-[#5C4732] py-20 text-[#FAF6F0]">
                <IslamicPattern id="pat-hajj" className="absolute inset-0 h-full w-full text-[#C9A876]/20" animate />
                <div className="relative px-[6%]">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="mb-4 inline-block rounded-full bg-[#C9A876]/20 px-4 py-1.5 text-xs font-bold text-[#C9A876]">
                            ✦ موسم الحج 1446 هـ / 2025 م
                        </span>
                        <h2 className="mb-4 font-[family-name:var(--font-amiri)] text-4xl font-bold md:text-5xl">
                            باقات الحج
                        </h2>
                        <div className="my-6 inline-flex items-center gap-2 rounded-full border border-[#C9A876] bg-[#FAF6F0]/10 px-6 py-2 text-sm font-bold text-[#C9A876]">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#C9A876] animate-pulse" />
                            مكتمل الحجز لهذا الموسم - تقبل الله من حجاجنا الكرام
                        </div>
                        <p className="mb-10 text-sm font-light leading-relaxed text-[#FAF6F0]/80 md:text-base">
                            تم بحمد الله اكتمال جميع الأماكن والمقاعد المخصصة لموسم الحج الحالي. نشكركم على ثقتكم الغالية في MelGo Travel، ونستعد قريباً لفتح باب التسجيل لموسم الحج القادم.
                        </p>
                    </div>

                    {/* إحصائيات الموسم المكتمل */}
                    <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
                        {[
                            ["1,450", "حاج تم خدمتهم هذا الموسم"],
                            ["100%", "نسبة التكفل بالتأشيرات والإقامة"],
                            ["12", "رحلة طيران مباشرة خُصصت للحجاج"],
                            ["24/7", "تأطير وإرشاد ديني وصحي مستمر"],
                        ].map(([val, desc], idx) => (
                            <div key={idx} className="rounded-2xl border border-[#FAF6F0]/15 bg-[#FAF6F0]/5 p-6 text-center backdrop-blur-sm transition-transform hover:-translate-y-1">
                                <b className="block font-[family-name:var(--font-amiri)] text-3xl font-bold text-[#C9A876] md:text-4xl">{val}</b>
                                <span className="mt-2 block text-xs font-light text-[#FAF6F0]/80">{desc}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <a href="#umrah" className="inline-block rounded-full bg-[#C9A876] px-8 py-3 text-sm font-bold text-[#5C4732] transition-all hover:scale-105 hover:bg-[#FAF6F0]">
                            استكشف باقات العمرة المتاحة حالياً ←
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

