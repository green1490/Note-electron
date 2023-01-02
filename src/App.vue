<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
//min size and width
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <div id="#app">
    <div class="sidenav">
      <Sidebar/>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: grid;
  padding-left: 60px;
  padding-top: 20px;
}

.sidenav {
  height: 100%;
  width: 50px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: rgb(0, 0, 0);
  overflow-x: hidden;
  padding-top: 20px;
}

/* .grid-container {
  display: grid;
  grid-template-columns: 80px 200px auto 30px;
  gap: 10px;
  background-color: #2196F3;
  padding: 10px;
}

.grid-container > div {
  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
  padding: 20px 0;
  font-size: 30px;
} */
</style>
