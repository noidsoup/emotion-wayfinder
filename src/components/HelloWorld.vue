<template>
  <div class="center-content page-container">
    <div style="position: relative; margin: 20px;">
      <video @playing="onPlay" id="inputVideo" autoplay muted></video>
      <canvas id="overlay" :height="height" :width="width"/>
    </div>
  </div>
</template>

<script>
import * as faceapi from 'face-api.js';

export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      selectedFaceDetector: null,
      width: null,
      height: null,
    };
  },
  methods: {
    onPlay() {
      const videoEl = document.getElementById('inputVideo');
      const overlay = document.getElementById('overlay');
      const withBoxes = true;
      const SELF = this;

      // tiny_face_detector options
      const inputSize = 512;
      const scoreThreshold = 0.5;

      if (videoEl.paused || videoEl.ended || !this.isFaceDetectionModelLoaded()) {
        return setTimeout(() => this.onPlay());
      }

      function getFaceDetectorOptions() {
        return new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
      }
      const options = getFaceDetectorOptions();
      async function getResults() {
        const result = await faceapi.detectSingleFace(videoEl, options).withFaceExpressions();
        if (result) {
          SELF.drawExpressions(videoEl, overlay, [result], withBoxes);
        }
        setTimeout(() => SELF.onPlay());
      }

      return getResults();
    },
    resizeCanvasAndResults(dimensions, canvas, results) {
      const { width, height } = dimensions instanceof HTMLVideoElement
        ? faceapi.getMediaDimensions(dimensions)
        : dimensions;
      this.width = width;
      this.height = height;

      // resize detections (and landmarks) in case displayed image is smaller than
      // original size
      return faceapi.resizeResults(results, { width, height });
    },
    drawExpressions(dimensions, canvas, faceAndEmotionDetection) {
      const resizedResults =
        this.resizeCanvasAndResults(dimensions, canvas, faceAndEmotionDetection);
      function emotionGenerator(emotion) {
        return emotion;
      }
      faceapi.drawFaceExpressions(
        canvas,
        resizedResults
          .map(({ detection, expressions }) => (
            emotionGenerator({ position: detection.box, expressions })),
          ));
    },
    isFaceDetectionModelLoaded() {
      return !!this.getCurrentFaceDetectionNet().params;
    },
    getCurrentFaceDetectionNet() {
      return faceapi.nets.tinyFaceDetector;
    },
  },
  mounted() {
    const TINY_FACE_DETECTOR = 'tiny_face_detector';
    this.selectedFaceDetector = TINY_FACE_DETECTOR;
    const SELF = this;

    function isFaceDetectionModelLoaded() {
      return !!SELF.getCurrentFaceDetectionNet().params;
    }

    async function changeFaceDetector() {
      if (!isFaceDetectionModelLoaded()) {
        await SELF.getCurrentFaceDetectionNet().load('/static/weights');
      }
    }

    async function run() {
      // load face detection and face expression recognition models
      SELF.selectedFaceDetector = TINY_FACE_DETECTOR;
      await changeFaceDetector(TINY_FACE_DETECTOR);
      await faceapi.loadFaceExpressionModel('/static/weights');
      // try to access users webcam and stream the images
      // to the video element
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      const videoEl = document.getElementById('inputVideo');
      videoEl.srcObject = stream;
    }
    run();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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

#navbar {
  position: absolute;
  top: 20px;
  left: 20px;
}

.center-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.side-by-side {
  display: flex;
  justify-content: center;
  align-items: center;
}
.side-by-side >* {
  margin: 0 5px;
}

.bold {
  font-weight: bold;
}

.margin-sm {
  margin: 5px;
}

.margin {
  margin: 20px;
}

.button-sm {
  padding: 0 10px !important;
}

.pad-sides-sm {
  padding: 0 8px !important;
}

#overlay, .overlay {
  position: absolute;
  top: 0;
  left: 0;
}

#facesContainer canvas {
  margin: 10px;
}
</style>
