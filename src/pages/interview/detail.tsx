import { useParams, Link } from 'react-router-dom';
import { interviewsData } from '../../mocks/interviews';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'scale' | 'fade';
}) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.08 });
  const directionStyles: Record<string, string> = {
    up: 'translate-y-[120px] opacity-0',
    left: '-translate-x-[100px] opacity-0',
    right: 'translate-x-[100px] opacity-0',
    scale: 'scale-[0.7] opacity-0',
    fade: 'opacity-0 translate-y-6',
  };
  return (
    <div
      ref={ref}
      className={`transition-all duration-[1000ms] ${
        isVisible ? 'translate-y-0 translate-x-0 scale-100 opacity-100' : directionStyles[direction]
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  );
}

export default function InterviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const interview = interviewsData.find((item) => item.id === Number(id));

  if (!interview) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-[#111111] mb-4">404</h1>
          <p className="text-[#64748B] mb-8">インタビューが見つかりませんでした</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF6B00] text-white font-bold hover:bg-[#FF8C00] transition-colors"
          >
            <i className="ri-arrow-left-line"></i>
            トップに戻る
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = interviewsData.findIndex((item) => item.id === Number(id));
  const prevInterview = currentIndex > 0 ? interviewsData[currentIndex - 1] : null;
  const nextInterview = currentIndex < interviewsData.length - 1 ? interviewsData[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://static.readdy.ai/image/b5df369270f37f8723a252918bb84c70/1d1d39e7560d42a68ddb982578300fcd.png"
              alt="CHALLENGE AZABU+PJ"
              className="h-6 sm:h-8 w-auto"
            />
          </Link>
          <Link
            to="/#インタビュー"
            className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#FF6B00] transition-colors"
          >
            <i className="ri-arrow-left-line"></i>
            インタビュー一覧
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-16">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#111111] to-[#0F0F1A]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row">
              {/* Photo */}
              <div className="relative w-full md:w-2/5 h-[50vh] md:h-[80vh]">
                <img
                  src={interview.photo}
                  alt={interview.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#111111] via-[#111111]/30 to-transparent" />
                {/* Number badge */}
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <span className="text-[#FF6B00] text-4xl sm:text-5xl font-black">
                    {String(interview.id).padStart(2, '0')}
                  </span>
                  <span className="text-white/30 text-lg">/</span>
                  <span className="text-white/30 text-lg">
                    {String(interviewsData.length).padStart(2, '0')}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 px-4 py-2 rounded-full bg-[#FF6B00] text-white text-xs font-bold">
                  Interview
                </div>
              </div>

              {/* Info */}
              <div className="w-full md:w-3/5 p-6 sm:p-10 md:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-[#FF6B00] rounded-full" />
                  <div>
                    <p className="text-white/60 text-sm">{interview.position}</p>
                    <p className="text-white text-xl font-bold">{interview.name}</p>
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-snug mb-6">
                  {interview.title}
                </h1>
                <p className="text-white/70 text-sm sm:text-base leading-loose mb-8">
                  {interview.subtitle}
                </p>
                <div className="flex flex-wrap gap-2">
                  {interview.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Q&A Content */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {interview.sections.map((section, index) => (
            <AnimatedSection key={index} delay={index * 100} className="mb-16 last:mb-0">
              {/* Question */}
              <div className="flex items-start gap-4 mb-8">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF8C00] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-[#FF6B00]/20">
                  Q{index + 1}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#111111] leading-relaxed pt-2">
                  {section.question}
                </h2>
              </div>

              {/* Answer */}
              <div className="ml-0 sm:ml-16 relative">
                <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FF6B00]/30 to-transparent hidden sm:block" />
                {section.answer.split('\n\n').map((paragraph, pi) => (
                  <p key={pi} className="text-sm sm:text-base text-[#334155] leading-[2] mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>

              {index < interview.sections.length - 1 && (
                <div className="mt-16 border-b border-dashed border-slate-200" />
              )}
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Message Section */}
      <AnimatedSection direction="scale">
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-br from-[#111111] to-[#0F0F1A] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF6B00]/5 rounded-full blur-3xl" />
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="text-center mb-10">
              <div className="inline-block px-4 py-2 rounded-full bg-[#FF6B00] text-white text-xs font-bold mb-4">
                Message
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                {interview.message.heading}
              </h2>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-white/10">
              <div className="text-[#FF6B00]/20 text-6xl sm:text-8xl leading-none mb-4 select-none">
                &ldquo;
              </div>
              {interview.message.body.split('\n\n').map((paragraph, pi) => (
                <p key={pi} className="text-white/85 text-sm sm:text-base leading-[2] mb-4 last:mb-0">
                  {paragraph.split('\n').map((line, li) => (
                    <span key={li}>
                      {line}
                      {li < paragraph.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
              <div className="mt-8 flex items-center gap-4">
                <img
                  src={interview.photo}
                  alt={interview.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#FF6B00]/30"
                />
                <div>
                  <p className="text-white font-bold">{interview.name}</p>
                  <p className="text-white/50 text-xs">{interview.position}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Navigation */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-[#FAFAFA]">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            {prevInterview ? (
              <Link
                to={`/interview/${prevInterview.id}`}
                className="flex items-center gap-3 text-[#111111] hover:text-[#FF6B00] transition-colors group"
              >
                <i className="ri-arrow-left-line text-xl group-hover:-translate-x-1 transition-transform" />
                <div className="hidden sm:block">
                  <p className="text-xs text-[#64748B]">前のインタビュー</p>
                  <p className="text-sm font-bold line-clamp-1">{prevInterview.name}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            <Link
              to="/#インタビュー"
              className="px-6 py-3 rounded-full border-2 border-[#111111] text-[#111111] text-sm font-bold hover:bg-[#111111] hover:text-white transition-all"
            >
              一覧に戻る
            </Link>

            {nextInterview ? (
              <Link
                to={`/interview/${nextInterview.id}`}
                className="flex items-center gap-3 text-[#111111] hover:text-[#FF6B00] transition-colors group text-right"
              >
                <div className="hidden sm:block">
                  <p className="text-xs text-[#64748B]">次のインタビュー</p>
                  <p className="text-sm font-bold line-clamp-1">{nextInterview.name}</p>
                </div>
                <i className="ri-arrow-right-line text-xl group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-[#111111] to-[#0F0F1A]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-white/80 text-sm mb-6">あなたも新しいキャリアへの一歩を踏み出しませんか？</p>
          <a
            href="https://line.me/R/ti/p/@azabuplus"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-white font-bold shadow-xl shadow-[#FF6B00]/30 hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            <i className="ri-line-fill text-2xl" />
            エントリーはこちら
            <i className="ri-arrow-right-line" />
          </a>
        </div>
      </section>
    </div>
  );
}
