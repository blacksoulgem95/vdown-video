import { describe, it, expect } from 'vitest';
import { detectPlatform, isValidUrl, getPlatformLabel } from '../platform-detect';

describe('detectPlatform', () => {
  it('detects youtube.com', () => expect(detectPlatform('https://youtube.com/watch?v=abc')).toBe('youtube'));
  it('detects www.youtube.com', () => expect(detectPlatform('https://www.youtube.com/watch?v=abc')).toBe('youtube'));
  it('detects youtu.be shortlink', () => expect(detectPlatform('https://youtu.be/abc123')).toBe('youtube'));
  it('detects m.youtube.com', () => expect(detectPlatform('https://m.youtube.com/watch?v=abc')).toBe('youtube'));

  it('detects vimeo.com', () => expect(detectPlatform('https://vimeo.com/123456')).toBe('vimeo'));
  it('detects player.vimeo.com', () => expect(detectPlatform('https://player.vimeo.com/video/123')).toBe('vimeo'));

  it('detects facebook.com', () => expect(detectPlatform('https://www.facebook.com/reel/123')).toBe('facebook'));
  it('detects fb.watch alias', () => expect(detectPlatform('https://fb.watch/abc')).toBe('facebook'));
  it('detects m.facebook.com', () => expect(detectPlatform('https://m.facebook.com/video')).toBe('facebook'));

  it('detects instagram.com', () => expect(detectPlatform('https://www.instagram.com/reel/abc')).toBe('instagram'));

  it('detects tiktok.com', () => expect(detectPlatform('https://www.tiktok.com/@user/video/123')).toBe('tiktok'));
  it('detects vm.tiktok.com', () => expect(detectPlatform('https://vm.tiktok.com/abc')).toBe('tiktok'));

  it('detects twitter.com', () => expect(detectPlatform('https://twitter.com/user/status/123')).toBe('twitter'));
  it('detects x.com alias', () => expect(detectPlatform('https://x.com/user/status/123')).toBe('twitter'));
  it('detects www.x.com', () => expect(detectPlatform('https://www.x.com/user/status/123')).toBe('twitter'));

  it('detects reddit.com', () => expect(detectPlatform('https://www.reddit.com/r/sub/comments/abc')).toBe('reddit'));
  it('detects v.redd.it alias', () => expect(detectPlatform('https://v.redd.it/abc123')).toBe('reddit'));
  it('detects old.reddit.com', () => expect(detectPlatform('https://old.reddit.com/r/sub')).toBe('reddit'));

  it('detects soundcloud.com', () => expect(detectPlatform('https://soundcloud.com/artist/track')).toBe('soundcloud'));
  it('detects on.soundcloud.com', () => expect(detectPlatform('https://on.soundcloud.com/abc')).toBe('soundcloud'));

  it('returns unknown for unrecognised domain', () => expect(detectPlatform('https://example.com/video')).toBe('unknown'));
  it('returns unknown for invalid url without throwing', () => expect(detectPlatform('not-a-url')).toBe('unknown'));
  it('returns unknown for empty string without throwing', () => expect(detectPlatform('')).toBe('unknown'));
});

describe('isValidUrl', () => {
  it('accepts https url', () => expect(isValidUrl('https://youtube.com')).toBe(true));
  it('accepts http url', () => expect(isValidUrl('http://youtube.com')).toBe(true));
  it('rejects non-url string', () => expect(isValidUrl('not a url')).toBe(false));
  it('rejects empty string', () => expect(isValidUrl('')).toBe(false));
  it('rejects ftp protocol', () => expect(isValidUrl('ftp://example.com')).toBe(false));
  it('rejects javascript protocol', () => expect(isValidUrl('javascript:alert(1)')).toBe(false));
});

describe('getPlatformLabel', () => {
  it('returns YouTube for youtube', () => expect(getPlatformLabel('youtube')).toBe('YouTube'));
  it('returns Twitter / X for twitter', () => expect(getPlatformLabel('twitter')).toBe('Twitter / X'));
  it('returns SoundCloud for soundcloud', () => expect(getPlatformLabel('soundcloud')).toBe('SoundCloud'));
  it('returns Unknown for unknown', () => expect(getPlatformLabel('unknown')).toBe('Unknown'));
});
