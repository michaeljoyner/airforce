<template>
  <div id="app" class="min-h-full font-sans">
    <aqi-report></aqi-report>
  </div>
</template>

<script>
import AqiReport from "./components/AqiReport.vue";

export default {
  name: "App",
  components: {
    AqiReport
  }
};
</script>

<style>
</style>
