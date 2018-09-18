<template>
<v-app>
  <v-toolbar dark color="blue lighten-1" :fixed="true" style="z-index: 99999;">
    <!-- <v-toolbar-side-icon v-if="isLoggedIn" @click.stop="drawer = !drawer"></v-toolbar-side-icon> -->
    <v-toolbar-title class="white--text">
      <v-btn icon @click="previousPage()" v-if="$store.state.showBackBtn">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      {{ title }}
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <slot name="right-icon"></slot>
  </v-toolbar>
  <!-- <v-container> -->
    <slot name="main-content"></slot>
  <!-- </v-container> -->
  <v-bottom-nav :value="showNavbar" :active.sync="activeNavigation" fixed color="white" height="50" style="z-index: 99999;">
    <v-btn v-for="(nav, key) in navs" :key="key"  flat color="blue lighten-1" :value="key">
      <v-icon>{{ nav.icon }}</v-icon>
    </v-btn>
  </v-bottom-nav>
  <v-card height="36px" flat color="transparent">
  </v-card>
  <v-snackbar
    v-model="showSnackbar"
    :bottom="true"
    :vertical="true"
    :timeout="3000"
    :color="snackbarColor"
  >
    {{ snackbarMessage }}
    <v-btn>tutup</v-btn>
  </v-snackbar>
</v-app>
</template>

<script>
export default {
  name: 'shell',
  props: ['title', 'userfullname', 'userimage', 'navs'],
  data () {
    return {
      drawer: false
    }
  },
  computed: {
    isLoggedIn () {
      return true
    },
    activeNavigation: {
      set: function (newValue) {
        this.$store.commit('setActiveNavigation', newValue)
        this.navLinkClicked(this.$store.state.navigations[newValue].path)
      },
      get: function () {
        return this.$store.state.activeNavigation
      }
    },
    showNavbar: function () {
      return this.$store.state.showNavbar
    },
    snackbarColor: function () {
      return this.$store.state.snackbarType
    },
    showSnackbar: {
      set: function (newVal) {
        this.$store.commit('setShowSnackbar', newVal)
      },
      get: function () {
        return this.$store.state.showSnackbar
      }
    },
    snackbarMessage: {
      set: function (newVal) {
        this.$store.commit('setSnackbarMessage', newVal)
      },
      get: function () {
        return this.$store.state.snackbarMessage
      }
    },
  },
  methods: {
    navLinkClicked (newPath) {
      this.$router.replace({path: newPath})
    },
    previousPage() {
      window.history.back()
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
