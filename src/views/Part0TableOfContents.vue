<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="container">
    <img class="cover" src="@/assets/cover.png" />
    <div class="v-separator"></div>
    <nav>
      <RouterLink :to="{ name: 'Part1ProgramsAndMachines' }">
        Part 1. Programs and Machines
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
}

.cover {
  height: 100%;
  border: 1px solid lightgray;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.1);
}
</style>
