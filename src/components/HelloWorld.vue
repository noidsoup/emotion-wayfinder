<template>
  <div class="container">
    <v-form>
      <v-text-field
        v-model="user.name"
        label="name"
      ></v-text-field>
      <v-text-field
        v-model="user.email"
        label="email"
      ></v-text-field>
      </v-form>
    <v-btn @click="registration">Success</v-btn>
  </div>
</template>

<script>
export default {
  name: 'registration',
  data() {
    return {
      user: {
        name: undefined,
        email: undefined,
      }
    };
  },
  methods: {
    registration() {
      fetch(`${this.$serverAddress}/registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.user),
      }).then((res) => {
        if (!res.ok) {
          this.alert = true;
          this.handleErrors(res);
          return;
        }
        res.text().then((text) => {
          storageProvider.set('account', JSON.parse(text));
          EventBus.$emit('LOGOUT BUTTON');
          EventBus.$emit('TOGGLE MENU DRAWER', true);
          router.push('accounts');
        });
      }).catch((error) => {
        console.error(error);
        this.handleErrors(error);
      });
    },
    handleErrors(error) {
      console.log(error);
      console.error(`error status code: ${error.status}, status text: ${error.statusText}`);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  padding-right: 1em;
  padding-left: 1em;
}
</style>
