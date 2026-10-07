"use client";

import { useState } from "react";
import { Amiri, Cairo } from "next/font/google";

const amiri = Amiri({ subsets: ["arabic"], weight: ["700"], variable: "--font-amiri" });
const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "600", "700"], variable: "--font-cairo" });

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const phone = "0793725621";
  const waUrl = `https://wa.me/213793725621?text=${encodeURIComponent("مرحباً M Décoration ✨ أود التواصل معكم والاستفسار عن المنتجات.")}`;

  return (
    <header dir="rtl" className={`${amiri.variable} ${cairo.variable} font-[family-name:var(--font-cairo)] sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E8E0D5] shadow-xs`}>
      {/* ── Top Bar ── */}
      <div className="bg-[#F5EFE6] border-b border-[#E8E0D5] text-[#3D2E1E] py-2 px-4 sm:px-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
          
          {/* Top Left: Social Media Icons (Instagram, TikTok, Facebook) */}
          <div className="flex items-center gap-3 order-2 md:order-1">
            <span className="text-[11px] text-[#765C43] font-medium hidden sm:inline">تابعونا:</span>
            <div className="flex items-center gap-2">
              {/* Instagram Icon */}
              <a
                href="#"
                title="Instagram"
                className="w-7 h-7 rounded-full bg-[#FFFFFF] border border-[#E8E0D5] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white flex items-center justify-center transition-all shadow-2xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* TikTok Icon */}
              <a
                href="#"
                title="TikTok"
                className="w-7 h-7 rounded-full bg-[#FFFFFF] border border-[#E8E0D5] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white flex items-center justify-center transition-all shadow-2xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68a6.34 6.34 0 0 0 10.86 4.49A6.27 6.27 0 0 0 15.8 15.7V8.56a8.27 8.27 0 0 0 4.79 1.52V6.69z"/>
                </svg>
              </a>

              {/* Facebook Icon */}
              <a
                href="#"
                title="Facebook"
                className="w-7 h-7 rounded-full bg-[#FFFFFF] border border-[#E8E0D5] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white flex items-center justify-center transition-all shadow-2xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Center Announcement Header */}
          <div className="font-[family-name:var(--font-amiri)] text-[#5C4732] font-bold text-base tracking-wide text-center order-1 md:order-2 flex items-center gap-1.5">
            <span>✨</span>
            <span>M Décoration — لمسات ديكور وإضاءة عصرية</span>
            <span>✨</span>
          </div>

          {/* Top Right: Delivery & Location Info */}
          <div className="flex items-center gap-3 text-[#765C43] order-3 text-xs">
            <span className="text-[#8B5E3C]">📍</span>
            <span className="font-medium">الجزائر 🇩🇿 — التوصيل متوفر لـ 58 ولاية</span>
            <div className="h-3 w-[1px] bg-[#E8E0D5] hidden sm:block" />
            <a href={`tel:${phone}`} className="hover:text-[#5C4732] font-semibold flex items-center gap-1 dir-ltr">
              <span>0793 725 621</span>
              <span>📞</span>
            </a>
          </div>

        </div>
      </div>

      {/* ── Main Navigation Bar ── */}
      <div className="container mx-auto px-4 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5C4732] to-[#8B5E3C] text-white font-extrabold flex items-center justify-center text-xl shadow-md shadow-[#5C4732]/20 group-hover:scale-105 transition-transform">
            M
          </div>
          <div>
            <span className="font-[family-name:var(--font-amiri)] text-2xl font-bold text-[#3D2E1E] group-hover:text-[#8B5E3C] transition-colors">
              M Décoration
            </span>
            <span className="block text-[10px] text-[#8B5E3C] font-semibold tracking-wider">إم ديكور — إضاءة وديكور عصري</span>
          </div>
        </a>

        {/* Desktop Menu Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#5C4732]">
          <a href="#" className="hover:text-[#8B5E3C] transition-colors">الرئيسية</a>
          <a href="#products" className="hover:text-[#8B5E3C] transition-colors">المنتجات</a>
          <a href="#products" className="hover:text-[#8B5E3C] transition-colors">ساعات LED</a>
          <a href="#products" className="hover:text-[#8B5E3C] transition-colors">مجسمات LED</a>
          <a href="#delivery" className="hover:text-[#8B5E3C] transition-colors">التوصيل</a>
          <a href="#contact" className="hover:text-[#8B5E3C] transition-colors">التواصل</a>
        </nav>

        {/* Floating / Single WhatsApp Contact CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-xs sm:text-sm hover:bg-[#20ba5a] transition-all shadow-md shadow-green-600/15 flex items-center gap-2 hover:scale-[1.02]"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.887 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
            <span>واتساب المتجر</span>
          </a>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#5C4732] hover:text-[#3D2E1E] focus:outline-none"
          aria-label="القائمة"
        >
          <span className="text-2xl">{mobileMenuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F5EFE6] border-t border-[#E8E0D5] px-4 py-5 space-y-4">
          <nav className="flex flex-col space-y-3 text-right text-sm text-[#5C4732]">
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#8B5E3C] py-1 font-semibold">الرئيسية</a>
            <a href="#products" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#8B5E3C] py-1 font-semibold">المنتجات</a>
            <a href="#delivery" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#8B5E3C] py-1 font-semibold">معلومات التوصيل</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#8B5E3C] py-1 font-semibold">التواصل معنا</a>
          </nav>
        </div>
      )}
    </header>
  );
}
