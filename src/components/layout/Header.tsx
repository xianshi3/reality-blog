import Navbar from "./Navbar";
import ParallaxSection from "./ParallaxSection";

interface HeaderProps {
  parallaxImage?: string;
  parallaxTitle?: string;
  parallaxSubtitle?: string;
}

export default function Header({
  parallaxImage = "/parallax-bg.png",
  parallaxTitle = "Reality Blog",
  parallaxSubtitle = "探索技术与世界的边界",
}: HeaderProps) {
  return (
    <>
      <div className="navbar-container">
        <Navbar />
      </div>

      <div className="overflow-hidden shadow-xl animate-fadeInDown transition-transform duration-700 ease-in-out hover:scale-105 sm:hover:scale-100 pt-14 sm:pt-16">
        <ParallaxSection backgroundImage={parallaxImage} height={450}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-lg">
            {parallaxTitle}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto drop-shadow-md">
            {parallaxSubtitle}
          </p>
        </ParallaxSection>
      </div>
    </>
  );
}
