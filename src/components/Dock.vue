<script setup lang="ts">
import { computed } from 'vue'
import { theme } from '../theme'

const props = defineProps<{
    text?: string | undefined
    }>()

const numberOfCharacter = computed(() => {
  return props.text?.split('').length ?? '0'
})

const numberOfWord = computed(() => {
  if (numberOfCharacter.value === 0) {
    return '0'
  }
  const numberList = props.text?.split(' ')
  let number = numberList?.length
  const banCharacter = [
    '#',
    '##',
    '###',
    '####',
    '-',
    '>'
  ]
  numberList?.forEach((item) => {
    if (banCharacter.includes(item)) {
      if (number !== undefined) {
        number = number - 1
      }
    }
  })
  return number ?? '0'
})
</script>

<template>
    <div class="dock">
        <div>Words: {{ numberOfWord }}</div>
        <div>Characters:  {{ numberOfCharacter }}</div>
    </div>
</template>

<style scoped>
.dock {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: end;
    padding-right: 2rem;
    gap: 2rem;
}

.dock {
    background-color: v-bind('theme.dock.backgroundColor');
    color: v-bind('theme.dock.fontColor');
}
</style>
