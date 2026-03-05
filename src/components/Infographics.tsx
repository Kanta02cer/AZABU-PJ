import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { AnimatedSection } from './Animate';

gsap.registerPlugin(ScrollTrigger);

interface CountUpStatProps {
  endValue: number;
  label: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
}

function CountUpStat({ endValue, label, suffix = '', duration = 2, decimals = 0 }: CountUpStatProps) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = numberRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            el,
            { innerHTML: '0' },
            {
              innerHTML: endValue,
              duration,
              ease: 'power3.out',
              snap: { innerHTML: Math.pow(10, -decimals) },
              onUpdate: function () {
                el.innerHTML = Number(this.targets()[0].innerHTML).toFixed(decimals);
              },
            }
          );
        },
      });
    });

    return () => ctx.revert();
  }, [endValue, duration, decimals]);

  return (
    <div ref={triggerRef} className="flex flex-col items-center justify-center p-6 border border-[#111111]/5 rounded-2xl bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
      <div className="text-4xl sm:text-6xl font-serif text-[#FF6B00] mb-2 font-bold tracking-tight">
        <span ref={numberRef}>0</span>
        <span className="text-2xl sm:text-3xl ml-1">{suffix}</span>
      </div>
      <div className="text-[#111111]/70 text-sm sm:text-base font-medium tracking-wider">{label}</div>
    </div>
  );
}

interface ProgressCircleProps {
  percentage: number;
  label: string;
  subLabel?: string;
}

function ProgressCircle({ percentage, label, subLabel }: ProgressCircleProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const circle = circleRef.current;
    const num = numberRef.current;
    if (!circle || !num) return;

    // Initial state
    gsap.set(circle, { strokeDasharray: circumference, strokeDashoffset: circumference });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          // Animate Circle
          gsap.to(circle, {
            strokeDashoffset: circumference - (percentage / 100) * circumference,
            duration: 2,
            ease: 'power3.out',
          });

          // Animate Number
          gsap.fromTo(
            num,
            { innerHTML: '0' },
            {
              innerHTML: percentage,
              duration: 2,
              ease: 'power3.out',
              snap: { innerHTML: 1 },
            }
          );
        },
      });
    });

    return () => ctx.revert();
  }, [percentage, circumference]);

  return (
    <div ref={triggerRef} className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl">
      <div className="relative w-40 h-40 mb-4 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-[#111111]/5"
          />
          {/* Animated Foreground Circle */}
          <circle
            ref={circleRef}
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            className="text-[#FF6B00]"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-[#111111]">
            <span ref={numberRef}>0</span>%
          </div>
          {subLabel && <div className="text-[10px] text-[#111111]/50 mt-1 uppercase tracking-widest">{subLabel}</div>}
        </div>
      </div>
      <div className="text-center font-bold tracking-widest text-[#111111]">{label}</div>
    </div>
  );
}

export function Infographics() {
  return (
    <div className="w-full">
      <AnimatedSection className="text-center mb-16">
        <p className="font-light tracking-widest text-[#FF6B00] text-xl sm:text-2xl uppercase mb-3 text-center">Data</p>
        <h2 className="text-[28px] sm:text-5xl font-light tracking-widest text-[#111111] leading-relaxed mb-6">
          数字で見るAZABU+
        </h2>
        <div className="w-16 h-1 bg-[#111111] mx-auto"></div>
      </AnimatedSection>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <CountUpStat endValue={100} label="未経験入社率" suffix="%" />
        <CountUpStat endValue={125} label="年間休日" suffix="日" />
        <CountUpStat endValue={12.5} label="月平均残業時間" suffix="h" decimals={1} />
        <CountUpStat endValue={98} label="定着率" suffix="%" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <ProgressCircle percentage={92} label="CCNA(国家資格相当) 取得率" subLabel="Pass Rate" />
         <ProgressCircle percentage={100} label="上流工程へのキャリアアップ支援" subLabel="Support" />
      </div>
    </div>
  );
}
