<script setup>
import cardBase from "../components/cardBase.vue";
import modal from "../components/modal.vue";
import AuthenticationForm from "./AuthenticationForm.vue";
import { useUserStore } from "../stores/user";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();

const showLoginForm = ref(false);
const showLoginModal = ref(false);
const LoginModalMSG = ref("");
let wantTo = "";

function routeTo(to) {
  wantTo = to;
  const isLoggedIn = useUserStore().isLoggedIn;
  if (isLoggedIn) {
    router.push(`${to}`);
  } else {
    switch (to) {
      case "/campaign":
        LoginModalMSG.value =
          "Achievement จะไม่ถูกบันทึก เพราะคุณยังไม่ได้ Login คุณต้องการจะ Login หรือไม่";
        break;
      case "/competitive":
        LoginModalMSG.value =
          "คะแนนของคุณจะไม่ถูกบันทึกใน leaderboard เพราะคุณยังไม่ได้ Login คุณต้องการจะ Login หรือไม่";
        break;
      case "/custom":
        LoginModalMSG.value =
          "Custom Level ที่คุณสร้างจะไม่ถูกบันทึก เพราะคุณยังไม่ได้ Login คุณต้องการจะ Login หรือไม่";
        break;
    }
    showLoginModal.value = true;
  }
}

function Login(wantLogin) {
  showLoginModal.value = false;
  if (wantLogin) showLoginForm.value = true;
  else {
    router.push(wantTo);
  }
}
</script>

<template>
  <div>
    <h1
      class="font-extrabold text-9xl text-yellow-100 drop-shadow-xl mobile-text-xl text-center font-fc-Candy tracking-widest"
    >
      MATH RAINING
    </h1>
  </div>
  <!-- Mode select -->
  <div class="flex gap-3 flex-col justify-center items-center flex-wrap">
    <!-- Btn Campaign Mode-->

    <div @click="routeTo('/campaign')">
      <cardBase forLabel="campaign" styles="mode" height="h-10" width="w-80">
        <template #input
          ><input type="radio" id="campaign" class="peer hidden"
        /></template>
        <template #name>Campaign</template>
      </cardBase>
    </div>

    <!-- Btn Competitive Mode -->
    <div @click="routeTo('/competitive')">
      <cardBase forLabel="competitive" styles="mode" height="h-10" width="w-80">
        <template #input
          ><input type="radio" id="competitive" class="peer hidden"
        /></template>
        <template #name>Competitive</template>
      </cardBase>
    </div>

    <!-- Btn Custom -->
    <div @click="routeTo('/custom')">
      <div>
        <cardBase forLabel="custom" styles="mode" height="h-10" width="w-80">
          <template #input
            ><input type="radio" id="custom" class="peer hidden"
          /></template>
          <template #name>Custom</template>
        </cardBase>
      </div>
    </div>

    <!-- Btn Tutorial -->
    <router-link to="/tutorial">
      <div>
        <cardBase forLabel="tutorial" styles="mode" height="h-10" width="w-80">
          <template #input>
            <input type="radio" id="tutorial" class="peer hidden"
          /></template>
          <template #name>Tutorial</template>
        </cardBase>
      </div>
    </router-link>

    <!-- Btn Credit -->
    <router-link to="/credit">
      <div>
        <cardBase forLabel="credit" styles="mode" height="h-10" width="w-80">
          <template #input>
            <input type="radio" id="credit" class="peer hidden"
          /></template>
          <template #name>Credit</template>
        </cardBase>
      </div>
    </router-link>
  </div>

  <modal type="login" @user-action="Login" v-if="showLoginModal" class="z-50">
    <template #text>{{ LoginModalMSG }}</template>
    <template #Ok>Login</template>
    <template #cancel>No</template>
  </modal>

  <AuthenticationForm
    v-if="showLoginForm"
    @close-form="showLoginForm = false"
  />
</template>

<style></style>
