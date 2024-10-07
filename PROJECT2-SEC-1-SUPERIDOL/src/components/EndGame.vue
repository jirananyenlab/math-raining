<script setup>
import { ref, onMounted } from "vue";
import bearButton from "../components/bearButton.vue";
import listEquation from "../components/listEquation.vue";
import toasts from "../components/toasts.vue";
import { countOfAwnser } from "../libs/Achievement.js";
import { useUserStore } from "../stores/user.js";
import {
  updateScoreRanking,
  updateCompleteGameResult,
} from "../libs/fetchUtils.js";

defineEmits(["retryGame"]);
const props = defineProps({
  gameResult: {
    type: Object,
    required: true,
  },
});
const userStore = useUserStore();

const gameResult = ref(props.gameResult);

const score = gameResult.value.score;
const useTime = gameResult.value.useTime;
const displayEquation = gameResult.value.displayEquation;
const mode = gameResult.value.mode;
const level = gameResult.value.level;

const AvgTime = ref();

const showList = ref(false);
const showToast = ref(false);

onMounted(async () => {
  AvgTime.value = useTime / countOfAwnser(displayEquation).correct;
  if (mode !== "CustomMode" && userStore.isLoggedIn) {
    if (mode === "CompetitiveMode") {
      if (score > userStore.userProfile.rankingHighScore) {
        const res = await updateScoreRanking(userStore.userProfile.id, score);
        if (res === 200) {
          userStore.updateScoreRankingInState(score);
          showToast.value = true;
        }
      }
    } else {
      const newScore = [...userStore.userProfile.totalScore];
      const newTime = [...userStore.userProfile.totalTimePlay];
      const completeAllAchievement =
        userStore.userProfile.completeAchievement.concat(
          gameResult.value.completeAchievement
        );
      newScore[level - 1] += score;
      newTime[level - 1] += useTime;
      const res = await updateCompleteGameResult(
        userStore.userProfile.id,
        completeAllAchievement,
        newScore,
        newTime
      );
      if (res === 200) {
        userStore.updateCompleteGameResultInState(
          completeAllAchievement,
          newScore,
          newTime
        );
        showToast.value = true;
      }
    }
  }
});

function SecToMin(timeSec) {
  if (timeSec === -1 || timeSec === null || timeSec === undefined) {
    return "00:00";
  }
  const minutes = Math.floor(timeSec / 60);
  const seconds = Math.floor(timeSec - minutes * 60);
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

const numberOfCorrect = countOfAwnser(displayEquation).correct;
const numberOfInCorrect = countOfAwnser(displayEquation).inCorrect;
</script>

<template>
  <!-- Game Over -->
  <Transition name="page-fade">
    <div
      class="flex flex-col gap-3 justify-center items-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <h1 class="text-4xl font-bold text-red-600 mb-4 scale-125">
        !!! GAME OVER !!!
      </h1>
      <span class="flex flex-col scale-125">
        <p class="font-bold text-lg">
          Your final score:
          <span class="text-success text-2xl">{{ score }}</span>
        </p>

        <p class="font-bold text-lg">
          Use Time:
          <span class="text-success text-2xl">{{ SecToMin(useTime) }}</span>
          Avg Time:
          <span class="text-success text-2xl">{{ SecToMin(AvgTime) }}</span>
        </p>

        <p>
          answer <br />
          correct : {{ numberOfCorrect }} <br />
          incorrect : {{ numberOfInCorrect }}
        </p>
      </span>
      <!-- -------------------List Equation  -->
      <button
        @click="showList = true"
        class="m-[10px] p-[10px] w-[10rem] bg-gradient-to-r from-violet-500 to-teal-500 text-white cursor-pointer rounded-lg border-solid border-2"
      >
        List of Equations
      </button>
      <div
        class="flex-col flex-wrap justify-center"
        :class="gameResult.completeAchievement.length !== 0 ? 'flex' : 'hidden'"
      >
        <div class="h-[11rem] overflow-y-auto snap-y snap-mandatory rounded">
          <div
            class="mr-2 px-4 py-2 bg-emerald-200 text-slate-950 snap-center snap-always border-b-[3px]"
            v-for="(
              allCompleteAchievement, index
            ) in gameResult.completeAchievement"
            :key="index"
          >
            <div class="flex gap-3">
              <div class="w-[10%]">
                <img src="/images/icon/trick.png" alt="trickIcon" />
              </div>
              <div class="w-[90%]">
                <p class="text-lg font-bold">
                  {{ allCompleteAchievement.name }}
                </p>
                <p>{{ allCompleteAchievement.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Teleport to="#app">
        <div
          class="absolute left-0 right-0 top-1/3 m-auto bg-slate-50 rounded-md h-[18rem] w-[24rem]"
          v-show="showList"
        >
          <listEquation
            :displayEquation="displayEquation"
            @close-list="showList = false"
          ></listEquation>
        </div>
      </Teleport>
      <Teleport to="#app">
        <div
          class="absolute left-[80%] right-0 top-[85%] m-auto transition opacity-100 translate-y-[50px] duration-[400ms] delay-1000"
          v-show="showToast"
        >
          <toasts toast="success" @close-toast="showToast = false"
            ><template v-slot:message> Data saved successfully </template>
          </toasts>
        </div>
      </Teleport>
      <!-- =----------------------------------------- -->
      <div class="flex gap-16" v-if="mode !== ''">
        <router-link
          :to="{
            name: 'inGame',
            params: { mode: mode, level: level },
          }"
        >
          <div
            class="group/bear relative cursor-pointer select-none"
            @click="$emit('retryGame', 'playing')"
          >
            <bearButton text="retry"></bearButton>
          </div>
        </router-link>
        <router-link to="/">
          <div class="group/bear relative cursor-pointer select-none">
            <bearButton text="menu"></bearButton>
          </div>
        </router-link>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
*::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: #ffe1ff;
}

*::-webkit-scrollbar {
  width: 7px;
  border-radius: 5px;
  background-color: #ffe1ff;
}

*::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #ffb5c5;
}

*::-webkit-scrollbar-thumb:active {
  border-radius: 5px;
  background-color: #ff82ab;
}
</style>
