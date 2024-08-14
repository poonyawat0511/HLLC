export const useButton = () => {
  const appConfig = useAppConfig()
  return { style: appConfig.button }
}
