<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
}
/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
}
* {
  box-sizing: border-box;
}
</style>