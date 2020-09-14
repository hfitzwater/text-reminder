<template>
  <div class="home">
    <h2>
      Text <strong>Reminder</strong>
    </h2>
    <p>
      Configurable sms reminder messages
    </p>
    <br>
    <br>
    <cv-button-set>
      <cv-button kind="tertiary" @click="goTo('signup')">Sign Up</cv-button>
      <cv-button kind="primary" @click="goTo('login')">Log In</cv-button>
    </cv-button-set>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Home',
  components: {},
  methods: {
    goTo(path) {
      this.$router.push(path);
    }
  },
  computed: mapState({
    user: state => state.user.active,
  }),
  mounted() {
    if(this.user) {
      this.$router.push('reminders');
    }
  }
}
</script>

<style lang="scss" scoped>
  .home {
    max-width: 500px;
    margin: auto;
  }

  .cv-button-set {
    .cv-button {
      width: 50%;
      max-width: 100%;
    }
  }
</style>
