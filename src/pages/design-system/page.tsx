import { AnimatedSection, StaggerChildren } from '../../components/Animate';
import { SEO } from '../../components/SEO';

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6">
      <SEO title="Design System" />
      <div className="max-w-5xl mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl font-bold text-[#111111] mb-4">AZABU+ Design System</h1>
          <p className="text-slate-600">Premium component library and brand guidelines.</p>
        </header>

        {/* Animation Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-[#111111] mb-8 pb-2 border-b">Animations</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-[#FF6B00] uppercase tracking-wider">AnimatedSection</h3>
              <div className="grid grid-cols-2 gap-4">
                <AnimatedSection animation="slide-up" className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <p className="font-bold">Slide Up</p>
                  <p className="text-xs text-slate-500">Default entrance</p>
                </AnimatedSection>
                <AnimatedSection animation="fade" delay={100} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <p className="font-bold">Fade</p>
                  <p className="text-xs text-slate-500">Smooth opacity</p>
                </AnimatedSection>
                <AnimatedSection animation="zoom" delay={200} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <p className="font-bold">Zoom</p>
                  <p className="text-xs text-slate-500">Scale entrance</p>
                </AnimatedSection>
                <AnimatedSection animation="slide-in-right" delay={300} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <p className="font-bold">Slide Right</p>
                  <p className="text-xs text-slate-500">Horizontal move</p>
                </AnimatedSection>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-bold text-[#FF6B00] uppercase tracking-wider">StaggerChildren</h3>
              <StaggerChildren className="grid gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 italic">
                    Staggered Item {i}
                  </div>
                ))}
              </StaggerChildren>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-[#111111] mb-8 pb-2 border-b">Brand Palette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <div className="h-24 bg-[#FF6B00] rounded-xl mb-3 shadow-md"></div>
              <p className="font-bold text-sm">Primary Orange</p>
              <p className="text-xs text-slate-400">#FF6B00</p>
            </div>
            <div>
              <div className="h-24 bg-[#111111] rounded-xl mb-3 shadow-md"></div>
              <p className="font-bold text-sm">Deep Navy</p>
              <p className="text-xs text-slate-400">#111111</p>
            </div>
            <div>
              <div className="h-24 bg-[#F8FAFC] rounded-xl mb-3 border border-slate-200"></div>
              <p className="font-bold text-sm">Soft Slate</p>
              <p className="text-xs text-slate-400">#F8FAFC</p>
            </div>
            <div>
              <div className="h-24 bg-[#0A1121] rounded-xl mb-3 shadow-md"></div>
              <p className="font-bold text-sm">Night Blue</p>
              <p className="text-xs text-slate-400">#0A1121</p>
            </div>
          </div>
        </section>

        <footer className="mt-20 pt-12 border-t text-sm text-slate-400">
          &copy; 2026 AZABU+ Project Design System.
        </footer>
      </div>
    </div>
  );
}
