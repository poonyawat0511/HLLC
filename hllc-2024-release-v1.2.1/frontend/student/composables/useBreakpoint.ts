import { useDisplay } from 'vuetify'

interface Breakpoint {
  axis: 'vertical' | 'horizontal'
  ratio: number
  display: 'mobile' | 'tablet' | 'laptop'
  navigation: 'bottom' | 'side'
}

export const useBreakpoint = (options?: {
  tabletWidth?: number
  laptopWidth?: number
}) => {
  const TABLET_SIZE = options?.tabletWidth ?? 768
  const LAPTOP_SIZE = options?.laptopWidth ?? 1280

  const { height, width, mobile } = useDisplay()

  // Fast computed for axis
  const axis = computed<Breakpoint['axis']>(() => {
    return width.value > height.value ? 'vertical' : 'horizontal'
  })

  // Fast computed for ratio
  const ratio = computed<Breakpoint['ratio']>(() => {
    const screenRatio = width.value / height.value
    if (screenRatio >= 1) return screenRatio
    return screenRatio
  })

  // Fast computed for display
  const display = computed<Breakpoint['display']>(() => {
    if (width.value >= LAPTOP_SIZE) return 'laptop'
    else if (width.value >= TABLET_SIZE) return 'tablet'
    else return 'mobile'
  })

  const navigation = computed<Breakpoint['navigation']>(() => {
    return mobile.value ? 'bottom' : 'side'
  })

  function createBreakpoint<T>(mobile: T, ipad: T, laptop: T) {
    if (display.value === 'mobile') return mobile
    if (display.value === 'tablet') return ipad
    if (display.value === 'laptop') return laptop
  }

  return { axis, ratio, display, navigation, createBreakpoint }
}
