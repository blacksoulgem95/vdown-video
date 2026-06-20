export type Platform =
  | 'youtube'
  | 'vimeo'
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'twitter'
  | 'reddit'
  | 'soundcloud'
  | 'unknown';

const PLATFORM_MAP: Record<string, Platform> = {
  'youtube.com': 'youtube',
  'www.youtube.com': 'youtube',
  'm.youtube.com': 'youtube',
  'youtu.be': 'youtube',
  'youtube-nocookie.com': 'youtube',
  'vimeo.com': 'vimeo',
  'www.vimeo.com': 'vimeo',
  'player.vimeo.com': 'vimeo',
  'facebook.com': 'facebook',
  'www.facebook.com': 'facebook',
  'm.facebook.com': 'facebook',
  'fb.watch': 'facebook',
  'fb.com': 'facebook',
  'instagram.com': 'instagram',
  'www.instagram.com': 'instagram',
  'tiktok.com': 'tiktok',
  'www.tiktok.com': 'tiktok',
  'vm.tiktok.com': 'tiktok',
  'twitter.com': 'twitter',
  'www.twitter.com': 'twitter',
  'x.com': 'twitter',
  'www.x.com': 'twitter',
  'reddit.com': 'reddit',
  'www.reddit.com': 'reddit',
  'old.reddit.com': 'reddit',
  'v.redd.it': 'reddit',
  'redd.it': 'reddit',
  'soundcloud.com': 'soundcloud',
  'www.soundcloud.com': 'soundcloud',
  'on.soundcloud.com': 'soundcloud',
};

export function detectPlatform(url: string): Platform {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    return PLATFORM_MAP[hostname] ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function getPlatformLabel(platform: Platform): string {
  const labels: Record<Platform, string> = {
    youtube: 'YouTube',
    vimeo: 'Vimeo',
    facebook: 'Facebook',
    instagram: 'Instagram',
    tiktok: 'TikTok',
    twitter: 'Twitter / X',
    reddit: 'Reddit',
    soundcloud: 'SoundCloud',
    unknown: 'Unknown',
  };
  return labels[platform];
}
