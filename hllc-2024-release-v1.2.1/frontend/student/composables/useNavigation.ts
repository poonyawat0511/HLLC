export const useNavigation = () => {
  const appConfig = useAppConfig()
  return { menus: appConfig.menus, expansions: appConfig.expansions }
}
