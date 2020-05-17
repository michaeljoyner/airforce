<template>
  <div
    class="min-h-full h-screen"
    style="transition: background-color 1s;"
    :class="background"
  >
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
    <div
      class="flex flex-col justify-center items-center text-white pt-20"
    ></div>
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
      today: new Date(),
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
  },

  mounted() {
    this.fetchReport();
  },

  methods: {
    fetchReport() {
      fetch("/api/get-aqi")
        .then((res) => res.json())
        .then((data) => (this.report = data));
    },
  },
};
</script>
