import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation, useCountUp, useParallax } from '../../hooks/useScrollAnimation';
import { newsData } from '../../mocks/news';
import { columnsData } from '../../mocks/columns';
import { SEO } from '../../components/SEO';
import { AnimatedSection, StaggerChildren } from '../../components/Animate';
import { MobileStickyCTA } from '../../components/MobileStickyCTA';
import { Heart } from 'lucide-react';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

function SalaryCounter({
  value,
  label,
  isVisible,
}: {
  value: number;
  label: string;
  isVisible: boolean;
}) {
  const count = useCountUp(value, 1800, isVisible);
  return (
    <div className="text-center flex-1">
      <p className="text-white/70 text-xs sm:text-sm mb-1 sm:mb-2">{label}</p>
      <p className="text-[#FF6B00] text-xl sm:text-3xl font-bold">{count}万円</p>
    </div>
  );
}

/* Section background decorator */
function SectionBg({
  variant = 'light',
  imageUrl, // Kept for interface compatibility
  opacity = 0.04,
  children,
  className = '',
  id,
}: {
  variant?: 'light' | 'warm';
  imageUrl?: string;
  opacity?: number;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const bgBase: Record<string, string> = {
    light: 'bg-white',
    warm: 'bg-slate-50', 
  };
  
  return (
    <section id={id} className={`relative overflow-hidden ${bgBase[variant]} ${className}`}>
      {/* Decorative Geometric Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
        {variant === 'warm' && (
          <>
            <div className="absolute w-[150%] h-[30px] bg-[#FFD700] opacity-30 transform rotate-[45deg] translate-x-[20%] -translate-y-[50%]" />
            <div className="absolute w-[100%] h-[20px] bg-[#FF6B00] opacity-20 transform -rotate-[30deg] -translate-x-[30%] translate-y-[40%]" />
          </>
        )}
        {variant === 'light' && (
          <>
            <div className="absolute w-[120%] h-[40px] bg-[#FF6B00] opacity-10 transform -rotate-[60deg] translate-x-[40%] -translate-y-[20%]" />
            <div className="absolute w-[80%] h-[15px] bg-[#FFD700] opacity-40 transform rotate-[15deg] -translate-x-[40%] translate-y-[60%]" />
          </>
        )}
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
}


import { useLayoutEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

/* HERO SECTION */
function HeroSection({ heroLoaded }: { heroLoaded: boolean }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const typographyRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useLayoutEffect(() => {
    if (!heroLoaded) return;
    
    // Setup scroll-triggered cinematic zoom and parallax
    const ctx = gsap.context(() => {
      gsap.to(imageWrapperRef.current, {
        scale: 1.15,
        opacity: 0.8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });
      
      gsap.to(typographyRef.current, {
        y: -100,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom center",
          scrub: true,
        }
      });
    }, sectionRef);

    return () => ctx.revert(); // Cleanup GSAP animations on unmount
  }, [heroLoaded]);

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-white px-4 sm:px-6">
      <SEO 
        title="東京・麻布台ヒルズでエンジニア転職 | AZABU+ Project"
        description="20代のエンジニア転職なら麻布台ヒルズのAZABU+ Project。未経験から年収350万円からのキャリアを。1day就職オーディション開催中。"
        keywords="転職エンジニア 東京,インフラエンジニア 転職,20代,麻布台ヒルズ"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[90vh] pt-24 sm:pt-32 pb-28 sm:pb-16">
        
        {/* Subtle top typography */}
        <div className={`absolute top-24 sm:top-32 left-4 sm:left-8 transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <p className="text-[#111111] text-xs sm:text-sm font-bold tracking-[0.2em] mb-2">麻布最大規模のプライム上場ITグループ</p>
          <div className="w-12 h-px bg-[#111111]/30"></div>
        </div>

        {/* Huge centered image with slight parallax based on mouse */}
        <div 
          ref={imageWrapperRef}
          className={`relative w-full max-w-4xl lg:max-w-6xl transition-all duration-1000 ease-out flex-grow flex items-center justify-center my-8 ${heroLoaded ? 'opacity-100' : 'opacity-0 scale-95'}`}
          style={{
            transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
          }}
        >
          <img 
            src={__BASE_PATH__ + "images/Challenge.png"}
            alt="Challenge."
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* Minimal Bottom CTA & Typography */}
        <div ref={typographyRef} className={`w-full flex flex-col sm:flex-row items-center justify-between mt-auto transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '0.4s' }}>
          
          <div className="flex flex-col mb-12 sm:mb-0 text-center sm:text-left">
            <h2 className="text-[#FF6B00] text-xl sm:text-3xl font-bold tracking-widest mb-2">
              特別就職オーディション
            </h2>
            <p className="text-[#111111]/60 text-sm sm:text-base tracking-[0.2em]">
              AZABU+ PROJECT
            </p>
          </div>

          <a
            href="https://calendar.app.google/8cVcUkLokHP1w48Y6"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-4 text-[#111111] font-bold tracking-[0.15em] uppercase hover:text-[#FF6B00] transition-colors pr-8"
          >
            <span className="text-lg sm:text-xl">面談エントリー</span>
            <div className="w-12 h-px bg-[#111111] group-hover:bg-[#FF6B00] group-hover:w-20 transition-all duration-500"></div>
            <i className="ri-arrow-right-line text-2xl absolute right-0 opacity-0 group-hover:opacity-100 transform -translate-x-8 group-hover:translate-x-0 transition-all duration-500" />
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center transition-opacity duration-1000 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '0.8s' }}>
        <span className="text-[10px] text-[#111111]/40 tracking-[0.2em] mb-2 sm:mb-3" style={{ writingMode: 'vertical-rl' }}>SCROLL</span>
        <div className="w-px h-12 sm:h-16 bg-gradient-to-b from-[#111111]/40 to-transparent"></div>
      </div>
    </section>
  );
}

/* Mobile Menu Component */
function MobileMenu({ isOpen, onClose, isScrolled }: { isOpen: boolean; onClose: () => void; isScrolled: boolean }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <img
            src="https://static.readdy.ai/image/b5df369270f37f8723a252918bb84c70/1d1d39e7560d42a68ddb982578300fcd.png"
            alt="CHALLENGE AZABU+PJ"
            className="h-7 w-auto"
          />
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
            <i className="ri-close-line text-2xl text-[#1A2B4C]"></i>
          </button>
        </div>
        <nav className="p-5 space-y-1">
          {[
              { label: '特徴', href: '#特徴' }, 
              { label: 'インタビュー', href: '#インタビュー' }, 
              { label: 'ニュース', href: '#ニュース' }, 
              { label: 'AZABU+PRESS', href: '#コラム' },
              { label: 'FAQ', href: '#FAQ' }
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#1A2B4C] text-base font-medium hover:bg-[#FF6B00]/5 hover:text-[#FF6B00] transition-all cursor-pointer"
            >
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-slate-100">
          <a
            href="https://calendar.app.google/8cVcUkLokHP1w48Y6"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                  event: 'cv_click',
                  button_location: 'mobile_menu_cta'
                });
              }
            }}
            className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-white text-sm font-bold shadow-lg cursor-pointer whitespace-nowrap"
          >
            <i className="ri-calendar-check-fill text-lg" />
            面談へエントリー
          </a>
        </div>
      </div>
    </>
  );
}

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const parallaxOffset = useParallax();
  const { ref: salaryAnimRef, isVisible: salaryVisible } = useScrollAnimation({ threshold: 0.3 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [progressKey, setProgressKey] = useState(0);
  const { ref: timelineRef, isVisible: timelineVisible } = useScrollAnimation({ threshold: 0.15 });
  const [activeStep, setActiveStep] = useState(-1);

  const handleCTAClick = () => {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'cv_click',
        button_location: 'home_page_cta'
      });
    }
  };

  useEffect(() => {
    setHeroLoaded(true);
  }, []);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    if (timelineVisible) {
      const timers: ReturnType<typeof setTimeout>[] = [];
      [0, 1, 2].forEach((step, i) => {
        timers.push(setTimeout(() => setActiveStep(step), 600 + i * 700));
      });
      return () => timers.forEach(clearTimeout);
    }
  }, [timelineVisible]);

  const faqs = [
    {
      question: '本当に無料ですか?',
      answer:
        'はい、完全無料です。エントリーから適性診断、キャリアアドバイザーとの面談、1day就職オーディションまで、一切費用はかかりません。入社後の研修や資格取得費用も会社が全額負担します。',
    },
    {
      question: 'PCスキルが全くなくても大丈夫ですか?',
      answer: '全く問題ありません。参加者の多くがPC初心者からスタートしています。基本的なタイピングができれば十分です。入社後の研修で必要なスキルは全て学べます。',
    },
    {
      question: '地方からでも参加できますか?',
      answer: 'はい、可能です。初回のカジュアル面談はオンラインで実施可能です。1day就職オーディションは東京での開催となりますが、遠方の方には交通費の補助制度もございます。',
    },
    {
      question: '年齢制限はありますか?',
      answer: '本プロジェクトは20代の方を対象としています。具体的には20歳から27歳までの方がエントリー可能です。',
    },
    {
      question: '選考にはどのくらい時間がかかりますか?',
      answer: '面談エントリーから内定まで、最短で2週間程度です。STEP1のフォーム入力内容をもとに一次書類審査を実施し、通過者の方とカジュアル面談（兼二次審査）を行います。',
    },
  ];

  const interviews = [
    {
      name: 'I.S さん',
      position: '第三技術本部 本部長',
      title: '20代でプロジェクトマネージャーに昇進',
      quote: '未経験からのスタートでしたが、充実した研修と先輩方のサポートのおかげで、20代でプロジェクトマネージャーに昇進できました。挑戦を後押ししてくれる環境が最大の魅力です。',
      photo: __BASE_PATH__ + 'images/interviews/gm_is.png',
    },
    {
      name: 'U.Y さん',
      position: '第五技術部',
      title: '仕事と家庭を両立しながらプロジェクトリーダーに',
      quote: '育児と仕事の両立に不安がありましたが、柔軟な働き方を支援してくれる制度のおかげで、プロジェクトリーダーとして活躍できています。',
      photo: __BASE_PATH__ + 'images/interviews/leader_uy.png',
    },
    {
      name: 'M.K さん',
      position: '第六技術部',
      title: 'チャレンジできる環境',
      quote: '新しい技術に挑戦したいという気持ちを尊重してくれる会社です。失敗を恐れず挑戦できる環境が、自分の成長を加速させてくれました。',
      photo: __BASE_PATH__ + 'images/interviews/eng_mk.png',
    },
    {
      name: 'O.R さん',
      position: '第四技術部 メンバー',
      title: '研修制度の手厚さに惹かれて',
      quote: '入社の決め手は研修制度の充実さ。未経験でも安心してスキルアップできる環境が整っていて、資格取得のサポートも手厚いです。',
      photo: __BASE_PATH__ + 'images/interviews/member_or.png',
    },
    {
      name: 'I.T さん',
      position: '第二技術部',
      title: '社員の人柄で入社を決意',
      quote: '面接で感じた社員の温かさが入社の決め手でした。チーム全体で助け合う文化があり、困った時はいつでも相談できる安心感があります。',
      photo: __BASE_PATH__ + 'images/interviews/it2_it.png',
    },
    {
      name: 'I.T さん',
      position: '営業社員',
      title: '公務員からITベンチャーの営業職に転職',
      quote: '公務員から転職して、裁量と責任を持って働ける環境に大きなやりがいを感じています。自分の提案が直接成果に繋がる実感があります。',
      photo: __BASE_PATH__ + 'images/interviews/sales_it.png',
    },
  ];

  const totalSlides = interviews.length;
  const goToSlide = useCallback(
    (index: number, direction: 'right' | 'left') => {
      setSlideDirection(direction);
      setCurrentSlide(index);
      setProgressKey((prev) => prev + 1);
    },
    []
  );
  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % totalSlides, 'right');
  }, [currentSlide, totalSlides, goToSlide]);
  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides, 'left');
  }, [currentSlide, totalSlides, goToSlide]);
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, nextSlide]);
  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };
  const resumeAutoPlay = () => {
    setIsAutoPlaying(true);
    setProgressKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2.5 sm:py-3' : 'bg-transparent py-4 sm:py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className={`flex items-center gap-2 transition-all duration-700 ${heroLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}>
            <img
              src="https://static.readdy.ai/image/b5df369270f37f8723a252918bb84c70/1d1d39e7560d42a68ddb982578300fcd.png"
              alt="CHALLENGE AZABU+PJ"
              className="h-6 sm:h-8 w-auto transition-all duration-500"
            />
          </div>
          <nav className={`hidden md:flex items-center gap-8 transition-all duration-700 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {[
              { label: '特徴', href: '#特徴' }, 
              { label: 'インタビュー', href: '#インタビュー' }, 
              { label: 'ニュース', href: '#ニュース' }, 
              { label: 'AZABU+PRESS', href: '#コラム' },
              { label: 'FAQ', href: '#FAQ' }
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium cursor-pointer text-[#111111] hover:text-[#FF6B00] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="https://calendar.app.google/8cVcUkLokHP1w48Y6"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-500 whitespace-nowrap bg-[#FF6B00] text-white hover:bg-[#FFB800]"
            >
              <i className="ri-calendar-check-fill text-base" />
              面談エントリー
            </a>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden w-12 h-12 flex items-center justify-center rounded-full transition-all cursor-pointer text-[#111111] hover:bg-slate-100"
            >
              <i className="ri-menu-3-line text-2xl"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} isScrolled={isScrolled} />

      <HeroSection heroLoaded={heroLoaded} />


      {/* Problem Section */}
      <SectionBg variant="light" imageUrl="https://readdy.ai/api/search-image?query=Abstract%20geometric%20pattern%20with%20soft%20warm%20tones%2C%20minimalist%20corporate%20background%20texture%20with%20subtle%20golden%20amber%20lines%20on%20light%20cream%20surface%2C%20elegant%20business%20presentation%20backdrop%2C%20clean%20modern%20design%20with%20faint%20network%20connection%20nodes%20and%20thin%20lines%2C%20professional%20muted%20aesthetic%20with%20warm%20highlights%2C%20ultra%20wide%20panoramic%20composition&width=1920&height=800&seq=bg-problem-section-v1&orientation=landscape" opacity={0.05}>
        <div className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection className="text-center mb-10 sm:mb-16">
              <p className="font-light tracking-widest text-[#FF6B00] text-xl sm:text-2xl tracking-widest uppercase mb-2 sm:mb-3">Problem</p>
              <h2 className="text-[28px] sm:text-5xl font-light tracking-widest text-[#111111] leading-relaxed mb-4 sm:mb-6">こんな悩み、ありませんか?</h2>
              <div className="w-12 sm:w-16 h-1 bg-[#FF6B00] mx-auto origin-center animate-expand-line"></div>
            </AnimatedSection>
            <StaggerChildren className="space-y-4 sm:space-y-6" interval={150}>
              {[
                '高卒・大学中退では上場企業に入社できない、、、',
                '文系、エンジニア未経験でIT業界に入れるか不安',
                '「未経験歓迎」のブラックな下請け企業には入りたくない',
                '高額なプログラミングスクールに通うお金がない',
              ].map((problem, index) => (
                <div
                  key={index}
                  className="py-5 border-b border-black/10 hover:border-[#FF6B00] transition-colors duration-300 group flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 group-hover:bg-red-500 text-red-500 group-hover:text-white transition-colors">
                    <i className="ri-close-line text-xl"></i>
                  </div>
                  <p className="text-lg sm:text-xl font-medium text-[#111111] leading-relaxed flex-1 pt-0.5">{problem}</p>
                </div>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </SectionBg>


      {/* Solution Section */}
      <SectionBg variant="warm" imageUrl="https://readdy.ai/api/search-image?query=Elegant%20abstract%20background%20with%20warm%20golden%20light%20rays%20streaming%20through%20modern%20glass%20architecture%2C%20soft%20bokeh%20effect%20with%20amber%20and%20cream%20tones%2C%20sophisticated%20corporate%20atmosphere%20with%20gentle%20light%20flares%2C%20minimalist%20luxury%20aesthetic%20with%20depth%20and%20warmth%2C%20professional%20photography%20style%20with%20shallow%20depth%20of%20field%2C%20ultra%20wide%20panoramic%20composition&width=1920&height=800&seq=bg-solution-section-v1&orientation=landscape" opacity={0.06}>
        <div className="py-12 sm:py-24 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection className="text-center mb-8 sm:mb-12">
              <p className="font-light tracking-widest text-[#FF6B00] text-xl sm:text-2xl tracking-widest uppercase mb-2 sm:mb-3">Solution</p>
              <h2 className="text-2xl sm:text-4xl font-light tracking-widest text-[#111111] mb-2 leading-relaxed">その悩み、すべて解決する</h2>
              <h2 className="text-[28px] sm:text-5xl font-light tracking-widest text-[#FF6B00] leading-relaxed">&lsquo;特別な入り口&rsquo;があります。</h2>
            </AnimatedSection>
            <AnimatedSection animation="zoom" delay={200}>
              <div className="py-10 relative group text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FF6B00]/5 via-transparent to-transparent blur-3xl -z-10"></div>
                <div className="inline-block px-4 py-2 border border-[#FF6B00] text-[#FF6B00] text-sm tracking-widest uppercase mb-8">AZABU+ Project</div>
                <h3 className="text-[#111111] text-2xl sm:text-4xl font-light tracking-widest leading-relaxed mb-8">
                  <span className="text-[#FF6B00] font-bold block text-4xl sm:text-5xl md:text-6xl mb-6 leading-tight whitespace-nowrap">AZABU+ 1day就職オーディション</span>
                  <span className="text-xl sm:text-2xl mt-2 block opacity-70 whitespace-nowrap">エントリー前の流れ</span>
                </h3>
                <p className="text-[#111111]/70 text-base sm:text-xl leading-loose max-w-2xl mx-auto">
                  目指すのはプログラマーではなく、文系未経験が勝てる「ITインフラエンジニア」。
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </SectionBg>

      {/* What is Infrastructure Engineer Section */}
      <SectionBg
        variant="light"
        imageUrl="https://readdy.ai/api/search-image?query=Elegant%20abstract%20digital%20network%20lattice%20on%20pure%20white%20background%2C%20minimalist%20tech%20aesthetic%2C%20subtle%20grey%20and%20amber%20connecting%20lines%2C%20clean%20professional%20corporate%20backdrop&width=1920&height=800&seq=bg-infra-engineer&orientation=landscape"
        opacity={0.03}
        id="about-infra"
      >
        <div className="py-12 sm:py-32 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection className="text-center mb-16 sm:mb-20">
              <p className="font-light tracking-widest text-[#FF6B00] text-xl sm:text-2xl tracking-widest uppercase mb-3">About</p>
              <h2 className="text-[28px] sm:text-5xl lg:text-6xl font-light tracking-widest text-[#111111] leading-relaxed mb-6">
                文系・未経験から目指す、<span className="text-[#FF6B00]">ITインフラエンジニア</span>とは？
              </h2>
              <div className="w-16 h-1 bg-[#111111] mx-auto"></div>
            </AnimatedSection>

            <StaggerChildren className="grid md:grid-cols-3 gap-8 sm:gap-10" interval={200}>
              {[
                {
                  icon: "ri-server-line",
                  title: "安定性と確実な将来性",
                  desc: "社会の裏方を支える不可欠なITの土台（サーバー・ネットワーク）。AI時代でも決して需要が尽きず、20代から手に職をつけられる最強の安定職種です。"
                },
                {
                  icon: "ri-road-map-line",
                  title: "未経験からプロフェッショナルへ",
                  desc: "プログラムが書けなくても大丈夫。ゼロから業界標準資格（CCNA等）を取得できる充実した研修制度で、土日休み・ホワイトな環境での就業を目指します。"
                },
                {
                  icon: "ri-shield-check-line",
                  title: "キャリアの不安をゼロに",
                  desc: "「きつい・夜勤ばかり」というネットの噂は過去のもの。マンツーマン研修と確実なキャリアパス設計で、失敗しないエンジニアデビューを約束します。"
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 sm:p-6 hover:-translate-y-2 transition-transform duration-400 group relative">
                  <div className="w-16 h-16 rounded-full border border-black/10 flex items-center justify-center mb-6 group-hover:border-[#FF6B00] group-hover:bg-[#FF6B00] transition-colors duration-400">
                    <i className={`${item.icon} text-3xl text-[#111111] group-hover:text-white transition-colors duration-400`}></i>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#111111] mb-4 tracking-tight">{item.title}</h3>
                  <p className="text-[#111111]/70 leading-relaxed text-sm sm:text-base">{item.desc}</p>
                </div>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </SectionBg>

      {/* Brand Story Section */}
      <section className="relative bg-white overflow-hidden">
        {/* Minimalist Accents */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF6B00]/20 to-transparent transform -translate-y-1/2" />
        <div className="absolute top-0 right-10 sm:right-20 w-px h-full bg-gradient-to-b from-transparent via-[#FF6B00]/10 to-transparent" />
        <div className="absolute top-10 left-10 sm:left-20 w-px h-[200px] bg-gradient-to-b from-[#FF6B00]/20 to-transparent" />

        {/* Cinematic Pinned Wrapper */}
        <div className="w-full relative min-h-[150vh] sm:min-h-[200vh]">
          <div className="sticky top-0 h-screen flex flex-col items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center">
              <AnimatedSection className="mb-12 sm:mb-16 w-full">
                <h2 className="font-light tracking-widest text-[#FF6B00] text-xl sm:text-2xl uppercase mb-6 sm:mb-8">Brand Story</h2>
                <h3 className="text-[28px] sm:text-5xl md:text-6xl font-light tracking-widest text-[#111111] leading-relaxed mb-8 sm:mb-12">
                  なぜ、未経験から「麻布台ヒルズ」なのか。
                </h3>
                <div className="w-px h-16 sm:h-24 bg-gradient-to-b from-[#FF6B00] to-transparent mx-auto"></div>
              </AnimatedSection>

              <div className="w-full space-y-10 sm:space-y-16">
                <AnimatedSection animation="slide-up">
                  <p className="text-[#111111]/80 text-lg sm:text-2xl leading-loose font-light tracking-wide">
                    「未経験だから」「文系だから」と、自分の可能性を小さく見積もっていませんか。<br/><br/>
                    私たちが拠点を置く麻布台ヒルズは、日本中から最先端のビジネスと熱量を持った人々が集う、特別な場所です。
                  </p>
                </AnimatedSection>
                
                <AnimatedSection animation="zoom" delay={200}>
                  <div className="py-8 sm:py-12 my-8 sm:my-12 border-y border-black/5 relative">
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FF6B00]/30"></div>
                    <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-[#FF6B00]/30"></div>
                    <p className="text-[#111111] text-2xl sm:text-4xl leading-loose font-light tracking-widest">
                      「環境が人を創る」
                    </p>
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="slide-up" delay={400}>
                  <p className="text-[#111111]/80 text-lg sm:text-2xl leading-loose font-light tracking-wide">
                    一流の刺激に触れ、高い視座を持った仲間と共に切磋琢磨する。<br/>その熱量の伝播が、あなたの成長を劇的に加速させます。
                  </p>
                  <div className="pt-10 sm:pt-16">
                    <p className="text-[#FF6B00] text-2xl sm:text-4xl font-light tracking-widest leading-relaxed">
                      最高の舞台で、あなたの新しい人生を始めよう。
                    </p>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Feature Section */}
      <SectionBg
        variant="light"
        imageUrl="https://readdy.ai/api/search-image?query=Modern%20technology%20workspace%20with%20abstract%20circuit%20board%20patterns%20fading%20into%20soft%20cream%20background%2C%20subtle%20digital%20network%20visualization%20with%20warm%20amber%20accent%20nodes%2C%20clean%20minimalist%20tech%20aesthetic%20with%20gentle%20gradients%2C%20professional%20corporate%20technology%20backdrop%2C%20thin%20geometric%20lines%20connecting%20dots%20in%20warm%20gold%20tones%20on%20light%20surface%2C%20ultra%20wide%20panoramic%20composition&width=1920&height=900&seq=bg-feature-section-v1&orientation=landscape"
        opacity={0.04}
        id="特徴"
      >
        <div className="py-12 sm:py-24 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection className="text-center mb-10 sm:mb-16">
              <p className="font-light tracking-widest text-[#FF6B00] text-xl sm:text-2xl tracking-widest uppercase mb-2 sm:mb-3">Features</p>
              <h2 className="text-[28px] sm:text-5xl font-light tracking-widest leading-relaxed mb-2">
                <span className="text-[#111111]">3つの圧倒的</span>
                <span className="text-[#FF6B00]">教育システム</span>
              </h2>
            </AnimatedSection>
            <div className="space-y-6 sm:space-y-8">
              {[
                {
                  number: '01',
                  icon: 'ri-team-line',
                  title: '全員が未経験スタート',
                  description:
                    '参加者の100%が未経験からのスタート。同じスタートラインだから、安心して学べる環境です。先輩社員も全員が未経験からキャリアをスタートしています。',
                  animation: 'slide-in-left' as const,
                },
                {
                  number: '02',
                  icon: 'ri-book-read-line',
                  title: '充実した研修カリキュラム',
                  description:
                    '入社後は基礎から体系的に学べる豊富な研修をご用意。専任の講師が丁寧にサポートし、未経験からでも着実に現場で通用するスキルを身につけられる環境を提供します。',
                  animation: 'slide-in-right' as const,
                },
                {
                  number: '03',
                  icon: 'ri-award-line',
                  title: '資格取得マラソン(CCNA等)',
                  description:
                    '研修は人事面接通過者を対象に採用前からプロのエンジニアが完全サポートで取得まで伴走いたします。業界標準資格CCNA等の取得を会社が全面サポート。受験代も不要、対策教材も不要、プロエンジニアからの直接指導を受けられます。',
                  animation: 'slide-in-left' as const,
                },
              ].map((feature, index) => (
                <AnimatedSection key={index} animation={feature.animation} delay={index * 150}>
                  <div className="relative py-8 sm:py-10 border-b border-black/10 hover:border-[#FF6B00] transition-colors duration-400 cursor-pointer group">
                    <div className="absolute top-4 sm:top-6 left-0 text-[#FF6B00] text-5xl sm:text-7xl font-thin opacity-20 group-hover:opacity-40 transition-opacity duration-500">{feature.number}</div>
                    <div className="relative z-10 pl-16 sm:pl-24">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-[#111111] mb-4 sm:mb-6 group-hover:bg-[#FF6B00] transition-colors duration-400">
                        <i className={`${feature.icon} text-2xl sm:text-3xl text-white`}></i>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-3 sm:mb-4 tracking-tight">{feature.title}</h3>
                      <p className="text-sm sm:text-base text-[#111111]/70 leading-loose">{feature.description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </SectionBg>


      {/* Benefit Section */}
      <SectionBg variant="warm" imageUrl="https://readdy.ai/api/search-image?query=Luxurious%20modern%20Tokyo%20Azabudai%20Hills%20building%20exterior%20at%20golden%20hour%20with%20warm%20sunlight%20reflecting%20off%20premium%20glass%20facades%2C%20elegant%20architectural%20photography%20with%20soft%20amber%20glow%2C%20sophisticated%20urban%20landscape%20with%20clean%20lines%20and%20premium%20materials%2C%20professional%20real%20estate%20photography%20with%20warm%20color%20palette%20and%20gentle%20lens%20flare%2C%20ultra%20wide%20panoramic%20composition&width=1920&height=900&seq=bg-benefit-section-v1&orientation=landscape" opacity={0.06}>
        <div className="py-12 sm:py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection animation="slide-in-right" className="mb-8 sm:mb-10">
              <p className="font-light tracking-widest text-[#FF6B00] text-xl sm:text-2xl tracking-widest uppercase mb-2 sm:mb-3">Location</p>
              <h2 className="text-2xl sm:text-4xl font-light tracking-widest text-[#111111] leading-relaxed mb-1 sm:mb-2">舞台は日本最高峰のビジネス街、</h2>
              <h2 className="text-[28px] sm:text-5xl font-light tracking-widest text-[#FF6B00] leading-relaxed">麻布台ヒルズ。</h2>
            </AnimatedSection>
            <AnimatedSection animation="zoom" delay={100}>
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-8 sm:mb-10 group">
                <div className="w-full h-56 sm:h-96">
                  <img
                    src="https://readdy.ai/api/search-image?query=Premium%20modern%20office%20workspace%20interior%20with%20panoramic%20Tokyo%20city%20views%20through%20large%20windows%2C%20contemporary%20furniture%20with%20navy%20blue%20and%20gold%20accents%2C%20sophisticated%20business%20lounge%20area%20with%20comfortable%20seating%20%2C%20natural%20daylight%20streaming%20through%20glass%20walls%2C%20minimalist%20corporate%20design%20with%20high-end%20finishes%2C%20professional%20photography%20style%20%2C%20clean%20and%20spacious%20layout&width=1400&height=800&seq=office-interior-002&orientation=landscape"
                    alt="オフィス環境"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A2B4C]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#1A2B4C] text-white text-xs sm:text-sm font-bold">麻布台ヒルズ 森JPタワー</div>
              </div>
            </AnimatedSection>
            <StaggerChildren className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-12" interval={100}>
              {[
                { icon: 'ri-building-line', title: '東証プライム上場', desc: '安定した経営基盤' },
                { icon: 'ri-calendar-check-line', title: '完全週休2日', desc: '年間休日125日以上' },
                { icon: 'ri-time-line', title: '残業少なめ', desc: '月平均20時間以内' },
                { icon: 'ri-shield-check-line', title: '充実の福利厚生', desc: '各種社会保険完備' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="py-4 sm:py-6 border-b border-black/10 hover:border-[#FF6B00] transition-colors duration-300 cursor-pointer group flex flex-col"
                >
                  <div className="w-10 h-10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 bg-[#111111] rounded-full group-hover:bg-[#FF6B00]">
                    <i className={`${item.icon} text-xl text-white`}></i>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-[#111111] mb-1 tracking-tight">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-[#111111]/70">{item.desc}</p>
                </div>
              ))}
            </StaggerChildren>
            <AnimatedSection animation="slide-up" delay={200}>
              <div ref={salaryAnimRef} className="bg-gradient-to-r from-[#1A2B4C] to-[#0F1A2E] rounded-xl sm:rounded-2xl p-5 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-28 sm:w-40 h-28 sm:h-40 bg-[#FF6B00]/10 rounded-full blur-3xl"></div>
                <h3 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6 relative z-10">年収モデル</h3>
                <div className="flex items-center justify-between gap-2 sm:gap-4 relative z-10">
                  <SalaryCounter value={350} label="3年目" isVisible={salaryVisible} />
                  <div className="text-white/30 text-lg sm:text-2xl animate-pulse">&rarr;</div>
                  <SalaryCounter value={450} label="5年目" isVisible={salaryVisible} />
                  <div className="text-white/30 text-lg sm:text-2xl animate-pulse">&rarr;</div>
                  <SalaryCounter value={600} label="10年目" isVisible={salaryVisible} />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </SectionBg>


      {/* Step Section — Timeline */}
      <SectionBg variant="light" imageUrl="https://readdy.ai/api/search-image?query=Abstract%20flowing%20lines%20and%20pathways%20on%20soft%20cream%20background%2C%20elegant%20journey%20visualization%20with%20warm%20golden%20amber%20accent%20paths%20%2C%20minimalist%20roadmap%20concept%20art%20with%20gentle%20curves%20and%20connection%20points%2C%20clean%20modern%20design%20with%20subtle%20depth%20and%20dimension%2C%20professional%20corporate%20infographic%20backdrop%20with%20warm%20highlights%2C%20ultra%20wide%20panoramic%20composition&width=1920&height=900&seq=bg-timeline-section-v1&orientation=landscape" opacity={0.05}>
        <div className="py-12 sm:py-24 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection className="text-center mb-10 sm:mb-16">
              <p className="font-light tracking-widest text-[#FF6B00] text-xl sm:text-2xl tracking-widest uppercase mb-2 sm:mb-3">Application Flow</p>
              <h2 className="text-[28px] sm:text-5xl font-light tracking-widest text-[#111111] leading-relaxed">エントリーまでの流れ</h2>
            </AnimatedSection>
            <div ref={timelineRef} className="relative">
              {/* Timeline vertical line */}
              <div className="absolute left-6 sm:left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-slate-200">
                <div
                  className="w-full bg-gradient-to-b from-[#FF6B00] to-[#FF8C00] origin-top transition-all duration-[1500ms] ease-out"
                  style={{ height: timelineVisible ? '100%' : '0%' }}
                ></div>
              </div>
              {[
                {
                  step: '01',
                  title: '一次書類審査・面談へのエントリー',
                  description: 'まずは専用フォームからエントリー。ご入力いただいたプロフィールをもとに一次書類審査を行います。',
                  time: '約1分',
                  icon: 'ri-line-fill',
                },
                {
                  step: '02',
                  title: '役員・人事オンライン面談',
                  description: '専任のキャリアアドバイザーがあなたの適性や希望をヒアリング。オンラインで気軽に参加できます。',
                  time: '約30分',
                  icon: 'ri-video-chat-line',
                },
                {
                  step: '03',
                  title: '役員との最終面接に挑戦！',
                  description: '実際の業務を想定して、役員との実務ベースの質問や、ポテンシャルをプレゼン。',
                  time: '1日',
                  icon: 'ri-trophy-line',
                },
              ].map((item, index) => {
                const isActive = activeStep >= index;
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={index}
                    className={`relative flex items-center mb-12 sm:mb-16 last:mb-0 ${
                      isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Dot */}
                    <div className="absolute left-6 sm:left-8 md:left-1/2 -translate-x-1/2 z-10">
                      <div
                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-700 ${
                          isActive
                            ? 'bg-gradient-to-br from-[#FF6B00] to-[#FF8C00] scale-100 animate-timeline-dot'
                            : 'bg-slate-200 scale-75'
                        }`}
                        style={{ transitionDelay: `${index * 300}ms` }}
                      >
                        <i className={`${item.icon} text-lg sm:text-2xl ${isActive ? 'text-white' : 'text-slate-400'} transition-colors duration-500`}></i>
                      </div>
                    </div>
                    {/* Card */}
                    <div className={`ml-16 sm:ml-24 md:ml-0 md:w-[calc(50%-60px)] ${isEven ? 'md:mr-auto md:pr-4' : 'md:ml-auto md:pl-4'}`}>
                      <div
                        className={`bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-lg border transition-all duration-700 ${
                          isActive
                            ? 'opacity-100 translate-y-0 border-[#FF6B00]/20 shadow-xl'
                            : 'opacity-0 translate-y-8 border-slate-100'
                        }`}
                        style={{ transitionDelay: `${300 + index * 400}ms` }}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <span className="text-[#FF6B00] text-[10px] sm:text-xs font-bold tracking-widest uppercase">STEP</span>
                          <span className="text-[#FF6B00] text-2xl sm:text-3xl font-black">{item.step}</span>
                        </div>
                        <h3 className={`font-bold text-[#1A2B4C] mb-2 sm:mb-3 leading-snug ${item.title.length > 15 ? 'text-sm sm:text-base tracking-normal' : 'text-base sm:text-xl'}`}>{item.title}</h3>
                        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-3 sm:mb-4">{item.description}</p>
                        <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#F8FAFC] w-fit">
                          <i className="ri-time-line text-[#FF6B00] text-sm"></i>
                          <span className="text-xs sm:text-sm font-medium text-[#334155]">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="absolute left-6 sm:left-8 md:left-1/2 -translate-x-1/2 -bottom-4 z-10">
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF8C00] flex items-center justify-center transition-all duration-700 ${
                    activeStep >= 2 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                  style={{ transitionDelay: '2100ms' }}
                >
                  <i className="ri-check-line text-white text-xs sm:text-sm font-bold"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionBg>


      {/* Interview Section */}
      <SectionBg variant="warm" imageUrl="https://readdy.ai/api/search-image?query=Elegant%20corporate%20team%20meeting%20environment%20with%20warm%20ambient%20lighting%2C%20soft%20focus%20modern%20office%20interior%20with%20comfortable%20seating%20areas%2C%20warm%20golden%20tones%20blending%20with%20cream%20and%20beige%2C%20sophisticated%20professional%20atmosphere%20with%20natural%20light%2C%20abstract%20bokeh%20effect%20creating%20depth%2C%20premium%20business%20photography%20style%20%2C%20ultra%20wide%20panoramic%20composition&width=1920&height=900&seq=bg-interview-section-v1&orientation=landscape" opacity={0.05} id="インタビュー">
        <div className="py-12 sm:py-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection className="text-center mb-4 sm:mb-6">
              <p className="font-light tracking-widest text-[#FF6B00] text-xl sm:text-2xl tracking-widest uppercase mb-2 sm:mb-3">Voice</p>
              <h2 className="text-[28px] sm:text-5xl font-light tracking-widest text-[#111111] leading-relaxed mb-4 sm:mb-6">社員インタビュー</h2>
              <div className="w-12 sm:w-16 h-1 bg-[#FF6B00] mx-auto"></div>
            </AnimatedSection>
            <AnimatedSection animation="fade" delay={100}>
              <p className="text-sm sm:text-base text-[#64748B] leading-loose text-center max-w-3xl mx-auto mb-10 sm:mb-16 px-2">
                株式会社当社で活躍している社員へのインタビュー。
                それぞれの入社のきっかけ、仕事を通して学んだこと、これからの目標、
                入社を希望する方へのメッセージなどをご紹介します。
              </p>
            </AnimatedSection>
            <div className="relative">
              <div className="relative bg-transparent border-t border-b border-black/10 py-8 sm:py-12 overflow-hidden mb-6 sm:mb-8">
                <div className={`flex flex-col md:flex-row gap-8 md:gap-16 ${slideDirection === 'right' ? 'animate-carousel-right' : 'animate-carousel-left'}`} key={currentSlide}>
                  <div className="relative w-full md:w-2/5 h-64 sm:h-96 md:h-[500px]">
                    <img src={interviews[currentSlide].photo} alt={interviews[currentSlide].name} className="w-full h-full object-cover object-center" />
                    <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1">
                      <span className="text-[#FF6B00] text-xl sm:text-2xl font-black">{String(currentSlide + 1).padStart(2, '0')}</span>
                      <span className="text-[#111111]/40 text-sm">/</span>
                      <span className="text-[#111111]/40 text-sm">{String(totalSlides).padStart(2, '0')}</span>
                    </div>
                  </div>
                  <div className="w-full md:w-3/5 flex flex-col justify-center relative">
                    <div className="absolute -top-10 sm:-top-20 right-0 text-[#111111]/5 text-8xl sm:text-[150px] leading-none pointer-events-none select-none">&ldquo;</div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                        <div className="w-1 h-6 sm:h-8 bg-[#FF6B00]"></div>
                        <div>
                          <p className="text-[#111111]/60 text-xs sm:text-sm uppercase tracking-widest">{interviews[currentSlide].position}</p>
                          <p className="text-[#111111] text-base sm:text-lg font-bold">{interviews[currentSlide].name}</p>
                        </div>
                      </div>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] mb-6 sm:mb-8 leading-snug tracking-tight">{interviews[currentSlide].title}</h3>
                      <p className="text-[#111111]/70 text-base sm:text-lg leading-loose mb-8 sm:mb-10 max-w-2xl">{interviews[currentSlide].quote}</p>
                      <a href={`/interview/${currentSlide + 1}`} className="inline-flex items-center gap-3 text-[#111111] text-sm sm:text-base font-bold hover:text-[#FF6B00] transition-colors duration-300 cursor-pointer group/link">
                        <span className="uppercase tracking-widest relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-[#FF6B00] group-hover/link:after:w-full after:transition-all after:duration-300">Read Full Interview</span>
                        <i className="ri-arrow-right-line group-hover/link:translate-x-2 transition-transform"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/5">
                  <div key={progressKey} className={`h-full bg-[#FF6B00] ${isAutoPlaying ? 'animate-progress' : ''}`} style={{ width: isAutoPlaying ? undefined : '0%' }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto pb-1">
                  {interviews.map((interview, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index, index > currentSlide ? 'right' : 'left')}
                      className={`relative rounded-full overflow-hidden transition-all duration-400 cursor-pointer flex-shrink-0 ${
                        currentSlide === index ? 'w-11 h-11 sm:w-12 sm:h-12 ring-2 ring-[#FF6B00] ring-offset-1 sm:ring-offset-2' : 'w-10 h-10 sm:w-10 sm:h-10 opacity-50 hover:opacity-80 grayscale hover:grayscale-0'
                      }`}
                    >
                      <img src={interview.photo} alt={interview.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-3">
                  <button onClick={prevSlide} className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border-2 border-[#1A2B4C]/20 text-[#1A2B4C] hover:bg-[#1A2B4C] hover:text-white hover:border-[#1A2B4C] transition-all duration-300 cursor-pointer">
                    <i className="ri-arrow-left-s-line text-lg sm:text-xl"></i>
                  </button>
                  <button onClick={nextSlide} className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-[#1A2B4C] text-white hover:bg-[#FF6B00] transition-all duration-300 cursor-pointer">
                    <i className="ri-arrow-right-s-line text-lg sm:text-xl"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionBg>


      {/* News Section */}
      <SectionBg variant="light" imageUrl="https://readdy.ai/api/search-image?query=Abstract%20newspaper%20and%20media%20concept%20background%20with%20soft%20warm%20tones%2C%20minimalist%20editorial%20design%20backdrop%20with%20faint%20text%20columns%20and%20golden%20amber%20highlights%2C%20clean%20modern%20journalism%20aesthetic%20with%20subtle%20geometric%20grid%20pattern%2C%20professional%20muted%20cream%20and%20warm%20white%20surface%20with%20gentle%20shadows%2C%20ultra%20wide%20panoramic%20composition&width=1920&height=800&seq=bg-news-section-v1&orientation=landscape" opacity={0.04} id="ニュース">
        <div className="py-12 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <AnimatedSection className="text-center mb-4 sm:mb-6">
              <p className="font-light tracking-widest text-[#FF6B00] text-xl sm:text-2xl tracking-widest uppercase mb-2 sm:mb-3">News</p>
              <h2 className="text-[28px] sm:text-5xl font-light tracking-widest text-[#111111] leading-relaxed mb-4 sm:mb-6">最新ニュース</h2>
              <div className="w-12 sm:w-16 h-1 bg-[#FF6B00] mx-auto"></div>
            </AnimatedSection>
          </div>
          <div className="relative w-full overflow-hidden mb-8 sm:mb-12 cursor-grab active:cursor-grabbing group">
            <div className="flex w-max animate-marquee gap-5 sm:gap-8 px-4 sm:px-6">
                {/* First set of items */}
                {[...newsData, ...newsData].map((news, index) => (
                  <Link to={`/news/${news.id}`} key={`first-${news.id}-${index}`} className="block w-[280px] sm:w-[360px] flex-shrink-0 group/card border-b border-black/10 pb-6 hover:border-[#FF6B00] transition-colors duration-400">
                    <div className="relative overflow-hidden mb-4 rounded-lg">
                      <div className="w-full aspect-video">
                        <img src={news.thumbnail} alt={news.title} className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="absolute top-0 left-0 px-3 py-1 bg-[#111111] text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase">{news.category}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-xs text-[#111111]/60 font-medium">
                        <i className="ri-calendar-line"></i>
                        <span>{news.date}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#111111] mb-3 line-clamp-2 group-hover/card:text-[#FF6B00] transition-colors duration-300">{news.title}</h3>
                      <p className="text-xs sm:text-sm text-[#111111]/70 leading-relaxed line-clamp-3 mb-4">{news.excerpt}</p>
                      <div className="flex items-center gap-2 text-[#111111] text-xs font-bold group-hover/card:text-[#FF6B00] transition-colors">
                        <span className="uppercase tracking-widest whitespace-nowrap">Read More</span>
                        <i className="ri-arrow-right-line group-hover/card:translate-x-1 transition-transform"></i>
                      </div>
                    </div>
                  </Link>
                ))}
                {/* Second set of items for seamless loop */}
                {[...newsData, ...newsData].map((news, index) => (
                  <Link to={`/news/${news.id}`} key={`second-${news.id}-${index}`} aria-hidden="true" className="block w-[280px] sm:w-[360px] flex-shrink-0 group/card border-b border-black/10 pb-6 hover:border-[#FF6B00] transition-colors duration-400">
                    <div className="relative overflow-hidden mb-4 rounded-lg">
                      <div className="w-full aspect-video">
                        <img src={news.thumbnail} alt={news.title} className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="absolute top-0 left-0 px-3 py-1 bg-[#111111] text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase">{news.category}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-xs text-[#111111]/60 font-medium">
                        <i className="ri-calendar-line"></i>
                        <span>{news.date}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#111111] mb-3 line-clamp-2 group-hover/card:text-[#FF6B00] transition-colors duration-300">{news.title}</h3>
                      <p className="text-xs sm:text-sm text-[#111111]/70 leading-relaxed line-clamp-3 mb-4">{news.excerpt}</p>
                      <div className="flex items-center gap-2 text-[#111111] text-xs font-bold group-hover/card:text-[#FF6B00] transition-colors">
                        <span className="uppercase tracking-widest whitespace-nowrap">Read More</span>
                        <i className="ri-arrow-right-line group-hover/card:translate-x-1 transition-transform"></i>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <AnimatedSection className="text-center">
              <Link to="/news" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full border-2 border-[#1A2B4C] text-[#1A2B4C] text-sm sm:text-base font-bold hover:bg-[#1A2B4C] hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap">
                <span>もっと見る</span>
                <i className="ri-arrow-right-line"></i>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </SectionBg>


    {/* Column Section */}
      <SectionBg variant="warm" imageUrl="https://readdy.ai/api/search-image?query=Elegant%20open%20book%20and%20knowledge%20concept%20background%20with%20warm%20golden%20ambient%20lighting%2C%20soft%20focus%20library%20or%20study%20environment%20with%20cream%20and%20amber%20tones%2C%20sophisticated%20educational%20atmosphere%20with%20gentle%20bokeh%2C%20minimalist%20learning%20aesthetic%20with%20warm%20highlights%20and%20natural%20textures%2C%20professional%20photography%20style%20with%20shallow%20depth%20of%20field%2C%20ultra%20wide%20panoramic%20composition&width=1920&height=800&seq=bg-column-section-v1&orientation=landscape" opacity={0.05} id="コラム">
        <div className="py-12 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <AnimatedSection className="text-center mb-4 sm:mb-6">
              <p className="font-light tracking-widest text-[#FF6B00] text-xl sm:text-2xl tracking-widest uppercase mb-2 sm:mb-3">Magazine</p>
              <h2 className="text-[28px] sm:text-5xl font-light tracking-widest text-[#111111] leading-relaxed mb-4 sm:mb-6">AZABU+PRESS</h2>
              <div className="w-12 sm:w-16 h-1 bg-[#FF6B00] mx-auto"></div>
            </AnimatedSection>
          </div>
          
          <div className="relative w-full overflow-hidden mb-8 sm:mb-12 cursor-grab active:cursor-grabbing group">
            <div className="flex w-max animate-marquee-slow gap-4 sm:gap-6 px-4" style={{ animationDirection: "reverse" }}>
              {/* First set of items */}
              {[...columnsData, ...columnsData].map((column, index) => (
                <Link to={`/column/${column.id}`} key={`first-${column.id}-${index}`} className="block w-[280px] sm:w-[360px] flex-shrink-0 group/card border-b border-black/10 pb-6 hover:border-[#FF6B00] transition-colors duration-400">
                  <div className="relative overflow-hidden mb-4 rounded-lg">
                    <div className="w-full aspect-video">
                      <img src={column.thumbnail} alt={column.title} className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="absolute top-0 left-0 px-3 py-1 bg-[#FF6B00] text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase">{column.category}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-xs text-[#111111]/60 font-medium">
                      <i className="ri-calendar-line"></i>
                      <span>{column.date}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#111111] mb-3 line-clamp-2 group-hover/card:text-[#FF6B00] transition-colors duration-300">{column.title}</h3>
                    <p className="text-xs sm:text-sm text-[#111111]/70 leading-relaxed line-clamp-3 mb-4">{column.excerpt}</p>
                    <div className="flex items-center gap-2 text-[#111111] text-xs font-bold group-hover/card:text-[#FF6B00] transition-colors">
                      <span className="uppercase tracking-widest whitespace-nowrap">Read More</span>
                      <i className="ri-arrow-right-line group-hover/card:translate-x-1 transition-transform"></i>
                    </div>
                  </div>
                </Link>
              ))}
              {/* Second set of items for seamless loop */}
              {[...columnsData, ...columnsData].map((column, index) => (
                <Link to={`/column/${column.id}`} key={`second-${column.id}-${index}`} aria-hidden="true" className="block w-[280px] sm:w-[360px] flex-shrink-0 group/card border-b border-black/10 pb-6 hover:border-[#FF6B00] transition-colors duration-400">
                  <div className="relative overflow-hidden mb-4 rounded-lg">
                    <div className="w-full aspect-video">
                      <img src={column.thumbnail} alt={column.title} className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="absolute top-0 left-0 px-3 py-1 bg-[#FF6B00] text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase">{column.category}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-xs text-[#111111]/60 font-medium">
                      <i className="ri-calendar-line"></i>
                      <span>{column.date}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#111111] mb-3 line-clamp-2 group-hover/card:text-[#FF6B00] transition-colors duration-300">{column.title}</h3>
                    <p className="text-xs sm:text-sm text-[#111111]/70 leading-relaxed line-clamp-3 mb-4">{column.excerpt}</p>
                    <div className="flex items-center gap-2 text-[#111111] text-xs font-bold group-hover/card:text-[#FF6B00] transition-colors">
                      <span className="uppercase tracking-widest whitespace-nowrap">Read More</span>
                      <i className="ri-arrow-right-line group-hover/card:translate-x-1 transition-transform"></i>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <AnimatedSection className="text-center">
            <Link to="/column" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full border-2 border-[#1A2B4C] text-[#1A2B4C] text-sm sm:text-base font-bold hover:bg-[#1A2B4C] hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap">
              <span>もっと見る</span>
              <i className="ri-arrow-right-line"></i>
            </Link>
          </AnimatedSection>
        </div>
      </SectionBg>

      {/* Selection Flow Section */}
      <SectionBg variant="warm" imageUrl="https://readdy.ai/api/search-image?query=Abstract%20professional%20growth%20and%20career%20path%20concept%20background%20with%20soft%20warm%20amber%20and%20cream%20tones%2C%20minimalist%20corporate%20design%20backdrop%20with%20subtle%20upward%20arrows%20and%20connecting%20lines%2C%20clean%20modern%20business%20aesthetic%20with%20gentle%20gradients%2C%20professional%20muted%20surface%20with%20warm%20highlights%20and%20faint%20geometric%20shapes%2C%20ultra%20wide%20panoramic%20composition&width=1920&height=1000&seq=bg-selection-flow-v1&orientation=landscape" opacity={0.05} id="選考フロー">
        <div className="py-12 sm:py-32 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection className="text-center mb-16 sm:mb-20">
              <p className="font-light tracking-widest text-[#FF6B00] text-xl sm:text-2xl tracking-widest uppercase mb-3">Selection Flow</p>
              <h2 className="text-[28px] sm:text-4xl lg:text-5xl font-light tracking-widest text-[#111111] leading-relaxed mb-4">
                選考フロー詳細
              </h2>
              <p className="text-lg sm:text-xl text-[#64748B] mb-6">ポテンシャルからスペシャリストへ</p>
              <div className="w-16 h-1 bg-[#111111] mx-auto"></div>
            </AnimatedSection>

            {/* Fluid Timeline Layout */}
            <div className="relative max-w-5xl mx-auto py-10">
              {/* Central Line */}
              <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-px bg-black/10 md:-translate-x-1/2"></div>
              
              <div className="space-y-16 sm:space-y-32">
                {[
                  {
                    step: "01",
                    title: "書類審査（ポテンシャル選考）",
                    desc: "まずは、過去の経歴よりも「未来への意欲」を重視して拝見します。",
                    points: [
                      "なぜIT業界、特に「インフラ」に興味を持ったか（きっかけの有無）。",
                      "自己学習の姿勢（資格取得への意欲、プログラミング経験の有無は問いません）。",
                      "20代ならではの柔軟性と、新しい知識を吸収する素直さ。"
                    ],
                    action: "通過後のアクション: 一次審査（1on1面談）の案内を送付。"
                  },
                  {
                    step: "02",
                    title: "人事面接",
                    desc: "現場に近い担当者、または採用担当との対話を通じて、相互のミスマッチをなくす場です。\n内容: 会社概要の説明、インフラエンジニアという職業のリアルな姿の共有。",
                    points: [
                      "コミュニケーション能力: チームで動くための基本的な対話スキル。",
                      "継続力: 研修期間（CCNA取得など）をやり抜ける根気があるか。",
                      "キャリアイメージ: 5年後、10年後にどのような技術者になりたいか。",
                      "雰囲気: 緊張をほぐし、応募者の本音を引き出す「キャリア相談」に近い形式。"
                    ]
                  },
                  {
                    step: "03",
                    title: "麻布台ヒルズグループ本社役員面接",
                    desc: "当社の文化に馴染むか、長期的に共に成長できるかを確認する最終局面です。\n内容: 執行役員による面談。よりマクロな視点でのキャリアビジョンや、弊社のパーパス（存在意義）への共感を確認します。\n形式: オンラインまたは対面（状況により変動）。",
                    points: [
                      "主体性: 与えられた仕事をこなすだけでなく、自ら考え動く姿勢があるか。",
                      "企業文化への共感: 「人を大切にする」「技術で社会を支える」という価値観への一致。",
                      "覚悟: プロのエンジニアとして自立していくための決意。"
                    ]
                  },
                  {
                    step: "04",
                    title: "内定・採択準備",
                    desc: "合格後、条件面提示（オファー面談）を経て採択となります。",
                    points: [
                      "フォロー: 採択前に不安を解消するための面談や、推薦図書・学習アドバイスの共有。",
                      "研修スタート: 99.2%が未経験の同期と共に、マンツーマンの教育体制でキャリアをスタート。"
                    ]
                  }
                ].map((item, idx) => (
                  <AnimatedSection animation="slide-up" delay={idx * 150} key={idx}>
                    <div className={`relative flex flex-col md:flex-row gap-8 md:gap-24 items-start ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''} group cursor-pointer`}>
                      
                      {/* Timeline Dot Glowing */}
                      <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-[#111111] md:-translate-x-1/2 mt-3 group-hover:bg-[#FF6B00] transition-colors duration-500 z-10">
                        <div className="absolute inset-0 rounded-full bg-[#FF6B00] animate-ping opacity-0 group-hover:opacity-50"></div>
                      </div>
                      
                      {/* Step Number Content */}
                      <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                        <div className={`text-[#FF6B00] font-light tracking-widest text-5xl sm:text-7xl font-thin opacity-30 group-hover:opacity-100 transition-opacity duration-500 mb-2 md:mb-4 ${idx % 2 === 0 ? '-ml-2 md:ml-0' : '-ml-2 md:-mr-2'}`}>STEP {item.step}</div>
                        <h3 className={`font-bold text-[#111111] leading-tight group-hover:text-[#FF6B00] transition-colors duration-300 ${item.title.length > 12 ? 'text-lg sm:text-xl md:text-2xl tracking-normal' : 'text-2xl sm:text-3xl'}`}>{item.title}</h3>
                      </div>

                      {/* Step Details */}
                      <div className={`w-full md:w-1/2 pl-16 md:pl-0 pt-2 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                        <p className="text-[#111111]/70 text-sm sm:text-base leading-relaxed mb-8 whitespace-pre-line">{item.desc}</p>
                        
                        <div className="mb-6">
                          <h4 className={`font-bold text-[#111111] text-sm sm:text-base mb-4 flex items-center gap-3 ${idx % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                            {idx % 2 !== 0 && <div className="w-1 h-4 bg-[#FF6B00] hidden md:block"></div>}
                            <div className="w-1 h-4 bg-[#FF6B00] md:hidden"></div>
                            重視するポイント
                            {idx % 2 === 0 && <div className="w-1 h-4 bg-[#FF6B00] hidden md:block"></div>}
                          </h4>
                          <ul className={`space-y-4 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                            {item.points.map((point, pIdx) => (
                              <li key={pIdx} className="text-sm sm:text-base text-[#111111]/60 leading-relaxed block border-b border-black/5 pb-2">
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {item.action && (
                          <div className={`inline-flex items-center gap-2 px-4 py-2 border border-[#FF6B00]/30 text-[#FF6B00] rounded-sm text-xs sm:text-sm font-bold bg-white mt-4 ${idx % 2 === 0 ? 'md:float-right' : 'md:float-left'}`}>
                            <i className="ri-mail-send-line"></i>
                            {item.action}
                          </div>
                        )}
                        <div className="clear-both"></div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            {/* Summary Table */}
            <AnimatedSection animation="fade" delay={600} className="mt-16 sm:mt-24">
              <h3 className="text-2xl font-bold text-center mb-8">各フェーズの期待値まとめ</h3>
              <div className="overflow-x-auto rounded-2xl shadow-lg border border-slate-200">
                <table className="w-full text-left border-collapse bg-white">
                  <thead>
                    <tr className="bg-[#1A2B4C] text-white">
                      <th className="p-4 sm:p-5 font-bold whitespace-nowrap">選考ステップ</th>
                      <th className="p-4 sm:p-5 font-bold whitespace-nowrap">評価の軸</th>
                      <th className="p-4 sm:p-5 font-bold min-w-[300px]">応募者へのメッセージ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-[#111111]">書類審査</td>
                      <td className="p-4 sm:p-5 text-[#FF6B00] font-semibold">学習意欲・ポテンシャル</td>
                      <td className="p-4 sm:p-5 text-[#475569]">あなたの「変わりたい」という気持ちを評価します。</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-[#111111]">一次審査</td>
                      <td className="p-4 sm:p-5 text-[#FF6B00] font-semibold">対話力・目的意識</td>
                      <td className="p-4 sm:p-5 text-[#475569]">インフラエンジニアという一生モノのスキルを知ってください。</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-[#111111]">二次審査</td>
                      <td className="p-4 sm:p-5 text-[#FF6B00] font-semibold">価値観の合致・主体性</td>
                      <td className="p-4 sm:p-5 text-[#475569]">この環境を、自分の成長のために使い倒してください。</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </SectionBg>

      {/* Important Notes Section */}
      <SectionBg variant="warm" opacity={0.03} id="留意事項">
        <div className="py-12 sm:py-24 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection className="text-center mb-10 md:mb-16">
              <p className="font-light tracking-widest text-[#FF6B00] text-sm md:text-base uppercase mb-2 md:mb-3">Attention</p>
              <h2 className="text-2xl md:text-4xl font-light tracking-widest text-[#111111] leading-relaxed mb-4">
                留意事項
              </h2>
              <div className="w-12 h-1 bg-[#FF6B00] mx-auto md:mb-8"></div>
            </AnimatedSection>
            
            <AnimatedSection animation="slide-up" delay={200}>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-5 md:p-10 shadow-lg border border-[#111111]/5">
                <ul className="space-y-6 md:space-y-8">
                  {[
                    "プロジェクト前提について：\n本プロジェクトは、求人者と求職者との出会いの機会を提供することを目的とするものであり、乙は、求人または求職のあっせんを行うものではない。",
                    "本プロジェクトは、直接の人材紹介を行うものではございません。企業プロジェクトの一部運営参画、リレーションの確立、マッチングの成立までを包括的にサポートすることを目的とする。",
                    "プロジェクト参加者は、選考を通過した場合は指定の連絡手段で円滑なコミュニケーションを取ること。",
                    "本プロジェクトへの一次審査フォーム（面談）のエントリー時点で、顔写真のサイト、動画等での本プロジェクトに関わるメディアへの掲載を許諾するものとする。",
                    "反社会的勢力との関係性を持たず、今後一切の反社会的勢力及びその関係者との接触、関係を持たないこと。",
                    "本プロジェクトへの参加が困難となる場合は、あらかじめ指定する期日（エントリーから最終採択の間における最終採択の通知から1週間以内）までに本プロジェクト責任者（指定の連絡先：面談担当）に迅速に通知すること。",
                    "本プロジェクトへの一次審査フォーム（面談）のエントリー時点で、上記の留意事項の全てを了承するものとする。"
                  ].map((note, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#111111]/5 flex items-center justify-center mt-0.5">
                        <span className="text-[#111111] text-xs font-bold">{idx + 1}</span>
                      </div>
                      <p className="text-[#111111]/80 text-sm md:text-base leading-relaxed whitespace-pre-wrap">{note}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </SectionBg>

      {/* FAQ Section */}
      <SectionBg variant="light" imageUrl="https://readdy.ai/api/search-image?query=Abstract%20question%20mark%20and%20answer%20concept%20background%20with%20soft%20warm%20cream%20tones%2C%20minimalist%20FAQ%20design%20backdrop%20with%20subtle%20golden%20amber%20geometric%20shapes%2C%20clean%20modern%20help%20center%20aesthetic%20with%20gentle%20gradients%20and%20light%20patterns%2C%20professional%20muted%20surface%20with%20warm%20highlights%20and%20thin%20decorative%20lines%2C%20ultra%20wide%20panoramic%20composition&width=1920&height=900&seq=bg-faq-section-v1&orientation=landscape" opacity={0.04} id="FAQ">
        <div className="py-12 sm:py-24 px-4 sm:px-6 relative">
          <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" style={{ background: 'rgba(255,107,0,0.03)' }}></div>
          <div className="absolute bottom-0 left-0 w-40 sm:w-80 h-40 sm:h-80 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" style={{ background: 'rgba(26,43,76,0.03)' }}></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <AnimatedSection className="text-center mb-10 sm:mb-16">
              <p className="font-light tracking-widest text-[#FF6B00] text-xl sm:text-2xl tracking-widest uppercase mb-2 sm:mb-3">FAQ</p>
              <h2 className="text-[28px] sm:text-5xl font-light tracking-widest text-[#111111] leading-relaxed mb-4 sm:mb-6">よくある質問</h2>
              <p className="text-[#64748B] text-sm sm:text-base">エントリー前の不安を解消します</p>
            </AnimatedSection>
            <StaggerChildren className="space-y-3 sm:space-y-5" interval={100}>
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="relative border-b border-black/10 transition-colors duration-500 hover:border-[#FF6B00]"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full py-5 sm:py-7 flex items-center gap-3 sm:gap-5 cursor-pointer group"
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-400 ${isOpen ? 'bg-[#FF6B00] text-white rotate-0 scale-110' : 'bg-[#111111] text-white group-hover:bg-[#FF6B00]'}`}
                      >
                        Q{index + 1}
                      </div>
                      <span
                        className={`flex-1 text-left text-sm sm:text-base font-bold transition-colors duration-300 ${isOpen ? 'text-[#FF6B00]' : 'text-[#111111] group-hover:text-[#FF6B00]'}`}
                      >
                        {faq.question}
                      </span>
                      <div
                        className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-all duration-400 ${isOpen ? 'rotate-180 text-[#FF6B00]' : 'text-[#111111] group-hover:text-[#FF6B00]'}`}
                      >
                        <i className="ri-arrow-down-s-line text-xl sm:text-2xl"></i>
                      </div>
                    </button>
                    <div className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="pb-5 sm:pb-8 pl-11 sm:pl-16">
                        <div className="flex gap-3 sm:gap-5">
                          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#111111]/10 flex items-center justify-center text-xs sm:text-sm font-bold text-[#111111]">A</div>
                          <div className="flex-1 pt-1 sm:pt-2">
                            <p className="text-sm sm:text-base text-[#111111]/80 leading-loose">{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </StaggerChildren>
            <AnimatedSection className="text-center mt-8 sm:mt-12" delay={300}>
              <p className="text-[#64748B] text-xs sm:text-sm mb-3 sm:mb-4">その他のご質問はお気軽にお問い合わせください</p>
              <a href="https://calendar.app.google/8cVcUkLokHP1w48Y6" target="_blank" rel="noopener noreferrer" onClick={handleCTAClick} className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#1A2B4C] text-white text-xs sm:text-sm font-bold hover:bg-[#FF6B00] transition-all duration-300 cursor-pointer whitespace-nowrap">
                <i className="ri-calendar-event-line text-base sm:text-lg"></i>
                <span>面談へエントリーする</span>
              </a>
            </AnimatedSection>
          </div>
        </div>
      </SectionBg>


      {/* Final CTA Section */}
      <SectionBg variant="light" imageUrl="https://readdy.ai/api/search-image?query=Dramatic%20aerial%20night%20view%20of%20Tokyo%20premium%20business%20district%20with%20illuminated%20skyscrapers%20and%20golden%20city%20lights%2C%20deep%20dark%20navy%20atmosphere%20with%20warm%20amber%20reflections%20on%20glass%20buildings%2C%20cinematic%20urban%20landscape%20photography%20with%20rich%20contrast%2C%20sophisticated%20metropolitan%20skyline%20at%20night%20with%20bokeh%20light%20effects%2C%20ultra%20premium%20quality%20architectural%20photography%2C%20ultra%20wide%20panoramic%20composition&width=1920&height=800&seq=bg-cta-section-v1&orientation=landscape" opacity={0.15}>
        <div className="py-12 sm:py-24 px-4 sm:px-6 relative">
          <div className="absolute top-10 left-10 w-20 sm:w-32 h-20 sm:h-32 bg-[#FF6B00]/5 rounded-full blur-2xl animate-float pointer-events-none"></div>
          <div className="absolute bottom-10 right-10 w-28 sm:w-48 h-28 sm:h-48 bg-[#FF6B00]/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>
          <AnimatedSection className="max-w-4xl mx-auto text-center relative z-10">
            <p className="text-white/90 text-xs sm:text-sm mb-1 sm:mb-2">※本プロジェクトは少人数限定の募集となります。</p>
            <p className="text-white/90 text-xs sm:text-sm mb-8 sm:mb-10">
              <span className="text-[#FF6B00] font-bold">定員に達し次第、予告なく締め切ります</span>のでお早めにエントリーください。
            </p>
            <a href="https://calendar.app.google/8cVcUkLokHP1w48Y6" target="_blank" rel="noopener noreferrer" onClick={handleCTAClick} className="inline-block w-full max-w-2xl bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-white py-5 sm:py-6 rounded-full shadow-[0_12px_32px_rgba(255,107,0,0.5)] hover:shadow-[0_16px_40px_rgba(255,107,0,0.6)] transition-all duration-300 hover:-translate-y-2 cursor-pointer animate-cta-glow">
              <div className="flex items-center justify-center gap-2 sm:gap-4 px-2">
                <i className="ri-calendar-check-line text-2xl sm:text-4xl"></i>
                <span className="text-base sm:text-xl font-bold whitespace-nowrap">一次審査・面談へエントリー(無料)</span>
                <i className="ri-arrow-right-line text-xl sm:text-3xl animate-slide-right"></i>
              </div>
            </a>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 sm:mt-8 text-white/80 text-[10px] sm:text-xs">
              <div className="flex items-center gap-1 sm:gap-2">
                <i className="ri-time-line"></i>
                <span>所要時間:約3分</span>
              </div>
              <div className="w-px h-3 sm:h-4 bg-white/30 hidden sm:block"></div>
              <div className="flex items-center gap-1 sm:gap-2">
                <i className="ri-edit-box-line"></i>
                <span>専用フォーム入力</span>
              </div>
              <div className="w-px h-3 sm:h-4 bg-white/30 hidden sm:block"></div>
              <div className="flex items-center gap-1 sm:gap-2">
                <i className="ri-check-line"></i>
                <span>完全無料</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </SectionBg>


      {/* Footer */}
      <footer className="relative bg-white border-t border-slate-200 overflow-hidden pb-20 md:pb-0">
        {/* Subtle decorative line */}
        <div className="absolute top-0 right-0 w-[50%] h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-[#FF6B00] transform -translate-y-1/2"></div>
        
        <div className="relative z-10 py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-8 sm:mb-12 gap-8 sm:gap-12">
              <div className="text-center sm:text-left">
                <img src="https://static.readdy.ai/image/b5df369270f37f8723a252918bb84c70/1d1d39e7560d42a68ddb982578300fcd.png" alt="CHALLENGE AZABU+PJ" className="h-8 sm:h-10 w-auto mb-4 mx-auto sm:mx-0" />
                <p className="text-[#111111]/70 text-sm">未経験から麻布台ヒルズで働く</p>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-end items-center gap-6 sm:gap-8">
                <a href="#特徴" className="text-[#111111]/80 text-sm font-bold hover:text-[#FF6B00] transition-colors">
                  特徴
                </a>
                <a href="#インタビュー" className="text-[#111111]/80 text-sm font-bold hover:text-[#FF6B00] transition-colors">
                  インタビュー
                </a>
                <a href="#ニュース" className="text-[#111111]/80 text-sm font-bold hover:text-[#FF6B00] transition-colors">
                  ニュース
                </a>
                <a href="#コラム" className="text-[#111111]/80 text-sm font-bold hover:text-[#FF6B00] transition-colors">
                  AZABU+PRESS
                </a>
                <a href="#FAQ" className="text-[#111111]/80 text-sm font-bold hover:text-[#FF6B00] transition-colors">
                  FAQ
                </a>
              </div>
            </div>
            <div className="border-t border-slate-200 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-center text-[#111111]/50 text-xs">&copy; 2025 AZABU+ Project. All rights reserved.</p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[#111111]/50 text-xs">
                <a href="#privacy" className="hover:text-[#111111] transition-colors">
                  プライバシーポリシー
                </a>
                <a href="#terms" className="hover:text-[#111111] transition-colors">
                  利用規約
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <MobileStickyCTA />
    </div>
  );
}
