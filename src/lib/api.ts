const BACKEND_INTERNAL_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:3000';

export async function serverFetch<T = any>(
  endpoint: string,
  options: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
  const url = `${BACKEND_INTERNAL_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
      },
    });

    if (!res.ok) {
      return {
        data: null,
        error: `Server returned status ${res.status}: ${res.statusText}`,
        status: res.status,
      };
    }

    const data = await res.json();
    return { data, error: null, status: res.status };
  } catch (err: any) {
    // Fail gracefully so static pages and ISR do not crash when backend is sleeping
    return {
      data: null,
      error: err?.message || 'Network request failed',
      status: 500,
    };
  }
}
