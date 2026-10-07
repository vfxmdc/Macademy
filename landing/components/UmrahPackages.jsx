"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { Amiri, Tajawal } from "next/font/google";

const amiri = Amiri({ subsets: ["arabic"], weight: ["700"], variable: "--font-amiri" });
const tajawal = Tajawal({ subsets: ["arabic"], weight: ["300", "400", "500", "700"], variable: "--font-tajawal" });

/* ── زخرفة إسلامية ─────────────────────────────── */
const STAR =
    "M25 0 L9.7 4.02 L17.68 17.68 L4.02 9.7 L0 25 L-4.02 9.7 L-17.68 17.68 " +
    "-9.7 4.02 L-25 0 L-9.7 -4.02 L-17.68 -17.68 L-4.02 -9.7 L0 -25 " +
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

/* ── الصور الخاصة بالفنادق ── */
const PACKAGE_IMAGES = [
    { src: "/roaa.jpg", fallback: "/roaa.jfif", alt: "فندق روعة الشموخ - مكة المكرمة", caption: "مكة المكرمة: فندق روعة الشموخ (11 ليلة)" },
    { src: "/central.jpg", fallback: "/central.jfif", alt: "فندق مركزي - المدينة المنورة", caption: "المدينة المنورة: فندق مركزي (3 ليالي — 200م عن المسجد النبوي)" },
    { src: "/roaa.jpg", fallback: "/roaa.jfif", alt: "فندق ريان الجوار - مكة المكرمة", caption: "العروض الترويجية: فندق ريان الجوار (مكة المكرمة)" }
];

/* ── أسعار غرف الباقات الترويجية (فندق ريان الجوار) ── */
const PROMO_ROOM_OPTIONS = [
    { id: "group", label: "سعر جماعي", price: 179000, defaultAdults: 1 },
    { id: "quad", label: "غرفة رباعية", price: 185000, defaultAdults: 4 },
    { id: "triple", label: "غرفة ثلاثية", price: 195000, defaultAdults: 3 },
    { id: "double", label: "غرفة ثنائية", price: 215000, defaultAdults: 2 },
];

/* ── أسعار غرف الباقات الكلاسيكية (فندق روعة الشموخ) ── */
const CLASSIC_ROOM_OPTIONS = [
    { id: "quintuple", label: "غرفة خماسية", price: 209000, defaultAdults: 5 },
    { id: "quad", label: "غرفة رباعية", price: 219000, defaultAdults: 4 },
    { id: "triple", label: "غرفة ثلاثية", price: 230000, defaultAdults: 3 },
    { id: "double", label: "غرفة ثنائية", price: 260000, defaultAdults: 2 },
];

/* ── بيانات جميع الرحلات ── */
const ALL_PACKAGES = [
    // 🔥 العروض الترويجية - فندق ريان الجوار
    {
        id: "promo-01-sep",
        hotelKey: "ryan",
        title: "رحلة 01 سبتمبر — 15 سبتمبر 2026",
        hotelMakkah: "فندق ريان الجوار",
        hotelMadinah: "فندق مركزي",
        isDone: false,
        statusText: "التسجيلات مفتوحة",
        duration: "15 يومًا",
        startPrice: 179000,
        roomOptions: PROMO_ROOM_OPTIONS,
        departure: { date: "01/09/2026", displayDate: "01 سبتمبر 2026", takeoff: "12:15", landing: "18:15", flightNum: "F3 9543" },
        returnFlight: { date: "15/09/2026", displayDate: "15 سبتمبر 2026", takeoff: "07:00", landing: "09:30", flightNum: "F3 9542" },
    },
    {
        id: "promo-15-sep",
        hotelKey: "ryan",
        title: "رحلة 15 سبتمبر — 29 سبتمبر 2026",
        hotelMakkah: "فندق ريان الجوار",
        hotelMadinah: "فندق مركزي",
        isDone: false,
        statusText: "التسجيلات مفتوحة",
        duration: "15 يومًا",
        startPrice: 179000,
        roomOptions: PROMO_ROOM_OPTIONS,
        departure: { date: "15/09/2026", displayDate: "15 سبتمبر 2026", takeoff: "12:15", landing: "18:15", flightNum: "F3 9543" },
        returnFlight: { date: "29/09/2026", displayDate: "29 سبتمبر 2026", takeoff: "07:00", landing: "09:30", flightNum: "F3 9542" },
    },
    {
        id: "promo-29-sep",
        hotelKey: "ryan",
        title: "رحلة 29 سبتمبر — 13 أكتوبر 2026",
        hotelMakkah: "فندق ريان الجوار",
        hotelMadinah: "فندق مركزي",
        isDone: false,
        statusText: "التسجيلات مفتوحة",
        duration: "15 يومًا",
        startPrice: 179000,
        roomOptions: PROMO_ROOM_OPTIONS,
        departure: { date: "29/09/2026", displayDate: "29 سبتمبر 2026", takeoff: "12:15", landing: "18:15", flightNum: "F3 9543" },
        returnFlight: { date: "13/10/2026", displayDate: "13 أكتوبر 2026", takeoff: "07:00", landing: "09:30", flightNum: "F3 9542" },
    },

    // 🕋 فندق روعة الشموخ
    {
        id: "classic-18-aug",
        hotelKey: "roaa",
        title: "رحلة 18 أوت — 01 سبتمبر 2026",
        hotelMakkah: "فندق روعة الشموخ",
        hotelMadinah: "فندق مركزي",
        isDone: true,
        statusText: "تمت بحمد الله",
        duration: "15 يومًا",
        startPrice: 209000,
        roomOptions: CLASSIC_ROOM_OPTIONS,
        departure: { date: "18/08/2026", displayDate: "18 أوت 2026", takeoff: "12:15", landing: "18:15", flightNum: "F3 9543" },
        returnFlight: { date: "01/09/2026", displayDate: "01 سبتمبر 2026", takeoff: "07:00", landing: "09:30", flightNum: "F3 9542" },
    },
    {
        id: "classic-01-sep",
        hotelKey: "roaa",
        title: "رحلة 01 سبتمبر — 15 سبتمبر 2026",
        hotelMakkah: "فندق روعة الشموخ",
        hotelMadinah: "فندق مركزي",
        isDone: false,
        statusText: "التسجيلات مفتوحة",
        duration: "15 يومًا",
        startPrice: 209000,
        roomOptions: CLASSIC_ROOM_OPTIONS,
        departure: { date: "01/09/2026", displayDate: "01 سبتمبر 2026", takeoff: "12:15", landing: "18:15", flightNum: "F3 9543" },
        returnFlight: { date: "15/09/2026", displayDate: "15 سبتمبر 2026", takeoff: "07:00", landing: "09:30", flightNum: "F3 9542" },
    },
    {
        id: "classic-15-sep",
        hotelKey: "roaa",
        title: "رحلة 15 سبتمبر — 29 سبتمبر 2026",
        hotelMakkah: "فندق روعة الشموخ",
        hotelMadinah: "فندق مركزي",
        isDone: false,
        statusText: "التسجيلات مفتوحة",
        duration: "15 يومًا",
        startPrice: 209000,
        roomOptions: CLASSIC_ROOM_OPTIONS,
        departure: { date: "15/09/2026", displayDate: "15 سبتمبر 2026", takeoff: "12:15", landing: "18:15", flightNum: "F3 9543" },
        returnFlight: { date: "29/09/2026", displayDate: "29 سبتمبر 2026", takeoff: "07:00", landing: "09:30", flightNum: "F3 9542" },
    },
];

/* ── أرقام الاتصال ── */
const PHONE_NUMBERS = [
    { display: "+213 699 35 22 50", raw: "+213699352250" },
    { display: "+213 770 39 33 49", raw: "+213770393349" },
    { display: "+213 771 78 01 06", raw: "+213771780106" },
    { display: "+213 562 61 94 93", raw: "+213562619493" },
    { display: "039 72 87 41", raw: "039728741" },
];

const fmtPrice = new Intl.NumberFormat("ar-DZ-u-nu-latn");

export default function UmrahPackages() {
    const [activeTab, setActiveTab] = useState("all"); // 'all' | 'promo' | 'classic'
    const [imgIndex, setImgIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setImgIndex((prev) => (prev + 1) % PACKAGE_IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const toggleNextImage = useCallback(() => {
        setImgIndex((prev) => (prev + 1) % PACKAGE_IMAGES.length);
    }, []);

    /* ── حالة نافذة الحجز ── */
    const [selectedPkg, setSelectedPkg] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [adultsCount, setAdultsCount] = useState(1);
    
    // عدد الأطفال
    const [infantsCount, setInfantsCount] = useState(0); // < 2 سنة (60,000 دج)
    const [kidsNoBedCount, setKidsNoBedCount] = useState(0); // 2-12 سنة بدون سرير (120,000 دج)
    const [kidsWithBedCount, setKidsWithBedCount] = useState(0); // 2-12 سنة مع سرير (145,000 دج)

    // خيار الإعاشة (25,000 دج للشخص)
    const [hasMeals, setHasMeals] = useState(false);

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const currentRoomOptions = useMemo(() => {
        return selectedPkg ? selectedPkg.roomOptions : PROMO_ROOM_OPTIONS;
    }, [selectedPkg]);

    const roomObj = useMemo(() => {
        return currentRoomOptions.find((r) => r.id === selectedRoom) || currentRoomOptions[0];
    }, [selectedRoom, currentRoomOptions]);

    const handleRoomTypeChange = (roomId) => {
        setSelectedRoom(roomId);
        const room = currentRoomOptions.find((r) => r.id === roomId);
        if (room) {
            setAdultsCount(room.defaultAdults || 1);
        }
    };

    const openBooking = (pkg) => {
        if (pkg.isDone) return;
        toggleNextImage();
        setSelectedPkg(pkg);
        const firstRoom = pkg.roomOptions[0];
        setSelectedRoom(firstRoom.id);
        setAdultsCount(firstRoom.defaultAdults || 1);
        setInfantsCount(0);
        setKidsNoBedCount(0);
        setKidsWithBedCount(0);
        setHasMeals(false);
        setFullName("");
        setPhone("");
        setSubmitError("");
        setStep(1);
    };

    const closeModal = () => setSelectedPkg(null);

    // حساب التكلفة الكلية
    const adultsTotal = useMemo(() => adultsCount * (roomObj?.price || 0), [adultsCount, roomObj]);
    const infantsTotal = useMemo(() => infantsCount * 60000, [infantsCount]);
    const kidsNoBedTotal = useMemo(() => kidsNoBedCount * 120000, [kidsNoBedCount]);
    const kidsWithBedTotal = useMemo(() => kidsWithBedCount * 145000, [kidsWithBedCount]);

    const personsRequiringMeals = useMemo(() => adultsCount + kidsWithBedCount + kidsNoBedCount, [adultsCount, kidsWithBedCount, kidsNoBedCount]);
    const mealsTotal = useMemo(() => (hasMeals ? personsRequiringMeals * 25000 : 0), [hasMeals, personsRequiringMeals]);

    const totalPrice = useMemo(() => {
        return adultsTotal + infantsTotal + kidsNoBedTotal + kidsWithBedTotal + mealsTotal;
    }, [adultsTotal, infantsTotal, kidsNoBedTotal, kidsWithBedTotal, mealsTotal]);

    const totalPersonsCount = useMemo(() => {
        return adultsCount + infantsCount + kidsNoBedCount + kidsWithBedCount;
    }, [adultsCount, infantsCount, kidsNoBedCount, kidsWithBedCount]);

    const canSubmit = fullName.trim().length >= 3 && phone.trim().length >= 8;

    const submitBooking = useCallback(async () => {
        if (!selectedPkg) return;
        setSubmitting(true);
        setSubmitError("");

        const detailsText = [
            `البالغين: ${adultsCount} (${roomObj?.label})`,
            infantsCount > 0 ? `أطفال أقل من سنتين: ${infantsCount}` : null,
            kidsNoBedCount > 0 ? `أطفال (2-12) بدون سرير: ${kidsNoBedCount}` : null,
            kidsWithBedCount > 0 ? `أطفال (2-12) مع سرير: ${kidsWithBedCount}` : null,
            `إجمالي المسافرين: ${totalPersonsCount} شخص`,
        ].filter(Boolean).join(" | ");

        try {
            const res = await fetch("/api/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    packageName: `عمرة ${selectedPkg.title} (${selectedPkg.hotelKey === 'ryan' ? 'عرض ترويجي - فندق ريان الجوار' : 'باقة روعة الشموخ'})`,
                    departureDate: selectedPkg.departure.date,
                    returnDate: selectedPkg.returnFlight.date,
                    airline: "Flyadeal",
                    roomType: `${roomObj?.label} (${adultsCount} بالغين)`,
                    roomPrice: adultsTotal,
                    mealOption: hasMeals ? `شامل الإعاشة (${personsRequiringMeals} شخص)` : "بدون إعاشة",
                    mealPrice: mealsTotal,
                    total: totalPrice,
                    fullName,
                    phone,
                    hotel: `مكة: ${selectedPkg.hotelMakkah} | المدينة: ${selectedPkg.hotelMadinah} | التفاصيل: ${detailsText}`,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error ?? "فشل إرسال الطلب");
            setStep(3);
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مجدداً.");
        } finally {
            setSubmitting(false);
        }
    }, [selectedPkg, roomObj, adultsCount, infantsCount, kidsNoBedCount, kidsWithBedCount, totalPersonsCount, adultsTotal, hasMeals, personsRequiringMeals, mealsTotal, totalPrice, fullName, phone]);

    const [selectedHotelFilter, setSelectedHotelFilter] = useState("all"); // 'all' | 'ryan' | 'roaa'

    const filteredPackages = useMemo(() => {
        if (selectedHotelFilter === "ryan") return ALL_PACKAGES.filter((p) => p.hotelKey === "ryan");
        if (selectedHotelFilter === "roaa") return ALL_PACKAGES.filter((p) => p.hotelKey === "roaa");
        return ALL_PACKAGES;
    }, [selectedHotelFilter]);

    return (
        <section id="umrah" dir="rtl" className={`${amiri.variable} ${tajawal.variable} relative overflow-hidden bg-[#F1E8DC]/60 py-10 md:py-20 font-[family-name:var(--font-tajawal)] text-[#5C4732]`}>
            <IslamicPattern id="pat-pkg" className="absolute inset-0 h-full w-full animate-pattern-drift text-[#8B6F52]/30 pointer-events-none" />

            {/* ── عنوان القسم ── */}
            <div className="relative mb-8 px-4 text-center">
                <span className="mb-2.5 inline-block rounded-full bg-[#FAF6F0] px-3.5 py-1 text-xs md:text-sm font-bold tracking-widest text-[#8B6F52] shadow-xs">
                    ✨ رحلات مباشرة من مطار باتنة
                </span>
                <h2 className="font-[family-name:var(--font-amiri)] text-3xl md:text-5xl font-bold text-[#5C4732]">
                    باقات العمرة والمواسم
                </h2>
                <p className="mt-2 text-xs md:text-base font-light text-[#8B6F52] max-w-xl mx-auto px-2">
                    تصفح باقات الفنادق المتاحة مع إمكانية التصفية حسب اسم الفندق
                </p>
            </div>

            {/* ── سلايدر الفنادق ── */}
            <div className="relative mx-auto max-w-5xl px-4 mb-8">
                <div className="relative h-56 sm:h-72 md:h-80 w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl border-2 border-[#C9A876]/40 group cursor-pointer" onClick={toggleNextImage}>
                    {PACKAGE_IMAGES.map((img, idx) => (
                        <div
                            key={idx}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === imgIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                        >
                            <img
                                src={img.src}
                                onError={(e) => { e.currentTarget.src = img.fallback; }}
                                alt={img.alt}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#5C4732]/90 via-[#5C4732]/35 to-transparent" />
                        </div>
                    ))}
                    
                    <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-5 z-20 text-[#FAF6F0]">
                        <span className="inline-block rounded-md bg-[#C9A876] px-2 py-0.5 text-[10px] sm:text-xs font-bold text-white mb-1 shadow-xs">
                            🏨 الفنادق المتاحة
                        </span>
                        <h3 className="font-[family-name:var(--font-amiri)] text-base sm:text-xl md:text-2xl font-bold leading-tight">
                            {PACKAGE_IMAGES[imgIndex].caption}
                        </h3>
                    </div>

                    <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-5 z-20 flex gap-1.5" dir="ltr">
                        {PACKAGE_IMAGES.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setImgIndex(idx); }}
                                className={`h-2 rounded-full transition-all duration-300 ${idx === imgIndex ? "w-6 bg-[#C9A876]" : "w-2 bg-white/60 hover:bg-white"}`}
                                aria-label={`صورة ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── التصفية حسب اسم الفندق (تصميم ممتاز للهاتف) ── */}
            <div className="relative mx-auto max-w-2xl px-4 mb-8">
                <div className="text-center mb-2.5">
                    <span className="text-xs font-bold text-[#8B6F52] flex items-center justify-center gap-1">
                        <span>🔍</span>
                        <span>اختر الفندق لعرض الرحلات:</span>
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 rounded-2xl bg-[#FAF6F0] p-1.5 shadow-md border border-[#C9A876]/40 text-center">
                    {/* الكل */}
                    <button
                        onClick={() => setSelectedHotelFilter("all")}
                        className={`rounded-xl py-2.5 px-2 text-xs sm:text-sm font-bold transition-all duration-200 active:scale-95 ${
                            selectedHotelFilter === "all"
                                ? "bg-[#8B6F52] text-white shadow-md"
                                : "text-[#5C4732] hover:bg-[#F1E8DC]"
                        }`}
                    >
                        الكل ({ALL_PACKAGES.length})
                    </button>

                    {/* فندق ريان الجوار (أحمر ترويجي أنيق) */}
                    <button
                        onClick={() => setSelectedHotelFilter("ryan")}
                        className={`rounded-xl py-2.5 px-2 text-xs sm:text-sm font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-1 ${
                            selectedHotelFilter === "ryan"
                                ? "bg-red-700 text-white shadow-md"
                                : "bg-red-50/80 text-red-700 hover:bg-red-100 border border-red-200/70"
                        }`}
                    >
                        <span>🏷️</span>
                        <span>ريان الجوار</span>
                    </button>

                    {/* فندق روعة الشموخ */}
                    <button
                        onClick={() => setSelectedHotelFilter("roaa")}
                        className={`rounded-xl py-2.5 px-2 text-xs sm:text-sm font-bold transition-all duration-200 active:scale-95 ${
                            selectedHotelFilter === "roaa"
                                ? "bg-[#8B6F52] text-white shadow-md"
                                : "text-[#5C4732] hover:bg-[#F1E8DC]"
                        }`}
                    >
                        روعة الشموخ
                    </button>
                </div>
            </div>

            {/* ── شبكة كروت الباقات ── */}
            <div className="relative mx-auto max-w-7xl grid gap-5 sm:gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPackages.map((pkg) => {
                    const isRyan = pkg.hotelKey === "ryan";
                    return (
                        <div
                            key={pkg.id}
                            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl transition-all duration-300 ${
                                pkg.isDone
                                    ? "bg-[#FAF6F0] border border-gray-300 opacity-90"
                                    : isRyan
                                    ? "bg-[#FAF6F0] border-2 border-red-500/80 hover:-translate-y-2 hover:shadow-2xl hover:border-red-600"
                                    : "bg-[#FAF6F0] border border-[#F1E8DC] hover:-translate-y-2 hover:shadow-2xl hover:border-[#C9A876]"
                            }`}
                        >
                            {/* الشارة العلوية: مطار باتنة + حالة الرحلة */}
                            <div className="flex items-center justify-between border-b border-[#F1E8DC] pb-3 mb-3">
                                <span className="rounded-full bg-[#8B6F52] px-3 py-1 text-[11px] sm:text-xs font-extrabold text-white shadow-xs flex items-center gap-1">
                                    <span>🛫</span>
                                    <span>مطار باتنة</span>
                                </span>

                                {pkg.isDone ? (
                                    <span className="text-[11px] sm:text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300 shadow-xs flex items-center gap-1">
                                        <span>✅</span>
                                        <span>{pkg.statusText}</span>
                                    </span>
                                ) : isRyan ? (
                                    <span className="text-[11px] sm:text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200 shadow-xs flex items-center gap-1">
                                        <span>🏷️</span>
                                        <span>عرض ترويجي</span>
                                    </span>
                                ) : (
                                    <span className="text-[11px] sm:text-xs font-bold bg-[#C9A876]/20 text-[#5C4732] px-3 py-1 rounded-full border border-[#C9A876]/40">
                                        ✨ {pkg.duration}
                                    </span>
                                )}
                            </div>

                            <h3 className="font-[family-name:var(--font-amiri)] text-xl sm:text-2xl font-bold text-[#5C4732] mb-3 text-center">
                                {pkg.title}
                            </h3>

                            {/* الفنادق (فندق ريان الجوار باللون الأحمر الترويجي) */}
                            <div className={`rounded-2xl p-3.5 mb-3 border space-y-1.5 text-xs sm:text-sm ${
                                isRyan ? "bg-red-50/60 border-red-200" : "bg-[#C9A876]/15 border-[#C9A876]/30"
                            }`}>
                                <div className="flex items-center gap-2 font-bold text-[#5C4732]">
                                    <span>🕋</span>
                                    <span>مكة المكرمة:</span>
                                    {isRyan ? (
                                        <strong className="text-red-600 font-extrabold">
                                            {pkg.hotelMakkah}
                                        </strong>
                                    ) : (
                                        <strong className="text-[#5C4732]">{pkg.hotelMakkah}</strong>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 font-bold text-[#5C4732]">
                                    <span>🕌</span>
                                    <span>المدينة المنورة: <strong>{pkg.hotelMadinah}</strong></span>
                                </div>
                            </div>

                            {/* مواعيد الرحلة */}
                            <div className="space-y-2 mb-3 text-xs">
                                <div className="rounded-xl bg-white p-2.5 sm:p-3 shadow-xs border border-[#F1E8DC]">
                                    <div className="flex items-center justify-between mb-1 font-bold text-[#8B6F52]">
                                        <span>🛫 الذهاب:</span>
                                        <span className="bg-[#F1E8DC] px-2 py-0.5 rounded text-[#5C4732]">{pkg.departure.displayDate}</span>
                                    </div>
                                    <div className="text-[#5C4732] flex justify-between">
                                        <span>الإقلاع: <strong>{pkg.departure.takeoff}</strong></span>
                                        <span>الوصول: <strong>{pkg.departure.landing}</strong></span>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-white p-2.5 sm:p-3 shadow-xs border border-[#F1E8DC]">
                                    <div className="flex items-center justify-between mb-1 font-bold text-[#8B6F52]">
                                        <span>🛬 العودة:</span>
                                        <span className="bg-[#F1E8DC] px-2 py-0.5 rounded text-[#5C4732]">{pkg.returnFlight.displayDate}</span>
                                    </div>
                                    <div className="text-[#5C4732] flex justify-between">
                                        <span>الإقلاع: <strong>{pkg.returnFlight.takeoff}</strong></span>
                                        <span>الوصول: <strong>{pkg.returnFlight.landing}</strong></span>
                                    </div>
                                </div>
                            </div>

                            {/* أسعار الغرف المقترحة */}
                            <div className="rounded-2xl bg-white p-3 sm:p-3.5 mb-4 border border-[#F1E8DC] text-xs space-y-1.5">
                                <p className="font-bold text-[#8B6F52] text-center mb-1 border-b border-[#F1E8DC] pb-1">💰 أسعار الغرف للشخص:</p>
                                {pkg.roomOptions.map((r) => (
                                    <div key={r.id} className="flex justify-between text-[#5C4732]">
                                        <span>{r.label}:</span>
                                        <strong className="font-bold tabular-nums text-[#5C4732]">
                                            {fmtPrice.format(r.price)} دج
                                        </strong>
                                    </div>
                                ))}
                            </div>

                            {/* السعر والزر */}
                            <div className="mt-auto pt-1">
                                {pkg.isDone ? (
                                    <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-3 text-center shadow-inner">
                                        <span className="text-xs sm:text-sm font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                                            <span>🕋</span>
                                            <span>تمت الرحلة بحمد الله</span>
                                        </span>
                                        <p className="text-[10px] sm:text-[11px] text-emerald-600 mt-0.5">اكتملت التسجيلات وانطلقت الرحلة</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-center mb-2">
                                            <span className="text-xs text-[#8B6F52] font-medium block">ابتداءً من</span>
                                            <div className={`font-[family-name:var(--font-amiri)] text-2xl sm:text-3xl font-bold tabular-nums ${
                                                isRyan ? "text-red-700" : "text-[#5C4732]"
                                            }`}>
                                                {fmtPrice.format(pkg.startPrice)} دج
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => openBooking(pkg)}
                                            className={`group/btn relative w-full overflow-hidden rounded-full py-3 sm:py-3.5 font-bold text-[#FAF6F0] shadow-md transition-all duration-200 hover:shadow-lg active:scale-[0.98] ${
                                                isRyan
                                                    ? "bg-red-700 hover:bg-red-800"
                                                    : "bg-[#8B6F52] hover:bg-[#5C4732]"
                                            }`}
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base">
                                                <span>{isRyan ? "احجز العرض الترويجي" : "احجز الآن"}</span>
                                                <span className="text-base">←</span>
                                            </span>
                                            <span className="absolute inset-0 -translate-x-full bg-gradient-to-l from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover/btn:translate-x-full" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── تفاصيل الإعاشة وأسعار الأطفال ── */}
            <div className="relative mx-auto max-w-5xl mt-14 px-4">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* أسعار الأطفال والإعاشة */}
                    <div className="rounded-3xl bg-[#FAF6F0] p-6 shadow-md border border-[#F1E8DC] space-y-4">
                        <h4 className="font-[family-name:var(--font-amiri)] text-xl font-bold text-[#5C4732] flex items-center gap-2 border-b border-[#F1E8DC] pb-3">
                            <span>👶</span>
                            <span>أسعار الأطفال والإعاشة</span>
                        </h4>

                        <div className="space-y-2 text-xs md:text-sm">
                            <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-[#F1E8DC]">
                                <span className="font-semibold text-[#5C4732]">👶 أقل من سنتين (رضيع):</span>
                                <span className="font-bold text-[#8B6F52] tabular-nums">60,000 دج</span>
                            </div>
                            <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-[#F1E8DC]">
                                <span className="font-semibold text-[#5C4732]">👦 من 2 إلى 12 سنة (بدون سرير):</span>
                                <span className="font-bold text-[#8B6F52] tabular-nums">120,000 دج</span>
                            </div>
                            <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-[#F1E8DC]">
                                <span className="font-semibold text-[#5C4732]">👦 من 2 إلى 12 سنة (مع سرير):</span>
                                <span className="font-bold text-[#8B6F52] tabular-nums">145,000 دج</span>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-[#C9A876]/15 p-4 border border-[#C9A876]/30 text-xs md:text-sm">
                            <p className="font-bold text-[#5C4732] mb-1 flex items-center gap-1.5">
                                <span>🍽️</span>
                                <span>الإطعام / الإعاشة (اختياري)</span>
                            </p>
                            <p className="text-[#8B6F52] text-xs mb-2">وجبات كاملة فطور وعشاء / غداء وعشاء طيلة أيام الرحلة</p>
                            <p className="font-bold text-[#5C4732]">➕ سعر الإطعام: 25,000 دج للشخص</p>
                        </div>
                    </div>

                    {/* للحجز والاستفسار */}
                    <div className="rounded-3xl bg-[#FAF6F0] p-6 shadow-md border border-[#F1E8DC] flex flex-col justify-between">
                        <div>
                            <h4 className="font-[family-name:var(--font-amiri)] text-xl font-bold text-[#5C4732] mb-3 flex items-center gap-2 border-b border-[#F1E8DC] pb-3">
                                <span>📞</span>
                                <span>للحجز والاستفسار</span>
                            </h4>
                            <p className="text-xs text-[#8B6F52] mb-4">وكالة مالقو للسياحة والسفر — خدمتكم شرف لنا وعمرة مقبولة بإذن الله:</p>
                            
                            <div className="space-y-2">
                                {PHONE_NUMBERS.map((p, i) => (
                                    <a
                                        key={i}
                                        href={`tel:${p.raw}`}
                                        dir="ltr"
                                        className="flex items-center justify-between rounded-xl bg-white px-4 py-2 text-xs md:text-sm font-bold text-[#5C4732] border border-[#F1E8DC] transition-all duration-150 hover:border-[#8B6F52] hover:bg-[#8B6F52] hover:text-[#FAF6F0]"
                                    >
                                        <span>{p.display}</span>
                                        <span className="text-xs opacity-75">📞 اتصل الآن</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── نافذة تفاصيل الحجز (Modal) ── */}
            {selectedPkg && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={closeModal}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-[#FAF6F0] shadow-2xl"
                    >
                        {/* الهيدر */}
                        <div className={`relative shrink-0 px-6 py-4 text-[#FAF6F0] ${selectedPkg.hotelKey === 'ryan' ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-[#8B6F52]'}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-[family-name:var(--font-amiri)] text-xl font-bold flex items-center gap-1.5">
                                        <span>حجز عمرة — مطار باتنة</span>
                                        {selectedPkg.category === 'promo' && <span className="text-xs bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-sans font-bold">عرض ترويجي</span>}
                                    </h3>
                                    <p className="text-xs text-[#FAF6F0]/90 mt-0.5">{selectedPkg.title} · {selectedPkg.hotelMakkah}</p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="rounded-full bg-white/10 p-2 text-lg hover:bg-white/20 transition-transform duration-150 active:scale-95"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            {/* شريط الخطوات */}
                            <div className="flex items-center justify-center gap-2 mt-3" dir="ltr">
                                {[1, 2].map((s) => (
                                    <span
                                        key={s}
                                        className={`h-2 rounded-full transition-all duration-300 ${step === s ? "w-10 bg-[#C9A876]" : step > s ? "w-3 bg-white" : "w-3 bg-white/30"}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* المحتوى القابل للتمرير */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            
                            {/* ── الخطوة 1: اختيار نوع الغرفة، عدد الأشخاص والأطفال، والإعاشة ── */}
                            {step === 1 && (
                                <>
                                    {/* اختيار الغرفة */}
                                    <div>
                                        <label className="block text-xs font-bold text-[#8B6F52] mb-2">1. اختر نوع الغرفة (للمعتمرين البالغين):</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {currentRoomOptions.map((r) => (
                                                <button
                                                    key={r.id}
                                                    onClick={() => handleRoomTypeChange(r.id)}
                                                    className={`rounded-xl border p-3 text-right text-xs md:text-sm transition-all duration-150 ${selectedRoom === r.id ? "border-[#8B6F52] bg-[#8B6F52] text-white shadow-md" : "border-[#F1E8DC] bg-white text-[#5C4732] hover:border-[#C9A876]"}`}
                                                >
                                                    <div className="font-bold">{r.label}</div>
                                                    <div className="text-xs opacity-90 tabular-nums">{fmtPrice.format(r.price)} دج / للشخص</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* عدد الأشخاص البالغين */}
                                    <div className="rounded-2xl bg-white p-4 border border-[#F1E8DC] flex items-center justify-between">
                                        <div>
                                            <span className="font-bold text-xs md:text-sm text-[#5C4732] block">👥 عدد الأشخاص (البالغين):</span>
                                            <span className="text-[11px] text-[#8B6F52]">{fmtPrice.format(roomObj?.price || 0)} دج للشخص</span>
                                        </div>
                                        <div className="flex items-center gap-3" dir="ltr">
                                            <button
                                                type="button"
                                                onClick={() => setAdultsCount((prev) => Math.max(1, prev - 1))}
                                                className="w-8 h-8 rounded-full border border-[#8B6F52] bg-[#FAF6F0] font-bold text-[#8B6F52] flex items-center justify-center hover:bg-[#8B6F52] hover:text-white transition-all"
                                            >
                                                -
                                            </button>
                                            <span className="font-bold text-base w-4 text-center text-[#5C4732]">{adultsCount}</span>
                                            <button
                                                type="button"
                                                onClick={() => setAdultsCount((prev) => prev + 1)}
                                                className="w-8 h-8 rounded-full border border-[#8B6F52] bg-[#FAF6F0] font-bold text-[#8B6F52] flex items-center justify-center hover:bg-[#8B6F52] hover:text-white transition-all"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* تفاصيل الأطفال */}
                                    <div className="space-y-3">
                                        <label className="block text-xs font-bold text-[#8B6F52]">2. إضافة الأطفال (إن وجد):</label>

                                        {/* طفل أقل من سنتين */}
                                        <div className="rounded-2xl bg-white p-3.5 border border-[#F1E8DC] flex items-center justify-between text-xs">
                                            <div>
                                                <span className="font-bold text-[#5C4732] block">👶 أقل من سنتين (رضيع)</span>
                                                <span className="text-[#8B6F52]">60,000 دج</span>
                                            </div>
                                            <div className="flex items-center gap-3" dir="ltr">
                                                <button
                                                    type="button"
                                                    onClick={() => setInfantsCount((prev) => Math.max(0, prev - 1))}
                                                    className="w-7 h-7 rounded-full border border-[#8B6F52] bg-[#FAF6F0] font-bold text-[#8B6F52] flex items-center justify-center hover:bg-[#8B6F52] hover:text-white"
                                                >
                                                    -
                                                </button>
                                                <span className="font-bold text-sm text-[#5C4732]">{infantsCount}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setInfantsCount((prev) => prev + 1)}
                                                    className="w-7 h-7 rounded-full border border-[#8B6F52] bg-[#FAF6F0] font-bold text-[#8B6F52] flex items-center justify-center hover:bg-[#8B6F52] hover:text-white"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* طفل 2-12 بدون سرير */}
                                        <div className="rounded-2xl bg-white p-3.5 border border-[#F1E8DC] flex items-center justify-between text-xs">
                                            <div>
                                                <span className="font-bold text-[#5C4732] block">👦 من 2 إلى 12 سنة (بدون سرير)</span>
                                                <span className="text-[#8B6F52]">120,000 دج</span>
                                            </div>
                                            <div className="flex items-center gap-3" dir="ltr">
                                                <button
                                                    type="button"
                                                    onClick={() => setKidsNoBedCount((prev) => Math.max(0, prev - 1))}
                                                    className="w-7 h-7 rounded-full border border-[#8B6F52] bg-[#FAF6F0] font-bold text-[#8B6F52] flex items-center justify-center hover:bg-[#8B6F52] hover:text-white"
                                                >
                                                    -
                                                </button>
                                                <span className="font-bold text-sm text-[#5C4732]">{kidsNoBedCount}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setKidsNoBedCount((prev) => prev + 1)}
                                                    className="w-7 h-7 rounded-full border border-[#8B6F52] bg-[#FAF6F0] font-bold text-[#8B6F52] flex items-center justify-center hover:bg-[#8B6F52] hover:text-white"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* طفل 2-12 مع سرير */}
                                        <div className="rounded-2xl bg-white p-3.5 border border-[#F1E8DC] flex items-center justify-between text-xs">
                                            <div>
                                                <span className="font-bold text-[#5C4732] block">👦 من 2 إلى 12 سنة (مع سرير)</span>
                                                <span className="text-[#8B6F52]">145,000 دج</span>
                                            </div>
                                            <div className="flex items-center gap-3" dir="ltr">
                                                <button
                                                    type="button"
                                                    onClick={() => setKidsWithBedCount((prev) => Math.max(0, prev - 1))}
                                                    className="w-7 h-7 rounded-full border border-[#8B6F52] bg-[#FAF6F0] font-bold text-[#8B6F52] flex items-center justify-center hover:bg-[#8B6F52] hover:text-white"
                                                >
                                                    -
                                                </button>
                                                <span className="font-bold text-sm text-[#5C4732]">{kidsWithBedCount}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setKidsWithBedCount((prev) => prev + 1)}
                                                    className="w-7 h-7 rounded-full border border-[#8B6F52] bg-[#FAF6F0] font-bold text-[#8B6F52] flex items-center justify-center hover:bg-[#8B6F52] hover:text-white"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* اختيار الإعاشة */}
                                    <div>
                                        <label className="block text-xs font-bold text-[#8B6F52] mb-2">3. خيار الإعاشة (اختياري):</label>
                                        <button
                                            type="button"
                                            onClick={() => setHasMeals(!hasMeals)}
                                            className={`w-full flex justify-between items-center rounded-2xl border px-4 py-3.5 text-xs md:text-sm transition-all duration-150 ${
                                                hasMeals ? "border-[#8B6F52] bg-[#8B6F52] text-white shadow-md" : "border-[#F1E8DC] bg-white text-[#5C4732] hover:border-[#C9A876]"
                                            }`}
                                        >
                                            <span className="font-bold flex items-center gap-2">
                                                <span>🍽️</span>
                                                <span>إضافة وجبات الإعاشة كاملة</span>
                                            </span>
                                            <span className="text-xs font-semibold tabular-nums">
                                                +{fmtPrice.format(25000)} دج / للشخص
                                            </span>
                                        </button>
                                    </div>

                                    {/* معاينة السعر والزر لمتابعة الخطوة الثانية */}
                                    <div className="rounded-2xl bg-[#F1E8DC]/60 p-4 border border-[#F1E8DC] space-y-1">
                                        <div className="flex justify-between items-center text-xs text-[#8B6F52]">
                                            <span>إجمالي المسافرين: <strong>{totalPersonsCount} شخص</strong></span>
                                            <span>({adultsCount} بالغين {infantsCount + kidsNoBedCount + kidsWithBedCount > 0 ? `+ ${infantsCount + kidsNoBedCount + kidsWithBedCount} أطفال` : ""})</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-1 border-t border-[#8B6F52]/20">
                                            <span className="font-bold text-sm text-[#5C4732]">المبلغ الإجمالي:</span>
                                            <span className="font-[family-name:var(--font-amiri)] text-2xl font-bold text-[#8B6F52] tabular-nums">
                                                {fmtPrice.format(totalPrice)} دج
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setStep(2)}
                                        className="w-full rounded-full bg-[#8B6F52] py-4 font-bold text-white shadow-lg transition-all duration-150 hover:bg-[#5C4732] active:scale-[0.98]"
                                    >
                                        تأكيد التفاصيل ومتابعة الحجز ←
                                    </button>
                                </>
                            )}

                            {/* ── الخطوة 2: رؤية الفاتورة التفصيلية + إدخال الاسم ورقم الهاتف ── */}
                            {step === 2 && (
                                <>
                                    {/* 🧾 الفاتورة / كشف الحجز النهائي */}
                                    <div className="rounded-2xl border border-[#C9A876]/50 bg-white p-5 shadow-sm space-y-3 text-xs md:text-sm">
                                        <div className="flex items-center justify-between border-b border-[#F1E8DC] pb-2 font-bold text-[#8B6F52]">
                                            <span className="text-sm">🧾 تفاصيل كشف الحجز:</span>
                                            <span className="bg-[#C9A876]/20 text-[#5C4732] px-2.5 py-0.5 rounded-full border border-[#C9A876]/40">
                                                مطار باتنة — Flyadeal
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center text-[#5C4732]">
                                            <span>الباقة المختارة:</span>
                                            <strong className="font-bold">{selectedPkg.title}</strong>
                                        </div>

                                        <div className="flex justify-between items-center text-[#5C4732]">
                                            <span>الفندق بمكة المكرمة:</span>
                                            <span className="font-bold text-xs">{selectedPkg.hotelMakkah}</span>
                                        </div>

                                        <div className="flex justify-between items-center text-[#5C4732]">
                                            <span>نوع الغرفة (البالغين):</span>
                                            <span className="font-bold">{roomObj?.label} × {adultsCount} <span className="text-xs text-[#8B6F52]">({fmtPrice.format(adultsTotal)} دج)</span></span>
                                        </div>

                                        {infantsCount > 0 && (
                                            <div className="flex justify-between items-center text-[#5C4732]">
                                                <span>أطفال أقل من سنتين:</span>
                                                <span className="font-bold">{infantsCount} × 60,000 دج <span className="text-xs text-[#8B6F52]">({fmtPrice.format(infantsTotal)} دج)</span></span>
                                            </div>
                                        )}

                                        {kidsNoBedCount > 0 && (
                                            <div className="flex justify-between items-center text-[#5C4732]">
                                                <span>أطفال (2-12) بدون سرير:</span>
                                                <span className="font-bold">{kidsNoBedCount} × 120,000 دج <span className="text-xs text-[#8B6F52]">({fmtPrice.format(kidsNoBedTotal)} دج)</span></span>
                                            </div>
                                        )}

                                        {kidsWithBedCount > 0 && (
                                            <div className="flex justify-between items-center text-[#5C4732]">
                                                <span>أطفال (2-12) مع سرير:</span>
                                                <span className="font-bold">{kidsWithBedCount} × 145,000 دج <span className="text-xs text-[#8B6F52]">({fmtPrice.format(kidsWithBedTotal)} دج)</span></span>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center text-[#5C4732]">
                                            <span>الإعاشة:</span>
                                            <span className="font-bold">
                                                {hasMeals ? `شاملة (${personsRequiringMeals} شخص × 25,000 دج)` : "بدون إعاشة"}
                                                {hasMeals && <span className="text-xs text-[#8B6F52]"> (+{fmtPrice.format(mealsTotal)} دج)</span>}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center pt-3 border-t border-dashed border-[#C9A876] font-bold">
                                            <span className="text-[#8B6F52] text-sm">المبلغ الإجمالي النهائي:</span>
                                            <span className="font-[family-name:var(--font-amiri)] text-2xl font-bold text-[#5C4732] tabular-nums">
                                                {fmtPrice.format(totalPrice)} دج
                                            </span>
                                        </div>
                                    </div>

                                    {/* 📝 إدخال بيانات الاسم الكامل ورقم الهاتف */}
                                    <div className="space-y-3 pt-2">
                                        <label className="block text-xs font-bold text-[#8B6F52]">يرجى ملء الاسم ورقم الهاتف لإكمال الإرسال:</label>
                                        <div>
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="الاسم الكامل"
                                                className="w-full rounded-xl border border-[#F1E8DC] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#8B6F52] focus:ring-2 focus:ring-[#C9A876]/40"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="tel"
                                                dir="ltr"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="رقم الهاتف (مثال: 06XXXXXXXX)"
                                                className="w-full rounded-xl border border-[#F1E8DC] bg-white px-4 py-3.5 text-sm text-right outline-none focus:border-[#8B6F52] focus:ring-2 focus:ring-[#C9A876]/40"
                                            />
                                        </div>
                                    </div>

                                    {/* الأزرار: تعديل + إرسال */}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="flex-1 rounded-full border border-[#8B6F52] py-4 font-bold text-[#8B6F52] transition-all hover:bg-[#8B6F52] hover:text-white active:scale-95"
                                        >
                                            → تعديل
                                        </button>
                                        
                                        <button
                                            onClick={submitBooking}
                                            disabled={!canSubmit || submitting}
                                            className="flex-[2] rounded-full bg-[#8B6F52] py-4 font-bold text-white shadow-lg transition-all duration-150 hover:bg-[#5C4732] active:scale-[0.98] disabled:opacity-40"
                                        >
                                            {submitting ? "جاري الإرسال..." : "إرسال الطلب ←"}
                                        </button>
                                    </div>

                                    {submitError && (
                                        <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl text-center">
                                            ⚠️ {submitError}
                                        </p>
                                    )}
                                </>
                            )}

                            {/* ── الخطوة 3: تم الإرسال ── */}
                            {step === 3 && (
                                <div className="text-center py-6">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A876]/20 text-3xl">
                                        🕋
                                    </div>
                                    <h4 className="font-[family-name:var(--font-amiri)] text-2xl font-bold text-[#5C4732] mb-2">
                                        تم استقبال طلبك بنجاح!
                                    </h4>
                                    <p className="text-sm text-[#8B6F52] mb-4">
                                        شكراً <strong className="text-[#5C4732]">{fullName}</strong>، يتواصل معك مستشارنا من وكالة مالقو للسياحة والسفر لاستكمال إجراءات رحلة العمرة.
                                    </p>
                                    <button
                                        onClick={closeModal}
                                        className="rounded-full bg-[#8B6F52] px-8 py-3 font-bold text-white transition-all hover:bg-[#5C4732]"
                                    >
                                        إغلاق
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
