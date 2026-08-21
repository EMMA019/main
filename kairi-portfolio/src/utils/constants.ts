export const BRAND = {
  name: 'KAIRI',
  tagline: 'Navigate Your Universe',
  meaning: '海里 — 1海里（nautical mile）は約1,852m。海を渡る距離の単位。',
  description:
    '「Kairi（海里）」は、航海の距離を測る単位であり、海そのものを意味する名前です。\n' +
    '私たちは、未知の海原を進むように、ブランドの羅針盤を描き、\n' +
    '波のようにたゆたう美しさを、3Dの力で表現します。',
} as const;

export const NAV_LINKS = [
  { id: 'hero', label: 'Top' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const;

export const SKILLS = [
  { name: 'Creative Direction', level: 96, description: 'ブランドの羅針盤を描く', icon: 'compass' },
  { name: 'Art Direction', level: 92, description: '世界観を総合演出する', icon: 'palette' },
  { name: 'Interactive 3D', level: 88, description: 'WebGLで空間を創る', icon: 'box' },
  { name: 'Visual Design', level: 94, description: '海面のような美しいUI', icon: 'layers' },
  { name: 'Typography', level: 90, description: '波長を合わせる文字組', icon: 'type' },
  { name: 'Brand Strategy', level: 85, description: '航路を設計する', icon: 'anchor' },
] as const;

export const VALUES = [
  {
    title: 'Navigate',
    text: '目的の港へ、最短ではなく、最も美しい航路で。',
  },
  {
    title: 'Embrace the Tide',
    text: '変化の潮流を恐れず、波と共に進化する。',
  },
  {
    title: 'Beyond the Horizon',
    text: '見える海の先に、まだ見ぬ表現を探しに行く。',
  },
] as const;

export function getSectionIds(): string[] {
  return NAV_LINKS.map((link) => link.id);
}

export function getMaxSkillLevel(): number {
  return Math.max(...SKILLS.map((skill) => skill.level));
}

export function isValidSkillLevel(level: number): boolean {
  return level >= 0 && level <= 100;
}
