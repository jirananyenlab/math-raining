<script setup>
import { ref, computed, onMounted } from "vue";
import { checkName } from "../libs/checkName.js";
import { useUserStore } from "../stores/user.js";
import {
  authenticateUser,
  registerUser,
  loadUserProfile,
  loadAllUsers,
} from "../libs/fetchUtils.js";
import toasts from "../components/toasts.vue";

const emit = defineEmits(["closeForm"]);
const userStore = useUserStore();
const email = ref("");
const password = ref("");
const userName = ref("");
const showRegister = ref(false);
const showLogin = ref(true);
const showErrorMSG = ref(false);
const showToast = ref(false);
const allUsers = ref([]);

onMounted(async () => {
  allUsers.value = await loadAllUsers();
});

async function Login() {
  const res = await authenticateUser(email.value, password.value);
  if (res) {
    let sessionId = sessionStorage.getItem("id");
    const res = await loadUserProfile(sessionId);
    userStore.setUserProfile(res);
    showLogin.value = false;
    emit("closeForm", false);
  } else {
    showErrorMSG.value = true;
  }
}
async function register() {
  if (
    email.value.length === 0 ||
    password.value.length === 0 ||
    userName.value.length === 0 ||
    checkUserName.value !== "Name validate" ||
    checkPass.value !== "Name validate" ||
    allUsers.value.find((e) => e.email === email.value) !== undefined
  ) {
    showErrorMSG.value = true;
  } else {
    const res = await registerUser({
      userName: userName.value,
      email: email.value,
      password: password.value,
    });
    if (res) {
      showToast.value = true;
      password.value = "";
      showRegister.value = false;
      showLogin.value = true;
    } else {
      showErrorMSG.value = true;
    }
  }
}

function msgColorBinding(msg) {
  if (msg === "Name validate" || msg === "Validate") {
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

const checkUserName = computed(() => checkName([], userName.value));
const checkPass = computed(() =>
  password.value?.length >= 8
    ? /[a-z]/.test(password.value) &&
      /[A-Z]/.test(password.value) &&
      /\d/.test(password.value) &&
      !/[@#$%^&*!]/.test(password.value)
      ? "Validate"
      : "Not Validate"
    : "Not Validate"
);
</script>

<template>
  <!-- Login component -->

  <div
    class="absolute left-0 right-0 m-auto top-0 bg-black h-screen w-screen bg-opacity-50 z-50"
    v-if="showLogin"
  >
    <div class="flex h-full items-center justify-center">
      <!-- Login form -->
      <div
        class="flex flex-wrap content-center justify-center rounded-md bg-white h-3/5 w-[28rem] shadow-md relative"
      >
        <div class="w-full pl-16 pr-16">
          <!-- Heading -->
          <span
            class="absolute right-2 top-2 cursor-pointer text-error text-2xl"
            @click="$emit('closeForm', false)"
            >X</span
          >
          <h1 class="text-xl font-semibold">Welcome back</h1>
          <small class="text-gray-400"
            >Welcome back! Please enter your details</small
          >
          <!-- Form -->
          <div class="mt-4">
            <div class="mb-3">
              <label class="mb-2 block text-xs font-semibold">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                class="block w-full rounded-md border border-gray-300 focus:border-gray focus:outline-none focus:ring-1 focus:ring-gray py-1 px-1.5 text-gray-500"
                v-model="email"
              />
            </div>

            <div class="mb-3">
              <label class="mb-2 block text-xs font-semibold">Password</label>
              <input
                type="password"
                placeholder="*****"
                class="block w-full rounded-md border border-gray-300 focus:border-gray focus:outline-none focus:ring-1 focus:ring-gray py-1 px-1.5 text-gray-500"
                v-model="password"
              />
            </div>

            <div
              class="mb-3 mt-3 m flex flex-wrap content-center justify-center"
            >
              <p class="text-xs font-semibold text-error" v-if="showErrorMSG">
                Enter your password or email again.
              </p>
            </div>

            <div class="mb-3">
              <button
                class="mb-1.5 block w-full text-center text-white bg-error hover:bg-red-500 px-2 py-1.5 rounded-md"
                @click="Login()"
              >
                Sign in
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="text-center">
            <span class="text-xs text-gray-400 font-semibold"
              >Don't have account?</span
            >
            <span
              class="text-xs font-semibold text-error pl-1 cursor-pointer"
              @click="
                (showRegister = true),
                  (showLogin = false),
                  (email = ''),
                  (password = ''),
                  (userName = '')
              "
              >Sign up</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Register component -->

  <div
    class="absolute left-0 right-0 m-auto top-0 bg-black h-screen w-screen bg-opacity-50 z-50"
    v-if="showRegister"
  >
    <div class="flex h-full items-center justify-center">
      <!-- Register form -->
      <div
        class="flex flex-wrap content-center justify-center rounded-md bg-white h-3/5 w-[28rem] shadow-md relative"
      >
        <div class="w-full pl-16 pr-16">
          <span
            class="absolute right-2 top-2 cursor-pointer text-error text-2xl"
            @click="$emit('closeForm', false)"
            >X</span
          >
          <!-- Heading -->
          <h1 class="text-xl font-semibold">Create an account</h1>
          <small class="text-gray-400"
            >Create an account to start your journey</small
          >
          <!-- Form -->
          <div class="mt-4">
            <div class="mb-3 relative">
              <label class="mb-2 block text-xs font-semibold">Username</label>
              <input
                v-model="userName"
                type="text"
                placeholder="Enter your username"
                class="block w-full rounded-md border border-gray-300 focus:border-gray focus:outline-none focus:ring-1 focus:ring-gray py-1 px-1.5 text-gray-500"
                :class="msgColorBinding(checkUserName).inputBinding"
              />
              <div
                class="absolute right-[-1px] top-8 text-xs font-medium p-2"
                :class="msgColorBinding(checkUserName).MsgBinding"
              >
                {{ checkUserName }}
              </div>
            </div>

            <div class="mb-3">
              <label class="mb-2 block text-xs font-semibold">Email</label>
              <input
                v-model="email"
                type="email"
                placeholder="Enter your email"
                class="block w-full rounded-md border border-gray-300 focus:border-gray focus:outline-none focus:ring-1 focus:ring-gray py-1 px-1.5 text-gray-500"
              />
            </div>

            <div class="mb-3 relative">
              <label class="mb-2 block text-xs font-semibold">Password</label>
              <input
                v-model="password"
                type="password"
                placeholder="*****"
                class="block w-full rounded-md border border-gray-300 focus:border-gray focus:outline-none focus:ring-1 focus:ring-gray py-1 px-1.5 text-gray-500"
                :class="msgColorBinding(checkPass).inputBinding"
              />
              <div
                class="absolute right-[-1px] top-8 text-xs font-medium p-2"
                :class="msgColorBinding(checkPass).MsgBinding"
              ></div>
            </div>

            <div class="mb-3">
              <p
                class="text-xs font-semibold text-error"
                v-if="checkPass === 'Not Validate'"
              >
                Your password must be contain <br />
                Upper case , Lower case letter ,<br />
                Digit and Not Special characters @#$%^&*!
              </p>
              <p class="text-xs font-semibold text-error" v-if="showErrorMSG">
                Enter your password or email again.
              </p>
              <button
                class="mb-1.5 block w-full text-center text-white bg-error hover:bg-red-500 px-2 py-1.5 rounded-md"
                @click="register()"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="#app">
    <div
      class="absolute left-[80%] right-0 top-[85%] m-auto transition opacity-100 translate-y-[50px] duration-[400ms] delay-1000 z-50"
      v-show="showToast"
    >
      <toasts toast="success" @close-toast="showToast = false"
        ><template v-slot:message> Register successfully </template>
      </toasts>
    </div>
  </Teleport>
</template>

<style scoped></style>
