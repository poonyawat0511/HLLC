export default defineNuxtPlugin((_) => {
  type Rule = (v: string) => string | boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type NestedRule = (option: any) => Rule
  const rules: Record<string, Rule | NestedRule> = {
    username(v: string) {
      if (!v) return 'Please enter your student ID'
      if (v.length > 10) return 'Your student ID must be equal to 10 characters'
      return true
    },
    password: (value: string) => {
      if (!value) {
        return 'Please enter your password'
      }
      if (!/(?=.*[a-z])/.test(value)) {
        return 'Password must contain at least one lowercase alphabet'
      }
      if (!/(?=.*\d)/.test(value)) {
        return 'Password must contain at least one digit'
      }
      if (value.length < 8) {
        return 'Password must be at least 8 characters'
      }
      return true
    },
    secret: (value: string) => !!value || 'Please select your province',
    confirm: (password: string) => {
      return (value: string) => {
        return value === password || 'Password do not match'
      }
    },
  }
  return { provide: { rules } }
})
