import { HeroSection } from "@/components/home/hero-section"
import { HomeDeferredEffects } from "@/components/home/home-deferred-effects"
import { StatsSection } from "@/components/home/stats-section"

export default function Page() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <HomeDeferredEffects />
    </>
  )
}
