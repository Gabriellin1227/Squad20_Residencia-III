export interface VanIllustrationProps {
  className?: string;
}

/** Ilustração de van em traço simples, desenhada à mão em SVG. */
export function VanIllustration({ className }: VanIllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 84"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {/* Carroceria */}
      <path d="M8 62V18a8 8 0 0 1 8-8h80l26 26h22a8 8 0 0 1 8 8v18Z" />
      {/* Divisão da cabine */}
      <path d="M96 10v26h26" />
      {/* Rodas (preenchidas com a cor de fundo para cobrir a linha da carroceria) */}
      <ellipse cx="42" cy="66" rx="14" ry="8" fill="var(--van-fill, transparent)" />
      <ellipse cx="124" cy="66" rx="14" ry="8" fill="var(--van-fill, transparent)" />
    </svg>
  );
}
