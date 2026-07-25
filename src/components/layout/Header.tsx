import Navbar from "./Navbar";
import ParallaxSection from "./ParallaxSection";
import { createServerSupabase } from "@/lib/supabaseServer";

export default async function Header() {
  const supabase = await createServerSupabase();
  const { data: profile } = await supabase
    .from("profile")
    .select("parallax_image_url, parallax_title, parallax_subtitle")
    .eq("id", 1)
    .maybeSingle();

  const bgImage = profile?.parallax_image_url || "/parallax-bg.png";
  const title = profile?.parallax_title || "Reality Blog";
  const subtitle = profile?.parallax_subtitle || "探索技术与世界的边界";

  return (
    <>
      <div className="navbar-container">
        <Navbar />
      </div>

      <div className="overflow-hidden shadow-xl animate-fadeInDown transition-transform duration-700 ease-in-out hover:scale-105 sm:hover:scale-100 pt-14 sm:pt-16">
        <ParallaxSection backgroundImage={bgImage} height={450}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-lg">
            {title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto drop-shadow-md">
            {subtitle}
          </p>
        </ParallaxSection>
      </div>
    </>
  );
}
