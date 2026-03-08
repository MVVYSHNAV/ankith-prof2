import Navigation from "@/components/layout/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import CampaignSection from "@/components/sections/CampaignSection";
import PressSection from "@/components/sections/PressSection";
import ContactSection from "@/components/sections/ContactSection";

const Index = () => {
    return (
        <main className="bg-background text-foreground overflow-x-hidden">
            <Navigation />
            <HeroSection />
            <AboutSection />
            <CampaignSection />
            <PressSection />
            <PortfolioSection />
            <ContactSection />
        </main>
    );
};

export default Index;
