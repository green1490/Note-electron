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
  return props.text?.split(' ').length ?? '0'
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
