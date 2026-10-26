const BASE_URL = import.meta.env.VITE_BASE_URL;

async function updateSetting(eVolume, mVolume, showAchievementBadge, id) {
  let res;
  try {
    res = await fetch(`${BASE_URL}/usersProfile/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        profileConfig: {
          effectVolume: eVolume,
          musicVolume: mVolume,
          showAchievementBadge: showAchievementBadge,
        },
      }),
    });
    return res.status;
  } catch (error) {
    console.log(`error: ${error}`);
    return false;
  }
}

async function updateCompleteGameResult(id, newAchievement, newScore, newTime) {
  let res;
  try {
    res = await fetch(`${BASE_URL}/usersProfile/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        completeAchievement: newAchievement,
        totalScore: newScore,
        totalTimePlay: newTime,
      }),
    });
    return res.status;
  } catch (error) {
    console.log(`Error Update Result: ${error}`);
    return false;
  }
}

async function updateScoreRanking(id, newScore) {
  let res;
  try {
    res = await fetch(`${BASE_URL}/usersProfile/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        rankingHighScore: newScore,
      }),
    });
    return res.status;
  } catch (error) {
    console.log(`Error Update Score Ranking: ${error}`);
    return false;
  }
}

async function updateUserProfile(id, editUser) {
  let res;
  try {
    res = await fetch(`${BASE_URL}/usersProfile/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...editUser,
      }),
    });
    return res.status;
  } catch (error) {
    console.log(`error: ${error}`);
    return false;
  }
}

async function loadLeaderBoard(page, perPage) {
  try {
    const res = await fetch(
      `${BASE_URL}/usersProfile/?_sort=-rankingHighScore&_page=${page}&_per_page=${perPage}`
    );
    const users = await res.json();
    return users;
  } catch (error) {
    console.log(`Error loading users in range: ${error}`);
    return false;
  }
}

async function loadUserProfile(id) {
  try {
    const res = await fetch(`${BASE_URL}/usersProfile/${id}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(`error: ${error}`);
    return false;
  }
}

async function registerUser(newUser) {
  try {
    const res = await fetch(`${BASE_URL}/users`);
    const users = await res.json();
    let id = 0;
    if (users.length !== 0) {
      id = parseInt(users[users.length - 1].id) + 1;
    }
    const resUser = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: `${id}`,
        ...newUser,
      }),
    });
    const resProfile = await fetch(`${BASE_URL}/usersProfile`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: `${id}`,
        userName: newUser.userName,
        rankingHighScore: 0,
        completeAchievement: [],
        profileConfig: {
          effectVolume: 2,
          musicVolume: 2,
          showAchievementBadge: [null , null , null],
        },
        totalScore: [0, 0, 0, 0, 0, 0, 0, 0],
        totalTimePlay: [0, 0, 0, 0, 0, 0, 0, 0],
        customLevel: [],
      }),
    });
    if (resUser.status === 201 && resProfile.status === 201) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(`error: ${error}`);
    return false;
  }
}

async function deleteUser(id) {
  try {
    const resUser = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
    });
    const resProfile = await fetch(`${BASE_URL}/usersProfile/${id}`, {
      method: "DELETE",
    });
    if (resUser.status === 200 && resProfile.status === 200) {
      sessionStorage.clear;
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(`error: ${error}`);
    return false;
  }
}

async function authenticateUser(email, password) {
  try {
    const res = await fetch(`${BASE_URL}/users`);
    if (res.status === 200) {
      const users = await res.json();
      const user = await users.find(
        (user) => user.email === email && user.password === password
      );
      if (user) {
        sessionStorage.setItem("isLoggedIn", true);
        sessionStorage.setItem("userName", user.userName);
        sessionStorage.setItem("id", user.id);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error authenticating user:", error);
    return false;
  }
}

async function loadAllUsers(){
  try {
    const res = await fetch(`${BASE_URL}/users`);
    const users = await res.json();
    return users
  } catch (error) {
    console.log("Error authenticating user:", error);
  }
}

async function saveCustomLevel(id, newCustomMode) {
  try {
    const res = await fetch(`${BASE_URL}/usersProfile/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        customMode: [...newCustomMode],
      }),
    });
    return res.status;
  } catch (error) {
    console.log(`Error Save CustomMode: ${error}`);
  }
}
export {
  loadUserProfile,
  registerUser,
  authenticateUser,
  deleteUser,
  updateUserProfile,
  loadLeaderBoard,
  updateScoreRanking,
  updateCompleteGameResult,
  updateSetting,
  saveCustomLevel,
  loadAllUsers
};
