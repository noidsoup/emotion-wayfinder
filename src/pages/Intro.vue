<template>
  <div
    class="intro"
  >
    <h1>How are you doin'</h1>
    <p>Click the button below, then look directly into the camera and tell me about your day.</p>
    <button class="button-swag" @click="$router.push('tell-me-about-it');">Proceed</button>
  </div>
</template>

<script>
export default {
  name: 'Intro',
  mounted() {
    const run = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoEl = document.createElement('video');
      videoEl.srcObject = stream;

      if (stream.MediaStream) {
        this.$router.push('tell-me-about-it');
      }
    };

    run();
  },
};
</script>

<style scoped>
.intro {
  padding-top: 5em;
  height: 100vh;
}

.button-swag {
  color: #fff !important;
  text-transform: uppercase;
  background: #60a3bc;
  padding: 20px;
  border-radius: 50px;
  display: inline-block;
  border: none;
  margin-top: 1em;
}

.button-swag:hover {
  text-shadow: 0px 0px 6px rgba(255, 255, 255, 1);
  -webkit-box-shadow: 0px 5px 40px -10px rgba(255, 255, 255,0.57);
  -moz-box-shadow: 0px 5px 40px -10px rgba(255, 255, 255,0.57);
  transition: all 0.3s ease 0s;
}
</style>
