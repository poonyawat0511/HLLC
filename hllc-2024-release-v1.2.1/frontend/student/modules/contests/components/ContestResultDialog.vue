<script setup lang="ts">
interface Props {
  items: Contest[]
}
type Events = {
  'click:item': [value: Contest]
}

const dialog = defineModel({ type: Boolean, default: false })
const { colors } = useSchool()
const props = defineProps<Props>()
defineEmits<Events>()

const getPercentage = (votes: number = 0) => {
  const maxVotes = props.items[0]?.votes || 1
  return (votes / maxVotes) * 1.2 * 100
}
</script>
<template>
  <div>
    <v-btn
      variant="flat"
      color="primary"
      rounded
      class="px-4"
      @click="dialog = true"
    >
      {{ $t('voteResult') }}
    </v-btn>
    <v-dialog
      v-model="dialog"
      content-class="elevation-0"
      max-width="30rem"
      persistent
      scrollable
    >
      <v-card
        rounded="xl"
        class="text-center"
        :style="{
          backgroundColor: colors['dialog-surface'],
          '-webkit-backdrop-filter': 'blur(15px)',
          'backdrop-filter': 'blur(15px)',
        }"
        elevation="0"
      >
        <v-card-title> {{ $t('voteResult') }} </v-card-title>
        <v-card-text>
          <v-row v-for="(item, index) in items" :key="index">
            <v-col
              cols="4"
              class="d-flex flex-row align-center"
              @click="$emit('click:item', item)"
            >
              <v-avatar color="primary" size="30" class="mr-2">
                <v-img :src="item.coverImage" />
              </v-avatar>
              <p class="ml-n1 content-title">
                {{ item.team }}
              </p>
            </v-col>
            <v-col cols="8">
              <v-progress-linear
                :model-value="getPercentage(item.votes)"
                background-color="primary "
                background-opacity="0.3"
                height="25"
                class="rounded-xl"
                color="primary"
              >
                <v-responsive
                  width="100%"
                  class="d-flex flex-column align-end pr-2"
                >
                  {{ item.votes }}
                </v-responsive>
              </v-progress-linear>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            rounded
            variant="flat"
            elevation="0"
            color="primary"
            class="px-4 text-white"
            @click="dialog = false"
          >
            {{ $t('isClose') }}
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<style scope>
.content-title {
  display: -webkit-box;
  display: flex;
  -webkit-line-clamp: 1; 
  line-clamp: 1; 
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
