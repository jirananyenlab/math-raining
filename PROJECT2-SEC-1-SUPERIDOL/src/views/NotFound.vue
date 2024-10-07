<script setup>
import bearButton from "../components/bearButton.vue";
</script>

<template>
  <div class="flex flex-col justify-center h-3/5 items-center">
    <h1 class="text-8xl text-red-700">404 Not Found</h1>
    <p class="text-2xl text-gray-500">
      The page you are looking for does not exist.
    </p>
    <router-link to="/">
      <div class="scale-[70%]">
        <div class="group/bear">
          <bearButton text="back"></bearButton>
        </div>
      </div>
    </router-link>
  </div>
</template>

<style scoped></style>
