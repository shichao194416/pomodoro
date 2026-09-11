interface LogoProps {
  size?: number;
}

export const Logo = ({ size = 28 }: LogoProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M100,50 C60,50 30,70 30,110 C30,150 60,170 100,170 C140,170 170,150 170,110 C170,70 140,50 100,50"
      fill="#e63946"
    />
    <path d="M100,52 Q60,38 45,15 Q85,30 100,52 Z" fill="#2a9d8f" />
    <path d="M100,52 Q75,18 70,0 Q98,25 100,52 Z" fill="#2a9d8f" />
    <path d="M100,52 Q125,18 130,0 Q102,25 100,52 Z" fill="#2a9d8f" />
    <path d="M100,52 Q140,38 155,15 Q115,30 100,52 Z" fill="#2a9d8f" />
    <rect x="98" y="40" width="4" height="14" rx="2" fill="#264653" />
    <polygon
      points="100,85 106,102 124,102 110,113 115,130 100,120 85,130 90,113 76,102 94,102"
      fill="white"
    />
    <circle
      cx="100"
      cy="110"
      r="45"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeDasharray="4,2"
      opacity="0.5"
    />
  </svg>
);
