<template>
  <nav>
    <ul>
      <li class="divider"></li>
      <router-link to="/streams" tag="li">Stream</router-link>
      <li class="divider"></li>
      <router-link to="/scheduling" tag="li">Programmation</router-link>
      <li class="divider"></li>
    </ul>
  </nav>
</template>

<script>
  export default {};
</script>

<style scoped lang="scss">
  ul {
    display: flex;
    margin: 0;
    padding: 0;

    border-style: solid;
    border-width: 4px 0 0;
    border-color: #1b1c1d;
  }

  li {
    padding: 8px 16px;

    font-size: 2rem;
    background-color: #1b1c1d;
    list-style: none;
    text-transform: uppercase;

    transition: all .1s linear;

    &:first-child,
    &:last-child {
      flex: 1;
    }
  }

  li:not(.divider) {
    cursor: pointer;
  }

  li.router-link-active,
  li:not(.divider):hover {
    background-color: transparent;
    color: #1b1c1d;
  }
</style>
