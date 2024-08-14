<script setup lang="ts">
const { xs, sm, md } = useDisplay()

defineEmits<{ 'click:logo': [] }>()
const progress = defineModel({
  type: Number,
  default: 0,
})

interface Props {
  gradientColors?: string[] | [string, number][]
  bgAvatar?: string
  border?: string
  to?: 'top' | 'bottom' | 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  gradientColors: () => [
    '#defdffcc',
    '#71e5ffcc',
    '#579affcc',
    '#1875ffcc',
    '#2400ffcc',
  ],
  to: 'bottom',
  bgAvatar: 'primary',
  border: 'black',
})

function computeGradient(arr: string[] | [string, number][]) {
  if (!arr.length) return ''
  const length = arr.length - 1
  return arr
    .map((color, i) => {
      if (Array.isArray(color)) {
        return `${color[0]} ${color[1] || (i / length) * 100}%`
      }
      return `${color} ${(i / length) * 100}%`
    })
    .join(', ')
}

const gradient = computed(() => {
  return `linear-gradient(to ${props.to}, ${computeGradient(
    props.gradientColors
  )})`
})

const percentage = computed(() => `${progress.value}%`)
</script>

<template>
  <v-sheet
    color="transparent"
    :style="{
      position: 'relative',
      marginBottom: xs ? '1.2rem' : sm ? '1.2rem' : md ? '1.2rem' : '0.5rem',
    }"
  >
    <v-sheet
      :color="bgAvatar"
      :style="{
        position: 'relative',
        border: '1px solid #FFFFFF',
        borderRadius: '90%',
        width: xs ? '3rem' : sm ? '3rem' : md ? '3rem' : '4rem',
        height: xs ? '3rem' : sm ? '3rem' : md ? '3rem' : '4rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'end',
        zIndex: 1,
        top: xs ? '1.4rem' : sm ? '1.2rem' : md ? '1.7rem' : '1.3rem',
      }"
      class="cursor-pointer"
      @click="$emit('click:logo')"
    >
      <v-img
        src="/hllc/hllcW.png"
        :width="xs ? '2.4rem' : sm ? '2.4rem' : md ? '2.4rem' : '3rem'"
        contain
        alt="hllc logo"
      />
    </v-sheet>
    <div
      class="progress"
      :style="{
        position: 'relative',
        marginLeft: '1rem',
        bottom: xs ? '1rem' : sm ? '1.1rem' : md ? '0.7rem' : '1.5rem',
        left: xs ? '1.4rem' : sm ? '1.5rem' : md ? '1.6rem' : '1.6rem',
      }"
    >
      <v-responsive :width="xs ? '75%' : sm ? '40%' : md ? '30%' : '30%'">
        <div class="box">
          <div class="value" />
          <div class="text text-white text-caption">{{ percentage }}</div>
        </div>
      </v-responsive>
    </div>
  </v-sheet>
</template>

<style scoped>
.progress .box {
  background: linear-gradient(
    180deg,
    #bebebe66 4%,
    #ffffff66 25%,
    #acacac66 50%,
    #ffffff66 75%,
    #bebebe66 100%
  );
  --bar-height: 30px;
  height: var(--bar-height);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 0px 90px 90px 0px;
  overflow: hidden;
}

.progress .box .value {
  position: relative;
  --progress-gradiant: v-bind(gradient);
  background: var(--progress-gradiant);
  height: inherit;
  width: v-bind(percentage);
}

.progress .box .value::after {
  content: '';
  position: absolute;
  height: inherit;
  --circle-width: min(calc((100% - v-bind(percentage)) / 4), 6px);
  width: var(--circle-width);
  border-radius: 90%;
  background: #eee;
  top: 0;
  right: calc(-1 * var(--circle-width) / 2);
}

.progress .box .text {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 6px;
  left: max(10%, min(v-bind(percentage), 80%));
}
</style>
