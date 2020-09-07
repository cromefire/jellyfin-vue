<template>
  <div ref="container" class="container"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import { createPlayer, Player } from '~/mixins/player';
import streamHelper from '~/mixins/streamHelper';

export default Vue.extend({
  mixins: [streamHelper],

  props: {
    id: {
      required: true,
      type: String
    }
  },

  data(): { player: Player } {
    return {
      player: (null as unknown) as Player
    };
  },

  async mounted(): Promise<void> {
    const container = this.$refs.container as HTMLElement;

    const id = this.$route.params.itemId;

    const resp = await this.$mediaInfoApi.getPlaybackInfo({
      itemId: id,
      userId: this.$auth.user.User.Id
    });
    const info = resp.data;

    this.player = createPlayer(container);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const sourceId = info.MediaSources![0].Id as string;
    const url = this.getStreamLink(id, sourceId, 'webm');
    this.player.load(url);
  }
});
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>
