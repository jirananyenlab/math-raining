import { defineStore, acceptHMRUpdate } from "pinia";
import { useUserStore } from "./user.js";

export const useCustomModeStore = defineStore("CustomMode", {
  state: () => ({
    customMode: [],
  }),
  actions: {
    addLevel(mode) {
      this.customMode.push(mode);
    },
    deleteLevel(index) {
      this.customMode.splice(index, 1);
    },
    loadCustomLevel(allCustomMode) {
      this.customMode = allCustomMode === undefined ? [] : [...allCustomMode];
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCustomModeStore, import.meta.hot));
}
