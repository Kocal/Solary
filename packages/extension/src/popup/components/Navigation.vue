<template>
  <nav>
    <ul>
      <li class="divider"></li>
      <router-link to="/streams" tag="li">Stream</router-link>
      <li class="divider"></li>
      <router-link to="/scheduling" tag="li">Programmation</router-link>
      <li class="divider"></li>
      <li>
        <a href="https://twitter.com/SolaryTV" target="_blank" title="Twitter">
          <icon name="twitter"></icon>
        </a>
      </li>
      <li>
        <a href="https://www.youtube.com/channel/UCb3c6rB0Ru1i9EUcc-a5ZJw" target="_blank" title="YouTube">
          <icon name="youtube"></icon>
        </a>
      </li>
      <li>
        <a href="https://www.twitch.tv/solary" target="_blank" title="Twitch">
          <icon name="twitch"></icon>
        </a>
      </li>
      <li>
        <a href="https://www.snapchat.com/add/solarytv" target="_blank" title="SnapChat">
          <icon name="snapchat"></icon>
        </a>
      </li>
      <li>
        <a href="https://www.instagram.com/solarytv/" target="_blank" title="Instagram">
          <icon name="instagram"></icon>
        </a>
      </li>
      <li>
        <a href="https://www.facebook.com/SolaryTV/" target="_blank" title="Facebook">
          <icon name="facebook"></icon>
        </a>
      </li>
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
    &:nth-child(5) {
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
