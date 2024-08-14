<script setup lang="ts">
import type DialogNotify from './DialogNotify.vue'

const dialog = defineModel<boolean>({ default: false })

export type ResponseType =
  | 'incorrect'
  | 'success'
  | 'registered'
  | 'notfound'
  | 'error'

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
  success: [
    {
      text: 'Login',
      actions: { click: closeDialog },
      props: style.success,
    },
  ],
  confirm: [
    {
      text: 'Confirm',
      actions: { click: closeDialog },
      props: style.success,
    },
  ],
  login: [
    { text: 'Cancel', actions: { click: closeDialog }, props: style.text },
    {
      text: 'Login',
      props: { ...style.success, to: '/login' },
    },
  ],
}

const dialogProps = computed<DialogNotifyProps>(() => {
  switch (props.type) {
    case 'incorrect':
      return {
        image: icons.warning,
        title: 'Invalid student ID',
        details: 'Student ID must be 10 characters long.',
        buttons: buttons.confirm,
      }
    case 'notfound':
      return {
        image: icons.warning,
        title: 'Invalid student ID',
        details: 'The student ID is not found in the system.',
        buttons: buttons.facebook,
      }
    case 'registered':
      return {
        image: icons.warning,
        title: 'Already registered',
        details: 'This student ID has been registered.',
        buttons: buttons.login,
      }
    case 'success':
      return {
        image: icons.success,
        title: 'Register completed',
        details: 'Click to login.',
        buttons: buttons.success,
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
