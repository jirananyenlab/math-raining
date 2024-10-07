<script setup>
import { ref, computed, onMounted } from "vue";
import addButton from "../components/icons/addButton.vue";
import bearButton from "../components/bearButton.vue";
import toasts from "../components/toasts.vue";
import { checkName } from "../libs/checkName.js";
import { useCustomModeStore } from "../stores/customMode.js";
import { useRouter } from "vue-router";
import cardBase from "../components/cardBase.vue";
import { useUserStore } from "../stores/user.js";
import { saveCustomLevel } from "../libs/fetchUtils.js";
import modal from "../components/modal.vue";

const userStore = useUserStore();
const customModeStore = useCustomModeStore();
const router = useRouter();
const showToast = ref(false);
const isLogin = userStore.isLoggedIn;
const levels = ref([]);
const selected = ref(-1);
const addCustomLevelMode = ref(false);
const errorMSG = ref("");
const customLevel = ref({
  nameLevel: "",
  numberRange: 1,
  lengthExpression: 1,
  symbol: [],
  dropSpeed: 0,
  health: 1,
  endScore: 1e500,
});

onMounted(() => {
  if (isLogin) {
    customModeStore.loadCustomLevel(userStore.userProfile.customMode);
  }
  levels.value = customModeStore.customMode;
});

async function addNewLevel() {
  addCustomLevelMode.value = false;
  customModeStore.addLevel({ ...customLevel.value });
  if (isLogin) {
    const res = await saveCustomLevel(
      userStore.userProfile.id,
      customModeStore.customMode
    );
    if (res === 200) {
      userStore.updateCustomModeUserProfile(customModeStore.customMode);
      showToast.value = true;
    }
  }
  customLevel.value = {
    nameLevel: "",
    numberRange: 1,
    lengthExpression: 1,
    symbol: [],
    dropSpeed: 0,
    health: 1,
    endScore: Infinity,
  };
}
const showModal = ref(false);
let indexRef = ref(0);

async function deleteLevel(status = false, index) {
  indexRef.value = index;
  showModal.value = true;
  if (status) {
    customModeStore.deleteLevel(index);
    showModal.value = false;
    if (isLogin) {
      const res = await saveCustomLevel(
        userStore.userProfile.id,
        customModeStore.customMode
      );
      if (res !== 200) {
        customModeStore.loadCustomLevel();
        levels.value = customModeStore.customMode;
      }
    }
  } else {
    showModal.value = false;
  }
}

function msgColorBinding(msg) {
  if (msg === "Name validate") {
    return {
      inputBinding: " focus:border-green-500 focus:ring-green-500",
      MsgBinding: "opacity-100 text-green-500",
    }; // ผ่าน
  } else if (msg.length === 0) {
    return {
      inputBinding: " focus:border-violet-500 focus:ring-violet-500",
      MsgBinding: "opacity-0",
    }; // ทั่วไป
  } else {
    return {
      inputBinding: " focus:border-rose-500 focus:ring-rose-500",
      MsgBinding: "opacity-100 text-rose-500",
    }; // ไม่ผ่าน
  }
}
function startGame() {
  if (selected.value === -1) {
    // alert("plz select level");
    errorMSG.value = "!! PLEASE SELECT LEVEL !!";
  } else {
    errorMSG.value = "";
    router.push({
      name: "inGame",
      params: { mode: "CustomMode", level: selected.value + 1 },
    });
  }
}
const borderBinding = computed(() =>
  checkName(levels.value, customLevel.value.nameLevel)
);
</script>

<template>
  <!-- Mode Custom -->
  <div
    class="flex gap-3 flex-col flex-wrap justify-center items-center"
    :class="
      addCustomLevelMode ? 'bg-gradient-to-b from-blue-200 to-pink-200' : ''
    "
  >
    <p class="text-emerald-500 font-semibold text-8xl max-sm:text-[3.5rem]">
      CUSTOM YOUR MATHEMATIC
    </p>
    <!-- Custom Level List -->
    <div class="flex gap-3 flex-row justify-center flex-wrap">
      <div
        class="group/card hover:rotate-180"
        @click="
          addCustomLevelMode = true;
          errorMSG = '';
        "
      >
        <input type="radio" class="peer hidden" />
        <label
          class="btn flex justify-center items-center self-center text-center z-30 relative after:-z-20 after:bg-gradient-to-tl from-indigo-500 from-10% via-purple-500 via-30% to-pink-500 to-90% after:absolute after:h-1 after:w-1 after:left-5 overflow-hidden after:bottom-0 after:translate-y-full after:rounded-md after:hover:scale-[300] after:hover:transition-all after:hover:duration-700 after:transition-all after:duration-700 transition-all duration-700 peer-checked:bg-gradient-to-tl peer-checked:font-normal peer-checked:text-white select-none peer-hover:text-white rounded-lg lg:h-[12rem] w-[12rem] lg-h-Level-Selector mobile-Level-Selector"
        >
          <div class="group-hover/card:hidden rotate-0 font-base text-lg">
            <addButton />
          </div>
          <div
            class="hidden gap-3 flex-col justify-center flex-wrap rotate-180 group-hover/card:block text-pretty text-base text-white"
          >
            <div class="level-info">Add New Custom Level</div>
          </div>
        </label>
      </div>

      <Teleport to="#app">
        <modal
          type="delete"
          @user-action="deleteLevel($event, indexRef)"
          v-if="showModal"
        >
          <template #text
            >ต้องการลบ {{ levels[indexRef].nameLevel }} หรือไม่?</template
          >
          <template #Ok>Delete</template>
          <template #cancel>Cancel</template>
        </modal>
      </Teleport>

      <div
        v-for="(level, index) in levels"
        :key="index"
        class="group/card hover:rotate-180"
      >
        <cardBase
          :forLabel="index.toString()"
          styles="level"
          height="h-[12rem] lg-h-Level-Selector-height"
          width="w-[12rem] lg-h-Level-Selector-width"
          @delete-action="(status) => (showModal = status)"
        >
          <modal
            type="delete"
            @user-action="deleteLevel"
            :index="indexRef"
          ></modal>
          <template #input>
            <input
              type="radio"
              v-model.number="selected"
              :value="index"
              :id="index"
              class="peer hidden"
            />
          </template>
          <template #name>{{ level.nameLevel }}</template>
          <template #maxNumber>Max Number : {{ level.numberRange }}</template>
          <template #maxExpression>
            Max Expression : {{ level.lengthExpression + 2 }}</template
          >
          <template #health>Health : {{ level.health }}</template>
          <template #symbol>
            Symbol : {{ level.symbol[0] }} {{ level.symbol[1] }}
            {{ level.symbol[2] }} {{ level.symbol[3] }}</template
          >

          <template #action>
            <div
              class="mt-4 absolute z-0 right-[-10px] bottom-[-20px] ipad-delete-btn delete-btn"
              @click="deleteLevel(false, index)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 float-right"
                viewBox="0 0 448 512"
              >
                <path
                  d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                  fill="white"
                />
              </svg>
            </div>
          </template>
        </cardBase>
      </div>
    </div>
    <!-- INPUT CUSTOM LEVEL  -->
    <Transition name="page-fade">
      <div
        v-if="addCustomLevelMode"
        class="flex justify-between flex-col gap-3"
      >
        <!--Save Name -->
        <div class="flex justify-between items-center w-[100%]">
          <p class="font-semibold">Save Name</p>
          <div class="flex flex-row overflow-visible relative">
            <input
              v-model="customLevel.nameLevel"
              type="text"
              class="ml-2 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none block rounded-md sm:text-sm focus:ring-1"
              :class="msgColorBinding(borderBinding).inputBinding"
            />
            <div
              class="opacity-0 absolute right-[-1px] top-[14px] text-xs font-medium p-2"
              :class="msgColorBinding(borderBinding).MsgBinding"
            >
              {{ borderBinding }}
            </div>
          </div>
        </div>
        <!-- Max Number Random -->
        <div class="flex justify-between items-center w-[100%]">
          <p class="font-semibold">Max Number Random</p>
          <input
            v-model.number="customLevel.numberRange"
            type="number"
            min="1"
            class="ml-2 px-3 py-2 w-1/5 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-violet-500 block rounded-md sm:text-sm focus:ring-1"
          />
        </div>
        <!-- Max Length Expression -->
        <div class="flex justify-between items-center w-[100%]">
          <p class="font-semibold">Max Length Expression</p>
          <select
            v-model.number="customLevel.lengthExpression"
            class="select select-bordered select-sm w-4/12 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-violet-500 block rounded-md sm:text-sm focus:ring-1"
          >
            <option value="1" selected>a+b</option>
            <option value="3">a+b+c</option>
            <option value="5">a+b+c+d</option>
            <option value="7">a+b+c+d+e</option>
            <option value="9">a+b+c+d+e+f</option>
          </select>
        </div>
        <!-- Math Symbol -->
        <div class="flex justify-between items-center w-[100%]">
          <p class="font-semibold">Math Symbol</p>
          <div class="flex">
            <div>
              <input
                type="checkbox"
                id="addition"
                v-model="customLevel.symbol"
                value="+"
                class="hidden peer"
              />
              <label
                class="btn ml-1 mr-1 btn-sm text-center bg-white border-2 border-gray-200 rounded-lg cursor-pointer placeholder:hover:text-gray-300 peer-checked:border-violet-500 hover:text-gray-600 peer-checked:text-gray-600 hover:bg-gray-50"
                for="addition"
              >
                +
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="subtraction"
                v-model="customLevel.symbol"
                value="-"
                class="hidden peer"
              />
              <label
                class="btn ml-1 mr-1 btn-sm text-center bg-white border-2 border-gray-200 rounded-lg cursor-pointer placeholder:hover:text-gray-300 peer-checked:border-violet-500 hover:text-gray-600 peer-checked:text-gray-600 hover:bg-gray-50"
                for="subtraction"
              >
                -
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="multiplication"
                v-model="customLevel.symbol"
                value="*"
                class="hidden peer"
              />
              <label
                class="btn ml-1 mr-1 btn-sm text-center bg-white border-2 border-gray-200 rounded-lg cursor-pointer placeholder:hover:text-gray-300 peer-checked:border-violet-500 hover:text-gray-600 peer-checked:text-gray-600 hover:bg-gray-50"
                for="multiplication"
              >
                x
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="division"
                v-model="customLevel.symbol"
                value="/"
                class="hidden peer"
              />
              <label
                class="btn ml-1 mr-1 btn-sm text-center bg-white border-2 border-gray-200 rounded-lg cursor-pointer placeholder:hover:text-gray-300 peer-checked:border-violet-500 hover:text-gray-600 peer-checked:text-gray-600 hover:bg-gray-50"
                for="division"
              >
                /
              </label>
            </div>
          </div>
        </div>
        <!-- Health -->
        <div class="flex justify-between items-center w-[95%]">
          <p class="font-semibold">Health</p>
          <div class="rating gap-1">
            <input
              v-model.number="customLevel.health"
              :value="1"
              type="radio"
              name="rating-3"
              class="mask mask-heart bg-red-500"
              checked
            />
            <input
              v-model.number="customLevel.health"
              :value="2"
              type="radio"
              name="rating-3"
              class="mask mask-heart bg-red-500"
            />
            <input
              v-model.number="customLevel.health"
              :value="3"
              type="radio"
              name="rating-3"
              class="mask mask-heart bg-red-500"
            />
            <input
              v-model.number="customLevel.health"
              :value="4"
              type="radio"
              name="rating-3"
              class="mask mask-heart bg-red-500"
            />
            <input
              v-model="customLevel.health"
              :value.number="5"
              type="radio"
              name="rating-3"
              class="mask mask-heart bg-red-500"
            />
          </div>
        </div>
        <!-- SElECT RANGE SPEED -->
        <div class="flex justify-between items-center w-[100%]">
          <div
            class="flex flex-wrap justify-center flex-col items-center w-full"
          >
            <p class="text-emerald-500 font-semibold text-lg">DROP SPEED</p>
            <div class="w-full">
              <input
                v-model.number="customLevel.dropSpeed"
                type="range"
                min="0"
                max="50"
                value="0"
                class="range range-xs range-error"
              />
              <div class="flex justify-between">
                <p class="font-semibold">Slow</p>
                <div>{{ Math.round(customLevel.dropSpeed * 2) }}</div>
                <p class="font-semibold">Fast</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Save btn -->
        <div class="flex justify-center items-center w-[100%]">
          <button
            :disabled="
              customLevel.symbol.length === 0 ||
              customLevel.nameLevel.length === 0 ||
              checkName(levels, customLevel.nameLevel) !== 'Name validate'
                ? true
                : false
            "
            class="btn btn-sm mr-5 hover:bg-green-500 hover:text-white"
            @click="addNewLevel"
          >
            Save
          </button>
          <button
            class="btn btn-sm hover:bg-red-500 hover:text-white"
            @click="addCustomLevelMode = false"
          >
            Cancel
          </button>
        </div>
      </div>
    </Transition>
    <div class="flex items-center flex-col relative overflow-visible">
      <!-- startButton -->
      <div
        :class="
          selected !== -1 ? 'opacity-100' : 'opacity-25 cursor-not-allowed'
        "
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
    <router-link to="/">
      <div class="left-2 bottom-1 fixed scale-[70%] mobile-back-btn">
        <div class="group/bear relative place-content-center cursor-pointer">
          <bearButton text="back"> </bearButton>
        </div>
      </div>
    </router-link>
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
  </div>
</template>

<style scoped></style>
