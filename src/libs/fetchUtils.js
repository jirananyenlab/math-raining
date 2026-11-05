const BASE_URL = (import.meta.env.VITE_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

async function request(path, options = {}) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401 && !path.startsWith('/auth/')) sessionStorage.clear();
  return res;
}
async function updateProfile(id, data, method = 'PATCH') {
  try {
    return (await request(`/usersProfile/${encodeURIComponent(id)}`, { method, body: JSON.stringify(data) })).status;
  } catch { return false; }
}
const updateSetting = (effectVolume, musicVolume, showAchievementBadge, id) =>
  updateProfile(id, { profileConfig: { effectVolume: Number(effectVolume), musicVolume: Number(musicVolume), showAchievementBadge } });
const updateCompleteGameResult = (id, completeAchievement, totalScore, totalTimePlay) =>
  updateProfile(id, { completeAchievement, totalScore, totalTimePlay });
const updateScoreRanking = (id, rankingHighScore) => updateProfile(id, { rankingHighScore });
const updateUserProfile = (id, profile) => updateProfile(id, profile, 'PUT');
const saveCustomLevel = (id, customMode) => updateProfile(id, { customMode });
async function loadLeaderBoard(page, perPage) {
  try {
    const res = await request(`/usersProfile?_sort=-rankingHighScore&_page=${page}&_per_page=${perPage}`);
    if (res.ok) return await res.json();
  } catch { /* Display an empty leaderboard while offline. */ }
  return { data: [], items: 0, pages: 0 };
}
async function loadUserProfile(id) {
  try {
    const res = await request(`/usersProfile/${encodeURIComponent(id)}`);
    return res.ok ? await res.json() : false;
  } catch { return false; }
}
async function registerUser(newUser) {
  try {
    return (await request('/auth/register', { method: 'POST', body: JSON.stringify(newUser) })).status === 201;
  } catch { return false; }
}
async function deleteUser(id) {
  try {
    const res = await request(`/users/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!res.ok) return false;
    sessionStorage.clear();
    return true;
  } catch { return false; }
}
async function authenticateUser(email, password) {
  try {
    const res = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (!res.ok) return false;
    const { token, user } = await res.json();
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userName', user.userName);
    sessionStorage.setItem('id', user.id);
    return true;
  } catch { return false; }
}
async function logoutUser() {
  try { await request('/auth/logout', { method: 'POST' }); }
  catch { /* Local logout still works when offline. */ }
  finally { sessionStorage.clear(); }
}
export { loadUserProfile, registerUser, authenticateUser, deleteUser,
  updateUserProfile, loadLeaderBoard, updateScoreRanking,
  updateCompleteGameResult, updateSetting, saveCustomLevel, logoutUser };
