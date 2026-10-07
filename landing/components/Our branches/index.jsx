"use client";

import Image from "next/image";
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

const branches = [
    { name: "MELGO Batna — باتنة", address: "5 طريق بسكرة، باتنة", phones: ["+213 39 728 441"], email: "mvotours@gmail.com", image: "/branchement/batna.png" },
    { name: "MELGO Algiers — الجزائر", address: "حي أول نوفمبر، بابا حسن", phones: ["0540000030", "0770554542"], email: "melgo16@melgo.net", image: "/branchement/alger.png" },
    { name: "MELGO Blida — البليدة", address: "حي المدراس 4، زعبانة", phones: ["0541150013", "0657476963"], email: "melgo09@melgo.net", image: "/branchement/blida.png" },
    { name: "MELGO Sétif — سطيف", address: "Centre Ville, Sétif", phones: ["0657852540"], email: "melgo19@melgo.net", image: "/branchement/setif.png" },
    { name: "MELGO Biskra — بسكرة", address: "شارع الحكيم سعدان، حي المصلى", phones: ["0551919959", "0773839919"], email: "melgo07@melgo.net", image: "/branchement/biskra.png" },
    { name: "MELGO Khenchela — خنشلة", address: "نهج حفطاوي أحمد، حي أول نوفمبر", phones: ["0783377198", "0661935925"], email: "melgo40@melgo.net", image: "/branchement/khenchela.png" },
    { name: "MELGO Ain Mlila — عين مليلة", address: "مقابل البريد المركزي", phones: ["0550929605", "0770805692"], email: "melgo04@melgo.net", image: "/branchement/ain mlila.png" },
    { name: "MELGO Tebessa — تبسة", address: "Zone d'activité, Tebessa", phones: ["0657852540"], email: "melgo12@melgo.net", image: "/branchement/tebessa.png" },
];

export default function OurBranches() {
    return (
        <section
            id="contact"
            dir="rtl"
            className={`${amiri.variable} ${tajawal.variable} relative overflow-hidden bg-[#F1E8DC]/60 py-20 font-[family-name:var(--font-tajawal)] text-[#5C4732]`}
        >
            <IslamicPattern id="pat-branch" className="absolute inset-0 h-full w-full animate-pattern-drift text-[#8B6F52]/35" />

            {/* Header */}
            <div className="relative mb-14 px-[6%] text-center">
                <span className="mb-4 inline-block rounded-full bg-[#FAF6F0] px-4 py-1.5 text-xs font-bold tracking-widest text-[#8B6F52]">
                    ✦ شبكتنا
                </span>
                <h2 className="font-[family-name:var(--font-amiri)] text-4xl font-bold md:text-5xl">فروعنا في الجزائر</h2>
                <p className="mt-3 font-light text-[#8B6F52]">
                    متواجدون في جميع أنحاء الجزائر لخدمتكم — تفضلوا بزيارة أقرب فرع لكم
                </p>
            </div>

            {/* Grid */}
            <div className="relative grid gap-6 px-[6%] sm:grid-cols-2 lg:grid-cols-4">
                {branches.map((branch, i) => (
                    <div
                        key={i}
                        className="group overflow-hidden rounded-2xl bg-white shadow-sm shadow-[#5C4732]/10 transition-all duration-150 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#5C4732]/15"
                    >
                        {/* Branch image */}
                        <div className="relative h-36 overflow-hidden">
                            <Image
                                src={branch.image}
                                alt={branch.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover transition-transform duration-150 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#5C4732]/70 via-[#5C4732]/10 to-transparent" />
                        </div>

                        {/* Info */}
                        <div className="p-5">
                            <h3 className="mb-1 font-[family-name:var(--font-amiri)] text-base font-bold leading-snug">{branch.name}</h3>
                            <p className="mb-3 text-xs text-[#8B6F52]">📍 {branch.address}</p>

                            <div className="space-y-1.5">
                                {branch.phones.map((phone, idx) => (
                                    <a key={idx} href={`tel:${phone.replace(/\s/g, "")}`} dir="ltr"
                                        className="flex items-center gap-2 text-xs text-[#5C4732] transition-colors duration-100 hover:text-[#8B6F52]">
                                        <span className="text-[#C9A876]">📞</span>{phone}
                                    </a>
                                ))}
                                <a href={`mailto:${branch.email}`}
                                    className="flex items-center gap-2 text-xs text-[#5C4732] transition-colors duration-100 hover:text-[#8B6F52]">
                                    <span className="text-[#C9A876]">✉️</span>{branch.email}
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
