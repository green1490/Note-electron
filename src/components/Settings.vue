<script setup lang="ts">
import { theme } from '../theme'

</script>

<template>
    <div class="container">
        <div class="col">
            fgre
        </div>
    </div>
</template>

<style scoped>
.container {
    background-color: v-bind('theme.setting.container.backgroundColor');
    height: 100%;
    width: 100%;
    color: v-bind('theme.setting.container.fontColor');
}

.settings-menu {
    background-color: v-bind('theme.setting.backgroundColor');
}
</style>
