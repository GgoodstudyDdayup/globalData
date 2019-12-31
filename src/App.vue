<template>
  <v-app>
    <v-app-bar app  style="background: #2196F3" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://www.zhongxiaoxue.cn/zhongkao/yanuoData/img/6fde7d1be1f4320861d531c0f746d6d.png"
          transition="scale-transition"
          width="60"
        />
      </div>
    </v-app-bar>
    <v-content>
      <HelloWorld />
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",

  components: {
    HelloWorld
  },

  data: () => ({
    //
  })
};
</script>
