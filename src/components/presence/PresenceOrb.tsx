import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/lib/store/settings";

export type PresenceState = "idle" | "listening" | "thinking" | "responding";

interface Props {
  state?: PresenceState;
  /** 0..1 microphone level while listening */
  level?: number;
  className?: string;
  /** Shared-element name for the hero → header morph */
  transitionName?: string;
  label?: string;
}

/**
 * The Presence: a horizontal glass capsule with a flowing chromatic ribbon
 * (deep blue → violet → peach/white core → magenta → cyan), a cool rim on the
 * upper right and a warm rim on the lower left. SVG so every state animates.
 */
export function PresenceOrb({
  state = "idle",
  level = 0,
  className,
  transitionName,
  label = "iRiel",
}: Props) {
  const raw = useId().replace(/:/g, "");
  const id = (s: string) => `${raw}-${s}`;
  const u = (s: string) => `url(#${id(s)})`;
  const motion = useSettings((s) => s.motion);
  const glow = useSettings((s) => s.glow);
  const dur = state === "thinking" ? "2.4s" : state === "listening" ? "3.2s" : "8s";

  // Upper ribbon edge (blue) and lower edge (warm) — the S-curve of the reference.
  const ribbon = [
    "M30 104 C 80 96, 130 84, 190 88 C 250 92, 290 96, 336 92 L 336 96 C 290 104, 240 112, 180 112 C 120 112, 70 110, 30 106 Z",
    "M30 102 C 86 92, 140 90, 196 86 C 252 84, 296 92, 336 94 L 336 98 C 294 108, 236 106, 176 114 C 116 116, 68 108, 30 104 Z",
    "M30 104 C 76 100, 124 80, 184 90 C 244 98, 288 90, 336 90 L 336 94 C 288 100, 244 116, 186 110 C 126 108, 72 112, 30 106 Z",
    "M30 104 C 80 96, 130 84, 190 88 C 250 92, 290 96, 336 92 L 336 96 C 290 104, 240 112, 180 112 C 120 112, 70 110, 30 106 Z",
  ].join(";");
  const thread = [
    "M36 104 C 100 98, 150 86, 200 92 S 300 96, 334 93",
    "M36 102 C 104 92, 156 96, 206 90 S 296 96, 334 95",
    "M36 105 C 96 102, 146 84, 194 94 S 304 92, 334 92",
    "M36 104 C 100 98, 150 86, 200 92 S 300 96, 334 93",
  ].join(";");

  return (
    <div
      role="img"
      aria-label={label}
      data-state={state}
      data-motion={motion}
      className={cn("presence-orb select-none", className)}
      style={
        {
          "--orb-level": level.toFixed(3),
          opacity: 0.6 + (glow / 100) * 0.4,
          viewTransitionName: transitionName,
        } as CSSProperties
      }
    >
      <svg viewBox="0 0 360 190" className="block h-full w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id={id("body")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="oklch(0.13 0.01 250)" />
            <stop offset="0.4" stopColor="oklch(0.04 0.004 260)" />
            <stop offset="0.66" stopColor="oklch(0.06 0.004 60)" />
            <stop offset="1" stopColor="oklch(0.24 0.02 70)" />
          </linearGradient>
          {/* warm inner floor glow */}
          <radialGradient id={id("floor")} cx="0.42" cy="0.95" r="0.7">
            <stop offset="0" stopColor="oklch(0.85 0.05 75)" stopOpacity="0.5" />
            <stop offset="0.45" stopColor="oklch(0.5 0.03 70)" stopOpacity="0.16" />
            <stop offset="1" stopColor="oklch(0 0 0)" stopOpacity="0" />
          </radialGradient>
          {/* left warm edge refraction */}
          <radialGradient id={id("leftGlow")} cx="0.04" cy="0.6" r="0.3">
            <stop offset="0" stopColor="oklch(0.9 0.07 85)" stopOpacity="0.55" />
            <stop offset="1" stopColor="oklch(0 0 0)" stopOpacity="0" />
          </radialGradient>
          {/* rim: cool on upper right, warm/white lower left */}
          <linearGradient id={id("rim")} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="oklch(0.95 0.06 85)" stopOpacity="0.95" />
            <stop offset="0.3" stopColor="oklch(1 0 0)" stopOpacity="0.55" />
            <stop offset="0.55" stopColor="oklch(1 0 0)" stopOpacity="0.08" />
            <stop offset="0.8" stopColor="oklch(0.72 0.15 245)" stopOpacity="0.6" />
            <stop offset="1" stopColor="oklch(0.78 0.16 230)" stopOpacity="1" />
          </linearGradient>
          <linearGradient id={id("rimBottom")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.6" stopColor="oklch(1 0 0)" stopOpacity="0" />
            <stop offset="1" stopColor="oklch(0.97 0.03 85)" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id={id("ribbon")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="oklch(0.85 0.06 80)" stopOpacity="0.1" />
            <stop offset="0.14" stopColor="oklch(0.85 0.05 220)" stopOpacity="0.7" />
            <stop offset="0.32" stopColor="oklch(0.6 0.2 262)" />
            <stop offset="0.48" stopColor="oklch(0.86 0.08 55)" />
            <stop offset="0.58" stopColor="oklch(0.98 0.02 80)" />
            <stop offset="0.72" stopColor="oklch(0.66 0.2 320)" />
            <stop offset="0.86" stopColor="oklch(0.62 0.18 270)" stopOpacity="0.8" />
            <stop offset="1" stopColor="oklch(0.7 0.14 230)" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id={id("ribbonV")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="oklch(0.55 0.22 262)" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="oklch(1 0 0)" stopOpacity="0" />
            <stop offset="1" stopColor="oklch(0.85 0.08 70)" stopOpacity="0.5" />
          </linearGradient>
          <filter id={id("blur2")} x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
          <filter id={id("blur6")} x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id={id("blur16")} x="-30%" y="-80%" width="160%" height="260%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <clipPath id={id("clip")}>
            <rect x="10" y="10" width="340" height="170" rx="85" />
          </clipPath>
        </defs>

        {/* outer halo */}
        <ellipse
          cx="200"
          cy="96"
          rx="120"
          ry="26"
          fill={u("ribbon")}
          opacity="0.18"
          filter={u("blur16")}
          className="orb-halo"
        />

        <rect x="10" y="10" width="340" height="170" rx="85" fill={u("body")} />
        <g clipPath={u("clip")}>
          <ellipse cx="160" cy="196" rx="190" ry="78" fill={u("floor")} />
          <rect x="10" y="10" width="340" height="170" fill={u("leftGlow")} />
          {/* top specular */}
          <ellipse
            cx="170"
            cy="24"
            rx="120"
            ry="9"
            fill="oklch(1 0 0)"
            opacity="0.06"
            filter={u("blur6")}
          />

          <g className="orb-beam">
            {/* soft bloom */}
            <path
              d="M30 104 C 80 96, 130 84, 190 88 C 250 92, 290 96, 336 92 L 336 96 C 290 104, 240 112, 180 112 C 120 112, 70 110, 30 106 Z"
              fill={u("ribbon")}
              opacity="0.55"
              filter={u("blur16")}
            >
              <animate attributeName="d" dur={dur} repeatCount="indefinite" values={ribbon} />
            </path>
            {/* ribbon body */}
            <path
              d="M30 104 C 80 96, 130 84, 190 88 C 250 92, 290 96, 336 92 L 336 96 C 290 104, 240 112, 180 112 C 120 112, 70 110, 30 106 Z"
              fill={u("ribbon")}
              opacity="0.85"
              filter={u("blur2")}
            >
              <animate attributeName="d" dur={dur} repeatCount="indefinite" values={ribbon} />
            </path>
            <path
              d="M30 104 C 80 96, 130 84, 190 88 C 250 92, 290 96, 336 92 L 336 96 C 290 104, 240 112, 180 112 C 120 112, 70 110, 30 106 Z"
              fill={u("ribbonV")}
              opacity="0.6"
              style={{ mixBlendMode: "screen" }}
            >
              <animate attributeName="d" dur={dur} repeatCount="indefinite" values={ribbon} />
            </path>
            {/* hairline highlight */}
            <path
              d="M36 104 C 100 98, 150 86, 200 92 S 300 96, 334 93"
              stroke="oklch(1 0.02 80)"
              strokeWidth="1.2"
              fill="none"
              opacity="0.9"
              filter={u("blur2")}
            >
              <animate attributeName="d" dur={dur} repeatCount="indefinite" values={thread} />
            </path>
            {/* incandescent core */}
            <ellipse
              cx="200"
              cy="99"
              rx="46"
              ry="6"
              fill="oklch(0.99 0.03 75)"
              opacity="0.9"
              filter={u("blur6")}
              className="orb-core"
            />
          </g>
          {/* glass shading below the ribbon */}
          <rect
            x="10"
            y="114"
            width="340"
            height="30"
            fill="oklch(0 0 0)"
            opacity="0.3"
            filter={u("blur6")}
          />
        </g>

        {/* rims */}
        <rect
          x="10"
          y="10"
          width="340"
          height="170"
          rx="85"
          fill="none"
          stroke={u("rim")}
          strokeWidth="5"
          opacity="0.45"
          filter={u("blur6")}
        />
        <rect
          x="10.75"
          y="10.75"
          width="338.5"
          height="168.5"
          rx="84.25"
          fill="none"
          stroke={u("rim")}
          strokeWidth="1.5"
        />
        <rect
          x="10.75"
          y="10.75"
          width="338.5"
          height="168.5"
          rx="84.25"
          fill="none"
          stroke={u("rimBottom")}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
