<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});

function bindingClass(text) {
  if (text === "start") {
    return {
      earOut: "bg-rose-600",
      earIn: "bg-yellow-200",
      bg: "bg-gradient-to-b from-rose-500 to-pink-400",
    };
  } else if (text === "retry") {
    return {
      earOut: "bg-yellow-500",
      earIn: "bg-rose-600",
      bg: "bg-gradient-to-b from-amber-400 to-yellow-200",
    };
  } else {
    return {
      earOut: "bg-purple-700",
      earIn: "bg-yellow-300",
      bg: "bg-gradient-to-b from-purple-500 to-fuchsia-400",
    };
  }
}
</script>

<template>
  <div v-if="text !== 'back'">
    <div class="flex gap-2 z-20">
      <div
        class="w-1/4 h-6 rounded-t-3xl -rotate-45 relative top-[2rem] z-0 left-[0.1rem]"
        :class="bindingClass(text).earOut"
      ></div>
      <div
        class="w-1/4 h-6 rounded-t-3xl rotate-45 relative top-[2rem] z-0 left-[4rem]"
        :class="bindingClass(text).earOut"
      ></div>
      <div
        class="w-1/4 h-6 rounded-t-3xl -rotate-45 relative scale-50 z-0 top-[2rem] left-[-4.25rem]"
        :class="bindingClass(text).earIn"
      ></div>
      <div
        class="w-1/4 h-6 rounded-t-3xl rotate-45 relative z-0 scale-50 top-[31px] left-[0px]"
        :class="bindingClass(text).earIn"
      ></div>
    </div>
    <div
      class="group/text inline-flex flex-shrink-0 justify-center items-center flex-wrap z-30"
    >
      <button
        class="relative h-32 w-32 cursor-pointer select-none rounded-full"
        :class="bindingClass(text).bg"
      ></button>
      <div
        class="absolute m-0 p-0 font-bold text-2xl font-sans group-hover/text:-translate-y-10 transition group-hover/text:duration-700 group-hover/text:opacity-0 z-0"
        :class="text === 'retry' ? 'text-rose-500' : 'text-yellow-300 '"
      >
        {{ props.text }}
      </div>

      <div
        class="opacity-0 scale-50 absolute group-hover/bear:-translate-y-6 transition group-hover/bear:duration-1000 group-hover/bear:opacity-100 m-0 p-0 left-[-2.75rem] top-[4rem] cursor-pointer z-0"
      >
        <svg
          width="225"
          height="106"
          viewBox="0 0 225 106"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="72"
            cy="15.5"
            rx="13"
            ry="15.5"
            fill="#1D1C1C"
            class="group-active/bear:opacity-0"
          />
          <ellipse
            cx="144"
            cy="15.5"
            rx="13"
            ry="15.5"
            fill="#1D1C1C"
            class="group-active/bear:opacity-0"
          />
          <g filter="url(#filter0_f_50_23)">
            <path
              d="M56 60C56 66.6274 50.1797 72 43 72C35.8203 72 30 66.6274 30 60C30 53.3726 35.8203 48 43 48C50.1797 48 56 53.3726 56 60Z"
              :fill="text === 'retry' ? '#FF547D' : '#FFF500'"
            />
            <path
              d="M55.5 60C55.5 66.3143 49.942 71.5 43 71.5C36.058 71.5 30.5 66.3143 30.5 60C30.5 53.6857 36.058 48.5 43 48.5C49.942 48.5 55.5 53.6857 55.5 60Z"
              :stroke="text === 'retry' ? '#FFD703' : '#FFD80B'"
            />
          </g>
          <g filter="url(#filter1_f_50_23)">
            <path
              d="M195 60C195 66.6274 189.18 72 182 72C174.82 72 169 66.6274 169 60C169 53.3726 174.82 48 182 48C189.18 48 195 53.3726 195 60Z"
              :fill="text === 'retry' ? '#FF547D' : '#FFF500'"
              style="mix-blend-mode: hard-light"
            />
            <path
              d="M194.5 60C194.5 66.3143 188.942 71.5 182 71.5C175.058 71.5 169.5 66.3143 169.5 60C169.5 53.6857 175.058 48.5 182 48.5C188.942 48.5 194.5 53.6857 194.5 60Z"
              :stroke="text === 'retry' ? '#FFD703' : '#FFD80B'"
            />
          </g>
          <path
            d="M59.0933 85C79.1206 110.474 89.347 109.873 106 85.2338"
            stroke="black"
            stroke-width="4"
          />
          <path
            d="M106.093 85C126.121 110.474 136.347 109.873 153 85.2338"
            stroke="black"
            stroke-width="4"
          />
          <path
            d="M110.678 69.6463C108.703 72.6503 104.297 72.6503 102.322 69.6463L93.8405 56.747C91.6543 53.4223 94.0391 49 98.0182 49H114.982C118.961 49 121.346 53.4223 119.16 56.747L110.678 69.6463Z"
            fill="black"
          />
          <line
            x1="106.5"
            y1="71"
            x2="106.5"
            y2="86"
            stroke="black"
            stroke-width="5"
          />
          <defs>
            <filter
              id="filter0_f_50_23"
              x="0"
              y="18"
              width="86"
              height="84"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="15"
                result="effect1_foregroundBlur_50_23"
              />
            </filter>
            <filter
              id="filter1_f_50_23"
              x="139"
              y="18"
              width="86"
              height="84"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="15"
                result="effect1_foregroundBlur_50_23"
              />
            </filter>
          </defs>
        </svg>
      </div>
      <div class="opacity-0 group-active/bear:opacity-100">
        <div class="top-[0.85rem] left-[1rem] absolute">
          <svg
            width="50px"
            height="115px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 10 L16 13 L 7 17 "
              stroke="#000000"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </div>
        <div class="top-[1.2rem] left-[4rem] absolute rotate-180">
          <svg
            width="50px"
            height="115px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 10 L16 13 L 7 17 "
              stroke="#000000"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="text === 'back'">
    <div class="flex gap-2 z-20">
      <div
        class="w-1/4 h-6 bg-gray-700 rounded-t-3xl -rotate-45 relative top-[2rem] z-0 left-[0.1rem]"
      ></div>
      <div
        class="w-1/4 h-6 bg-gray-700 rounded-t-3xl rotate-45 relative top-[2rem] z-0 left-[4rem]"
      ></div>
      <div
        class="w-1/4 h-6 bg-yellow-100 rounded-t-3xl -rotate-45 relative scale-50 z-0 top-[2rem] left-[-4.25rem]"
      ></div>
      <div
        class="w-1/4 h-6 bg-yellow-100 rounded-t-3xl rotate-45 relative z-0 scale-50 top-[31px] left-[0px]"
      ></div>
    </div>
    <div
      class="group/text inline-flex flex-shrink-0 justify-center items-center flex-wrap z-30"
    >
      <button
        class="relative h-32 w-32 cursor-pointer select-none rounded-full bg-gradient-to-b from-gray-500 to-slate-400"
      ></button>
      <div
        class="absolute m-0 p-0 font-bold text-2xl font-sans text-yellow-100 group-hover/text:-translate-y-10 transition group-hover/text:duration-700 group-hover/text:opacity-0 z-0"
      >
        {{ props.text }}
      </div>

      <div
        class="opacity-0 scale-50 absolute group-hover/bear:-translate-y-6 transition group-hover/bear:duration-1000 group-hover/bear:opacity-100 m-0 p-0 left-[-2.75rem] top-[4rem] cursor-pointer z-0"
      >
        <svg
          width="225"
          height="108"
          viewBox="0 0 225 108"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M85.3855 13.1403C83.6893 21.531 77.2976 26.2985 70.2602 24.8759C63.2229 23.4533 58.2048 16.3792 59.901 7.98853C61.5972 -0.402151 67.191 1.30039 74.2284 2.72301C81.2657 4.14563 87.0817 4.74961 85.3855 13.1403Z"
            fill="#1D1C1C"
          />
          <path
            d="M156.071 8.84838C157.767 17.239 153.73 24.1151 146.692 25.5379C139.655 26.9607 132.283 22.3915 130.587 14.0008C128.89 5.61018 134.706 5.00605 141.743 3.58324C148.781 2.16044 154.375 0.457745 156.071 8.84838Z"
            fill="#1D1C1C"
          />
          <g filter="url(#filter0_f_114_16)">
            <path
              d="M56 55C56 61.6274 50.1797 67 43 67C35.8203 67 30 61.6274 30 55C30 48.3726 35.8203 43 43 43C50.1797 43 56 48.3726 56 55Z"
              fill="#FCFCFC"
            />
            <path
              d="M55.5 55C55.5 61.3143 49.942 66.5 43 66.5C36.058 66.5 30.5 61.3143 30.5 55C30.5 48.6857 36.058 43.5 43 43.5C49.942 43.5 55.5 48.6857 55.5 55Z"
              stroke="#F4F4F4"
            />
          </g>
          <g filter="url(#filter1_f_114_16)">
            <path
              d="M195 55C195 61.6274 189.18 67 182 67C174.82 67 169 61.6274 169 55C169 48.3726 174.82 43 182 43C189.18 43 195 48.3726 195 55Z"
              fill="#FCFCFC"
              style="mix-blend-mode: hard-light"
            />
            <path
              d="M194.5 55C194.5 61.3143 188.942 66.5 182 66.5C175.058 66.5 169.5 61.3143 169.5 55C169.5 48.6857 175.058 43.5 182 43.5C188.942 43.5 194.5 48.6857 194.5 55Z"
              stroke="#F4F4F4"
            />
          </g>
          <path
            d="M110.678 64.6463C108.703 67.6503 104.297 67.6503 102.322 64.6463L93.8405 51.747C91.6543 48.4223 94.0391 44 98.0182 44H114.982C118.961 44 121.346 48.4223 119.16 51.747L110.678 64.6463Z"
            fill="black"
          />
          <line
            x1="106.5"
            y1="66"
            x2="106.5"
            y2="81"
            stroke="black"
            stroke-width="5"
            class="group-active/bear:opacity-0"
          />
          <path
            d="M131.79 105.754L105.5 78.5"
            stroke="black"
            stroke-width="5"
            class="group-active/bear:opacity-0"
          />
          <line
            x1="105.818"
            y1="79.7455"
            x2="80.7898"
            y2="105.409"
            stroke="black"
            stroke-width="5"
            class="group-active/bear:opacity-0"
          />
          <defs>
            <filter
              id="filter0_f_114_16"
              x="0"
              y="13"
              width="86"
              height="84"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="15"
                result="effect1_foregroundBlur_114_16"
              />
            </filter>
            <filter
              id="filter1_f_114_16"
              x="139"
              y="13"
              width="86"
              height="84"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="15"
                result="effect1_foregroundBlur_114_16"
              />
            </filter>
          </defs>
        </svg>
      </div>
      <div class="opacity-0 group-active/bear:opacity-100">
        <div class="top-[6.2rem] left-[1.5rem] absolute scale-50">
          <svg
            width="79"
            height="38"
            viewBox="0 0 79 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10 7.91667L20 0L30 7.91667L40 0L50 7.91667L59 0L70 7.91667L79 0V19.3958V38L70 30L59 38L50 30L40 38L30 30L20 38L10 30L0 38V0L10 7.91667Z"
              fill="black"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: sunny-spells;
  letter-spacing: 0.15rem;
  text-wrap: nowrap;
}
</style>
