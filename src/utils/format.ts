export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  const date = new Date(+y!, +m! - 1, +d!)
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  return `${days[date.getDay()]!} ${d}/${m}`
}
