export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR')
}

export function formatTime(date: string) {
  return new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function formatDateTime(date: string) {
  return `${formatDate(date)} às ${formatTime(date)}`
}