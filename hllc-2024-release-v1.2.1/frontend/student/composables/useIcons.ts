export const useIcons = () => {
  const appConfig = useAppConfig()
  return { icons: appConfig.icons }
}
