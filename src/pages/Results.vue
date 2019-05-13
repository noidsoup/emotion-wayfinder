<template>
  <div>
    overall, you seem
    <h1>{{$store.state.emotion}}</h1>
    <div id="container">
      <!-- <img class='img' width="500" src="../assets/Exhibit-Hall-map.jpg" alt="" /> -->
      <canvas id="gameCanvas" width="500"></canvas>
    </div>
  </div>
</template>

<script>
import dotPlacement from '../../dot-placement.json';

export default {
  name: 'Results',
  mounted() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 320;
    canvas.height = 480;
    const x = dotPlacement.emotions[this.$store.state.emotion].placement.x;
    const y = dotPlacement.emotions[this.$store.state.emotion].placement.y;
    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, 20, 20);
  },
};
</script>

<style>
.img {
  position:absolute;z-index:1;
}

#container {
  display:inline-block;
  width:500px;
  height: 600px;
  margin: 0 auto;
  margin-top: 100px;
  background-image: url('../assets/Exhibit-Hall-map.jpg');
  position:relative;
  border:5px solid black;
  background-repeat: round;
  border-radius: 10px;
  box-shadow: 0 5px 20px #333
}

#gameCanvas{
  position:relative;
  z-index:20;
}
</style>
