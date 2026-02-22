
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';

interface SectionBackgroundProps {
  variant: 'dark' | 'light' | 'gradient' | 'warm';
  imageUrl?: string;
  imageOpacity?: number;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function SectionBackground({
  variant,
  imageUrl,
  imageOpacity = 0.06,
  children,
  className = '',
  id,
}: SectionBackgroundProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });

  const bgColors: Record<string, string> = {
    dark: 'bg-[#0A0A0A]',
    light: 'bg-[#FAFAFA]',
    gradient: 'bg-gradient-to-b from-[#FAFAFA] to-white',
    warm: 'bg-[#F5F0EB]',
  };

  return (
    <section
      id={id}
      ref={ref}
      className={`relative overflow-hidden ${bgColors[variant]} ${className}`}
    >
      {/* Background image */}
      {imageUrl && (
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={imageUrl}
            alt=""
            className={`w-full h-full object-cover object-top transition-opacity duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ opacity: isVisible ? imageOpacity : 0 }}
          />
          {variant === 'dark' && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/90 to-[#0A0A0A]/80" />
          )}
          {variant === 'light' && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA]/85 via-[#FAFAFA]/90 to-[#FAFAFA]/85" />
          )}
          {variant === 'gradient' && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA]/85 via-white/90 to-white/85" />
          )}
          {variant === 'warm' && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#F5F0EB]/80 via-[#F5F0EB]/90 to-[#F5F0EB]/80" />
          )}
        </div>
      )}

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle diagonal lines */}
        <div
          className="absolute w-[200%] h-px"
          style={{
            top: '15%',
            left: '-50%',
            transform: 'rotate(-5deg)',
            background:
              variant === 'dark'
                ? 'linear-gradient(90deg, transparent, rgba(245,166,35,0.08), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(245,166,35,0.06), transparent)',
          }}
        />
        <div
          className="absolute w-[200%] h-px"
          style={{
            bottom: '20%',
            left: '-50%',
            transform: 'rotate(3deg)',
            background:
              variant === 'dark'
                ? 'linear-gradient(90deg, transparent, rgba(245,166,35,0.06), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(245,166,35,0.04), transparent)',
          }}
        />

        {/* Corner accents */}
        <div className="absolute top-0 right-0 w-32 h-32">
          <div
            className="absolute top-6 right-6 w-16 h-px"
            style={{
              background:
                variant === 'dark'
                  ? 'linear-gradient(to left, rgba(245,166,35,0.2), transparent)'
                  : 'linear-gradient(to left, rgba(245,166,35,0.12), transparent)',
            }}
          />
          <div
            className="absolute top-6 right-6 w-px h-16"
            style={{
              background:
                variant === 'dark'
                  ? 'linear-gradient(to top, transparent, rgba(245,166,35,0.2))'
                  : 'linear-gradient(to top, transparent, rgba(245,166,35,0.12))',
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
