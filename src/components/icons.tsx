import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function svgProps({ size = 20, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...rest,
  };
}

export const IconHome = (p: IconProps) => (
  <svg {...svgProps(p)}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M10 21v-6h4v6" />
  </svg>
);

export const IconPlay = (p: IconProps) => (
  <svg {...svgProps(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="m10 8.5 5.5 3.5-5.5 3.5z" />
  </svg>
);

export const IconClock = (p: IconProps) => (
  <svg {...svgProps(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const IconChart = (p: IconProps) => (
  <svg {...svgProps(p)}>
    <path d="M5 20V10" />
    <path d="M12 20V4" />
    <path d="M19 20v-6" />
  </svg>
);

export const IconUser = (p: IconProps) => (
  <svg {...svgProps(p)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
  </svg>
);

export const IconSun = (p: IconProps) => (
  <svg {...svgProps(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const IconMoon = (p: IconProps) => (
  <svg {...svgProps(p)}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

export const IconCheck = (p: IconProps) => (
  <svg {...svgProps(p)}>
    <path d="M5 13l4 4L19 7" />
  </svg>
);

export const IconX = (p: IconProps) => (
  <svg {...svgProps(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconArrowRight = (p: IconProps) => (
  <svg {...svgProps(p)}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const IconArrowLeft = (p: IconProps) => (
  <svg {...svgProps(p)}>
    <path d="M19 12H5" />
    <path d="m11 18-6-6 6-6" />
  </svg>
);

export const IconTrophy = (p: IconProps) => (
  <svg {...svgProps(p)}>
    <path d="M8 21h8" />
    <path d="M12 17v4" />
    <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
    <path d="M7 6H4a2.5 2.5 0 0 0 2.7 4" />
    <path d="M17 6h3a2.5 2.5 0 0 1-2.7 4" />
  </svg>
);

export const IconTrendingDown = (p: IconProps) => (
  <svg {...svgProps(p)}>
    <path d="M22 17 13.5 8.5l-5 5L2 7" />
    <path d="M16 17h6v-6" />
  </svg>
);

export const IconTarget = (p: IconProps) => (
  <svg {...svgProps(p)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" />
  </svg>
);

export const IconPencil = (p: IconProps) => (
  <svg {...svgProps(p)}>
    <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
  </svg>
);

export const IconFlag = (p: IconProps) => (
  <svg {...svgProps(p)}>
    <path d="M5 21V4" />
    <path d="M5 4c2.5-1.8 5 .9 8 0 1-.3 2-.8 3-1.4V11c-1 .6-2 1.1-3 1.4-3 .9-5.5-1.8-8 0" />
  </svg>
);

export const IconTrash = (p: IconProps) => (
  <svg {...svgProps(p)}>
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="m6 6 1 14h10l1-14" />
  </svg>
);

export const IconRestart = (p: IconProps) => (
  <svg {...svgProps(p)}>
    <path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export const IconZap = (p: IconProps) => (
  <svg {...svgProps(p)}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
  </svg>
);
