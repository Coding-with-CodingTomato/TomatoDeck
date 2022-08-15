<template>
  <div class="slider">
    <div class="content">
      <input class="sliderInput" type="range" min="0" max="100" />
      <b>Test</b>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.slider {
  width: 13vw;
  height: 26vw;

  display: flex;
  justify-content: center;
  align-items: center;
  grid-column: span 1;
  grid-row: span 2;

  border-radius: 5px;
  background-color: black;
  font-size: 15pt;
  font-weight: bold;
  text-align: center;
  overflow: hidden;
}

.content {
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-rows: 80% auto;
  justify-content: center;
  align-items: center;
}
.sliderInput {
  -webkit-appearance: none;
  width: 150%;
  height: 15px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
  transform: rotate(-90deg);
}

.sliderInput::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #04aa6d;
  cursor: pointer;
}

.sliderInput::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #04aa6d;
  cursor: pointer;
}

@media screen and (max-width: 1200px) {
  .slider {
    width: 15vw;
    height: 30vw;
  }
}

@media screen and (max-width: 900px) {
  .slider {
    width: 18vw;
    height: 36vw;
  }
}

@media screen and (max-width: 800px) {
  .slider {
    width: 22vw;
    height: 44vw;
  }
}

@media screen and (max-width: 600px) {
  .slider {
    width: 28vw;
    height: 56vw;
  }
}

@media screen and (max-width: 450px) {
  .slider {
    width: 42vw;
    height: 84vw;
  }
}
</style>
