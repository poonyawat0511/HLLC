export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:finish', () => {
    // const { data: user } = useAuth()
    // if (user.value && !user.value.pretest) {
    //   // navigateTo('/assessment')
    // }
  })
})
