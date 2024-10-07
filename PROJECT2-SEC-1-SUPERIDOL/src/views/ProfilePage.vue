<script setup>
import { ref, watch } from "vue";
import { useUserStore } from "../stores/user";
import bearButton from "../components/bearButton.vue";
import {
  getItemsOfCurrentPage,
  getTotalPages,
  getPageToShow,
} from "../libs/paginate.js";
import { updateUserProfile } from "../libs/fetchUtils.js";

import toasts from "../components/toasts.vue";
import modal from "../components/modal.vue";
const editMode = ref(false);
const userStore = useUserStore();
const userdata = ref(userStore.userProfile);
const AllAchievement = userStore.userAllAchievement;
const showAchievementBadge =
  userStore.userProfile.profileConfig.showAchievementBadge;

function isCompleteBinding(Boolean) {
  if (Boolean) return "";
  return "grayscale";
}

let levelFilter = ref("");
let conditionFilter = ref("");
const currentPage = ref(1);
let displayAllAchievement = ref(AllAchievement);
let displayAllAchievement_beforePaginate = displayAllAchievement;
const allPage = ref(10);
const editBadgeSelect = ref(0);
allPage.value = getTotalPages(displayAllAchievement_beforePaginate, 10);

watch(
  [levelFilter, conditionFilter, editMode, editBadgeSelect],
  (newValue, oldValue) => {
    updateDisplayAchievement();
    currentPage.value = 1;
  }
);
watch(currentPage, (newValue, oldValue) => {
  updateDisplayAchievement();
});

displayAllAchievement.value = getItemsOfCurrentPage(
  AllAchievement,
  currentPage.value,
  10
);

function updateDisplayAchievement() {
  if (!editMode.value) {
    displayAllAchievement_beforePaginate = AllAchievement.filter(
      (AllAchievement) =>
        AllAchievement.nameLevel.includes(levelFilter.value) &&
        AllAchievement.conditionType.includes(conditionFilter.value)
    );

    displayAllAchievement_beforePaginate.sort((a, b) => {
      return (a.isComplete === true ? 0 : 1) - (b.isComplete === true ? 0 : 1);
    });
    displayAllAchievement.value = getItemsOfCurrentPage(
      displayAllAchievement_beforePaginate,
      currentPage.value,
      10
    );
    allPage.value = getTotalPages(displayAllAchievement_beforePaginate, 10);
  } else if (editMode.value) {
    displayAllAchievement_beforePaginate = AllAchievement.filter(
      (AllAchievement) =>
        AllAchievement.nameLevel.includes(levelFilter.value) &&
        AllAchievement.conditionType.includes(conditionFilter.value) &&
        AllAchievement.isComplete
    );
    displayAllAchievement.value = getItemsOfCurrentPage(
      displayAllAchievement_beforePaginate,
      currentPage.value,
      10
    );
    allPage.value = getTotalPages(displayAllAchievement_beforePaginate, 10);
  }
}
updateDisplayAchievement();

const editModeData = ref({ ...userStore.userProfile });
let displayAllAchievementBadge_EditMode = ref([null, null, null]);
let displayAllAchievementBadge = ref([null, null, null]);
watch(editModeData.value.profileConfig.showAchievementBadge, () => {
  updateAchievementBadge(true);
});
function updateAchievementBadge(isEditMode) {
  if (showAchievementBadge !== undefined && !isEditMode) {
    for (let index = 0; index < 3; index++) {
      // showAchievementBadge.length
      if (showAchievementBadge[index] == null) {
        displayAllAchievementBadge.value[index] = null;
      } else
        displayAllAchievementBadge.value[index] = AllAchievement.find(
          (achievement) => achievement.id == showAchievementBadge[index]
        );
    }
  }
  if (
    editModeData.value.profileConfig.showAchievementBadge !== undefined &&
    isEditMode
  ) {
    for (
      let index = 0;
      // index < editModeData.value.profileConfig.showAchievementBadge.length;
      index < 3;
      index++
    ) {
      if (
        editModeData.value.profileConfig.showAchievementBadge[index] == null
      ) {
        displayAllAchievementBadge_EditMode.value[index] = {
          name: "ไม่มีอะไรทั้งนั้น",
          description: "คุณยังไม่ได้เลือก Achievement ใด ๆ มาแสดง",
          imagePath: "/images/Achievement/Hidden-Achievement.png",
        };
      } else
        displayAllAchievementBadge_EditMode.value[index] = AllAchievement.find(
          (achievement) =>
            achievement.id ==
            editModeData.value.profileConfig.showAchievementBadge[index]
        );
    }
  }
}
updateAchievementBadge(false);
updateAchievementBadge(true);

function getHighestScoreAndTime() {
  const highestScore = Math.max(...userdata.value.totalScore);
  const highestTimePlay = Math.max(...userdata.value.totalTimePlay);
  return {
    score: {
      level:
        userdata.value.totalScore.findIndex((score) => score === highestScore) +
        1,
      score: highestScore,
    },
    timePlay: {
      level:
        userdata.value.totalTimePlay.findIndex(
          (timeplay) => timeplay === highestTimePlay
        ) + 1,
      timeplay: highestTimePlay,
    },
  };
}

function enterEditMode() {
  editMode.value = true;
  editModeData.value = { ...userStore.userProfile };
}
const showToast = ref(false);
const showModal = ref(false);
async function saveProfile(wantToSave) {
  editMode.value = false;
  showModal.value = false;
  if (wantToSave) {
    const res = await updateUserProfile(
      editModeData.value.id,
      editModeData.value
    );
    if (res === 200) {
      userStore.updateProfile(editModeData.value);
      userdata.value = userStore.userProfile;
      showAchievementBadge.value =
        userStore.userProfile.profileConfig.showAchievementBadge;
      updateAchievementBadge(false);
      showToast.value = true;
    }
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="left-[0%] top-[15%] absolute w-full">
      <div
        class="flex gap-3 flex-col flex-wrap justify-center items-center p-0 bg-gradient-to-b from-blue-200 to-pink-200 text-base-content">
        <div
          class="container w-3/4 flex h-40 justify-between justify-self-center bg-gradient-to-tl from-yellow-100 to-fuchsia-2000 border-double border-4 border-sky-500 rounded-lg">
          <div class="basis-1/4 grid justify-items-stretch p-3">
            <img src="https://minotar.net/helm/sorrapong2521/64" alt="Profile Image"
              class="w-[125px] h-[125px] border-double border-4 border-sky-500 justify-self-center" />
          </div>
          <!-- username and description -->
          <div class="basis-2/4 p-4" v-if="!editMode">
            <h1 class="text-xl m-2">
              {{ userdata.userName }}
            </h1>
            <div class="w-full flex">
              <div class="h-full w-1/2">
                <h6>
                  คะแนนรวมที่สูงที่สุดคือด่าน
                  {{ getHighestScoreAndTime().score.level }}
                </h6>
                <h6>
                  คุณทำคะแนนไปถึง
                  {{ getHighestScoreAndTime().score.score }}
                  คะแนน!!
                </h6>
              </div>

              <div class="w-1/2">
                <h6>
                  เวลาเล่นรวมสูงสุดคือด่าน
                  {{ getHighestScoreAndTime().timePlay.level }}
                </h6>
                <h6>
                  คุณเล่นไปทั้งหมด
                  {{ getHighestScoreAndTime().timePlay.timeplay }}
                  วินาที!!
                </h6>
              </div>
            </div>
          </div>
          <!-- username and description  (( EDIT MODE ))-->
          <div class="basis-2/4 p-4" v-if="editMode">
            <h1 class="text-xl m-2">
              <label for="username" class="pr-3">user name</label>
              <input type="text" name="userName" id="username" class="rounded-md pl-2"
                v-model="editModeData.userName" />
            </h1>
          </div>

          <div class="basis-1/4 p-4 flex items-center">
            <button class="submit-btn m-auto" v-if="!editMode" @click="enterEditMode">
              Edit Profile
            </button>
            <button class="submit-btn m-auto" v-if="editMode" @click="showModal = true">
              Save Profile
            </button>
          </div>
        </div>

        <!-- display Achivement Badge -->
        <div class="flex w-3/5 justify-center gap-12" v-if="!editMode">
          <div v-for="(
              AdisplayAllAchievementBadge, index
            ) in displayAllAchievementBadge.filter((ach) => ach !== null)" :key="index">
            <div
              class="p-5 bg-gradient-to-bl from-teal-300 via-purple-300 to-violet-300 border-double border-4 border-sky-500 rounded-lg">
              <img :src="AdisplayAllAchievementBadge.imagePath" alt="HeartSuccess" class="m-auto h-auto w-20" />
              <h5 class="text-base text-center">
                {{ AdisplayAllAchievementBadge.name }}
              </h5>
              <h6 class="text-sm">
                {{ AdisplayAllAchievementBadge.description }}
              </h6>
            </div>
          </div>
        </div>

        <!-- display Achivement Badge (( EDIT MODE )) -->
        <div class="flex w-3/5 gap-12 items-center" v-if="editMode">
          <div v-for="(
              AdisplayAllAchievementBadge, index
            ) in displayAllAchievementBadge_EditMode" :key="index" @click="
            editBadge = true;
          editBadgeSelect = index;
          ">
            <div v-if="AdisplayAllAchievementBadge !== null"
              class="p-5 bg-gradient-to-bl from-teal-300 via-purple-300 to-violet-300 border-double border-4 border-sky-500 rounded-lg">
              <img :src="AdisplayAllAchievementBadge.imagePath" class="m-auto h-auto w-20" />
              <h5 class="text-base text-center">
                {{ AdisplayAllAchievementBadge.name }}
              </h5>
              <h6 class="text-sm">
                {{ AdisplayAllAchievementBadge.description }}
              </h6>
            </div>
          </div>
        </div>

        <!-- Achievement -->
        <div
          class="container w-3/4 flex-col p-5 gap-3 bg-gradient-to-tl from-yellow-100 to-fuchsia-2000 border-double border-4 border-sky-500 rounded-lg">
          <h1 class="text-xl font-bold">AllAchievement</h1>

          <!-- Achievement Filter -->
          <div class="flex gap-5">
            <button
              class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              @click="
            levelFilter = '';
          conditionFilter = '';
          ">
              Show All
            </button>
            <select
              class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              v-model="levelFilter">
              <option value="" selected>Filter By Level</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4</option>
              <option value="5">Level 5</option>
              <option value="6">Level 6</option>
              <option value="7">Level 7</option>
              <option value="8">Level 8</option>
            </select>
            <select
              class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              v-model="conditionFilter">
              <option value="" selected>Filter By Condition</option>
              <option value="allachievement">All Achievement</option>
              <option value="time">Time</option>
              <option value="score">Score</option>
              <option value="totalscore">Totalscore</option>
            </select>
          </div>

          <!-- List Achievement !editMode -->
          <div class="flex flex-col gap-2 m-2" v-if="!editMode">
            <div v-show="displayAllAchievement == undefined ||
            displayAllAchievement == null ||
            displayAllAchievement?.length == 0
            " class="p-5">
              Hmm.. There doesn't seem to be an achievement you're looking for.
              Try Show ALL.
            </div>
            <div v-for="(Achievement, index) in displayAllAchievement" :key="index" class="flex flex-row">
              <div class="h-fit w-auto">
                <img :src="Achievement.isComplete
              ? Achievement.imagePath
              : '/images/Achievement/Hidden-Achievement.png'
            " alt="" class="h-[50px] w-[50px]" :class="isCompleteBinding(Achievement.isComplete)" />
              </div>
              <div>
                <h2 class="font-semibold">{{ Achievement.name }}</h2>
                <h2>{{ Achievement.description }}</h2>
              </div>
            </div>
          </div>

          <!-- List Achievement editMode -->
          <div class="flex flex-col gap-2 m-2" v-if="editMode">
            <div v-show="displayAllAchievement == undefined ||
            displayAllAchievement == null ||
            displayAllAchievement?.length == 0
            " class="p-5">
              Hmm.. There doesn't seem to be an achievement you're looking for.
              Try Show ALL.
            </div>

            <div class="flex flex-row">
              <div class="h-fit w-full flex">
                <input class="p-5" :value="null" id="editBadge-null" type="radio" :name="editModeData.profileConfig.showAchievementBadge[
            editBadgeSelect
            ]
            " v-model="editModeData.profileConfig.showAchievementBadge[
            editBadgeSelect
            ]
            " />
                <label for="editBadge-null" :class="editModeData.profileConfig.showAchievementBadge[
              editBadgeSelect
            ] == null
              ? 'bg-slate-100'
              : ''
            " class="flex w-full rounded-lg p-2">
                  <div>
                    <img src="/images/Achievement/Hidden-Achievement.png" class="h-[50px] w-[50px]" />
                  </div>
                  <div>
                    <h2 class="font-semibold">Not Select</h2>
                    <h2>ฉันไม่ต้องการเลือกอะไรเลย</h2>
                  </div>
                </label>
              </div>
            </div>

            <div v-for="(Achivement, index) in displayAllAchievement" :key="index" class="flex flex-row">
              <div class="h-fit w-full flex">
                <input class="p-5" :value="Achivement.id" :id="'editBadge-' + Achivement.id" type="radio" :name="editModeData.profileConfig.showAchievementBadge[
            editBadgeSelect
            ]
            " v-model="editModeData.profileConfig.showAchievementBadge[
            editBadgeSelect
            ]
            " />
                <label :for="'editBadge-' + Achivement.id" :class="Achivement.id ==
              editModeData.profileConfig.showAchievementBadge[
              editBadgeSelect
              ]
              ? 'bg-slate-100'
              : ''
            " class="flex w-full rounded-lg p-2">
                  <div>
                    <img :src="Achivement.imagePath" class="h-[50px] w-[50px]"
                      :class="isCompleteBinding(Achivement.isComplete)" />
                  </div>
                  <div>
                    <h2 class="font-semibold">{{ Achivement.name }}</h2>
                    <h2>{{ Achivement.description }}</h2>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div class="grid grid-flow-col justify-stretch gap-2 m-2">
            <button class="page-select" @click="currentPage -= 1" :disabled="currentPage == 1">
              previous
            </button>
            <button class="page-select" :class="page == currentPage ? 'page-current' : ''"
              v-for="(page, index) in getPageToShow(allPage, currentPage, 10)" :key="index" @click="currentPage = page">
              {{ page }}
            </button>
            <button class="page-select" @click="currentPage += 1" :disabled="currentPage == allPage">
              next
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Back btn -->
    <router-link to="/">
      <div class="left-2 bottom-1 fixed scale-[70%] mobile-back-btn">
        <div class="group/bear relative place-content-center cursor-pointer">
          <bearButton text="back"></bearButton>
        </div>
      </div>
    </router-link>
  </Teleport>

  <Teleport to="#app">
    <div
      class="fixed left-[80%] right-0 top-[85%] m-auto transition opacity-100 translate-y-[50px] duration-[400ms] delay-1000 z-50"
      v-show="showToast">
      <toasts toast="success" @close-toast="showToast = false"><template v-slot:message> Data saved successfully
        </template>
      </toasts>
    </div>
  </Teleport>

  <Teleport to="#app">
    <modal type="edit" @user-action="saveProfile" v-if="showModal" class="z-50">
      <template #text>ต้องการแก้ไขข้อมูลหรือไม่</template>
      <template #Ok>Comfirm</template>
      <template #cancel>Cancel</template>
    </modal>
  </Teleport>
</template>

<style scoped>
.page-select {
  display: block;
  border-radius: 0.25rem;
  border-width: 1px;
  border-color: #9ca3af;
  background-color: #ffffff;
  appearance: none;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

input::selection+label {
  border: 1px solid red;
}

.page-select:hover {
  border-color: #6b7280;
}

.page-select:disabled {
  background-color: silver;
}

.page-current {
  border: 1px solid aquamarine;
  background: rgb(0, 200, 202);
  background: linear-gradient(41deg,
      rgba(0, 200, 202, 1) 0%,
      rgba(241, 139, 255, 1) 72%);
}

.progress-bar {
  width: 50%;
  height: 25px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid deepskyblue;
  padding: 6px;
}

.progress {
  height: 100%;
  background: linear-gradient(to left, #f70000 0%, #ff3399 50%, #ffcccc 100%);
  border-radius: 10px;
  animation: animate 3s linear forwards;
}

@keyframes animate {
  0% {
    width: 0;
  }

  100% {
    width: 80%;
  }
}

.submit-btn {
  padding: 10px 5px;
  border: 3px rgba(241, 139, 255, 1) outset;
  background: rgb(0, 200, 202);
  background: linear-gradient(41deg,
      rgba(0, 200, 202, 1) 0%,
      rgba(241, 139, 255, 1) 72%);
  border-radius: 5px;
}

.submit-btn:hover {
  padding: 10px 5px;
  border: 3px black outset;
  background: rgb(0, 200, 202);
  background: linear-gradient(90deg,
      rgba(0, 200, 202, 1) 0%,
      rgba(241, 139, 255, 1) 72%);
  border-radius: 5px;
}
</style>
