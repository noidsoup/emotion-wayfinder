<template>
  <div
    class="intro"
    @click="$router.push('tell-me-about-it');">
    Click the page, then look directly into the camera and tell me about your day.
  </div>
</template>

<script>
export default {
  name: 'Intro',
};
</script>

<style scoped>
.intro {
  padding-top: 5em;
  height: 100vh;
}
</style>
