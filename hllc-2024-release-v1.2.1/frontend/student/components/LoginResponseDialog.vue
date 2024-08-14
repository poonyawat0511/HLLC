<script setup lang="ts">
import type DialogNotify from './DialogNotify.vue'

const dialog = defineModel<boolean>({ default: false })

export type ResponseType = 'register' | 'success' | 'error'

interface Props {
  type: ResponseType
}

type DialogNotifyProps = InstanceType<typeof DialogNotify>['$props']

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const { style } = useButton()
const { icons } = useIcons()

const buttons: Record<string, DialogNotifyProps['buttons']> = {
  facebook: [
    { text: 'Cancel', actions: { click: closeDialog }, props: style.text },
    {
      text: 'Contact Us',
      props: { ...style.error, href: 'https://www.facebook.com/mfuactivities' },
    },
  ],
  confirm: [
    {
      text: 'Confirm',
      actions: { click: closeDialog },
      props: style.success,
    },
  ],
  register: [
    { text: 'Cancel', actions: { click: closeDialog }, props: style.text },
    {
      text: 'Register',
      props: { ...style.error, to: '/register' },
    },
  ],
}

const dialogProps = computed<DialogNotifyProps>(() => {
  switch (props.type) {
    case 'register':
      return {
        image: icons.warning,
        title: 'Invalid user credentials',
        details: 'If your account is not set, please go to register',
        buttons: buttons.register,
      }
    case 'success':
      return {
        image: icons.success,
        title: 'Login completed',
        details: 'Click to continue',
        buttons: buttons.confirm,
      }
    default:
      return {
        image: icons.warning,
        title: 'Unknown error',
        details:
          'Unknown error occurred. Please try again or report this issue.',
        buttons: buttons.facebook,
      }
  }
})

function closeDialog() {
  dialog.value = false
  emit('close', props.type)
}
</script>

<template>
  <dialog-notify v-model="dialog" theme="login" v-bind="dialogProps" />
</template>
