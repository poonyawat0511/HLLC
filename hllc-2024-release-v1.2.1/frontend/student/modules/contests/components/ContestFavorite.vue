<script setup lang="ts">
interface Props {
  item?: Contest
  isOpen?: boolean
}
type Events = {
  'click:unvote': [value: Contest]
  click: [value: Contest]
}

defineEmits<Events>()
withDefaults(defineProps<Props>(), { isOpen: false, item: undefined })
</script>

<template>
  <div>
    <v-card
      v-if="item"
      elevation="0"
      rounded="xl"
      class="overflow-hidden mx-auto"
      :width="$vuetify.display.xs ? '80%' : '100%'"
      @click="$emit('click', item)"
    >
      <v-img
        :src="item.coverImage"
        :aspect-ratio="3 / 4"
        cover
        class="rounded-xl"
      >
        <v-chip color="primary" variant="flat" class="ma-2">
          <v-icon icon="mdi-heart" />
          <span class="ml-1"> {{ $t('yourVote') }}</span>
        </v-chip>
      </v-img>

      <v-card-actions style="position: absolute; bottom: 0.1rem; width: 100%">
        <v-spacer />
        <v-btn
          v-if="!isOpen"
          disabled
          rounded
          variant="outlined"
          class="px-4"
          color="white"
        >
          <v-icon left> mdi-close</v-icon>
          <span class="mr-2"> {{ $t('closeVoted') }} </span>
        </v-btn>

        <v-btn
          v-else
          color="white"
          rounded
          variant="flat"
          elevation="2"
          class="px-4"
          @click.stop="$emit('click:unvote', item)"
        >
          <v-avatar class="pa-2 ml-n">
            <v-img src="../contests/dislike.png" />
          </v-avatar>
          <span class="text-error ml-1"> {{ $t('unVote') }} </span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scope>
.blur {
  -webkit-backdrop-filter: blur(15px);
  backdrop-filter: blur(15px);
  background-color: #ffffff8c;
}

.content-title {
  overflow: hidden;
  overflow-wrap: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  white-space: 'normal';
  line-clamp: 1;
}
</style>
