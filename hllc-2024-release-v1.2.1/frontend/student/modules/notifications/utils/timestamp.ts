import type { useDate } from '#imports'

export const toLocaleTimeStamp = (
  locale: string,
  timestamp: unknown,
  adapter: ReturnType<typeof useDate>
) => {
  if (!adapter.isValid(timestamp)) return
  const date = adapter.toJsDate(adapter.date(timestamp))

  return `${date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })} | ${date.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  })}`
}
