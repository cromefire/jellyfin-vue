import videojs, { VideoJsPlayer } from 'video.js';

export interface Player {
  load(url: URL): void;
}

export class VideoJsPlayerImpl implements Player {
  #player: VideoJsPlayer;

  constructor(parent: HTMLElement) {
    const video = document.createElement('video');
    video.classList.add('video-js');
    parent.append(video);
    this.#player = videojs(video, {
      autoplay: true,
      controls: true
    });
  }

  load(url: URL): void {
    this.#player.src(url.href);
  }
}

/**
 *
 */
export function createPlayer(parent: HTMLElement): Player {
  return new VideoJsPlayerImpl(parent);
}
