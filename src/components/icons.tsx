import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Copy,
  Gamepad2,
  Hammer,
  Home,
  Map,
  Menu,
  MessageCircle,
  Moon,
  Play,
  Radio,
  RefreshCw,
  Route as RouteIcon,
  Shield,
  Sparkles,
  Sun,
  Swords,
  Ticket,
  TrendingUp,
  Users,
  X,
  type LucideIcon
} from 'lucide-react'

/** String → lucide icon. Lets locale JSON pick icons without shipping emoji. */
export const ICONS: Record<string, LucideIcon> = {
  arrowRight: ArrowRight,
  barChart: BarChart3,
  check: Check,
  chevronRight: ChevronRight,
  copy: Copy,
  gamepad: Gamepad2,
  gamepad2: Gamepad2,
  hammer: Hammer,
  home: Home,
  map: Map,
  menu: Menu,
  messageCircle: MessageCircle,
  moon: Moon,
  play: Play,
  radio: Radio,
  refresh: RefreshCw,
  route: RouteIcon,
  shield: Shield,
  sparkles: Sparkles,
  sun: Sun,
  swords: Swords,
  ticket: Ticket,
  trending: TrendingUp,
  users: Users,
  x: X
}

export function Icon({
  name,
  className
}: {
  name?: string
  className?: string
}) {
  const Component = (name && ICONS[name]) || Sparkles
  return <Component className={className} aria-hidden="true" />
}
