<template>
  <v-app>
    <Nav />
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>


<script>
import Vue from "vue";
import Nav from "@/components/Nav";

export default Vue.extend({
  name: "Base",
  components: { Nav }
});
</script>
