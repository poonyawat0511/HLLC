interface ColorDefinition {
  [key: string]: string | ColorDefinition | null | undefined
}

interface BaseColor extends ColorDefinition {
  primary?: string
  secondary?: string
  error?: string
  warning?: string
  success?: string
  text?: string
}

interface NavigationColor extends ColorDefinition {
  backgound?: string
  text?: string
  textActive?: string
  icon?: {
    primary?: string
    primaryActive?: string
    secondary?: string
    secondaryActive?: string
  }
}

interface ExpansionMenuColor extends ColorDefinition {
  background?: string
  activator?: {
    primary?: string
    secondary?: string
  }
  menu?: {
    primary?: string
    secondary?: string
  }
}

type Theme = Partial<BaseColor> & {
  navigation?: NavigationColor
  expansion?: ExpansionMenuColor
}
