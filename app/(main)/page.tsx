import { DriftWallSection } from "@/components/home/drift-wall-section"
import { HeroSection } from "@/components/home/hero-section"
import { ParallaxSection } from "@/components/home/parallax-section"
import { PixelTrailSection } from "@/components/home/pixel-trail-section"
import { StatsSection } from "@/components/home/stats-section"
import { TargetCursor } from "@/components/home/target-cursor"

export default function Page() {
  return (
    <>
      <div className="hidden md:block">
        <TargetCursor />
      </div>
      <HeroSection />
      <StatsSection />
      <ParallaxSection />
      <DriftWallSection />
      <PixelTrailSection />
    </>
  )
}
