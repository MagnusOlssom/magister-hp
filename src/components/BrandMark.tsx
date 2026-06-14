interface Props {
  size?: number;
}

/**
 * Magister HP-loggan: en stiliserad examensmössa (magister/akademisk examen).
 * Vit på det gradient-färgade märket – färgen ärvs via currentColor.
 */
export default function BrandMark({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* Mössans platta ovansida */}
      <path d="M12 4.2 21.5 8.6 12 13 2.5 8.6 12 4.2Z" fill="currentColor" />
      {/* Huvudbygeln under mössan */}
      <path
        d="M7 10.4V14.3c0 1.6 2.2 2.7 5 2.7s5-1.1 5-2.7v-3.9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tofsens snöre + knopp */}
      <path d="M20.3 8.9v5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20.3" cy="15.5" r="1.25" fill="currentColor" />
    </svg>
  );
}
