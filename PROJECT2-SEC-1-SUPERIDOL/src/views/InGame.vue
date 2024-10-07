<script setup>
import { ref, onMounted, computed, watchEffect, onUnmounted, watch } from "vue";
import cloud from "../components/cloud.vue";
import correctSoundFile from "../assets/music/correct.mp3";
import inCorrectSoundFile from "../assets/music/inCorrect.mp3";
import AllLevel from "../../data/AllLevel.json";
import EndGame from "../components/EndGame.vue";
import achievementPopUp from "../components/achievementPopUp.vue";
import equationBox from "../components/equationBox.vue";
import bearButton from "../components/bearButton.vue";
import { equationGenerator } from "../libs/equationGenerator.js";
import { useCustomModeStore } from "../stores/customMode.js";
import { useRouter, useRoute } from "vue-router";
import { checkAchievement } from "../libs/Achievement.js";
import { useUserStore } from "../stores/user.js";

const customModeStore = useCustomModeStore();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const isLogin = userStore.isLoggedIn;
// Sound
const correctSound = new Audio(correctSoundFile);
const inCorrectSound = new Audio(inCorrectSoundFile);

watchEffect(() => {
  const Volume = userStore.userProfile.profileConfig.effectVolume / 100;
  correctSound.volume = Volume;
  inCorrectSound.volume = Volume;
});

const userInput = ref("");
const levels = ref([]);

const selected = ref(route.params.level);
const mode = ref(route.params.mode);
const score = ref(0);
const health = ref(0);
const gameStatus = ref("");
const timeSec = ref(0);
let healthSpecial = true;
let doubleScoreChance = 0.1;
let healthSpecialChance = 0.15;

const displayEquation = ref([]);
const listAllEquation = ref([]); // บ่งบอกว่า สมการไหนถูก สมการไหนไม่ถูก
const selectedLevel = ref({});

const completeAchievement = ref([]);

const tutorialStarted = ref(false);
const currentStepIndex = ref(0);
const showTutorial = ref(false);

const gameResult = ref({});

let timeouts = []
let intervals = []

function clearAllTimeout () {
  timeouts.map((timeout) => clearTimeout(timeout))
  timeouts = []
}

function clearAllInterval () {
  intervals.map((interval) => clearInterval(interval))
  intervals = []
}

onMounted(() => {
  startGame();
});

onUnmounted(() => {
  clearAllTimeout();
  clearAllInterval();
});

function startGame(status = "playing") {
  if (
    mode.value === "CustomMode" ||
    mode.value === "CompetitiveMode" ||
    mode.value === "CampaignMode" ||
    mode.value === "TutorialMode"
  ) {
    if (
      mode.value === "CampaignMode" ||
      mode.value === "CompetitiveMode" ||
      mode.value === "TutorialMode"
    ) {
      levels.value = AllLevel;
    } else if (mode.value === "CustomMode") {
      levels.value = customModeStore.customMode;
    }

    selectedLevel.value = levels.value[selected.value - 1];
    gameStatus.value = status;
    completeAchievement.value = [];
    listAllEquation.value = [];
    displayEquation.value = [];
    health.value = selectedLevel.value.health;
    score.value = 0;
    userInput.value = "";
    timeSec.value = 0;
    watch([score, health], (newValue) => {
      if (newValue[0] >= selectedLevel.value.endScore || newValue[1] <= 0) {
        gameStatus.value = "gameOver";
      }
    });
    watch(gameStatus, (status) => {
      // ทำให้หยุดการสร้างสมการ
      if (status === "gameOver") {
        gameResult.value = {
          level: selected.value,
          mode: mode.value,
          score: score.value,
          displayEquation: listAllEquation.value,
          useTime: timeSec.value,
          completeAchievement: completeAchievement.value,
        };
        clearAllTimeout();
        clearAllInterval();
      }
      if (mode.value === "TutorialMode") {
        showTutorial.value = false;
        tutorialStarted.value = false;
        currentStepIndex.value = 0;
      }
    });
    // tutorial
    if (mode.value === "TutorialMode") {
      startTutorial();
    } else {
      startSpawnMath();
      startTimeCount();
      startFallDown();
    }
  } else {
    router.push({ name: "home" });
  }
}

const timeLeft = computed(() => {
  if (selected.value === -1) {
    return "00:00";
  }
  const minutes = Math.floor(timeSec.value / 60);
  const seconds = Math.floor(timeSec.value - minutes * 60);
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
});

function randomMath() {
  const finalEquation = equationGenerator(selectedLevel.value);
  let expression = finalEquation.expression.map((element) =>
    element === "*" ? "x" : element
  );
  function score() {
    // เอาไว้ bind สีตามความยาว
    const expressionLength = finalEquation.expression.length;
    let special = 0;
    const rng = Math.random();
    if (rng <= doubleScoreChance) {
      special = 1;
    } else if (
      health.value < selectedLevel.value.health &&
      healthSpecial &&
      rng <= healthSpecialChance
    ) {
      special = 2;
      healthSpecial = false;
    }

    return { score: (expressionLength - 1) / 2, isSpecial: special };
  }
  function randomX() {
    return Math.floor(Math.random() * (80 - 20) + 20);
  }

  displayEquation.value.push({
    expression: expression.join(""),
    result: finalEquation.result,
    score: score(),
    x: randomX(),
    y: 0,
  });

  listAllEquation.value.push({
    expression: expression.join(""),
    result: finalEquation.result,
    isCorrect: false,
  });
}

function startFallDown() {
  intervals.push(setInterval(() => {
    changeY();
  }, 50 - selectedLevel.value.dropSpeed));
}

function startSpawnMath() {
  intervals.push(setInterval(() => {
    randomMath();
  }, 2500 - selectedLevel.value.dropSpeed * 10));
}

function startTimeCount() {
  intervals.push(setInterval(() => {
    timeSec.value++;
  }, 1000));
}
// ทำให้ checkคำตอบตัวindex ที่หาเจอก่อนอันอื่น
function checkResult() {
  const firsteq = displayEquation.value.findIndex(
    (eq) => eq.result === userInput.value
  );

  if (firsteq === -1 || userInput.value.length === 0) {
    // check -1 เพราะ findIndex ถ้าไม่เจอ index ที่ตรง จะคืนค่า -1
    health.value--;
    inCorrectSound.play();
  } else {
    switch (displayEquation.value[firsteq].score.isSpecial) {
      case 1:
        score.value++;
        break;
      case 2:
        health.value++;
        healthSpecial = true;
        break;
    }

    score.value++;
    displayEquation.value.splice(firsteq, 1);
    correctSound.play();
  }

  const checkCorrect = listAllEquation.value.findIndex(
    (checkeq) =>
      checkeq.result === userInput.value && checkeq.isCorrect === false
  );

  if (firsteq === -1 || userInput.value.length === 0) {
    return;
  } else {
    listAllEquation.value[checkCorrect].isCorrect = true;
  }

  userInput.value = "";
}

function changeY() {
  displayEquation.value.forEach((eq, index) => {
    if (eq.y === 90) {
      displayEquation.value.splice(index, 1);
      health.value--;
      inCorrectSound.play();
    }
    // eq.y++;
    eq.y += 0.5;
  });
}

let showAlertCompleteAch = false;
if (isLogin && mode.value !== "TutorialMode") {
  watch(timeSec, () => {
    let checkAchievementObject = checkAchievement(
      mode.value,
      selected.value,
      score.value,
      timeSec.value
    );
    if (checkAchievementObject !== undefined) {
      userStore.updateCompleteInAllAchievement(checkAchievementObject); //เก็บเข้าไปใน userStore UpdateComplete state AllAchievement
      completeAchievement.value.push(checkAchievementObject);
      showAlertCompleteAch = true;
      checkAchievementObject = undefined;
    } else {
      showAlertCompleteAch = false;
    }
  });
}

const tutorialSteps = [
  {
    title: "ยินดีต้อนรับสู่โหมดฝึกสอนของ Math Rainning",
    content: "เราจะสอนวิธีการเล่นให้กับคุณ ตั้งใจล่ะ!!!",
  },
  {
    title: "สมการ",
    content: "จะมีสมการหล่นลงมาจากก้อนเมฆ ลองพิมพ์คำตอบลงในช่อง input ดูสิ.",
  },
  {
    title: "คะแนน",
    content:
      "ถ้าคุณตอบถูกคุณจะได้คะแนน แล้วจะเกิดอะไรขึ้นหากตอบผิดหรือตอบไม่ทันล่ะ?",
  },
  {
    title: "เลือด",
    content:
      "คุณจะเสียเลือดเมื่อคุณตอบผิดหรือตอบไม่ทัน และเมื่อเลือดหมดเกมก็จะจบลง",
  },
  {
    title: "สมการพิเศษ",
    content: "สมการสีทองจะช่วยให้คุณได้รับคะแนน 2 เท่า",
  },
  {
    title: "สมการพิเศษ",
    content: "สมการสีแดงจะช่วยให้คุณได้รับเลือดเพิ่ม 1 หน่วย.",
  },
  {
    title: "เป้าหมาย",
    content: "คุณต้องทำคะแนนให้ถึง 30 คะแนนเกมถึงจะจบลง.",
  },
  {
    title: "ยินดีด้วย!!!",
    content: "เอาล่ะเราสอนทุกอย่างให้กับคุณแล้ว ลองเล่นให้ถึง 30 คะแนน",
  },
];
const currentStep = computed(() => tutorialSteps[currentStepIndex.value]);

function startTutorial() {
  tutorialStarted.value = true;
  showTutorial.value = true;
  const clearScoreWatch = watch(score, (newScore, oldScore) => {
    if (newScore > oldScore) {
      nextStep();
    }
  });
  const clearHealthWatch = watch(health, (value) => {
    if (value < 3 && currentStepIndex.value !== 2) {
      health.value++;
    }
  });
  const clearStepWatch = watch(
    currentStepIndex,
    (newIndex, oldIndex) => {
      switch (newIndex) {
        case 0:
          if (!tutorialStarted.value) {
            clearScoreWatch();
            clearHealthWatch();
            clearStepWatch();
            break;
          }
          if (oldIndex !== 7) {
            clearAllInterval()
            doubleScoreChance = -1;
            healthSpecialChance = -1;
            startFallDown();
            randomMath();
            showTutorial.value = true;
            timeouts.push(setTimeout(() => {
              clearAllInterval()
              nextStep();
            }, 5000));
            break;
          }
          break;
        case 1:
          break;
        case 2:
          clearAllTimeout()
          clearAllInterval()
          startFallDown();
          randomMath();
          watch(
            health,
            () => {
              nextStep();
            },
            { once: true }
          );
          break;
        case 3:
          timeouts.push(timeouts.push(setTimeout(() => {
            nextStep();
          }, 5000)));
          break;
        case 4:
          doubleScoreChance = 1;
          healthSpecialChance = -1;
          randomMath();
          timeouts.push(setTimeout(() => {
            clearAllInterval()
          }, 5000));
          break;
        case 5:
          doubleScoreChance = -1;
          healthSpecialChance = 1;
          startFallDown();
          randomMath();
          timeouts.push(setTimeout(() => {
            clearAllInterval()
          }, 5000));
          break;
        case 6:
          doubleScoreChance = 0.1;
          healthSpecialChance = 0.15;
          clearScoreWatch();
          clearHealthWatch();
          timeouts.push(setTimeout(() => {
            startFallDown();
            startSpawnMath();
            startTimeCount();
            nextStep();
          }, 5000));
          break;
        case 7:
          timeouts.push(setTimeout(() => {
            clearStepWatch();
            nextStep();
          }, 5000));
          break;
      }
    },
    { immediate: true }
  );
}

function stopTutorial() {
  showTutorial.value = false;
  tutorialStarted.value = false;
  currentStepIndex.value = 0;
}

function nextStep() {
  if (currentStepIndex.value < tutorialSteps.length - 1) {
    showTutorial.value = false;
    timeouts.push(setTimeout(() => {
      currentStepIndex.value++;
      showTutorial.value = true;
    }, 2000));
  } else {
    stopTutorial();
  }
}
</script>

<template>
  <div
    class="backdrop-opacity-10 backdrop-invert h-svh w-svw flex flex-col fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 gap-10 flex-wrap"
  >
    <div v-if="gameStatus === 'playing'">
      <div class="absolute left-5 top-20 font-bold text-3xl">
        {{ timeLeft }}
      </div>
      <div class="p-5 fixed z-20">
        <!-- Sun -->
        <div
          class="w-[300px] h-[300px] left-[35%] top-[2px] fixed bg-gradient-to-b from-pink-600 via-orange-500 to-yellow-500 rounded-full max-md:w-[175px] max-md:h-[165px] xl:left-[40%] max-lg:w-[230px] max-lg:h-[230px] max-lg:top-[10px] max-2xl:top-[-20px]"
        ></div>
        <!-- popup -->
        <div v-show="tutorialStarted">
          <achievementPopUp :alert="showTutorial" type="tutorial">
            <template #title>{{ currentStep.title }}</template>
            <template #description>{{ currentStep.content }}</template>
          </achievementPopUp>
        </div>
        <div v-show="mode !== 'TutorialMode'">
          <achievementPopUp
            :alert="showAlertCompleteAch"
            type="achievement"
            :id="completeAchievement[completeAchievement.length - 1]?.id"
          >
            <template #title>ความสำเร็จที่ยิ่งใหญ่</template>
            <template #description>{{
              completeAchievement[completeAchievement.length - 1]?.name
            }}</template>
          </achievementPopUp>
        </div>

        <!-- Clouds -->
        <Transition name="slide-fade-cloud-right">
          <!-- left-[3%] top-[20%] -->
          <div
            class="w-[30%] h-[20%] p-0 left-[3%] top-[10%] fixed z-10 max-sm:w-[400px] max-sm:top-[5%] minh-600-maxh-800"
          >
            <cloud />
          </div>
        </Transition>
        <Transition name="slide-fade-cloud-right">
          <!-- left-[20%] top-[-1%] -->
          <div
            class="w-[30%] h-[20%] p-0 left-[20%] top-[5%] fixed z-10 max-sm:hidden minh-600-maxh-800"
          >
            <cloud />
          </div>
        </Transition>
        <Transition name="slide-fade-cloud-left">
          <!-- left-[40%] top-[20%] -->
          <div
            class="w-[30%] h-[20%] p-0 left-[40%] top-[10%] fixed z-10 max-sm:hidden minh-600-maxh-800"
          >
            <cloud />
          </div>
        </Transition>
        <Transition name="slide-fade-cloud-left">
          <!-- left-[55%] top-[-2%] -->
          <div
            class="w-[30%] h-[20%] p-0 left-[55%] top-[2%] fixed z-10 max-sm:hidden max-lg:top-[5%] minh-600-maxh-800"
          >
            <cloud />
          </div>
        </Transition>
        <Transition name="slide-fade-cloud-left">
          <!-- left-[70%] top-[20%] -->
          <div
            class="w-[30%] h-[20%] p-0 left-[70%] top-[10%] fixed z-10 max-sm:hidden minh-600-maxh-800"
          >
            <cloud />
          </div>
        </Transition>
      </div>

      <div class="h-[90svh]">
        <section class="flex justify-center m-auto pt-10 h-4/5">
          <div class="flex items-end hw">
            <div class="relative w-full h-3/5">
              <equationBox :displayEquation="displayEquation" />
            </div>
          </div>
        </section>

        <!-- Health & Score -->
        <section class="flex justify-center pt-10">
          <p class="ml-2">Score: {{ score }} / {{ selectedLevel.endScore }}</p>
        </section>
        <section class="flex justify-center">
          <div v-for="(heart, index) in health" :key="index">
            <img src="../assets/img/heart.png" class="w-6 h-6" />
          </div>
        </section>

        <!-- input box -->
        <section class="flex justify-center pt-2">
          <div class="flex items-center">
            <input
              v-model="userInput"
              @keyup.enter="checkResult"
              class="input input-bordered w-full max-w-xs z-10"
              :disabled="health <= 0 || currentStepIndex === 2"
              type="number"
              placeholder="Enter"
            />
          </div>
        </section>
      </div>
      <router-link to="/" v-show="mode === 'TutorialMode'">
        <div class="left-2 bottom-1 absolute scale-[70%] mobile-back-btn">
          <div class="group/bear relative place-content-center cursor-pointer">
            <bearButton text="back"> </bearButton>
          </div>
        </div>
      </router-link>
    </div>
    <div v-if="gameStatus === 'gameOver'">
      <EndGame :gameResult="gameResult" @retry-game="startGame" />
    </div>
  </div>
</template>

<style scoped></style>
