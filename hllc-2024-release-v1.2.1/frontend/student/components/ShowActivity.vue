<script setup lang="ts">
import { useCheckIns } from '~/modules/check-ins/composible/use-check-ins'
import { useEvaluation } from '~/modules/evaluation/composible/use-evaluation'

const dialog = defineModel({ type: Boolean, default: false })
const tabs = [
  { value: 'check-ins', text: 'Check-ins' },
  { value: 'evaluation', text: 'Evaluation' },
]

const tab = computed<string>({
  get() {
    return route.query.view ? String(route.query.view) : tabs[0]?.value
  },
  set(value) {
    router.push({ query: { view: value } })
  },
})
const router = useRouter()
const route = useRoute()
const { processUser } = useCheckIns()
const { evaluations } = useEvaluation()
</script>
<template>
  <v-dialog v-model="dialog">
    <v-card rounded="lg" variant="flat">
      <v-tabs v-model="tab">
        <v-tab :value="tabs[0].value">{{ tabs[0].text }}</v-tab>
        <v-tab :value="tabs[1].value">{{ tabs[1].text }}</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item :value="tabs[0].value">
          <v-card-title> activity check-ins</v-card-title>
          <v-card>
            {{ processUser }}
          </v-card>
        </v-window-item>
        <v-window-item :value="tabs[1].value">
          <v-card-title> activity have done</v-card-title>
          <v-card>
            {{ evaluations }}
          </v-card>
        </v-window-item>
      </v-window>
      <v-btn class="text-error" @click="dialog = false"> close </v-btn>
    </v-card>
  </v-dialog>
</template>
