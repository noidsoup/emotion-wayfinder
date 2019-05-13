<template>
  <div class="wat" :style="`background-color: ${color}; height: 100vh`">
    <div class="center-content page-container" >
      <div style="position: relative; margin: 20px;">
        <video @playing="onPlay" id="inputVideo" width="800" autoplay muted></video>
        <canvas id="overlay" />
      </div>
      <h1>{{seconds}}</h1>
    </div>
  </div>
</template>

<script>
import * as faceapi from 'face-api.js';

export default {
  name: 'Camera',
  data() {
    return {
      recordedEmotions: [],
      maxEmotionsCount: 20,
      color: 'black',
      seconds: 0,
    };
  },
  watch: {
    recordedEmotions(emotions) {
      // eslint-disable-next-line
      if (emotions.length === this.maxEmotionsCount) {
        this.analyzeEmotions(emotions);
      }
    },
  },
  methods: {
    onPlay() {
      const videoEl = document.getElementById('inputVideo');
      const overlay = document.getElementById('overlay');

      // tiny_face_detector options
      const inputSize = 512;
      const scoreThreshold = 0.5;

      if (videoEl.paused || videoEl.ended) {
        return setTimeout(() => this.onPlay());
      }

      const getFaceDetectorOptions = () =>
        new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
      const options = getFaceDetectorOptions();
      const getResults = async () => {
        const result = await faceapi.detectSingleFace(videoEl, options).withFaceExpressions();
        if (result) {
          this.drawExpressions(videoEl, overlay, [result]);
        }
        setTimeout(() => this.onPlay());
      };

      return getResults();
    },
    setColor(emotion) {
      this.$store.commit('setEmotion', emotion);
      if (this.seconds >= 30) {
        this.$router.push('results');
      }
    },
    resizeCanvasAndResults(dimensions, canvas, results) {
      const { width, height } = dimensions instanceof HTMLVideoElement
        ? faceapi.getMediaDimensions(dimensions)
        : dimensions;
      // eslint-disable-next-line
      canvas.width = width;
      // eslint-disable-next-line
      canvas.height = height;

      // resize detections (and landmarks) in case displayed image is smaller than
      // original size
      return faceapi.resizeResults(results, { width, height });
    },
    analyzeEmotions() {
      let totalEmotions = [];
      this.recordedEmotions.forEach((arr) => {
        totalEmotions = totalEmotions.concat(arr);
      });
      const reducedEmotion = totalEmotions.reduce(
        // eslint-disable-next-line
        (max, emotion) => max && max.probability > emotion.probability ? max : emotion, null,
      );
      this.setColor(reducedEmotion.expression);
      this.recordedEmotions = [];
      // eslint-disable-next-line
    },
    drawExpressions(dimensions, canvas, faceAndEmotionDetection) {
      if (this.recordedEmotions.length < this.maxEmotionsCount
          && faceAndEmotionDetection[0].expressions !== undefined) {
        this.recordedEmotions.push(faceAndEmotionDetection[0].expressions);
      }
      const resizedResults =
        this.resizeCanvasAndResults(dimensions, canvas, faceAndEmotionDetection);
      const emotionGenerator = emotion => emotion;
      faceapi.drawFaceExpressions(
        canvas,
        resizedResults
          .map(({ detection, expressions }) => (
            emotionGenerator({ position: detection.box, expressions })),
          ));
    },
  },
  mounted() {
    const getCurrentFaceDetectionNet = () => faceapi.nets.tinyFaceDetector;

    const run = async () => {
      // load face detection and face expression recognition models
      await getCurrentFaceDetectionNet().load('/static/weights');
      await faceapi.loadFaceExpressionModel('/static/weights');
      // try to access users webcam and stream the images to video element
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      const videoEl = document.getElementById('inputVideo');
      videoEl.srcObject = stream;
    };
    run();
    setInterval(() => {
      this.seconds = this.seconds + 1;
    }, 1000);
  },
};
</script>

<style scoped>
.page-container {
  left: 0;
  right: 0;
  margin: auto;
  margin-top: 20px;
  padding-left: 280px;
  display: inline-flex !important;
}

@media only screen and (max-width : 992px) {
  .page-container {
    padding-left: 0;
    display: flex !important;
  }
}

.center-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

#overlay, .overlay {
  position: absolute;
  top: 0;
  left: 0;
}

#facesContainer canvas {
  margin: 10px;
}

.wat {
  -moz-transition: background-color 3s ease-in;
  -o-transition: background-color 3s ease-in;
  -webkit-transition: background-color 3s ease-in;
  transition: background-color 3s ease-in;
}

</style>
