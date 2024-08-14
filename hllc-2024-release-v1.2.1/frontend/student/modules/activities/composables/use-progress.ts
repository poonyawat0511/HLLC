export function useProgress() {
  const { activities } = useActivity()
  const progress = computed(() => {
    const countActivities = activities.value.filter(
      (activity) => activity.progress
    )
    const len = countActivities.length
    if (len === 0) return 0
    const successAccitivites = countActivities.filter(
      (activity) => activity.takeAssessmentAt
    )
    return Math.round((successAccitivites.length / len) * 100)
  })

  return { progress }
}
