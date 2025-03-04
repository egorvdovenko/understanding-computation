<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
main {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
