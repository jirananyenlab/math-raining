<script setup>
import bearButton from "../components/bearButton.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const selected = ref(1);
const errorMSG = ref("");

function startGame() {
  if (selected.value === -1) {
    // alert("plz select level");
    errorMSG.value = "!! PLEASE SELECT LEVEL !!";
  } else {
    errorMSG.value = "";
    router.push({
      name: "inGame",
      params: { mode: "TutorialMode", level: selected.value },
    });
  }
}
</script>

<template>
  <!-- Title -->
  <!-- Mode Tutorial -->
  <div class="flex gap-3 flex-col justify-center flex-wrap items-center">
    <p class="text-emerald-500 font-semibold text-8xl max-sm:text-[3.5rem]">
      Tutorial Mode
    </p>
  </div>
  <div class="flex items-center flex-col relative overflow-visible">
    <!-- startButton -->
    <div
      :class="selected !== -1 ? 'opacity-100' : 'opacity-25 cursor-not-allowed'"
      class="group/bear relative place-content-center cursor-pointer"
      @click="startGame"
    >
      <bearButton text="start"> </bearButton>
    </div>
    <Transition name="page-fade">
      <p
        v-if="errorMSG !== ''"
        class="text-error text-lg font-bold absolute bottom-[-40px] text-nowrap"
      >
        {{ errorMSG }}
      </p>
    </Transition>
  </div>
  <!-- Back btn -->
  <router-link to="/">
    <div class="left-2 bottom-1 absolute scale-[70%] mobile-back-btn">
      <div class="group/bear relative place-content-center cursor-pointer">
        <bearButton text="back"> </bearButton>
      </div>
    </div>
  </router-link>
</template>

<style scoped></style>
