<template>
  <div>
    <div class="icon-play"></div>
  </div>
</template>

<style scoped lang="scss">
.icon-play {
  width: 64px;
  height: 64px;

  clip-path: polygon(0 0, 0% 100%, 100% 50%);
  background-color: #fff;
  opacity: 0.6;

  transition: all 0.25s ease-in-out;

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }
}
</style>
