export function computeSize(size: string | number) {
  if (typeof size == 'number') return { number: size, unit: 'px' }
  const number = size.match(/\d+/)?.[0] ?? '0'
  const unit = size.replace(number, '') || 'px'
  return { number: Number(number), unit }
}
