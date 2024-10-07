<script setup>
import { ref, watchEffect } from "vue";
import { useUserStore } from "../stores/user.js";
import { updateSetting } from "../libs/fetchUtils.js";
const props = defineProps({
  originalMusicVolume: { type: Number, required: true },
  originalEffectVolume: { type: Number, required: true },
});
const emit = defineEmits(["applySetting", "closeSetting"]);

const userStore = useUserStore();
let musicVolume = ref(props.originalMusicVolume);
let effectVolume = ref(props.originalEffectVolume);

watchEffect(() => {
  musicVolume.value = props.originalMusicVolume;
  effectVolume.value = props.originalEffectVolume;
});
function cancelChange() {
  emit("closeSetting", false);
  musicVolume.value = props.originalMusicVolume;
  effectVolume.value = props.originalEffectVolume;
}
async function applySetting() {
  emit("applySetting", musicVolume.value, effectVolume.value),
    emit("closeSetting", false);
  if (userStore.isLoggedIn) {
    await updateSetting(
      effectVolume.value,
      musicVolume.value,
      userStore.userProfile.profileConfig.showAchievementBadge,
      userStore.userProfile.id
    );
  }
  userStore.updateMusicVolume(effectVolume.value, musicVolume.value);
}
</script>

<template>
  <div class="bg-slate-50 rounded-md p-3">
    <div class="flex">
      <h2 class="text-lg font-bold mb-2 p-2">Setting</h2>
      <div class="grow">
        <p
          class="text-red-600 text-right font-bold p-2 cursor-pointer float-right w-fit"
          @click="cancelChange"
        >
          X
        </p>
      </div>
    </div>
    <div class="flex justify-center">
      <div class="m-0 justify-self-center p-0">
        <!-- Music Volume -->
        <div class="flex items-center">
          <div class="mr-2">Music:</div>
          <input
            v-model.number="musicVolume"
            type="range"
            min="0"
            max="100"
            class="range range-xs range-error mr-2"
          />
          <div>{{ musicVolume }}%</div>
        </div>
        <!-- Effect Volume -->
        <div class="flex items-center mt-2">
          <div class="mr-2">Effect:</div>
          <input
            v-model.number="effectVolume"
            type="range"
            min="0"
            max="100"
            class="range range-xs range-error mr-2"
          />
          <div>{{ effectVolume }}%</div>
        </div>
      </div>
    </div>
    <div class="flex justify-center mt-3">
      <button
        @click="applySetting"
        class="btn btn-sm mr-5 bg-red-400 text-white hover:bg-green-500 hover:text-white"
      >
        Apply
      </button>
    </div>
  </div>
</template>

<style scoped></style>
