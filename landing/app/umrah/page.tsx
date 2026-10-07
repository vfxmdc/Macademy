import Navbar from "@/components/Navbar";
import UmrahPackages from "@/components/UmrahPackages";
import Footer from "@/components/footer";

export default function UmrahPage() {
  return (
    <main className="bg-[#FAF6F0] min-h-screen">
      <Navbar />
      <UmrahPackages />
      <Footer />
    </main>
  );
}
