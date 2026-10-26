<script setup>
import CardBase from "../components/cardBase.vue";
import { ref } from "vue";
import bearButton from "../components/bearButton.vue";
const members = [
  {
    id: "65130500010",
    name: "Jiranan Yenlab",
    task: "?",
    github: "https://github.com/jirananyenlab",
    image: "/images/CreditProfile/jiranan.png",
  },
  {
    id: "65130500012",
    name: "Jhatnipat Sarakal",
    task: "?",
    github: "https://github.com/Jhatniphat",
    image: "/images/CreditProfile/Jhatniphat.png",
  },
  {
    id: "65130500042",
    name: "Porama Jirasupadilok",
    task: "?",
    github: "https://github.com/FocusXis",
    image: "/images/CreditProfile/Porama.png",
  },
  {
    id: "65130500054",
    name: "Phuttinan Phaksawaeng",
    task: "?",
    github: "https://github.com/GodeFvt",
    image: "/images/CreditProfile/putthinnan.png",
  },
  {
    id: "65130500063",
    name: "Pumrapee Chaisa",
    task: "?",
    github: "https://github.com/Pumrapee",
    image: "/images/CreditProfile/pumrapee.png",
  },
];

const selectedMember = ref({});
const showDetails = ref(false);
</script>
<template>
  <div class="h-full flex items-center justify-center">
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      style="width: 50%"
    >
      <div v-for="(member, index) in members" :key="index" class="p-4">
        <div
          class="bg-white rounded-lg shadow-md p-6 cursor-pointer"
          @click="(showDetails = true), (selectedMember = member)"
        >
          <div class="text-center mb-2">
            <img
              :src="member.image"
              class="w-32 h-32 rounded-full mx-auto object-cover"
              alt="Profile Image"
            />
          </div>
          <h3 class="text-xl font-bold text-center mb-2">{{ member.id }}</h3>
          <p class="text-center text-gray-500">{{ member.name }}</p>
        </div>
      </div>
    </div>
  </div>

  <div
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
    v-if="showDetails === true"
  >
    <CardBase
      :forLabel="'card-base'"
      :styles="'profile'"
      height="h-[30rem]"
      width="w-[40rem]"
    >
      <template #detail>
        <div class="flex flex-col space-y-10">
          <div>
            <img
              :src="selectedMember.image"
              alt="Profile Image"
              class="w-40 h-40 rounded-full mx-auto object-cover"
            />
          </div>
          <div class="mt-4">
            <h2 class="text-xl font-bold">{{ selectedMember.name }}</h2>
            <p class="mt-2 text-gray-700">Task: {{ selectedMember.task }}</p>
            <a
              :href="selectedMember.github"
              class="text-blue-500 hover:underline"
              >{{ selectedMember.github }}</a
            >
          </div>
          <button
            class="btn hover:bg-red-300 active:bg-red-700"
            @click="showDetails = false"
          >
            Close
          </button>
        </div>
      </template>
    </CardBase>
  </div>

  <router-link to="/">
    <div class="left-2 bottom-1 absolute scale-[70%] mobile-back-btn">
      <div class="group/bear relative place-content-center cursor-pointer">
        <bearButton text="back"> </bearButton>
      </div>
    </div>
  </router-link>
</template>

<style scoped></style>
