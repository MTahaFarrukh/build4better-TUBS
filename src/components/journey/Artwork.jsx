export default function Artwork({ kind = 'photo' }) {
  return <svg className="mission-art" viewBox="0 0 240 190" aria-hidden="true">
    <circle cx="123" cy="99" r="77" fill={kind === 'safety' ? '#f9d6b9' : kind === 'voice' ? '#e0dafb' : '#d4e6f8'} />
    <path d="M25 149 Q120 118 215 155" fill="none" stroke="#193556" strokeWidth="3" strokeDasharray="4 8" />
    <g transform="rotate(-9 115 90)"><rect x="62" y="29" width="117" height="135" rx="13" fill="#fff" stroke="#193556" strokeWidth="3" />
    {kind === 'photo' ? <><rect x="73" y="42" width="95" height="90" rx="5" fill="#b5d8f1" /><circle cx="143" cy="65" r="13" fill="#ed926c"/><path d="M73 118 L108 78 L132 107 L145 91 L168 121 V132 H73Z" fill="#557f9f"/><path d="M90 146 H145" stroke="#193556" strokeWidth="4"/></> : kind === 'voice' ? <><rect x="106" y="54" width="28" height="53" rx="14" fill="#6854a0"/><path d="M94 85 V97 Q120 132 147 97 V85 M120 119 V139 M104 139 H136" fill="none" stroke="#193556" strokeWidth="5"/></> : <><path d="M120 48 L154 62 V94 Q150 122 120 139 Q90 122 86 94 V62Z" fill="#d96546"/><path d="M103 91 L115 103 L137 78" fill="none" stroke="white" strokeWidth="6"/></>}
    </g><circle cx="183" cy="144" r="23" fill="#193556"/><path d="M172 144 L180 152 L195 136" fill="none" stroke="white" strokeWidth="4"/>
  </svg>
}
