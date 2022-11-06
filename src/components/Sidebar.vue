<script setup lang="ts">
</script>

<template>
  <div class="sidenav">
		<div class="icon">
			<button  class="btn btn-outline-dark">
				<i class="fa fa-solid fa-gear"></i>
			</button>
		</div>
	</div>
</template>

<style scoped>
.sidenav {
  height: 100%;
  width: 50px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #111;
  overflow-x: hidden;
  padding-top: 20px;
}
.icon,i {
	text-decoration: none;
	text-align: center;
  font-size: 25px;
  display: inline-block;
}
/*
.sidenav button {
  padding: 6px 16px 6px 20%;
  text-decoration: none;
	text-align: center;
  font-size: 25px;
  color: #818181;
  display: inline-block;
}
*/
.fa {
	color: white;
	}
</style>
