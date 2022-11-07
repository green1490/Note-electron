<script setup lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
</script>

<template>
  <div class="icon container">
    <div class="grid-item">
      <button  class="btn btn-outline-dark">
        <font-awesome-icon class="fa" icon="fa-solid fa-arrow-right-arrow-left" />
      </button>
      <button class="btn btn-outline-dark">
        <!-- vue-tss bug -->
        <font-awesome-icon class="fa" icon="fa-solid fa-folder" />
      </button>
    </div>
    <div>
      <button  class="btn btn-outline-dark">
        <font-awesome-icon class="fa" icon="fa-solid fa-gear"></font-awesome-icon>
      </button>
    </div>
  </div>
</template>

<style scoped>

.icon {
	text-decoration: none;
	text-align: center;
  font-size: 25px;
  color: white;
}

.container {
  display: grid;
  grid-template-rows: 1fr 1fr;
  padding: 0%;
  /* against overflow */
  max-width: 50px;
  height: 95%;
}

.grid-item {
  grid-row-start: 1;
  grid-row-end: 2;
}

.fa {
	color: white;
	}
</style>
