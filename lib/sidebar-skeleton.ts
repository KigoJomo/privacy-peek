const sidebar_skeleton_widths = ['52%', '61%', '68%', '76%', '84%'] as const

export function getSidebarSkeletonWidth(seed: string): (typeof sidebar_skeleton_widths)[number] {
  let hash = 0

  for (const character of seed) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0
  }

  return sidebar_skeleton_widths[hash % sidebar_skeleton_widths.length]
}

export { sidebar_skeleton_widths }
