/**
 * Utilitarios seguros para extracao e embutimento de videos (YouTube e Vimeo)
 */

const SAFE_VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]+$/;
const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com']);
const YOUTU_BE_HOSTS = new Set(['youtu.be', 'www.youtu.be']);
const VIMEO_HOSTS = new Set(['vimeo.com', 'www.vimeo.com']);
const VIMEO_PLAYER_HOSTS = new Set(['player.vimeo.com']);

export const getEmbedVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed || /[<>"'`]/.test(trimmed)) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null;
    }

    const host = parsed.hostname.toLowerCase();

    if (YOUTUBE_HOSTS.has(host)) {
      let videoId = null;
      if (parsed.pathname === '/watch') {
        videoId = parsed.searchParams.get('v');
      } else if (parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.split('/')[2];
      }
      if (videoId && SAFE_VIDEO_ID_REGEX.test(videoId)) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return null;
    }

    if (YOUTU_BE_HOSTS.has(host)) {
      const videoId = parsed.pathname.slice(1).split('/')[0];
      if (videoId && SAFE_VIDEO_ID_REGEX.test(videoId)) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return null;
    }

    if (VIMEO_HOSTS.has(host)) {
      const videoId = parsed.pathname.slice(1).split('/')[0];
      if (videoId && SAFE_VIDEO_ID_REGEX.test(videoId)) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
      return null;
    }

    if (VIMEO_PLAYER_HOSTS.has(host) && parsed.pathname.startsWith('/video/')) {
      const videoId = parsed.pathname.split('/')[2];
      if (videoId && SAFE_VIDEO_ID_REGEX.test(videoId)) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
      return null;
    }

    return null;
  } catch {
    return null;
  }
};
