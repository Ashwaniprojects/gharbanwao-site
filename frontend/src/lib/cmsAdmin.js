import axios from "axios";

/*
 * Thin client for the content service (the CMS backend, deployed separately
 * from the lead/registration serverless functions). Everything here except
 * login and the public project list requires an admin Bearer token.
 *
 * The base URL is an env-configurable constant rather than a build-time
 * REACT_APP_* constant, so it can be changed without waiting for a Vercel
 * rebuild — which is the point of the Deploy button below it. CRA inlines
 * REACT_APP_* at build time, so any build-time value is a second, separate
 * override; that is intentional for hotfixing a wrong default.
 */

export const CMS_BASE_URL =
  process.env.CMS_BACKEND_URL ||
  process.env.REACT_APP_CMS_BACKEND_URL ||
  "https://backend-production-07ed.up.railway.app";

const TOKEN_KEY = "cms_admin_token";
const ROLE_KEY = "cms_admin_role";

export const getToken = () => localStorage.getItem(TOKEN_KEY) || null;

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  clearRole();
};

/**
 * The signed-in role ("admin" or "author"), mirrored from the token so the UI
 * can gate destructive actions (delete, site rebuild) without decoding the
 * JWT. Absent for an author session that pre-dates the role field.
 */
export const getRole = () => localStorage.getItem(ROLE_KEY) || null;

export const setRole = (role) => {
  if (role) localStorage.setItem(ROLE_KEY, role);
};

export const clearRole = () => localStorage.removeItem(ROLE_KEY);

export const isAdmin = () => getRole() === "admin";

export const isAuthenticated = () => Boolean(getToken());

/**
 * One request at a time. Mutations are sequential in this UI, and concurrent
 * saves of the same item from two open tabs is the exact case the lock is for.
 * Every failed request releases the lock, so a single bad call cannot make the
 * whole admin page unresponsive.
 */
let queue = Promise.resolve();
export const withLock = (task) => {
  const next = queue.then(task, task);
  queue = next.catch(() => {});
  return next;
};

const request = axios.create({ baseURL: CMS_BASE_URL });

/** Attach the stored token and let a 401 mean "go back to login". */
request.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) clearToken();
    return Promise.reject(error);
  },
);

/** Turn any thrown axios error into a short, human-readable sentence. */
export const errorMessage = (error, fallback = "Something went wrong.") => {
  if (error && error.response) {
    const detail = error.response.data && error.response.data.detail;
    if (typeof detail === "string" && detail.trim()) return detail;
    if (detail && typeof detail === "object") {
      const joined = Object.values(detail)
        .filter((v) => typeof v === "string")
        .join(" ");
      if (joined.trim()) return joined;
    }
  }
  if (error && error.message === "Network Error") {
    return "The content service is not reachable. Check your connection.";
  }
  return fallback;
};

export const login = (password) =>
  request
    .post("/api/admin/login", { password })
    .then((r) => {
      if (r.data.role) setRole(r.data.role);
      return r.data.token;
    });

export const fetchPosts = (includeDrafts) =>
  request
    .get("/api/content/posts", {
      params: includeDrafts ? { all: true, limit: 50 } : { limit: 50 },
    })
    .then((r) => r.data.items || []);

export const fetchProjects = () =>
  request.get("/api/content/projects", { params: { limit: 50 } }).then((r) => r.data.items || []);

/*
 * Featured customer-review videos and the project-gallery entries live on the
 * content service like every other content type. The public site reads the
 * published list; the admin reads and writes with the stored Bearer token.
 */
export const fetchVideos = (includeDrafts) =>
  request.get("/api/content/videos", {
    params: includeDrafts ? { all: true, limit: 50 } : { limit: 50 },
  }).then((r) => r.data.items || []);

export const saveVideo = (payload) =>
  withLock(() => request.post("/api/content/videos", payload).then((r) => r.data));

export const updateVideo = (slug, payload) =>
  withLock(() =>
    request.put(`/api/content/videos/${encodeURIComponent(slug)}`, payload).then((r) => r.data),
  );

export const deleteVideo = (slug) =>
  withLock(() =>
    request.delete(`/api/content/videos/${encodeURIComponent(slug)}`).then((r) => r.data),
  );

export const fetchGallery = (includeDrafts) =>
  request.get("/api/content/gallery", {
    params: includeDrafts ? { all: true, limit: 50 } : { limit: 50 },
  }).then((r) => r.data.items || []);

export const saveGallery = (payload) =>
  withLock(() => request.post("/api/content/gallery", payload).then((r) => r.data));

export const updateGallery = (slug, payload) =>
  withLock(() =>
    request.put(`/api/content/gallery/${encodeURIComponent(slug)}`, payload).then((r) => r.data),
  );

export const deleteGallery = (slug) =>
  withLock(() =>
    request.delete(`/api/content/gallery/${encodeURIComponent(slug)}`).then((r) => r.data),
  );

/* Author profiles power the blog byline. The public site reads the public
 * list (no token), the admin reads and writes with the stored Bearer token, so
 * a single fetchAuthors call serves both. */
export const fetchAuthors = () =>
  request.get("/api/content/authors", { params: { limit: 50 } }).then((r) => r.data.items || []);

export const saveAuthor = (payload) =>
  withLock(() => request.post("/api/content/authors", payload).then((r) => r.data));

export const updateAuthor = (slug, payload) =>
  withLock(() =>
    request.put(`/api/content/authors/${encodeURIComponent(slug)}`, payload).then((r) => r.data),
  );

export const deleteAuthor = (slug) =>
  withLock(() =>
    request.delete(`/api/content/authors/${encodeURIComponent(slug)}`).then((r) => r.data),
  );

/* Registrations land in the FastAPI lead store, not the content DB, so the
 * admin lists them here (no deploy) rather than in the post list. */
export const fetchRegistrations = (type) =>
  request
    .get("/api/registrations", { params: type ? { type } : {} })
    .then((r) => r.data);

/*
 * Offers are scheduled promos with a live window (starts_at / ends_at). The
 * public active list is what the home-page offer banner renders; the admin
 * list and mutations work exactly like the other content types.
 */
export const fetchOffers = (includeDrafts) =>
  request.get("/api/content/offers", {
    params: includeDrafts ? { all: true, limit: 50 } : { limit: 50 },
  }).then((r) => r.data.items || []);

export const fetchActiveOffers = () =>
  request.get("/api/content/offers/active").then((r) => r.data.items || []);

export const saveOffer = (payload) =>
  withLock(() => request.post("/api/content/offers", payload).then((r) => r.data));

export const updateOffer = (slug, payload) =>
  withLock(() =>
    request.put(`/api/content/offers/${encodeURIComponent(slug)}`, payload).then((r) => r.data),
  );

export const deleteOffer = (slug) =>
  withLock(() => request.delete(`/api/content/offers/${encodeURIComponent(slug)}`).then((r) => r.data));

export const uploadImage = (file) =>
  withLock(async () => {
    const form = new FormData();
    form.append("file", file);
    return request.post("/api/admin/upload", form).then((r) => r.data);
  });

export const triggerDeploy = () =>
  withLock(() => request.post("/api/admin/deploy").then((r) => r.data));

/**
 * The backend builds a slug from the title when none is sent, using
 * lowercase, one hyphen per run of non-alphanumerics, hyphens trimmed at both
 * ends. Duplicated here so the form can show and edit the slug that will be
 * used instead of leaving the admin guessing.
 */
export const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * A post date is stored as a timestamp. date inputs only speak YYYY-MM-DD, so
 * round-trip through that: take the leading ten characters on the way in, and
 * pin a saved date to midnight UTC on the way out. A missing date stays null,
 * which the backend treats as "not published yet".
 */
export const dateValue = (value) =>
  value ? String(value).slice(0, 10) : "";

const datePayload = (value) => (value ? `${value}T00:00:00.000Z` : null);

export const savePost = ({ slug, ...payload }) =>
  withLock(async () => {
    const body = { ...payload };
    body.published_at = datePayload(body.published_at);
    return request.post("/api/content/posts", body).then((r) => r.data);
  });

export const updatePost = (slug, { slug: _ignored, ...payload }) =>
  withLock(async () => {
    const body = { ...payload };
    body.published_at = datePayload(body.published_at);
    // The slug never moves on an edit; the server ignores it, so never send a
    // derived one that would 409 against another post.
    return request.put(`/api/content/posts/${encodeURIComponent(slug)}`, body).then((r) => r.data);
  });

export const deletePost = (slug) =>
  withLock(() => request.delete(`/api/content/posts/${encodeURIComponent(slug)}`)).then((r) => r.data);

export const saveProject = (payload) =>
  withLock(() => request.post("/api/content/projects", payload).then((r) => r.data));

export const updateProject = (slug, payload) =>
  withLock(() =>
    request.put(`/api/content/projects/${encodeURIComponent(slug)}`, payload).then((r) => r.data),
  );

export const deleteProject = (slug) =>
  withLock(() =>
    request.delete(`/api/content/projects/${encodeURIComponent(slug)}`).then((r) => r.data),
  );
