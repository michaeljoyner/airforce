<template>
  <div
    class="min-h-full h-screen relative"
    style="transition: background-color 1s;"
    :class="background"
  >
    <transition name="fade">
      <div
        v-if="report"
        class="flex flex-col items-center text-white pt-20 h-full relative"
      >
        <icon-cloud v-if="report.Level === 1"></icon-cloud>
        <icon-breeze v-if="report.Level === 2"></icon-breeze>
        <icon-gas-mask v-if="report.Level === 3"></icon-gas-mask>
        <icon-skull v-if="report.Level === 4"></icon-skull>
        <p class="text-huge">{{ report.Index }}</p>

        <div
          class="absolute bottom-0 w-full pb-16 left-0 right-0 flex items-center flex-col"
        >
          <p class="text-sm mt-20 uppercase">{{ month }}</p>
          <p class="flex items-start">
            <span class="text-5xl font-black">{{ day }}</span>
            <span class="pt-3 pl-1">{{ ordinal }}</span>
          </p>
          <p>{{ time }}</p>
        </div>
      </div>
    </transition>
    <svg
      v-if="waiting"
      class="h-4 spinner text-white absolute top-0 right-0 fill-current m-2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    >
      <path
        d="M17.584 9.372h2a9.554 9.554 0 0 0-.668-2.984L17.16 7.402c.224.623.371 1.283.424 1.97zm-3.483-8.077a9.492 9.492 0 0 0-3.086-.87v2.021a7.548 7.548 0 0 1 2.084.585l1.002-1.736zm2.141 4.327l1.741-1.005a9.643 9.643 0 0 0-2.172-2.285l-1.006 1.742a7.625 7.625 0 0 1 1.437 1.548zm-6.228 11.949a7.6 7.6 0 0 1-7.6-7.6c0-3.858 2.877-7.036 6.601-7.526V.424C4.182.924.414 5.007.414 9.971a9.6 9.6 0 0 0 9.601 9.601c4.824 0 8.807-3.563 9.486-8.2H17.48c-.658 3.527-3.748 6.199-7.466 6.199z"
      />
    </svg>
  </div>
</template>

<script>
import IconBreeze from "./Breeze";
import IconCloud from "./Cloud";
import IconGasMask from "./GasMask";
import IconSkull from "./Skull";
export default {
  components: {
    IconBreeze,
    IconCloud,
    IconGasMask,
    IconSkull,
  },
  data() {
    return {
      report: null,
      last_fetched: null,
      waiting: false,
    };
  },

  computed: {
    month() {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      return months[this.date.getMonth()];
    },

    date() {
      return new Date(this.report.CheckedAt);
    },

    day() {
      return this.date.getDate();
    },

    ordinal() {
      const lookup = {
        1: "st",
        2: "nd",
        3: "rd",
        21: "st",
        22: "nd",
        23: "rd",
        31: "st",
      };

      return Object.keys(lookup).includes(this.date) ? lookup[this.date] : "th";
    },

    time() {
      return this.date.toLocaleTimeString({}, { timeStyle: "short" });
    },

    background() {
      if (!this.report) {
        return "bg-gray-800";
      }

      const levels = {
        1: "bg-blue-500",
        2: "bg-green-500",
        3: "bg-orange-500",
        4: "bg-red-500",
      };

      return levels[this.report.Level];
    },

    recently_fetched() {
      if (!this.last_fetched) {
        return false;
      }

      return (
        new Date().getTime() - this.last_fetched.getTime() < 1000 * 60 * 60
      );
    },
  },

  mounted() {
    this.fetchReport();

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        this.fetchReport();
      }
    });
  },

  methods: {
    fetchReport() {
      if (this.last_fetched && this.recently_fetched) {
        return;
      }

      this.waiting = true;
      fetch("/api/get-aqi")
        .then((res) => res.json())
        .then((data) => {
          this.last_fetched = new Date();
          this.report = data;
        })
        .catch(() => {})
        .then(() => (this.waiting = false));
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.spinner {
  animation-name: spinIt;
  animation-duration: 0.5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes spinIt {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
