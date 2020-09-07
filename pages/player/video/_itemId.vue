<template>
  <video-player :id="id"></video-player>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  layout: 'fullpage',
  data() {
    return {
      id: (null as unknown) as string
    };
  },

  beforeMount() {
    this.id = this.$route.params.itemId;
  }
});
</script>
