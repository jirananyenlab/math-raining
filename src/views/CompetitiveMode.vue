<script setup>
import AllLevel from "../../data/AllLevel.json";
import bearButton from "../components/bearButton.vue";
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { loadLeaderBoard } from "../libs/fetchUtils.js";

const router = useRouter();
const levels = ref(AllLevel);
const selected = ref(levels.value.length);
const showUser = ref([]);
const errorMSG = ref("");
const currentPage = ref(1);
const rowsPerPage = ref(5);
let allPage = 0;

onMounted(async () => {
  await callLeaderBoard();
});

async function callLeaderBoard() {
  const users = await loadLeaderBoard(currentPage.value, rowsPerPage.value);
  showUser.value = users;
  allPage = Math.ceil(users.items / rowsPerPage.value);
}

async function loadUsersInPage(pageNumber) {
  currentPage.value = pageNumber;
  await callLeaderBoard();
}

function startGame() {
  if (selected.value === -1) {
    errorMSG.value = "!! PLEASE SELECT LEVEL !!";
  } else {
    errorMSG.value = "";
    router.push({
      name: "inGame",
      params: { mode: "CompetitiveMode", level: selected.value },
    });
  }
}

const ranking = computed(() => {
  return (currentPage.value - 1) * rowsPerPage.value + 1;
});
</script>

<template>
  <div class="flex gap-3 flex-col justify-center flex-wrap items-center">
    <p
      class="text-emerald-500 font-semibold text-8xl max-sm:text-[3.5rem] header"
    >
      Competitive Mode
    </p>
  </div>

  <div
    class="flex items-center flex-col relative overflow-visible justify-center"
  >
    <div
      class="w-[30%] h-full bg-white shadow-[0px_5px_15px_8px_#e4e7fb] flex flex-col items-center rounded-lg max-md:w-[70%]"
    >
      <div
        id="header"
        class="w-full flex items-center justify-between px-8 pt-5"
      >
        <h1
          class="text-[1.7rem] text-[#141a39] uppercase cursor-default leaderBoard-header"
        >
          LeaderBoard
        </h1>
      </div>
      <div class="w-full relative">
        <table class="w-full table-fixed text-[#141a39] leaderBoard">
          <thead>
            <tr
              class="transition-all duration-[0.2s] ease-[ease-in-out] rounded-[0.2rem]"
            >
              <td class="w-4 text-[2.2rem] text-left">Rank</td>
              <td class="text-left text-[1.2rem]">Username</td>
              <td class="text-[1.3rem] flex justify-end items-center">score</td>
            </tr>
          </thead>
          <tbody>
            <tr
              class="transition-all duration-[0.2s] ease-[ease-in-out] rounded-[0.2rem]"
              v-for="(user, index) in showUser.data"
              :key="index"
            >
              <td class="w-4 text-[2.2rem] text-left">
                {{ ranking + index }}
              </td>
              <td class="text-left text-[1.2rem]">{{ user.userName }}</td>
              <td class="text-[1.3rem] flex justify-end items-center">
                {{ user.rankingHighScore }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="w-full flex justify-center gap-2 my-5">
          <button
            @click="
              currentPage > 1
                ? loadUsersInPage(currentPage - 1)
                : (currentPage = currentPage)
            "
            :class="
              currentPage === 1
                ? 'opacity-25 cursor-not-allowed'
                : 'opacity-100'
            "
            class="h-10 w-20 text-[1.3rem] text-white uppercase bg-[#5c5be5] cursor-pointer rounded-[2rem] border-b-[0.2rem] border-b-[#3838b8] border-0 border-solid active:border-b-0"
          >
            Prev
          </button>

          <button
            @click="
              currentPage < allPage
                ? loadUsersInPage(currentPage + 1)
                : (currentPage = currentPage)
            "
            :class="
              currentPage === allPage
                ? 'opacity-25 cursor-not-allowed'
                : 'opacity-100'
            "
            class="h-10 w-20 text-[1.3rem] uppercase text-white bg-error cursor-pointer rounded-[2rem] border-0 hover:border-[0.1rem] hover:border-solid hover:border-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <div
      :class="selected !== -1 ? 'opacity-100' : 'opacity-25 cursor-not-allowed'"
      class="group/bear relative place-content-center cursor-pointer"
      @click="startGame"
    >
      <bearButton text="start"></bearButton>
    </div>

    <transition name="page-fade">
      <p
        v-if="errorMSG !== ''"
        class="text-error text-lg font-bold absolute bottom-[-40px] text-nowrap"
      >
        {{ errorMSG }}
      </p>
    </transition>
  </div>

  <router-link to="/">
    <div class="left-2 bottom-1 absolute scale-[70%] mobile-back-btn">
      <div class="group/bear relative place-content-center cursor-pointer">
        <bearButton text="back"></bearButton>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
td {
  height: 3rem;
  font-size: 1.4rem;
  padding: 1px 2rem;
  position: relative;
}

/* browser responsive */
@media not all and (min-height: 850px) {
  .header {
    font-size: 5rem;
  }
  .leaderBoard-header {
    font-size: 1.5rem;
  }

  table.leaderBoard {
    font-size: 1.5rem;

    thead > tr > td {
      font-size: 1.1rem;
    }

    tbody > tr {
      padding: 0;
      height: 0.5rem;
      td {
        font-size: 1rem;
        height: fit-content;
        /* margin: 10px 0px; */
      }
    }
  }
}
</style>
