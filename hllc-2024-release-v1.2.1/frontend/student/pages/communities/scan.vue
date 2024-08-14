<script setup lang="ts">
const { data: user } = useAuth()
definePageMeta({
  menu: {
    display: true,
  },
  background: true,
})
const { colors } = useSchool()
const switchter = ref(true)

const { fetchQuestions } = useFetchQuestions()

onMounted(async () => {
  await fetchQuestions()
})
</script>

<template>
  <v-container fluid>
    <NavigationBar />
    <v-col v-if="user.type == 'TESTER'">
      <v-card
        :color="colors['card-surface']"
        rounded="xl"
        elevation="0"
        class="responsive-card-height"
      >
        <v-card-text>
          <v-responsive
            :max-width="$vuetify.display.xs ? '80%' : '60%'"
            class="mx-auto"
          >
            <div v-if="switchter">
              <scan-card />
            </div>
            <div v-else>
              <qr-code-only />
            </div>
          </v-responsive>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn
            color="primary"
            variant="flat"
            rounded="xl"
            prepend-icon="mdi-qrcode-scan"
            @click="switchter = !switchter"
          >
            <span v-if="switchter">{{ $t('menus.QR Code') }}</span>
            <span v-if="!switchter">{{ $t('scan') }}</span>
          </v-btn>
        </v-card-actions>
        <v-card-text>
          <span>
            {{ $t('descriptionScan') }}
          </span>
        </v-card-text>
      </v-card>
    </v-col>
    <v-card v-else :color="colors['card-surface']" rounded="xl" elevation="0">
      <v-card-text>
        <p class="text-center">{{ $t('communityComing') }}</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<style scoped>
@media (max-width: 600px) {
  .responsive-card-height {
    height: auto;
  }
}
</style>
