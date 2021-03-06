<template>
  <div>
    <v-form
      ref="form"
      v-model="validInputs"
      :disabled="loginIn"
      @submit.prevent="userLogin"
    >
      <v-text-field
        v-model="serverUrl"
        outlined
        :label="$t('serverAddress')"
        type="url"
        :rules="rules.serverUrlTest"
        required
      ></v-text-field>
      <v-text-field
        v-model="login.username"
        outlined
        :label="$t('username')"
        :rules="[(v) => !!v || $t('usernameRequired')]"
        required
      ></v-text-field>
      <v-text-field
        v-model="login.pw"
        outlined
        :label="$t('password')"
        :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        :type="showPassword ? 'text' : 'password'"
        @click:append="() => (showPassword = !showPassword)"
      ></v-text-field>
      <v-row align="center" no-gutters>
        <v-col class="mr-2">
          <v-btn
            :disabled="!validInputs"
            :loading="loginIn"
            block
            large
            color="primary"
            type="submit"
            >{{ $t('signIn') }}</v-btn
          >
        </v-col>
        <v-col cols="auto">
          <locale-switcher />
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      serverUrl: '',
      login: {
        username: '',
        pw: ''
      },
      showPassword: false,
      validInputs: false,
      loginIn: false,
      rules: {
        serverUrlTest: [
          (v: string) => !!v || this.$t('serverAddressRequired'),
          (v: string) =>
            /^https?:\/\/.+/.test(v) || this.$t('serverAddressMustBeUrl')
        ]
      }
    };
  },
  methods: {
    async userLogin() {
      this.loginIn = true;
      try {
        this.$axios.setBaseURL(this.serverUrl);

        const response = await this.$auth.loginWith('local', {
          data: this.login
        });

        const accessToken = `MediaBrowser Client="Jellyfin Web", Device="Firefox", DeviceId="TW96aWxsYS81LjAgKFgxMTsgTGludXggeDg2XzY0OyBydjo3Ny4wKSBHZWNrby8yMDEwMDEwMSBGaXJlZm94Lzc3LjB8MTU5NTQ1MTYzMzE4OQ11", Version="10.7.0", Token="${response.data.AccessToken}"`;

        this.$auth.setUserToken(
          // TODO: Generate the token properly
          accessToken
        );
        this.$auth.setUser(response.data.User);
        this.$user.set(response.data.User.Id, this.serverUrl, accessToken);
      } catch (error) {
        let errorMessage = this.$t('unexpectedError');

        if (!error.response) {
          errorMessage = this.$t('serverNotFound');
        } else if (error.response.status === 500) {
          errorMessage = this.$t('incorrectUsernameOrPassword');
        } else if (error.response.status === 400) {
          errorMessage = this.$t('badRequest');
        }

        this.loginIn = false;
        this.$snackbar(errorMessage as string, 'error');
      }
    }
  }
});
</script>

<style scoped>
/* HACK: Snackbar positioning -- See: https://github.com/vuetifyjs/vuetify/issues/11781#issuecomment-655689025 */
div.v-snack:not(.v-snack--absolute) {
  height: 100%;
}
</style>
