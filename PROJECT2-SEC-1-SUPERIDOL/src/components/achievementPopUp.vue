<script setup>
import { computed } from "vue";
const props = defineProps({
  alert: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: false,
  },
});

const imgsrc = computed(() => {
  return props.type === "achievement"
    ? "/images/icon/trick.png"
    : "/images/icon/Hidden-Achievement.png";
});
</script>

<template>
  <Teleport to="#app">
    <div
      class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md absolute left-0 right-0 top-[0px] m-auto w-[30rem] transition"
      :class="
        props.alert
          ? 'opacity-100 translate-y-[50px] duration-[500ms]'
          : 'delay-[800ms] duration-[900ms] opacity-0 -translate-y-[50px]'
      "
    >
      <div class="flex">
        <div class="py-1 scale-75 w-16 h-16 flex-none">
          <img :src="imgsrc" alt="Icon" class="w-16 h-16" />
        </div>
        <div class="flex-grow-0">
          <p class="font-bold"><slot name="title"></slot></p>
          <p class="text-sm"><slot name="description"></slot></p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped></style>
