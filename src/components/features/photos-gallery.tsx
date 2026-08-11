import { PageScroll } from "@/components/shared/page-scroll"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Photo {
  id: string
  site: string
  caption: string
  time: string
  gradient: string
  iconColor: string
  iconType: "camera" | "crane" | "concrete" | "safety" | "pipe" | "inspect"
}

interface DateGroup {
  label: string
  photos: Photo[]
}

// ─── Photo data ───────────────────────────────────────────────────────────────

const groups: DateGroup[] = [
  {
    label: "TODAY — MON 11 AUG 2026",
    photos: [
      {
        id: "t1",
        site: "Brisbane Terminal",
        caption: "Concrete pour — pier cap P14, 35MPa mix",
        time: "14:22",
        gradient: "from-blue-500/40 to-blue-900/70",
        iconColor: "#93c5fd",
        iconType: "concrete",
      },
      {
        id: "t2",
        site: "Melbourne Depot",
        caption: "Asphalt overlay Ch 2+200, mat temp 145°C",
        time: "11:38",
        gradient: "from-amber-400/40 to-amber-800/70",
        iconColor: "#fcd34d",
        iconType: "concrete",
      },
      {
        id: "t3",
        site: "Sydney Yard",
        caption: "Waterproofing membrane application deck D",
        time: "09:15",
        gradient: "from-slate-400/40 to-slate-800/70",
        iconColor: "#cbd5e1",
        iconType: "inspect",
      },
      {
        id: "t4",
        site: "Geelong Site",
        caption: "Crane lift — precast panel PP-22, 18t",
        time: "08:45",
        gradient: "from-emerald-400/40 to-emerald-900/70",
        iconColor: "#6ee7b7",
        iconType: "crane",
      },
    ],
  },
  {
    label: "YESTERDAY — SUN 10 AUG 2026",
    photos: [
      {
        id: "y1",
        site: "Brisbane Terminal",
        caption: "Formwork strike — pier P13, 7-day cure",
        time: "15:30",
        gradient: "from-violet-400/40 to-violet-900/70",
        iconColor: "#c4b5fd",
        iconType: "concrete",
      },
      {
        id: "y2",
        site: "Perth Workshop",
        caption: "Reinforcement cage fabrication, 32mm bar",
        time: "13:00",
        gradient: "from-rose-400/40 to-rose-900/70",
        iconColor: "#fda4af",
        iconType: "camera",
      },
      {
        id: "y3",
        site: "Sydney Yard",
        caption: "Post-tension stressing — anchor zone R4",
        time: "10:20",
        gradient: "from-cyan-400/40 to-cyan-900/70",
        iconColor: "#67e8f9",
        iconType: "inspect",
      },
      {
        id: "y4",
        site: "Adelaide Depot",
        caption: "Drainage pipe installation MH-07 to MH-09",
        time: "08:55",
        gradient: "from-teal-400/40 to-teal-900/70",
        iconColor: "#5eead4",
        iconType: "pipe",
      },
    ],
  },
  {
    label: "FRI 8 AUG 2026",
    photos: [
      {
        id: "f1",
        site: "Melbourne Depot",
        caption: "Subbase compaction test pass — Ch 2+000",
        time: "16:45",
        gradient: "from-indigo-400/40 to-indigo-900/70",
        iconColor: "#a5b4fc",
        iconType: "inspect",
      },
      {
        id: "f2",
        site: "Geelong Site",
        caption: "Safety walk — Ruth Alvarez + MRPV rep",
        time: "11:00",
        gradient: "from-orange-400/40 to-orange-900/70",
        iconColor: "#fdba74",
        iconType: "safety",
      },
      {
        id: "f3",
        site: "Brisbane Terminal",
        caption: "Confined space entry permit check",
        time: "09:30",
        gradient: "from-red-400/40 to-red-900/70",
        iconColor: "#fca5a5",
        iconType: "safety",
      },
      {
        id: "f4",
        site: "Perth Workshop",
        caption: "Bored pile cap pour — pile 14 close-out",
        time: "07:45",
        gradient: "from-sky-400/40 to-sky-900/70",
        iconColor: "#7dd3fc",
        iconType: "concrete",
      },
    ],
  },
  {
    label: "THU 7 AUG 2026",
    photos: [
      {
        id: "th1",
        site: "Sydney Yard",
        caption: "Platform 3 tactile indicator installation",
        time: "15:00",
        gradient: "from-purple-400/40 to-purple-900/70",
        iconColor: "#d8b4fe",
        iconType: "inspect",
      },
      {
        id: "th2",
        site: "Adelaide Depot",
        caption: "Culvert joint waterproofing inspection",
        time: "13:30",
        gradient: "from-lime-400/40 to-lime-900/70",
        iconColor: "#bef264",
        iconType: "pipe",
      },
      {
        id: "th3",
        site: "Melbourne Depot",
        caption: "Traffic control setup — shoulder closure",
        time: "08:00",
        gradient: "from-yellow-400/40 to-yellow-900/70",
        iconColor: "#fde047",
        iconType: "safety",
      },
      {
        id: "th4",
        site: "Brisbane Terminal",
        caption: "Structural inspection — NCR-042 follow-up",
        time: "16:10",
        gradient: "from-pink-400/40 to-pink-900/70",
        iconColor: "#f9a8d4",
        iconType: "inspect",
      },
    ],
  },
]

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function CameraIcon({ color }: { color: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.5 10L12 14H6C4.9 14 4 14.9 4 16V30C4 31.1 4.9 32 6 32H34C35.1 32 36 31.1 36 30V16C36 14.9 35.1 14 34 14H28L25.5 10H14.5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="22" r="5" stroke={color} strokeWidth="2" />
      <circle cx="20" cy="22" r="2.5" fill={color} opacity="0.5" />
    </svg>
  )
}

function CraneIcon({ color }: { color: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="8"
        y1="32"
        x2="8"
        y2="10"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="10"
        x2="32"
        y2="10"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="10"
        x2="16"
        y2="32"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      <line
        x1="20"
        y1="10"
        x2="20"
        y2="20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="16" y="20" width="8" height="5" rx="1" stroke={color} strokeWidth="1.5" />
      <line
        x1="6"
        y1="32"
        x2="10"
        y2="32"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ConcreteIcon({ color }: { color: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="6" y="24" width="28" height="8" rx="1.5" stroke={color} strokeWidth="2" />
      <path d="M10 24V18" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M20 24V14" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M30 24V18" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M6 18H34" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
      <circle cx="10" cy="14" r="2" fill={color} opacity="0.6" />
      <circle cx="20" cy="11" r="2" fill={color} opacity="0.6" />
      <circle cx="30" cy="14" r="2" fill={color} opacity="0.6" />
    </svg>
  )
}

function SafetyIcon({ color }: { color: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 6L8 11V21C8 27.6 13.3 33.8 20 35C26.7 33.8 32 27.6 32 21V11L20 6Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 20L18.5 23.5L25 17"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PipeIcon({ color }: { color: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="10" cy="20" rx="4" ry="6" stroke={color} strokeWidth="2" />
      <ellipse cx="30" cy="20" rx="4" ry="6" stroke={color} strokeWidth="2" />
      <line x1="10" y1="14" x2="30" y2="14" stroke={color} strokeWidth="2" />
      <line x1="10" y1="26" x2="30" y2="26" stroke={color} strokeWidth="2" />
      <line
        x1="20"
        y1="26"
        x2="20"
        y2="32"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="15"
        y1="32"
        x2="25"
        y2="32"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function InspectIcon({ color }: { color: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="8" y="6" width="18" height="24" rx="2" stroke={color} strokeWidth="2" />
      <path d="M12 12H22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 16H22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 20H18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="29" cy="29" r="5" stroke={color} strokeWidth="2" />
      <line
        x1="33"
        y1="33"
        x2="36"
        y2="36"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PhotoIcon({ type, color }: { type: Photo["iconType"]; color: string }) {
  switch (type) {
    case "crane":
      return <CraneIcon color={color} />
    case "concrete":
      return <ConcreteIcon color={color} />
    case "safety":
      return <SafetyIcon color={color} />
    case "pipe":
      return <PipeIcon color={color} />
    case "inspect":
      return <InspectIcon color={color} />
    default:
      return <CameraIcon color={color} />
  }
}

// ─── Stat tile ────────────────────────────────────────────────────────────────

interface StatTileProps {
  label: string
  value: string | number
  accent?: boolean
}

function StatTile({ label, value, accent = false }: StatTileProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 rounded-xl border px-4 py-3",
        "bg-white/5 border-white/10",
        accent && "border-red-500/40 bg-red-500/10",
      )}
    >
      <span
        className={cn(
          "text-2xl font-semibold tabular-nums",
          accent ? "text-red-400" : "text-white",
        )}
      >
        {value}
      </span>
      <span className="text-xs text-white/50 tracking-wide">{label}</span>
    </div>
  )
}

// ─── Photo tile ───────────────────────────────────────────────────────────────

function PhotoTile({ photo }: { photo: Photo }) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] rounded-xl overflow-hidden",
        "bg-gradient-to-br",
        photo.gradient,
        "ring-1 ring-white/10",
        "group cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:ring-white/25",
      )}
    >
      {/* Icon centered in upper portion */}
      <div className="absolute inset-0 flex items-center justify-center pb-10 opacity-70 group-hover:opacity-90 transition-opacity">
        <PhotoIcon type={photo.iconType} color={photo.iconColor} />
      </div>

      {/* Subtle grid texture overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 19px,rgba(255,255,255,0.5) 20px),repeating-linear-gradient(90deg,transparent,transparent 19px,rgba(255,255,255,0.5) 20px)",
        }}
      />

      {/* Bottom caption overlay */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent px-3 py-2.5">
        <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider leading-none mb-0.5">
          {photo.site}
        </p>
        <p className="text-xs text-white leading-tight line-clamp-2">{photo.caption}</p>
        <p className="text-[10px] text-white/50 mt-0.5">{photo.time}</p>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function PhotosGallery() {
  return (
    <PageScroll>
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-8">
        {/* Toolbar / stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatTile label="Photos today" value={4} />
          <StatTile label="This week" value={16} />
          <StatTile label="Sites covered" value={6} />
          <StatTile label="Flagged" value={1} accent />
        </div>

        {/* Date groups */}
        {groups.map((group) => (
          <section key={group.label} className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="text-xs font-semibold tracking-widest text-white/40 uppercase">
                {group.label}
              </h2>
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-white/30">{group.photos.length} photos</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {group.photos.map((photo) => (
                <PhotoTile key={photo.id} photo={photo} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageScroll>
  )
}
