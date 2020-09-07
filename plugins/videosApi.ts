import { Context } from '@nuxt/types';
import { AxiosInstance } from 'axios';
import { VideosApi } from '~/api/api';
import { Configuration } from '~/api/configuration';
import { PluginInjection } from '~/types/utils';

declare module '@nuxt/types' {
  interface Context {
    $videosApi: VideosApi;
  }

  interface NuxtAppOptions {
    $videosApi: VideosApi;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $videosApi: VideosApi;
  }
}

export default (context: Context, inject: PluginInjection): void => {
  const config = new Configuration();

  const mediaInfoApi = new VideosApi(
    config,
    '',
    context.$axios as AxiosInstance
  );
  inject('videosApi', mediaInfoApi);
};
