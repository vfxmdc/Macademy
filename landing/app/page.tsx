"use client";

import { useState } from "react";
import { Amiri, Cairo } from "next/font/google";
import Navbar from "@/components/Navbar";
import HeroFloatingDecor3D from "@/components/HeroFloatingDecor3D";

const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-amiri" });
const cairo = Cairo({ subsets: ["arabic"], weight: ["300", "400", "500", "600", "700", "800"], variable: "--font-cairo" });

// Sample decor products with authentic Algerian pricing
const PRODUCTS = [
  {
    id: 1,
    name: "ساعة LED ديكورية فاخرة",
    category: "clocks",
    categoryLabel: "ساعات LED",
    price: 2600,
    oldPrice: 3200,
    image: "/led-clock.png",
    badge: "الأكثر مبيعاً 🌟",
    rating: 4.9,
    reviews: 128,
    description: "ساعة حائط وعرض رقمي مع إضاءة LED دافئة ومحيطية، تضيف لمسة عصرية وراقية لغرفة المعيشة أو المكتب.",
    features: ["إضاءة LED دافئة مريحة للعين", "تحكم بلمسة واحدة", "تصميم عصري رفيع", "توفير عالي للطاقة"]
  },
  {
    id: 2,
    name: "ساعة LED عصرية صغيرة",
    category: "clocks",
    categoryLabel: "ساعات LED",
    price: 1300,
    oldPrice: 1800,
    image: "/led-clock.png",
    badge: "عروض خاصة 🏷️",
    rating: 4.8,
    reviews: 95,
    description: "ساعة مكتب رقمية بإضاءة LED عصرية ومناسبة لغرف النوم والمكاتب، أنيقة وعملية جداً.",
    features: ["عرض الوقت والتاريخ", "منبه دقيق", "إضاءة خافتة ليلية", "تعمل بسلك USB"]
  },
  {
    id: 3,
    name: "الكرة الأرضية المغناطيسية العائمة LED",
    category: "led",
    categoryLabel: "منتجات LED",
    price: 5720,
    oldPrice: 6900,
    image: "/globe.png",
    badge: "ديكور مبتكر ✨",
    rating: 5.0,
    reviews: 210,
    description: "مجسم كرة أرضية يطفو في الهواء بقوة الرفع المغناطيسي مع إضاءة LED ملونة ساحرة، تحفة ديكورية ممتازة للمكاتب والمنازل والهدايا.",
    features: ["تقنية الرفع المغناطيسي الحقيقي", "إضاءة LED متغيرة الألوان", "دوران ذاتي 360 درجة", "هدية فاخرة ومبتكرة"]
  },
  {
    id: 4,
    name: "شريط إضاءة LED محيطي عالي الجودة",
    category: "lighting",
    categoryLabel: "ديكور مضيء",
    price: 2400,
    oldPrice: 3000,
    image: "/led-lighting.png",
    badge: "جديد 💡",
    rating: 4.7,
    reviews: 64,
    description: "إكسسوارات إضاءة LED لتزيين الرفوف وخلفيات الشاشات والغرف بإضاءة هادئة وراقية.",
    features: ["سهولة التركيب", "ألوان متعددة وتأثيرات ساحرة", "جودة ممتازة وعمر طويل"]
  },
  {
    id: 5,
    name: "تحفة ديكورية عصرية للمنزل",
    category: "decor",
    categoryLabel: "قطع ديكور",
    price: 3500,
    oldPrice: 4200,
    image: "/home-decor.png",
    badge: "لمسة فنية 🖼️",
    rating: 4.9,
    reviews: 82,
    description: "قطعة ديكورية فنية مميزة تجمع بين الجمال والطابع العصري لتزيين الطاولات والرفوف.",
    features: ["تصميم عصري مبتكر", "خامات ممتازة", "تتناسب مع مختلف الديكورات"]
  },
  {
    id: 6,
    name: "مصباح ديكوري مضيء للهدايا",
    category: "gifts",
    categoryLabel: "أفكار هدايا",
    price: 2900,
    oldPrice: 3600,
    image: "/led-lighting.png",
    badge: "هدية مميزة 🎁",
    rating: 4.8,
    reviews: 115,
    description: "مصباح إضاءة رومانسية وعصرية لإضافة جو دافئ ومميز، مناسب جداً للهدايا والمناسبات.",
    features: ["إضاءة خافتة مريحة", "تغليف مميز مناسب للهدايا", "بطارية قابلة للشحن"]
  }
];

const WILAYAS = [
  "01. أدرار", "02. الشلف", "03. الأغواط", "04. أم البواقي", "05. باتنة", "06. بجاية", "07. بسكرة", "08. بشار",
  "09. البليدة", "10. البويرة", "11. تمنراست", "12. تبسة", "13. تلمسان", "14. تيارت", "15. تيزي وزو", "16. الجزائر العاصمة",
  "17. الجلفة", "18. جيجل", "19. سطيف", "20. سعيدة", "21. سكيكدة", "22. سيدي بلعباس", "23. عنابة", "24. قالمة",
  "25. قسنطينة", "26. المدية", "27. مستغانم", "28. المسيلة", "29. معسكر", "30. ورقلة", "31. وهران", "32. البيض",
  "33. إليزي", "34. برج بوعريريج", "35. بومرداس", "36. الطارف", "37. تندوف", "38. تسمسيلت", "39. الوادي", "40. خنشلة",
  "41. سوق أهراس", "42. تيبازة", "43. ميلة", "44. عين الدفلى", "45. النعامة", "46. عين تموشنت", "47. غرداية", "48. غليزان",
  "49. المغير", "50. المنيعة", "51. أولاد جلال", "52. برج باجي مختار", "53. بني عباس", "54. تيميمون", "55. تقرت", "56. جانت", "57. إن صالح", "58. إن قزام"
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Order Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    wilaya: "16. الجزائر العاصمة",
    address: "",
    quantity: 1,
    notes: ""
  });

  const filteredProducts = activeTab === "all" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeTab);

  const handleOrderClick = (product: any) => {
    setSelectedProduct(product);
    setOrderSuccess(false);
    setOrderModalOpen(true);
  };

  const handleSubmitTelegramOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("يرجى إدخال الاسم ورقم الهاتف لإكمال الطلب");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: selectedProduct?.name,
          productPrice: selectedProduct?.price,
          quantity: formData.quantity,
          fullName: formData.name,
          phone: formData.phone,
          wilaya: formData.wilaya,
          address: formData.address,
          notes: formData.notes
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOrderSuccess(true);
      } else {
        alert(data.error || "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.");
      }
    } catch (err) {
      console.error("Order submission error:", err);
      alert("تعذر الاتصال بالسيرفر، يرجى التحقق من الاتصال والمحاولة لاحقاً.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const waUrl = `https://wa.me/213793725621?text=${encodeURIComponent("مرحباً M Décoration ✨ أود الاستفسار عن المنتجات والديكورات المتاحة.")}`;

  return (
    <div dir="rtl" className={`${amiri.variable} ${cairo.variable} font-[family-name:var(--font-cairo)] bg-[#FAF6F0] text-[#3D2E1E] min-h-screen selection:bg-[#8B5E3C] selection:text-white`}>
      {/* Header & Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#F5EFE6] border-b border-[#E8E0D5]">
        {/* Decorative Warm Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4A359]/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-[#8B5E3C]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Right Text Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5EFE6] border border-[#E8E0D5] text-[#8B5E3C] text-sm font-semibold shadow-2xs">
                <span className="animate-pulse">✨</span>
                <span>متجر جزائري متخصص في أرقى لمسات الديكور والإضاءة</span>
              </div>

              <h1 className="font-[family-name:var(--font-amiri)] text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-[#3D2E1E]">
                أناقة بيتك تبدأ من <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5E3C] via-[#A98B6F] to-[#5C4732]">التفاصيل ✨</span>
              </h1>

              <p className="text-[#6F5B46] text-lg sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                اكتشفوا مجموعتنا المميزة من منتجات الديكور والإضاءة وLED، واختروا القطع التي تضيف لمسة عصرية ومميزة إلى منزلكم.
              </p>

              {/* Feature Tags (Decor motifs) */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 py-2 text-sm text-[#5C4732]">
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#E8E0D5] shadow-2xs">
                  💡 إضاءة وLED
                </span>
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#E8E0D5] shadow-2xs">
                  🏠 ديكور عصري
                </span>
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#E8E0D5] shadow-2xs">
                  🎁 أفكار هدايا مميزة
                </span>
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#E8E0D5] shadow-2xs">
                  🚚 توصيل 58 ولاية
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                <a
                  href="#products"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#8B5E3C] to-[#5C4732] text-white font-bold text-base hover:from-[#744C2E] hover:to-[#4A3826] transition-all shadow-md shadow-[#5C4732]/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  تصفح المنتجات 🛍️
                </a>
                <button
                  onClick={() => handleOrderClick(PRODUCTS[0])}
                  className="px-8 py-4 rounded-xl bg-[#F5EFE6] border border-[#E8E0D5] text-[#5C4732] font-bold text-base hover:bg-[#E8E0D5] transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>اطلب الآن 🛒</span>
                </button>
              </div>

              {/* Delivery Banner Note */}
              <div className="mt-6 p-4 rounded-2xl bg-white border border-[#E8E0D5] text-right flex items-center gap-3 shadow-xs">
                <span className="text-2xl">🇩🇿</span>
                <p className="text-sm text-[#5C4732] font-medium">
                  <strong className="text-[#8B5E3C]">نوصل طلباتكم إلى مختلف ولايات الجزائر 🇩🇿</strong> — توصيل سريع وموثوق مع خيار الدفع عند الاستلام.
                </p>
              </div>
            </div>

            {/* Left Column: Floating 3D Decor Shape (Replaced old flat image) */}
            <div className="lg:col-span-5 relative">
              <HeroFloatingDecor3D />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories & Products */}
      <section id="products" className="py-20 bg-[#FAF6F0] relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="font-[family-name:var(--font-amiri)] text-3xl sm:text-4xl font-bold text-[#3D2E1E]">
              تشكيلة منتجات <span className="text-[#8B5E3C]">M Décoration</span>
            </h2>
            <p className="text-[#765C43] text-base">
              اختر ما يناسب ذوقك من أحدث منتجات الإضاءة، الساعات الديكورية، ومنتجات LED العصريّة
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 pt-6">
              {[
                { id: "all", label: "جميع المنتجات" },
                { id: "clocks", label: "🕐 ساعات LED" },
                { id: "led", label: "🌍 منتجات ومجسمات LED" },
                { id: "lighting", label: "💡 إضاءة محيطية" },
                { id: "decor", label: "🏠 قطع ديكور" },
                { id: "gifts", label: "🎁 أفكار هدايا" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-[#5C4732] text-white shadow-md shadow-[#5C4732]/20"
                      : "bg-white text-[#5C4732] border border-[#E8E0D5] hover:border-[#8B5E3C]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-2xl bg-white border border-[#E8E0D5] hover:border-[#8B5E3C]/60 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:shadow-[#5C4732]/10 hover:-translate-y-1"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden bg-[#F5EFE6]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#5C4732] text-white text-xs font-bold shadow-xs">
                      {product.badge}
                    </div>
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[#8B5E3C] text-xs font-semibold flex items-center gap-1 shadow-xs">
                      <span>★</span>
                      <span>{product.rating}</span>
                      <span className="text-[#765C43]">({product.reviews})</span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#8B5E3C] font-semibold">
                      <span>{product.categoryLabel}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">متوفر 🟢</span>
                    </div>

                    <h3 className="font-bold text-xl text-[#3D2E1E] group-hover:text-[#8B5E3C] transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-[#765C43] text-sm leading-relaxed line-clamp-2">
                      {product.description}
                    </p>

                    {/* Features list */}
                    <ul className="space-y-1 text-xs text-[#5C4732]">
                      {product.features.slice(0, 2).map((feat, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-[#8B5E3C]">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Price & Ordering Button (Single Action Button) */}
                <div className="p-6 pt-0 space-y-3">
                  <div className="flex items-baseline justify-between border-t border-[#E8E0D5] pt-4">
                    <div>
                      <span className="text-xs text-[#765C43] block">السعر المعروض:</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-[#5C4732]">{product.price.toLocaleString()} دج</span>
                        {product.oldPrice && (
                          <span className="text-xs text-gray-400 line-through">{product.oldPrice.toLocaleString()} دج</span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-[#765C43]">شامل التوصيل 🚚</span>
                  </div>

                  <button
                    onClick={() => handleOrderClick(product)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B5E3C] to-[#5C4732] hover:from-[#744C2E] hover:to-[#4A3826] text-white font-bold text-sm transition-all shadow-md shadow-[#5C4732]/15 text-center flex items-center justify-center gap-2"
                  >
                    <span>طلب المنتج الآن 🛍️</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Transparency Section */}
      <section className="py-16 bg-[#F5EFE6] border-y border-[#E8E0D5]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10 space-y-2">
            <span className="text-[#8B5E3C] font-bold text-sm">💡 شفافية الأسعار</span>
            <h2 className="font-[family-name:var(--font-amiri)] text-3xl font-bold text-[#3D2E1E]">
              أمثلة على أسعار المنتجات في المتجر
            </h2>
            <p className="text-[#765C43] text-sm">
              نوفر منتجات عالية الجودة بأسعار تنافسية ومناسبة للجميع
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#E8E0D5] bg-white shadow-md">
            <table className="w-full text-right text-sm">
              <thead className="bg-[#FAF6F0] text-[#5C4732] border-b border-[#E8E0D5]">
                <tr>
                  <th className="p-4 font-bold">المنتج</th>
                  <th className="p-4 font-bold">السعر التقديري</th>
                  <th className="p-4 font-bold hidden sm:table-cell">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D5] text-[#5C4732]">
                <tr className="hover:bg-[#FAF6F0]/60 transition-colors">
                  <td className="p-4 font-medium text-[#3D2E1E]">🕐 ساعات LED ديكورية</td>
                  <td className="p-4 font-bold text-[#8B5E3C]">من 1,300 دج إلى 2,600 دج</td>
                  <td className="p-4 text-xs text-emerald-700 hidden sm:table-cell">متوفر بأشكال متعددة</td>
                </tr>
                <tr className="hover:bg-[#FAF6F0]/60 transition-colors">
                  <td className="p-4 font-medium text-[#3D2E1E]">🌍 كرة أرضية LED عائمة (رفع مغناطيسي)</td>
                  <td className="p-4 font-bold text-[#8B5E3C]">حوالي 5,720 دج</td>
                  <td className="p-4 text-xs text-[#8B5E3C] hidden sm:table-cell">الكمية محدودة ✨</td>
                </tr>
                <tr className="hover:bg-[#FAF6F0]/60 transition-colors">
                  <td className="p-4 font-medium text-[#3D2E1E]">💡 قطع وإكسسوارات إضاءة LED</td>
                  <td className="p-4 font-bold text-[#8B5E3C]">حسب النوع والشكل</td>
                  <td className="p-4 text-xs text-[#765C43] hidden sm:table-cell">توصيل متوفر لـ 58 ولاية</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-center text-xs text-[#765C43] mt-4">
            📌 <strong>ملاحظة:</strong> يتم تأكيد الطلب والمخزون مباشرة فور استقبال الطلب في النظام.
          </p>
        </div>
      </section>

      {/* Delivery & Shipping Info Section */}
      <section id="delivery" className="py-16 bg-[#FAF6F0] relative">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="rounded-3xl bg-white border border-[#E8E0D5] p-8 sm:p-12 shadow-lg relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4 text-right">
                <span className="px-3 me-2 py-1 rounded-full bg-[#F5EFE6] text-[#8B5E3C] text-xs font-bold inline-block border border-[#E8E0D5]">
                  🚚 سياسة التوصيل المعتمدة
                </span>
                <h2 className="font-[family-name:var(--font-amiri)] text-3xl font-bold text-[#3D2E1E]">
                  نوصل طلباتكم إلى مختلف ولايات الجزائر 🇩🇿
                </h2>
                <p className="text-[#6F5B46] text-base leading-relaxed">
                  حرصاً منا على تقديم أفضل خدمة، نقوم بتوصيل جميع المنتجات والديكورات المضيئة إلى باب منزلكم أو إلى مكاتب التوصيل عبر 58 ولاية جزائرية.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm">
                  <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#E8E0D5]">
                    <h4 className="font-bold text-[#5C4732] mb-1">⏱️ مدة التوصيل</h4>
                    <p className="text-[#765C43] text-xs">من 24 ساعة إلى 48 ساعة حسب الولاية والموقع.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#E8E0D5]">
                    <h4 className="font-bold text-[#5C4732] mb-1">💳 طريقة الدفع</h4>
                    <p className="text-[#765C43] text-xs">الدفع يد بيد بعد معاينة الطلب والتأكد منه.</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 text-center">
                <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#E8E0D5] space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#5C4732] text-white text-3xl flex items-center justify-center mx-auto shadow-md">
                    🚚
                  </div>
                  <h3 className="font-bold text-[#3D2E1E] text-lg">طلب سريع ومباشر</h3>
                  <button
                    onClick={() => handleOrderClick(PRODUCTS[0])}
                    className="w-full py-3 rounded-xl bg-[#5C4732] text-white font-bold text-sm hover:bg-[#4A3826] transition-all shadow-md"
                  >
                    <span>قدم طلبك الآن</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Modal with Direct Telegram Integration */}
      {orderModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-[#E8E0D5] w-full max-w-lg rounded-2xl p-6 sm:p-8 space-y-6 relative shadow-2xl text-[#3D2E1E]">
            <button
              onClick={() => setOrderModalOpen(false)}
              className="absolute top-4 left-4 text-[#765C43] hover:text-[#3D2E1E] text-xl font-bold w-8 h-8 rounded-full bg-[#F5EFE6] flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            {!orderSuccess ? (
              <>
                <div className="text-right border-b border-[#E8E0D5] pb-4">
                  <span className="text-[#8B5E3C] text-xs font-bold block">تأكيد طلب المنتج</span>
                  <h3 className="font-bold text-xl text-[#3D2E1E]">{selectedProduct.name}</h3>
                  <p className="text-[#8B5E3C] font-bold text-lg">{selectedProduct.price.toLocaleString()} دج</p>
                </div>

                <form onSubmit={handleSubmitTelegramOrder} className="space-y-4 text-right">
                  <div>
                    <label className="block text-xs font-bold text-[#5C4732] mb-1">الاسم الكامل *</label>
                    <input
                      type="text"
                      required
                      placeholder="أدخل اسمك الكامل"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E8E0D5] text-[#3D2E1E] text-sm focus:border-[#8B5E3C] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C4732] mb-1">رقم الهاتف *</label>
                    <input
                      type="tel"
                      required
                      placeholder="07XX XX XX XX"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E8E0D5] text-[#3D2E1E] text-sm focus:border-[#8B5E3C] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#5C4732] mb-1">الولاية *</label>
                      <select
                        value={formData.wilaya}
                        onChange={e => setFormData({ ...formData, wilaya: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E8E0D5] text-[#3D2E1E] text-sm focus:border-[#8B5E3C] outline-none"
                      >
                        {WILAYAS.map(w => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#5C4732] mb-1">الكمية</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E8E0D5] text-[#3D2E1E] text-sm focus:border-[#8B5E3C] outline-none text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C4732] mb-1">العنوان أو البلدية</label>
                    <input
                      type="text"
                      placeholder="أدخل عنوان السكن أو اسم البلدية"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E8E0D5] text-[#3D2E1E] text-sm focus:border-[#8B5E3C] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8B5E3C] to-[#5C4732] text-white font-bold text-base hover:from-[#744C2E] hover:to-[#4A3826] transition-all shadow-md shadow-[#5C4732]/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>جاري إرسال الطلب... ⏳</span>
                    ) : (
                      <span>تأكيد الطلب 📦</span>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-3xl flex items-center justify-center mx-auto">
                  ✓
                </div>
                <h3 className="font-bold text-2xl text-[#3D2E1E]">تم استلام طلبك بنجاح!</h3>
                <p className="text-[#6F5B46] text-sm leading-relaxed max-w-xs mx-auto">
                  شكراً لك {formData.name}! تم إرسال تفاصيل طلبك مباشرة وسيقوم فريق M Décoration بالتواصل معك هاتفياً لتأكيد الشحن والتوصيل.
                </p>
                <button
                  onClick={() => setOrderModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#5C4732] text-white font-bold text-sm hover:bg-[#4A3826] transition-all"
                >
                  إغلاق النافذة
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating WhatsApp Contact Button (Only 1 primary floating button) */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="تواصل معنا عبر الواتساب"
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-110 transition-transform flex items-center justify-center"
      >
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
        </svg>
      </a>

      {/* Contact & Footer Section */}
      <footer id="contact" className="bg-[#F5EFE6] text-[#5C4732] text-sm border-t border-[#E8E0D5]">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Store Bio */}
            <div className="md:col-span-5 space-y-4 text-right">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-[#5C4732] text-white font-extrabold flex items-center justify-center text-lg">M</span>
                <span className="font-[family-name:var(--font-amiri)] text-2xl font-bold text-[#3D2E1E]">M Décoration</span>
              </div>
              <p className="text-[#765C43] text-sm leading-relaxed max-w-md">
                متجر جزائري متخصص في الديكور، المنتجات المضيئة، ومنتجات LED، مع مجموعة من المنتجات العصرية والمميزة المناسبة للمنزل والهدايا.
              </p>
              <div className="text-[#8B5E3C] font-bold text-xs">
                نوصل طلباتكم إلى مختلف ولايات الجزائر 🇩🇿
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-3 text-right">
              <h4 className="text-[#3D2E1E] font-bold text-base">روابط سريعة</h4>
              <ul className="space-y-2 text-xs text-[#765C43]">
                <li><a href="#" className="hover:text-[#8B5E3C] transition-colors">الرئيسية</a></li>
                <li><a href="#products" className="hover:text-[#8B5E3C] transition-colors">المنتجات</a></li>
                <li><a href="#delivery" className="hover:text-[#8B5E3C] transition-colors">معلومات التوصيل</a></li>
                <li><a href="#contact" className="hover:text-[#8B5E3C] transition-colors">التواصل مع المتجر</a></li>
              </ul>
            </div>

            {/* Direct Contact */}
            <div className="md:col-span-4 space-y-4 text-right">
              <h4 className="text-[#3D2E1E] font-bold text-base">التواصل مع المتجر</h4>
              <p className="text-xs text-[#765C43]">يمكنكم التواصل معنا مباشرة لطلب المنتجات أو الاستفسار:</p>
              
              <div className="space-y-2">
                <a
                  href="tel:0793725621"
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E8E0D5] hover:border-[#8B5E3C] text-[#3D2E1E] font-bold text-sm transition-all dir-ltr shadow-2xs"
                >
                  <span className="text-[#8B5E3C]">📞 اتصل بنا:</span>
                  <span>0793 725 621</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-[#E8E0D5] text-center text-xs text-[#765C43]">
            © {new Date().getFullYear()} M Décoration — إم ديكور. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </div>
  );
}
