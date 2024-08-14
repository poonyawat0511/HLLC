export default defineNuxtPlugin(() => {
  const { progress } = useProgress()
  const { data: user } = useAuth()
  const router = useRouter()

  addRouteMiddleware(
    'assessment',
    (to) => {
      if (to.fullPath === '/assessment') {
        if (!user.value.posttest && progress.value >= 80) return
        return '/'
      }
      if (progress.value >= 80 && !user.value.posttest) {
        return '/assessment'
      }
    },
    { global: true }
  )

  watch(
    () => progress.value,
    (value) => {
      if (!user) return
      if (value >= 80 && !user.value.posttest) {
        router.push('/assessment')
      }
    }
  )
})
