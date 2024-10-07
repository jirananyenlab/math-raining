<script setup>
const props = defineProps({
  displayEquation: {
    type: Array,
    required: true,
  },
});

function scoreColorBinding(score) {
  if (score.isSpecial) {
    switch (score.isSpecial) {
      case 1:
        return "from-yellow-300 via-amber-600 to-yellow-300 text-black border-amber-400 border-2 shadow-lg shadow-yellow-500/25"; //ทอง
      case 2:
        return "from-orange-300 via-red-600 to-red-orange text-white border-red-400 border-2 shadow-lg shadow-orange-500/25"; //แดง
    }
  } else {
    switch (score.score) {
      case 1:
        return "from-fuchsia-300 via-blue-800 to-fuchsia-300 text-white"; //ม่วง purple
      case 2:
        return "from-pink-300 via-fuchsia-700 to-pink-300 text-white"; // ม่วง fuchsia
      case 3:
        return "from-sky-500 via-indigo-700 to-sky-500 text-white"; //น้ำเงิน
      case 4:
        return "from-sky-300 via-sky-600 to-sky-300 text-white"; //ฟ้า
      case 5:
        return "from-green-300 via-emerald-700 to-green-300 text-white"; //เขียว
    }
  }
}
</script>

<template>
  <div
    v-for="(equation, index) in props.displayEquation"
    :key="index"
    class="absolute p-3 bg-gradient-to-b rounded-full z-0 font-bold text-xl tracking-[.3em] text-center"
    :style="{ top: equation.y + '%', left: equation.x + '%' }"
    :class="scoreColorBinding(equation.score)"
  >
    {{ equation.expression }}
  </div>
</template>

<style scoped></style>
