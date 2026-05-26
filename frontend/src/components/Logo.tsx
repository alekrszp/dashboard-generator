interface LogoProps {
  size?: number
}

export default function Logo({ size = 32 }: LogoProps) {
  const scale = size / 200
  const h = Math.round(320 * scale)

  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 200 320"
      role="img"
      aria-label="Dashboard Generator logo"
    >
      <rect x="0" y="0" width="200" height="200" rx="24" fill="#0d1e3a"/>

      <line x1="0" y1="60" x2="200" y2="60" stroke="#1a3a6a" strokeWidth="1"/>
      <line x1="0" y1="100" x2="200" y2="100" stroke="#1a3a6a" strokeWidth="1"/>
      <line x1="0" y1="140" x2="200" y2="140" stroke="#1a3a6a" strokeWidth="1"/>
      <line x1="60" y1="0" x2="60" y2="200" stroke="#1a3a6a" strokeWidth="1"/>
      <line x1="120" y1="0" x2="120" y2="200" stroke="#1a3a6a" strokeWidth="1"/>
      <line x1="180" y1="0" x2="180" y2="200" stroke="#1a3a6a" strokeWidth="1"/>

      <rect x="15" y="125" width="22" height="65" rx="3" fill="#1976d2"/>
      <rect x="47" y="95" width="22" height="95" rx="3" fill="#2196f3"/>
      <rect x="79" y="70" width="22" height="120" rx="3" fill="#1565c0"/>
      <rect x="111" y="50" width="22" height="140" rx="3" fill="#4d9de0"/>
      <rect x="143" y="85" width="22" height="105" rx="3" fill="#1976d2"/>

      <polyline
        points="26,115 58,88 90,62 122,45 154,78"
        fill="none"
        stroke="#64b5f6"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="26" cy="115" r="3.5" fill="#64b5f6"/>
      <circle cx="58" cy="88" r="3.5" fill="#64b5f6"/>
      <circle cx="90" cy="62" r="3.5" fill="#64b5f6"/>
      <circle cx="122" cy="45" r="3.5" fill="#64b5f6"/>
      <circle cx="154" cy="78" r="3.5" fill="#64b5f6"/>

      <rect x="0" y="190" width="200" height="10" fill="#0a1628"/>
      <rect x="0" y="190" width="200" height="10" fill="#1565c0" opacity="0.4"/>

      <rect x="15" y="212" width="30" height="4" rx="2" fill="#1976d2" opacity="0.8"/>
      <rect x="53" y="212" width="20" height="4" rx="2" fill="#4d9de0" opacity="0.6"/>
      <rect x="81" y="212" width="40" height="4" rx="2" fill="#1565c0" opacity="0.5"/>
      <rect x="129" y="212" width="15" height="4" rx="2" fill="#2196f3" opacity="0.4"/>
      <rect x="152" y="212" width="28" height="4" rx="2" fill="#1976d2" opacity="0.3"/>

      <rect x="15" y="226" width="120" height="3" rx="1.5" fill="#1a3a6a"/>
      <rect x="15" y="235" width="90" height="3" rx="1.5" fill="#1a3a6a"/>
      <rect x="15" y="244" width="105" height="3" rx="1.5" fill="#1a3a6a"/>

      <circle cx="165" cy="235" r="14" fill="none" stroke="#1976d2" strokeWidth="2"/>
      <circle cx="165" cy="235" r="6" fill="#1976d2"/>
      <line x1="165" y1="218" x2="165" y2="223" stroke="#1976d2" strokeWidth="2" strokeLinecap="round"/>
      <line x1="165" y1="247" x2="165" y2="252" stroke="#1976d2" strokeWidth="2" strokeLinecap="round"/>
      <line x1="148" y1="235" x2="153" y2="235" stroke="#1976d2" strokeWidth="2" strokeLinecap="round"/>
      <line x1="177" y1="235" x2="182" y2="235" stroke="#1976d2" strokeWidth="2" strokeLinecap="round"/>
      <line x1="153" y1="223" x2="157" y2="227" stroke="#1976d2" strokeWidth="2" strokeLinecap="round"/>
      <line x1="173" y1="243" x2="177" y2="247" stroke="#1976d2" strokeWidth="2" strokeLinecap="round"/>
      <line x1="177" y1="223" x2="173" y2="227" stroke="#1976d2" strokeWidth="2" strokeLinecap="round"/>
      <line x1="157" y1="243" x2="153" y2="247" stroke="#1976d2" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}