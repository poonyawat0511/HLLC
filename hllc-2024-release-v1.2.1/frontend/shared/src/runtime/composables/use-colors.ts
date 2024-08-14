import { reactive, useTheme } from '#imports'

export const useColors = () => {
  const { themes, global } = useTheme()

  function changeTheme(theme: string) {
    global.name.value = theme
  }

  function provideTheme(theme: string) {
    if (!themes.value[theme]) {
      themes.value = {
        ...themes.value,
        [theme]: reactive(Object.assign({}, global.current.value)),
      }
    }
  }

  function getTheme(theme: string) {
    return themes.value[theme]
  }

  function updateTheme(theme: string, colors: Record<string, string>) {
    provideTheme(theme)
    themes.value[theme] = {
      ...themes.value[theme],
      colors: Object.assign(
        themes.value[theme].colors,
        Object.fromEntries(Object.entries(colors).filter(([_k, v]) => !!v)),
      ),
    }
  }

  function getColor(color: string, theme?: string) {
    const selectedTheme = theme ?? global.name.value
    provideTheme(selectedTheme)
    return themes.value[selectedTheme].colors[color] ?? color
  }

  return { changeTheme, updateTheme, getTheme, getColor, provideTheme }
}
