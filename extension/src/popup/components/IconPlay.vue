<template>
  <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="100"
      height="100"
  >
    <path d="M 95,50 5,95 5,5 z"/>
  </svg>
</template>

<style scoped lang="scss">
  $color: #1196ff;

  svg path {
    fill: $color;
    transition: fill .5s;
  }

  svg:hover path {
    fill: lighten($color, 10%);
  }
</style>
