<template>
  <div id="app">
    <router-view name="navbar"/>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import "@/scss/global.scss";

#app {
  font-family: map-get($fonts, main);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
a[href], span.link {
  text-decoration: none;
  color: map-get($colors, href);
  cursor: pointer;
}

::-webkit-scrollbar {
  width: map-get($scrollbar, width);
  height: map-get($scrollbar, height);
}
::-webkit-scrollbar-thumb {
  background: map-get($scrollbar, thumb);
}
::-webkit-scrollbar-track {
  background: map-get($scrollbar, track);
}

body {
  background-color: map-get($colors, background);
}

// normalize
html, body {
  margin: 0;
  padding: 0;
}
* {
  color: white;
}
</style>
