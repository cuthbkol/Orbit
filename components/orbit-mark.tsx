import type { SVGProps } from "react"

export function OrbitMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
      <circle cx="24" cy="24" r="5" fill="#22D3C5" />
      <ellipse cx="24" cy="24" rx="19" ry="8.5" stroke="currentColor" strokeWidth="2.5" transform="rotate(-32 24 24)" />
      <ellipse cx="24" cy="24" rx="19" ry="8.5" stroke="currentColor" strokeWidth="2.5" transform="rotate(32 24 24)" opacity=".6" />
      <circle cx="39.8" cy="14.1" r="3" fill="#22D3C5" />
    </svg>
  )
}
