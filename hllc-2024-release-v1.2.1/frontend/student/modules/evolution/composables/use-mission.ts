export function useMission() {
  const { activities } = useActivity()
  const { items } = useEvolution()
  const adapter = useDate()

  function localesDate(date: unknown) {
    if (!date || !adapter.isValid(date)) {
      return { th: '', en: '' }
    }
    const jsDate = adapter.toJsDate(adapter.date(date))
    const dateOptions: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }
    return Object.fromEntries(
      ['th', 'en'].map((locale) => [
        locale,
        `${jsDate.toLocaleDateString(
          locale,
          dateOptions
        )} | ${jsDate.toLocaleTimeString(locale, timeOptions)}`,
      ])
    ) as { th: string; en: string }
  }

  function index(date: unknown) {
    return adapter.toJsDate(adapter.date(date)).getTime()
  }

  const missions = computed<Mission[]>(() => {
    const itemsMap = new Map(items.value.map((item) => [item.activity, true]))
    return activities.value
      .filter((activity) => itemsMap.has(activity.id))
      .map((activity) => {
        const status = activity.status
        switch (status.step) {
          case 0: {
            if (status.message === 'not started') {
              return [
                {
                  status: 'coming soon',
                  message: {
                    th: `ภารกิจ ${activity.name.th} กำลังจะมาเร็ว ๆ นี้!`,
                    en: `Mission ${activity.name.en} is coming soon!`,
                  },
                  start: localesDate(activity.dateTime.start),
                  end: localesDate(activity.dateTime.end),
                  index: index(activity.dateTime.start),
                  image: activity.icon,
                  id: activity.id,
                },
              ]
            }
            return null
          }
          case 1: {
            if (status.message === 'failed') {
              return [
                {
                  status: 'failed',
                  message: {
                    th: `ภารกิจ ${activity.name.th} ล้มเหลว`,
                    en: `Mission ${activity.name.en} is failed`,
                  },
                  activity: activity.name,
                  start: localesDate(activity.dateTime.start),
                  end: localesDate(activity.dateTime.end),
                  index: index(activity.dateTime.start),
                  image: activity.icon,
                  id: activity.id,
                },
              ]
            } else {
              return [
                {
                  status: 'waiting',
                  message: {
                    th: `ไปเช็คอินกิจกรรม ${activity.name.th} กันเถอะ`,
                    en: `Let's check-in the activity ${activity.name.en} `,
                  },
                  start: localesDate(activity.dateTime.start),
                  end: localesDate(activity.dateTime.end),
                  index: index(activity.dateTime.start),
                  image: activity.icon,
                  id: activity.id,
                },
              ]
            }
          }
          case 2: {
            if (status.message === 'waiting') {
              return [
                {
                  status: 'success',
                  message: {
                    th: `คุณได้เช็คชื่อเข้ากิจกรรม ${activity.name.th} เเล้ว`,
                    en: `You have checked in the activity ${activity.name.en}`,
                  },
                  start: localesDate(activity.dateTime.start),
                  end: localesDate(activity.dateTime.end),
                  index: index(activity.dateTime.start),
                  timestamp: localesDate(activity.checkInAt),
                  image: activity.icon,
                  id: activity.id,
                },
                {
                  status: 'waiting',
                  message: {
                    th: `รอทำเเบบประเมินกิจกรรม ${activity.name.th} เพื่อรับไอเทมพิเศษ`,
                    en: `Wait to do the assessment of activity ${activity.name.en} to get special item`,
                  },
                  start: localesDate(activity.dateTime.end),
                  end: null,
                  index: index(activity.checkInAt),
                  image: activity.icon,
                  id: activity.id,
                },
              ]
            }
            return null
          }
          case 3: {
            if (status.message === 'success') {
              return [
                {
                  status: 'success',
                  message: {
                    th: `คุณได้ผ่านกิจกรรม ${activity.name.th}`,
                    en: `You have completed this activity ${activity.name.en}`,
                  },
                  start: localesDate(activity.dateTime.start),
                  end: localesDate(activity.dateTime.end),
                  index: index(activity.dateTime.start),
                  timestamp: localesDate(activity.checkInAt),
                  image: activity.icon,
                  id: activity.id,
                },
                {
                  status: 'success',
                  message: {
                    th: `คุณได้ทำเเบบประเมินของกิจกรรม ${activity.name.th} เรียบร้อยเเล้ว`,
                    en: `You have completed the evaluation for the activity ${activity.name.en}`,
                  },
                  start: localesDate(activity.dateTime.end),
                  end: null,
                  index: index(activity.checkInAt),
                  timestamp: localesDate(activity.takeAssessmentAt),
                  image: activity.icon,
                  id: activity.id,
                },
              ]
            }
            return [
              {
                status: 'success',
                message: {
                  th: `เข้ากิจกรรม ${activity.name.th} เรียบร้อยเเล้ว`,
                  en: `Attended the activity ${activity.name.en} successfully.`,
                },
                start: localesDate(activity.dateTime.start),
                end: localesDate(activity.dateTime.end),
                index: index(activity.dateTime.start),
                timestamp: localesDate(activity.checkInAt),
                image: activity.icon,
                id: activity.id,
              },
              {
                status: 'waiting',
                message: {
                  th: `อย่าลืมทำเเบบประเมินกิจกรรม ${activity.name.th}`,
                  en: `Do not forget to do the assessment of activitiy ${activity.name.en}`,
                },
                start: localesDate(activity.dateTime.end),
                end: null,
                index: index(activity.checkInAt),
                image: activity.icon,
                id: activity.id,
              },
            ]
          }
        }
      })
      .filter((item) => !!item)
      .flatMap((item) => item as Mission[])
      .sort((a, b) => a.index - b.index)
  })

  const success = computed(() =>
    missions.value.filter((item) => item.status === 'success')
  )

  const failure = computed(() =>
    missions.value.filter((item) => item.status === 'failed')
  )

  const coming = computed(() =>
    missions.value.filter((item) => item.status === 'coming soon')
  )

  const waiting = computed(() =>
    missions.value.filter((item) => item.status === 'waiting')
  )

  return { missions, success, failure, coming, waiting }
}
