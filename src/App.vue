<script setup>
import { ref } from "vue";
import navBar from "./components/navBar.vue";
const IsPlaying = ref(false);
</script>

<template>
  <div
    class="flex flex-col gap-3 bg-gradient-to-b from-blue-200 h-svh to-pink-200 text-base-content"
    @click.once="IsPlaying = true"
  >
    <!-- Setting -->
    <navBar :musicIsPlaying="IsPlaying" />
    <router-view />
  </div>
</template>

<style>
* {
  font-family: itim;
  letter-spacing: 0.1rem;
  /* text-wrap: nowrap; */
}

.hw {
  height: 100%;
  width: 90%;
}

/* browser responsive */
@media not all and (min-height: 850px) {
  .minh-600-maxh-800 {
    height: 35%;
  }

  .lg-h-Level-Selector {
    /* h-[12rem] w-[12rem]*/
    /* height: 11rem;
    width: 13rem; */
    height: 9rem;
    width: 11rem;
  }

  .lg-h-Level-Selector-height {
    height: 9rem;
  }

  .lg-h-Level-Selector-width {
    width: 11rem;
  }

  .lg-h-Level-Selector > div > .level-info {
    font-size: small;
    text-wrap: nowrap;
  }

  .lg-h-Level-Selector > div > .delete-btn {
    right: -10px;
    bottom: -10px;
  }
}

/* mobile responsive */
@media not all and (min-width: 500px) {
  .mobile-text-xl {
    font-size: 3rem;
  }

  .mobile-LevelMode-Selector {
    height: 10rem;
    width: 10rem;
  }

  .mobile-Level-Selector {
    height: 3rem;
    width: 6rem;
  }

  .mobile-Level-Selector > div > .level-info {
    font-size: x-small;
    text-wrap: wrap;
  }

  .mobile-Level-Selector > div > .delete-btn {
    right: -5px;
    bottom: 15px;
  }

  .mobile-back-btn {
    left: 0%;
    bottom: 0%;
    transform: scale(50%);
  }
}

/* ipad responsive */
@media not all and (min-width: 800px) {
  .ipad-delete-btn {
    right: -10px;
    bottom: 15px;
  }
}

/* cloud transition */
.slide-fade-cloud-left-enter-active,
.slide-fade-cloud-right-enter-active {
  transition: all 2s ease-out;
}

.slide-fade-cloud-left-leave-active,
.slide-fade-cloud-right-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-cloud-left-enter-from,
.slide-fade-cloud-left-leave-to {
  transform: translateX(40px);
  opacity: 0;
}

.slide-fade-cloud-right-enter-from,
.slide-fade-cloud-right-leave-to {
  transform: translateX(-40px);
  opacity: 0;
}

/* page fade transition */
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

.page-fade-enter-to,
.page-fade-leave-from {
  opacity: 100%;
}

.page-fade-enter-active {
  transition: all 1s ease-out;
}
</style>