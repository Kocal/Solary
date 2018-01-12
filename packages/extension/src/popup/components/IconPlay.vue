<template>
  <div class="icon-play solary-gradient"></div>
</template>

<style scoped lang="scss">
$width: 90px;
$height: 90px;

.icon-play {
  width: $width;
  height: $height;

  clip-path: polygon(0 0, 0% 100%, 100% 50%);
  background-size: 200%;

  animation: move-background 5s ease-in-out infinite;
  transition: all 0.2s ease-in-out;

  &:hover {
    width: $width + 20px;
    height: $height + 20px;
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
