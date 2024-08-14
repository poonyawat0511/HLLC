<script setup lang="ts">
import type DialogNotify from './DialogNotify.vue'

const dialog = defineModel<boolean>({ default: false })

export type ResponseType =
  | 'incorrect'
  | 'secret'
  | 'register'
  | 'success'
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
      text: 'Contact Us',
      props: { ...style.error, to: '/register' },
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
    case 'register':
      return {
        image: icons.warning,
        title: 'User password is not set',
        details: 'This Student ID is has not been register yet.',
        buttons: buttons.register,
      }
    case 'success':
      return {
        image: icons.success,
        title: 'Reset password complete',
        details: 'Password has been changed successfully completed.',
        buttons: buttons.confirm,
      }
    case 'secret':
      return {
        image: icons.warning,
        title: 'Invalid secret',
        details: 'Please check your province and try again.',
        buttons: buttons.facebook,
      }
    case 'notfound':
      return {
        image: icons.warning,
        title: 'User not found',
        details: 'Cannot reset password of unknown user.',
        buttons: buttons.facebook,
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
