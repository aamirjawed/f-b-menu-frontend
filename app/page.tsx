import React from 'react';
import { Navbar } from '@/components/home/Navbar';
import { Hero } from '@/components/home/Hero';
import { StatsBanner } from '@/components/home/StatsBanner';
import { FeatureGrid } from '@/components/home/FeatureGrid';
import { WorkflowSteps } from '@/components/home/WorkflowSteps';
import { StallShowcase } from '@/components/home/StallShowcase';
import { EventOrganizerBenefits } from '@/components/home/EventOrganizerBenefits';
import { FaqSection } from '@/components/home/FaqSection';
import { Footer } from '@/components/home/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans antialiased selection:bg-amber-500 selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <StatsBanner />
        <FeatureGrid />
        <WorkflowSteps />
        <StallShowcase />
        <EventOrganizerBenefits />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
