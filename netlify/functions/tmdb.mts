// Proxies requests to TMDB so the API key stays on the server.
// /api/tmdb/<path>?<query> -> https://api.themoviedb.org/3/<path>?<query>&api_key=...
const ALLOWED_PATHS = [
  /^trending\/movie\/day$/,
  /^search\/movie$/,
  /^movie\/\d+\/credits$/,
];

export default async (req: Request) => {
  const apiKey =
    Netlify.env.get("TMDB_API_KEY") ?? Netlify.env.get("VITE_TMDB_API_KEY");

  if (!apiKey) {
    return Response.json(
      { error: "TMDB_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/tmdb\/?/, "");

  if (!ALLOWED_PATHS.some((pattern) => pattern.test(path))) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const params = new URLSearchParams(url.searchParams);
  params.delete("api_key");
  params.set("api_key", apiKey);

  const response = await fetch(`https://api.themoviedb.org/3/${path}?${params}`, {
    headers: { accept: "application/json" },
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/json",
      "cache-control": "public, max-age=60",
    },
  });
};

export const config = {
  path: "/api/tmdb/*",
};
