<script setup>
import AllLevel from "../../data/AllLevel.json";
import bearButton from "../components/bearButton.vue";
import cardBase from "../components/cardBase.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const levels = ref(AllLevel);
const selected = ref(-1);
const errorMSG = ref("");
function startGame() {
  if (selected.value === -1) {
    // alert("plz select level");
    errorMSG.value = "!! PLEASE SELECT LEVEL !!";
  } else {
    errorMSG.value = "";
    router.push({
      name: "inGame",
      params: { mode: "CampaignMode", level: selected.value },
    });
  }
}
</script>

<template>
  <div class="flex gap-3 flex-col justify-center flex-wrap items-center">
    <p class="text-emerald-500 font-semibold text-8xl max-sm:text-[3.5rem]">
      SELECT YOUR LEVEL
    </p>
    <div
      class="flex gap-3 flex-row justify-center flex-wrap mr-96 ml-96 max-2xl:mr-40 max-2xl:ml-40 max-sm:mr-5 max-sm:ml-5"
    >
      <div
        v-for="(level, index) in levels"
        :key="index"
        class="group/card hover:rotate-180"
      >
        <cardBase
          :forLabel="index.toString()"
          styles="level"
          height="h-[13.5rem] max-lg:h-[10rem] lg-h-Level-Selector-height"
          width="w-[14rem] max-lg:w-[12rem] lg-h-Level-Selector-width"
          v-if="level.nameLevel !== '9'"
        >
          <template #input>
            <input
              type="radio"
              v-model="selected"
              :value="level.nameLevel"
              :id="index"
              class="peer hidden"
              @click="errorMSG = ''"
            />
          </template>
          <template #name>Level {{ level.nameLevel }}</template>
          <template #maxNumber>Max Number : {{ level.numberRange }}</template>
          <template #maxExpression>
            Max Expression : {{ level.lengthExpression + 2 }}</template
          >
          <template #health>Health : {{ level.health }}</template>
          <template #symbol>
            Symbol : {{ level.symbol[0] }} {{ level.symbol[1] }}
            {{ level.symbol[2] }} {{ level.symbol[3] }}</template
          >
        </cardBase>
      </div>
    </div>
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
