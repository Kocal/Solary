<template>
  <div>
    <div class="icon-play solary-gradient"></div>
  </div>
</template>

<style scoped lang="scss">
.icon-play {
  width: 92px;
  height: 92px;

  clip-path: polygon(0 0, 0% 100%, 100% 50%);
  background-size: 200%;

  animation: move-background 5s ease-in-out infinite;
  transition: all 0.2s ease-in-out;
  transform-origin: center;

  &:hover {
    transform: scale(1.2);
  }
}

@keyframes move-background {
  0%,
  100% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>
