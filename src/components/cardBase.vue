<script setup>
defineEmits(["deleteAction"]);
const props = defineProps({
  forLabel: {
    type: String,
  },
  styles: {
    type: String,
  },
  height: {
    type: String,
  },
  width: {
    type: String,
  },
});
function styleBinding(style) {
  switch (style) {
    case "level":
      return "btn flex justify-center items-center self-center text-center z-30 relative after:-z-20 after:bg-gradient-to-tl from-indigo-500 from-10% via-purple-500 via-30% to-pink-500 to-90% after:absolute after:h-1 after:w-1 after:left-5 overflow-hidden after:bottom-0 after:translate-y-full after:rounded-md after:hover:scale-[300] after:hover:transition-all after:hover:duration-700 after:transition-all after:duration-700 transition-all duration-700 peer-checked:bg-gradient-to-tl peer-checked:font-normal peer-checked:text-white select-none peer-hover:text-white rounded-lg lg-h-Level-Selector mobile-Level-Selector";
    case "mode":
      return "btn text-center font-bold text-xl hover:-translate-y-3 transition hover:duration-300 hover:delay-100 rounded-lg obile-LevelMode-Selector bg-gradient-to-tl from-yellow-100 to-fuchsia-200";
    case "profile":
      return "btn text-center text-xl hover:-translate-y-3 transition hover:duration-300 hover:delay-100 rounded-lg  bg-gradient-to-tl from-yellow-100 to-fuchsia-200 shadow-lg";
  }
}
</script>

<template>
  <slot name="input"></slot>
  <label :class="`${styleBinding(styles)} ${height} ${width}`" :for="forLabel">
    <p class="group-hover/card:hidden rotate-0 font-base text-lg text-center">
      <slot name="name"></slot>
    </p>

    <p class="text-center text-gray-600"><slot name="detail"></slot></p>
    <!-- จะเอาไปใช้ใน credit -->

    <div
      class="hidden gap-3 flex-col justify-center flex-wrap rotate-180 group-hover/card:block text-pretty text-base"
    >
      <p class="level-info"><slot name="maxNumber"></slot></p>
      <p class="level-info"><slot name="maxExpression"></slot></p>
      <p class="level-info"><slot name="health"></slot></p>
      <p class="level-info"><slot name="symbol"></slot></p>
     <div @click="$emit('deleteAction', true)"><slot name="action" ></slot></div>
    </div>
  </label>
</template>

<style scoped></style>
