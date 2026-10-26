import { defineStore, acceptHMRUpdate } from "pinia";
import AllAchievement from "../../data/AllAchievement.json";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    isLoggedIn: false,
    userProfile: { profileConfig: { effectVolume: 10, musicVolume: 10 } },
    userAllAchievement: [ ...AllAchievement ],
  }),
  actions: {
    setUserProfile(profile) {
      this.isLoggedIn = true;
      this.userProfile = profile;
      if (profile.completeAchievement.length !== 0) {
        profile.completeAchievement.forEach((e) => {
          this.userAllAchievement.forEach((a) =>
            a.id === e.id ? (a.isComplete = e.isComplete) : null
          );
        });
      }
    },
    updateCompleteInAllAchievement(achievement) {
      this.userAllAchievement.find((e) =>
        e.id === achievement.id ? (e.isComplete = achievement.isComplete) : null
      );
    },
    updateScoreRankingInState(score) {
      this.userProfile.rankingHighScore = score;
    },
    updateCompleteGameResultInState(newAchievement, newScore, newTime) {
      this.userProfile.completeAchievement = newAchievement;
      this.userProfile.totalScore = newScore;
      this.userProfile.totalTimePlay = newTime;
    },
    updateMusicVolume(eVolume, mVolume) {
      this.userProfile.profileConfig.musicVolume = mVolume;
      this.userProfile.profileConfig.effectVolume = eVolume;
    },
    updateProfile(newProfile) {
      this.userProfile = newProfile;
    },
    updateCustomModeUserProfile(newAllCustomMode) {
      this.userProfile.customMode = newAllCustomMode;
    },
    logout() {
      this.isLoggedIn = false;
      this.userProfile = {
        profileConfig: { effectVolume: "10", musicVolume: "10" },
      };
      this.userAllAchievement = [ ...AllAchievement];
      sessionStorage.clear();
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
