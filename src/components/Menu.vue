<script setup lang="ts">
const props = defineProps({
  currentFile: String
})
</script>

<template>
    <div class="menu">
      {{ props.currentFile }}
    </div>
</template>

<style scoped>
.menu {
    width: 100%;
    height: 100%;
}

.menu {
    background-color: #1a1a1c;
    color: white;
    border-bottom: 1px solid white;
}
</style>
