<script setup lang="ts">
interface Props {
  item: Contest
  isVoted?: boolean
  isOpen?: boolean
}
type Events = {
  'click:vote': [value: Contest]
  'click:unvote': [value: Contest]
}
const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  isVoted: false,
})
defineEmits<Events>()
const { colors } = useSchool()

const embedSrc = computed(() => {
  if (props.item.url) {
    return `https://www.youtube-nocookie.com/embed/${props.item.url}?rel=0`
  } else {
    return null
  }
})

type Locales = 'th' | 'en'
const { current } = useLocale()
const lang = computed<Locales>(() => current.value as Locales)
</script>

<template>
  <div>
    <v-card
      v-if="item"
      :title="item.team"
      rounded="xl"
      :color="colors['card-surface']"
      variant="flat"
    >
      <template #prepend>
        <v-avatar size="35" :image="item?.coverImage" color="primary" />
      </template>
      <template #append>
        <v-chip color="white" variant="flat" class="ma-2 px-5" elevation="0">
          <v-avatar class="pa-1 ml-n1" color="transparent">
            <v-img src="../contests/lamduan.png" />
          </v-avatar>
          <span class="ml-1 text-content">{{ item.votes || '0' }}</span>
        </v-chip>
      </template>
      <div class="ma-4 mt-n1">
        <div class="video-wrapper overflow-hidden rounded-xl">
          <iframe
            v-if="embedSrc"
            :src="embedSrc"
            title="YouTube Video Player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
            allowfullscreen
            controls
          />
          <div v-else>No video available</div>
        </div>
      </div>

      <v-card-text class="mt-n4">
        <h2 class="pb-2 text-title">
          {{ item?.title[lang] }}
        </h2>
        <p class="text-subtitle">
          <span class="text-content"> {{ $t('Category') }} : </span>
          {{ item?.category[lang] }}
        </p>
        <p class="text-subtitle">
          <span class="text-content"> {{ $t('Description') }} : </span>
          {{ item?.description[lang] }}
        </p>
      </v-card-text>
      <v-card-actions class="mt-n3 mb-3">
        <v-spacer />
        <template v-if="isOpen">
          <v-btn
            v-if="isVoted"
            variant="flat"
            rounded
            color="primary"
            class="px-4 mr-2 text-white"
            elevation="2"
            @click="$emit('click:unvote', item)"
          >
            <v-avatar class="pa-2 ml-n1" color="transparent">
              <v-img src="../contests/dislike.png" />
            </v-avatar>
            {{ $t('unVote') }}
          </v-btn>
          <v-btn
            v-else
            variant="flat"
            rounded
            color="primary"
            class="px-4 mr-2 text-white"
            elevation="2"
            @click="$emit('click:vote', item)"
          >
            <v-avatar class="pa-2 ml-n1" color="transparent">
              <v-img src="../contests/open.png" />
            </v-avatar>
            {{ $t('Vote') }}
          </v-btn>
        </template>
        <template v-else>
          <v-btn disabled rounded variant="outlined" color="white">
            <v-icon left> mdi-close</v-icon>
            <span class="mr-2"> {{ $t('closeVoted') }} </span>
          </v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
.video-wrapper {
  width: 100%;
  height: auto;
  aspect-ratio: calc(16 / 9);
  position: relative;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  aspect-ratio: calc(16 / 9);
}

.blur {
  -webkit-backdrop-filter: blur(15px);
  backdrop-filter: blur(15px);
  background-color: #ffffff8c;
}
</style>
