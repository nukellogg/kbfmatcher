<template>
  <div>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-subheader>
          Making our students happier with less work. 😅
        </v-subheader>
        <v-list-item v-for="(link, i) in links" :key="i" :to="link.route">
          <v-list-item-icon>
            <v-icon color="deep-purple" v-text="link.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="link.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click.stop="celebrate" class="pink lighten-4" dark>
          <v-list-item-icon>
            <v-icon color="deep-purple">mdi-party-popper</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Celebrate</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      color="deep-purple"
      fixed
      app
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ appTitle }}</v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script>
import Vue from 'vue'
import kelloggConfetti from '@/utils/kellogg-confetti'

export default Vue.extend({
  data() {
    return {
      appTitle: "Kellogg Board Fellows Optimizer",
      drawer: false,
      links: [
        {
          text: "KBF Optimizer",
          icon: "mdi-square-root",
          route: "/"
        },
        {
          text: "Qualtrics Converter",
          icon: "mdi-database-cog",
          route: "/qualtrics",
        },
      ],
    }
  },
  methods: {
    celebrate() {
      kelloggConfetti(0.5)
    }
  }
});
</script>

<style scoped>
header {
  /* position: absolute !important;
  top: 0 !important;
  left: 0 !important; */
  z-index: 99999 !important;
}

nav,
main {
  margin-top: 4rem !important;
}

main {
  padding: 2rem;
}
</style>
