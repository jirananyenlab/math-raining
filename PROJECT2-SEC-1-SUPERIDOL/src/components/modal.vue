<script setup>
defineEmits(["userAction"]);
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
  },
});

const styleBinding = (type) => {
  switch (type) {
    case "edit":
      return {
        OK: "text-white bg-amber-400 hover:bg-amber-700 ocus:ring-amber-300 dark:focus:ring-amber-800",
        Cancel:
          "text-white bg-red-600 hover:bg-red-700 ocus:ring-red-300 dark:focus:ring-red-800",
      };
    case "delete":
      return {
        OK: "text-white bg-red-600 hover:bg-red-700 ocus:ring-red-300 dark:focus:ring-red-800",
        Cancel:
          "text-white bg-sky-500 hover:bg-sky-600 ocus:sky-sky-300 dark:focus:ring-sky-800 hover:bg-sky-600",
      };
    case "login":
      return {
        OK: "text-white bg-green-400 hover:bg-green-500 ocus:ring-green-300 dark:focus:ring-green-600",
        Cancel:
          "text-white bg-sky-500 hover:bg-sky-600 ocus:sky-sky-300 dark:focus:ring-sky-800 hover:bg-sky-600",
      };
  }
};
</script>

<template>
  <div class="flex absolute m-auto top-1/3 right-0 left-0 z-50">
    <div
      id="popup-modal"
      class="overflow-y-auto overflow-x-hidden flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div class="relative p-4 w-full max-w-md max-h-full">
        <div class="relative bg-white rounded-lg shadow dark:bg-teal-50">
          <button
            type="button"
            class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-600 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-400 dark:hover:text-white"
            data-modal-hide="popup-modal"
            @click="$emit('userAction', false)"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <div class="p-4 md:p-5 text-center">
            <svg
              class="mx-auto mb-4 text-gray-600 w-12 h-12 dark:text-gray-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3
              class="mb-5 text-lg font-normal text-gray-900 dark:text-gray-800"
            >
              <slot name="text"></slot>
            </h3>
            <button
              type="button"
              class="focus:ring-4 focus:outline-none f font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              :class="styleBinding(type).OK"
              @click="$emit('userAction', true, index)"
            >
              <slot name="Ok"></slot>
            </button>
            <button
              type="button"
              class="py-2.5 px-5 ms-3 text-sm font-medium focus:outline-none rounded-lg border focus:z-10 focus:ring-4"
              :class="styleBinding(type).Cancel"
              @click="$emit('userAction', false)"
            >
              <!-- Cancel -->
              <slot name="cancel"></slot>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
