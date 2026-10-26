import { useUserStore } from "../stores/user.js";

function countOfAwnser(allResult) {
  return {
    correct: allResult.filter((element) => element.isCorrect === true).length,
    inCorrect: allResult.filter((element) => element.isCorrect !== true).length,
  };
}

function checkAchievement(mode, level, score, timeSec) {
  const userStore = useUserStore();
  const allAchievement = userStore.userAllAchievement;
  const userProfiletotalScore = userStore.userProfile.totalScore;
   let allAchLevel = (condition)=>  allAchievement.filter((e) => level === e.nameLevel &&  e.conditionType !== condition ).every((e) => e.isComplete === true)
    if (mode === "CampaignMode" && !allAchLevel()) {                             
      const userTotalScoreThatLevel = userProfiletotalScore[level - 1]+score;

        let AchThatLevel = (condition) =>
        allAchievement.filter(
          (e) =>
            level === e.nameLevel &&
            e.conditionType === condition &&
            e.isComplete === false
        ).find((e) => {
          if (condition==="score") {
            return score >= e.scoreRequire
          } else if (condition==="time") {
            return  timeSec <= e.timeRequire && score >= e.scoreRequire
          } else if (condition==="totalscore") {
            return  userTotalScoreThatLevel >= e.scoreRequire
          } else { return e}
        });
        let scoreAch = AchThatLevel("score")
        let scoreAndTimeAch = AchThatLevel("time")
        let totalsScoreAch = AchThatLevel("totalscore")
        let allAch=  AchThatLevel("allachievement")
      if (scoreAch !== undefined) {
        return {
          id: scoreAch.id,
          name: scoreAch.name,
          description: scoreAch.description,
          isComplete: true,
        };
      } else if (scoreAndTimeAch !== undefined) {
        return {
          id:scoreAndTimeAch.id,
          name:scoreAndTimeAch.name,
          description: scoreAndTimeAch.description,
          isComplete: true,
        };
      } else if (   totalsScoreAch !== undefined ) {
        return {
          id: totalsScoreAch.id,
          name: totalsScoreAch.name,
          description: totalsScoreAch.description,
          isComplete: true,
        };
      } else if (allAchLevel("allachievement")) {
        return {
          id: allAch.id,
          name: allAch.name,
          description: allAch.description,
          isComplete: true,
        };
      }
      
    } 
  }
export { countOfAwnser, checkAchievement };
