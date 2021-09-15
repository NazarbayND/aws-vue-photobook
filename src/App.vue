<template>
  <div id="nav">
    <Nav />
  </div>
  <router-view />
</template>
<script>
import Nav from "./components/Nav.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    Nav,
  },
  async mounted() {
    await this.authAction();
    if (this.user) this.$router.push("./albums");
  },
  methods: {
    ...mapActions({
      authAction: "auth/authAction",
    }),
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
