import Image from "next/image";
import { ShieldCheck, Target, Heart } from "lucide-react";

export const metadata = {
    title: "Tentang Kami - 22Mart",
    description: "Pelajari lebih lanjut tentang misi 22Mart dalam mendefinisikan ulang pengalaman belanja premium Anda.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 pt-24 pb-20">

            {/* ── 1. HERO SECTION ─────────────────────────────────────────────── */}
            <section className="relative px-6 py-20 lg:py-32 overflow-hidden flex flex-col items-center justify-center text-center mb-20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0" />

                <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1] text-foreground">
                        Mendefinisikan Ulang<br />Standar Premium.
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto">
                        Berawal dari dedikasi untuk kualitas, 22Mart hadir untuk memastikan setiap kebutuhan harian Anda terpenuhi tanpa kompromi.
                    </p>
                </div>
            </section>

            {/* ── 2. OUR STORY / KISAH KAMI ───────────────────────────────────── */}
            <section className="px-6 py-16 max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Perjalanan Kami</h2>
                        <div className="space-y-6 text-lg text-muted-foreground font-medium leading-relaxed">
                            <p>
                                Didirikan dengan satu visi sederhana: membuat produk berkualitas tinggi dapat diakses oleh semua orang dengan layanan yang tak tertandingi. Kami percaya bahwa berbelanja kebutuhan pokok tidak seharusnya menjadi rutinitas yang membosankan, melainkan sebuah pengalaman yang memuaskan.
                            </p>
                            <p>
                                Setiap produk di 22Mart melewati proses kurasi yang ketat. Dari produk segar hasil panen petani lokal hingga barang-barang impor pilihan, kami memastikan bahwa apa yang sampai ke tangan Anda adalah yang terbaik di kelasnya.
                            </p>
                        </div>
                    </div>

                    <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                        <Image
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop"
                            alt="Dedikasi 22Mart"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
                    </div>
                </div>
            </section>

            {/* ── 3. CORE VALUES ─────────────────────────────────────────────── */}
            <section className="px-6 py-24 mt-16 bg-muted/30 border-y border-border/40">
                <div className="max-w-[1200px] mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-16">Nilai Inti Kami</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">

                        <div className="bg-white p-10 rounded-3xl shadow-sm border border-border/60 hover:shadow-lg transition-shadow">
                            <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground mb-6">
                                <Target className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Fokus Pelanggan</h3>
                            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                                Kepuasan Anda adalah prioritas utama kami. Kami membangun setiap fitur dan layanan dengan mempertimbangkan kemudahan dan kenyamanan Anda.
                            </p>
                        </div>

                        <div className="bg-white p-10 rounded-3xl shadow-sm border border-border/60 hover:shadow-lg transition-shadow">
                            <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground mb-6">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Integritas Kualitas</h3>
                            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                                Tidak ada ruang untuk mediocrity. Kami menjamin bahwa setiap item di 22Mart telah memenuhi standar kualitas tertinggi.
                            </p>
                        </div>

                        <div className="bg-white p-10 rounded-3xl shadow-sm border border-border/60 hover:shadow-lg transition-shadow">
                            <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground mb-6">
                                <Heart className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Keberlanjutan</h3>
                            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                                Kami mendukung ekonomi lokal dengan bekerja sama erat bersama petani dan produsen lokal, serta meminimalisir jejak karbon kami.
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
