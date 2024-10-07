<script setup>
import { ref, computed } from "vue";
import {
  getItemsOfCurrentPage,
  getTotalPages,
  getPageToShow,
} from "../libs/paginate.js";
defineEmits(["closeList"]);
const props = defineProps({
  displayEquation: {
    type: Array,
    required: true,
  },
});
const listAllEquation = ref(props.displayEquation);
const currentPage = ref(1);
const rowPerPage = ref(5);
const paginated = computed(() => {
  return getItemsOfCurrentPage(
    listAllEquation.value,
    currentPage.value,
    rowPerPage.value
  );
});

const allPage = getTotalPages(listAllEquation.value, rowPerPage.value);

const showPageBtn = computed(() => {
  return getPageToShow(allPage, currentPage.value, 3);
});
</script>

<template>
  <div class="bg-slate-50 rounded-md p-5 w-full h-full">
    <!-- <p class="text-red-600 text-right font-bold p-2 " @click="$emit('closeList', false)"> X </p>
    <h2 class="text-lg font-bold mb-2">List of Equations</h2> -->
    <div class="flex">
      <h2 class="text-lg font-bold mb-2 p-2">List of Equations</h2>
      <div class="grow">
        <p
          class="text-red-600 text-right font-bold p-2 cursor-pointer float-right w-fit"
          @click="$emit('closeList', false)"
        >
          X
        </p>
      </div>
    </div>

    <table class="table-auto w-full mb-4">
      <tr>
        <th colspan="2">Equation</th>
        <th>Answer</th>
      </tr>
      <tr v-for="(equation, index) in paginated" :key="index">
        <td> Q: </td>
        <td>  {{ equation.expression }}  </td>
        <td :class="equation.isCorrect ? 'text-success' : 'text-error'">  {{ equation.isCorrect ? "Correct" : "InCorrect" }} : {{ equation.result }} </td>
      </tr>
    </table>
     <p v-if="paginated.length===0" class="text-center text-zinc-400 text-3xl">No Target</p>
    <div
      class="flex justify-center m-0 justify-self-center p-0"
      v-show="paginated.length !== 0"
    >
      <button
        @click="currentPage > 1 ? currentPage-- : (currentPage = currentPage)"
        :disabled="currentPage === 1"
        class="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded"
      >
        Prev
      </button>
      <button
        v-for="(pages, index) in showPageBtn"
        :key="index"
        @click="currentPage = pages"
        class="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded"
      >
        {{ pages }}
      </button>
      <button
        @click="
          currentPage < allPage ? currentPage++ : (currentPage = currentPage)
        "
        :disabled="currentPage === allPage"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded"
      >
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
  td{
    text-align: center;
  }
</style>

