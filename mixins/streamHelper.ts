import Vue from 'vue';

const streamHelper = Vue.extend({
  methods: {
    getStreamLink(id: string, mediaSourceId: string, container: string): URL {
      const url = new URL(
        `videos/${id}/stream.${container}`,
        this.$axios.defaults.baseURL
      );
      url.searchParams.append('mediaSourceId', mediaSourceId);
      url.searchParams.append('static', 'true');
      // Fixme: This is hardcoded
      const deviceId =
        'TW96aWxsYS81LjAgKFgxMTsgTGludXggeDg2XzY0OyBydjo3Ny4wKSBHZWNrby8yMDEwMDEwMSBGaXJlZm94Lzc3LjB8MTU5NTQ1MTYzMzE4OQ11';
      url.searchParams.append('deviceId', deviceId);
      url.searchParams.append('api_key', this.$auth.user.accessToken);
      return url;
    }
  }
});

export default streamHelper;
