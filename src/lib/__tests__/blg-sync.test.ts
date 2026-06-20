import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockRun, mockPrepare, mockGet } = vi.hoisted(() => {
  const mockRun = vi.fn();
  const mockGet = vi.fn();
  const mockPrepare = vi.fn(() => ({ run: mockRun, get: mockGet }));
  return { mockRun, mockPrepare, mockGet };
});

vi.mock('@/lib/db', () => ({
  default: { prepare: mockPrepare },
}));

const { syncArticlesFromBLG } = await import('@/lib/blg-sync');

const mockArticle = {
  id: 1,
  title: 'Test Article',
  slug: 'test-article',
  excerpt: 'An excerpt',
  content_html: '<p>Hello</p>',
  meta_description: 'A test',
  hero_image_url: 'https://example.com/img.jpg',
  languageCode: 'en',
};

function mockFetch(pages: typeof mockArticle[][]): void {
  let call = 0;
  global.fetch = vi.fn(async () => {
    const data = pages[call] ?? [];
    call++;
    return {
      ok: true,
      json: async () => ({ data }),
    } as unknown as Response;
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  delete process.env['BABYLOVEGROWTH_API_KEY'];
});

describe('syncArticlesFromBLG', () => {
  it('skips when no API key', async () => {
    global.fetch = vi.fn();
    await syncArticlesFromBLG();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockPrepare).not.toHaveBeenCalled();
  });

  it('skips when articles table already has rows', async () => {
    process.env['BABYLOVEGROWTH_API_KEY'] = 'key';
    mockGet.mockReturnValue({ n: 5 });
    global.fetch = vi.fn();

    await syncArticlesFromBLG();

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('fetches and upserts articles when table empty', async () => {
    process.env['BABYLOVEGROWTH_API_KEY'] = 'testkey';
    mockGet.mockReturnValue({ n: 0 });
    mockFetch([[mockArticle], []]);

    await syncArticlesFromBLG();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/articles?limit=50&page=1'),
      expect.objectContaining({ headers: expect.objectContaining({ 'x-api-key': 'testkey' }) }),
    );
    expect(mockRun).toHaveBeenCalledTimes(1);
    expect(mockRun).toHaveBeenCalledWith(
      1, 'test-article', 'Test Article',
      'An excerpt', '<p>Hello</p>', null,
      'A test', 'https://example.com/img.jpg',
      null, null, 'en', null, null,
    );
  });

  it('paginates until partial page', async () => {
    process.env['BABYLOVEGROWTH_API_KEY'] = 'key';
    mockGet.mockReturnValue({ n: 0 });
    // page 1: 50 items (full) → fetch page 2; page 2: 1 item (< 50) → stop
    mockFetch([
      Array(50).fill(mockArticle).map((a, i) => ({ ...a, slug: `slug-${i}`, id: i })),
      [{ ...mockArticle, slug: 'last', id: 99 }],
    ]);

    await syncArticlesFromBLG();

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(mockRun).toHaveBeenCalledTimes(51);
  });

  it('stops pagination when page has fewer than 50 results', async () => {
    process.env['BABYLOVEGROWTH_API_KEY'] = 'key';
    mockGet.mockReturnValue({ n: 0 });
    mockFetch([[{ ...mockArticle, slug: 'only-one' }]]);

    await syncArticlesFromBLG();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(mockRun).toHaveBeenCalledTimes(1);
  });

  it('logs and continues on fetch error without crashing', async () => {
    process.env['BABYLOVEGROWTH_API_KEY'] = 'key';
    mockGet.mockReturnValue({ n: 0 });
    global.fetch = vi.fn(async () => ({ ok: false, status: 500, statusText: 'Error' } as unknown as Response));
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await syncArticlesFromBLG();

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[blg-sync]'));
    spy.mockRestore();
  });

  it('logs and continues on network exception', async () => {
    process.env['BABYLOVEGROWTH_API_KEY'] = 'key';
    mockGet.mockReturnValue({ n: 0 });
    global.fetch = vi.fn(async () => { throw new Error('Network down'); });
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await syncArticlesFromBLG();

    expect(spy).toHaveBeenCalledWith('[blg-sync] startup sync error:', expect.any(Error));
    spy.mockRestore();
  });

  it('serialises jsonLd and faqJsonLd as JSON strings', async () => {
    process.env['BABYLOVEGROWTH_API_KEY'] = 'key';
    mockGet.mockReturnValue({ n: 0 });
    const article = {
      ...mockArticle,
      slug: 'with-ld',
      jsonLd: { '@type': 'Article' },
      faqJsonLd: { '@type': 'FAQPage' },
    };
    mockFetch([[article]]);

    await syncArticlesFromBLG();

    const call = mockRun.mock.calls[0]!;
    expect(call[8]).toBe('{"@type":"Article"}');
    expect(call[9]).toBe('{"@type":"FAQPage"}');
  });
});
