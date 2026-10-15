import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  ImagePlus,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Container } from "@/components/site/shared";
import { AdminHeader, AdminLogin } from "@/pages/AdminLogin";
import {
  CMS_BASE_URL,
  clearToken,
  dateValue,
  deletePost,
  deleteProject,
  errorMessage,
  fetchPosts,
  fetchProjects,
  isAuthenticated,
  savePost,
  saveProject,
  slugify,
  triggerDeploy,
  updatePost,
  updateProject,
  uploadImage,
} from "@/lib/cmsAdmin";

const STATUSES = ["draft", "published"];
const PROJECT_STATUSES = ["ongoing", "handed_over"];

const BLANK_POST = {
  title: "",
  excerpt: "",
  body: "",
  cover_image_url: "",
  author: "",
  status: "draft",
  published_at: "",
  meta_title: "",
  meta_description: "",
  related_links: "",
};

const BLANK_PROJECT = {
  title: "",
  locality: "",
  city: "Lucknow",
  area_sqft: "",
  plot_dimensions: "",
  package: "",
  status: "ongoing",
  handover_date: "",
  stage: "",
  summary: "",
  photos: "",
  cover_image_url: "",
};

/** From an empty form, the slug the server will derive; from a real one, its own. */
const slugFor = (form, original) => original?.slug || slugify(form.title);

/** Photos are stored as a JSON array of URLs; the textarea is one URL per line. */
const photosToText = (photos) => (Array.isArray(photos) ? photos.join("\n") : "");

const formatDate = (value) =>
  value ? String(value).slice(0, 10) : "—";

const Field = ({ label, hint, children, htmlFor }) => (
  <div>
    <label htmlFor={htmlFor} className="mono-label mb-2 block text-ink/50">
      {label}
    </label>
    {children}
    {hint ? <p className="mt-1.5 text-[12px] text-ink/45">{hint}</p> : null}
  </div>
);

const inputClass = "rounded-lg border-divider bg-paper text-[15px] font-medium focus-visible:ring-green";
const areaClass =
  "rounded-lg border-divider bg-paper font-mono text-[14px] leading-relaxed focus-visible:ring-green";

/* ------------------------------------------------------------------ */
/* Posts                                                              */
/* ------------------------------------------------------------------ */

const PostRow = ({ post, onEdit, onDelete, busy }) => (
  <li
    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
    data-testid={`admin-post-${post.slug}`}
  >
    <div className="min-w-0">
      <p className="truncate font-bold">{post.title}</p>
      <p className="mono-label mt-1 text-ink/40">
        /{post.slug} · {formatDate(post.published_at)}
      </p>
    </div>
    <div className="flex items-center gap-2">
      <span
        className={`rounded-full px-2.5 py-1 text-[12px] font-bold ${
          post.status === "published"
            ? "bg-wash-green text-green-700"
            : "bg-wash-yellow text-ink/60"
        }`}
        data-testid={`admin-post-status-${post.slug}`}
      >
        {post.status === "published" ? "Published" : "Draft"}
      </span>
      <Button variant="ghost" size="sm" onClick={() => onEdit(post)} className="rounded-lg">
        Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(post)}
        disabled={busy}
        aria-label={`Delete ${post.title}`}
        data-testid={`admin-post-delete-${post.slug}`}
        className="rounded-lg px-2 text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </li>
);

const PostEditor = ({ original, onSaved, onCancel }) => {
  const [form, setForm] = useState(() =>
    original
      ? {
          ...BLANK_POST,
          ...original,
          published_at: dateValue(original.published_at),
          related_links: photosToText(original.related_links),
        }
      : BLANK_POST,
  );
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const set = (key) => (value) =>
    setForm((prev) => ({ ...prev, [key]: value?.target ? value.target.value : value }));

  const onPickFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const { url } = await uploadImage(file);
      setForm((prev) => ({ ...prev, cover_image_url: url }));
    } catch (err) {
      setError(errorMessage(err, "The image could not be uploaded."));
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const payload = {
      ...form,
      slug: slugFor(form, original),
      related_links: form.related_links
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    };
    try {
      if (original) {
        await updatePost(original.slug, payload);
        onSaved("Post updated.");
      } else {
        await savePost(payload);
        onSaved("Post created.");
      }
    } catch (err) {
      setError(errorMessage(err, "The post could not be saved."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-5" data-testid="post-editor">
      <Field label="Title" htmlFor="post-title">
        <Input
          id="post-title"
          required
          data-testid="post-title-input"
          value={form.title}
          onChange={set("title")}
          className={inputClass}
          placeholder="Why your Lucknow home will cost more than the builder quoted"
        />
      </Field>
      <p className="-mt-3 font-mono text-[12px] text-ink/40" data-testid="post-slug-preview">
        /{slugFor(form, original) || "…"}
      </p>

      <Field label="Excerpt" hint="Shown in listings and search results." htmlFor="post-excerpt">
        <Textarea
          id="post-excerpt"
          rows={2}
          data-testid="post-excerpt-input"
          value={form.excerpt}
          onChange={set("excerpt")}
          className={areaClass}
        />
      </Field>

      <Field label="Body" hint="Plain text. Blank lines separate paragraphs." htmlFor="post-body">
        <Textarea
          id="post-body"
          required
          rows={14}
          data-testid="post-body-input"
          value={form.body}
          onChange={set("body")}
          className={areaClass}
        />
      </Field>

      <Field label="Cover image">
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onPickFile}
            data-testid="post-cover-file"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="rounded-lg"
            data-testid="post-cover-upload"
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            {uploading ? "Uploading…" : "Upload"}
          </Button>
          <Input
            value={form.cover_image_url}
            onChange={set("cover_image_url")}
            placeholder="https://…"
            className={`${inputClass} flex-1`}
            data-testid="post-cover-url-input"
          />
        </div>
        {form.cover_image_url ? (
          <img
            src={form.cover_image_url}
            alt=""
            className="mt-3 h-32 w-auto rounded-lg border border-divider object-cover"
          />
        ) : null}
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Author" htmlFor="post-author">
          <Input
            id="post-author"
            value={form.author}
            onChange={set("author")}
            className={inputClass}
            data-testid="post-author-input"
          />
        </Field>
        <Field label="Status">
          <Select
            value={form.status}
            onValueChange={set("status")}
            data-testid="post-status-select"
          >
            <SelectTrigger className={`${inputClass} h-12`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "published" ? "Published" : "Draft"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field
          label="Publish date"
          hint="Leave empty while the post is a draft."
          htmlFor="post-date"
        >
          <Input
            id="post-date"
            type="date"
            value={form.published_at}
            onChange={set("published_at")}
            className={inputClass}
            data-testid="post-date-input"
          />
        </Field>
        <Field label="Meta title" hint="Shown in the browser tab and search results." htmlFor="post-meta-title">
          <Input
            id="post-meta-title"
            value={form.meta_title}
            onChange={set("meta_title")}
            className={inputClass}
            data-testid="post-meta-title-input"
          />
        </Field>
      </div>

      <Field label="Meta description" htmlFor="post-meta-description">
        <Textarea
          id="post-meta-description"
          rows={2}
          value={form.meta_description}
          onChange={set("meta_description")}
          className={areaClass}
          data-testid="post-meta-description-input"
        />
      </Field>

      <Field
        label="Related links"
        hint="One URL per line. Used for the 'read next' links at the end of a post."
        htmlFor="post-links"
      >
        <Textarea
          id="post-links"
          rows={3}
          value={form.related_links}
          onChange={set("related_links")}
          className={areaClass}
          data-testid="post-links-input"
        />
      </Field>

      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-[14px] font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3 border-t border-divider pt-5">
        <Button
          type="submit"
          disabled={busy || !form.title}
          data-testid="post-save"
          className="rounded-lg bg-green px-8 text-[15px] font-bold text-ink hover:bg-green-600"
        >
          {busy ? "Saving…" : original ? "Save changes" : "Create post"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="rounded-lg px-5">
          Cancel
        </Button>
      </div>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/* Projects                                                           */
/* ------------------------------------------------------------------ */

const ProjectRow = ({ project, onEdit, onDelete, busy }) => (
  <li
    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
    data-testid={`admin-project-${project.slug}`}
  >
    <div className="min-w-0">
      <p className="truncate font-bold">{project.title}</p>
      <p className="mono-label mt-1 text-ink/40">
        {[project.locality, project.city].filter(Boolean).join(", ") || "—"} ·{" "}
        {project.status === "handed_over" ? "Handed over" : "Ongoing"}
      </p>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => onEdit(project)} className="rounded-lg">
        Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(project)}
        disabled={busy}
        aria-label={`Delete ${project.title}`}
        data-testid={`admin-project-delete-${project.slug}`}
        className="rounded-lg px-2 text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </li>
);

const ProjectEditor = ({ original, onSaved, onCancel }) => {
  const [form, setForm] = useState(() =>
    original
      ? {
          ...BLANK_PROJECT,
          ...original,
          area_sqft: original.area_sqft ?? "",
          handover_date: dateValue(original.handover_date),
          photos: photosToText(original.photos),
        }
      : BLANK_PROJECT,
  );
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const set = (key) => (value) =>
    setForm((prev) => ({ ...prev, [key]: value?.target ? value.target.value : value }));

  const onPickFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const { url } = await uploadImage(file);
      setForm((prev) => {
        const lines = prev.photos.split("\n").map((l) => l.trim()).filter(Boolean);
        return {
          ...prev,
          photos: [...lines, url].join("\n"),
          cover_image_url: prev.cover_image_url || url,
        };
      });
    } catch (err) {
      setError(errorMessage(err, "The image could not be uploaded."));
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const payload = {
      ...form,
      slug: slugFor(form, original),
      area_sqft: form.area_sqft === "" ? null : Number(form.area_sqft),
      handover_date: form.handover_date ? `${form.handover_date}T00:00:00.000Z` : null,
      photos: form.photos
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    };
    try {
      if (original) {
        await updateProject(original.slug, payload);
        onSaved("Project updated.");
      } else {
        await saveProject(payload);
        onSaved("Project created.");
      }
    } catch (err) {
      setError(errorMessage(err, "The project could not be saved."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-5" data-testid="project-editor">
      <Field label="Title" htmlFor="project-title">
        <Input
          id="project-title"
          required
          value={form.title}
          onChange={set("title")}
          className={inputClass}
          data-testid="project-title-input"
          placeholder="2BHK home in Gomti Nagar"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Locality" htmlFor="project-locality">
          <Input
            id="project-locality"
            value={form.locality}
            onChange={set("locality")}
            className={inputClass}
            data-testid="project-locality-input"
          />
        </Field>
        <Field label="City" htmlFor="project-city">
          <Input
            id="project-city"
            value={form.city}
            onChange={set("city")}
            className={inputClass}
            data-testid="project-city-input"
          />
        </Field>
        <Field label="Area (sq. ft.)" htmlFor="project-area">
          <Input
            id="project-area"
            type="number"
            min="0"
            value={form.area_sqft}
            onChange={set("area_sqft")}
            className={inputClass}
            data-testid="project-area-input"
          />
        </Field>
        <Field label="Plot dimensions" htmlFor="project-plot">
          <Input
            id="project-plot"
            value={form.plot_dimensions}
            onChange={set("plot_dimensions")}
            className={inputClass}
            placeholder="30×50 ft"
            data-testid="project-plot-input"
          />
        </Field>
        <Field label="Package" htmlFor="project-package">
          <Input
            id="project-package"
            value={form.package}
            onChange={set("package")}
            className={inputClass}
            data-testid="project-package-input"
          />
        </Field>
        <Field label="Stage" htmlFor="project-stage">
          <Input
            id="project-stage"
            value={form.stage}
            onChange={set("stage")}
            className={inputClass}
            placeholder="Structure complete"
            data-testid="project-stage-input"
          />
        </Field>
        <Field label="Status">
          <Select
            value={form.status}
            onValueChange={set("status")}
            data-testid="project-status-select"
          >
            <SelectTrigger className={`${inputClass} h-12`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "handed_over" ? "Handed over" : "Ongoing"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Handover date" htmlFor="project-handover">
          <Input
            id="project-handover"
            type="date"
            value={form.handover_date}
            onChange={set("handover_date")}
            className={inputClass}
            data-testid="project-handover-input"
          />
        </Field>
      </div>

      <Field label="Summary" htmlFor="project-summary">
        <Textarea
          id="project-summary"
          rows={3}
          value={form.summary}
          onChange={set("summary")}
          className={areaClass}
          data-testid="project-summary-input"
        />
      </Field>

      <Field
        label="Photos"
        hint="One image URL per line. The first is used as the cover."
        htmlFor="project-photos"
      >
        <Textarea
          id="project-photos"
          rows={4}
          value={form.photos}
          onChange={set("photos")}
          className={areaClass}
          data-testid="project-photos-input"
        />
      </Field>

      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={onPickFile}
          data-testid="project-photo-file"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="rounded-lg"
          data-testid="project-photo-upload"
        >
          <ImagePlus className="mr-2 h-4 w-4" />
          {uploading ? "Uploading…" : "Upload and add"}
        </Button>
      </div>

      <Field label="Cover image URL" htmlFor="project-cover">
        <Input
          id="project-cover"
          value={form.cover_image_url}
          onChange={set("cover_image_url")}
          placeholder="https://…"
          className={inputClass}
          data-testid="project-cover-input"
        />
      </Field>

      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-[14px] font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3 border-t border-divider pt-5">
        <Button
          type="submit"
          disabled={busy || !form.title}
          data-testid="project-save"
          className="rounded-lg bg-green px-8 text-[15px] font-bold text-ink hover:bg-green-600"
        >
          {busy ? "Saving…" : original ? "Save changes" : "Create project"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="rounded-lg px-5">
          Cancel
        </Button>
      </div>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

const SectionHead = ({ title, count, action }) => (
  <div className="flex items-center justify-between border-b border-divider px-5 py-4">
    <h2 className="text-[17px] font-bold">
      {title} <span className="mono-label ml-1 text-ink/40">{count}</span>
    </h2>
    {action}
  </div>
);

const Empty = ({ children }) => (
  <p className="px-5 py-10 text-center text-[14px] text-ink/45">{children}</p>
);

export default function AdminPage() {
  const [authed, setAuthed] = useState(isAuthenticated);
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = "Admin — Ghar Banwao";
  }, []);

  const say = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 4000);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [postItems, projectItems] = await Promise.all([
        fetchPosts(true),
        fetchProjects(),
      ]);
      setPosts(postItems);
      setProjects(projectItems);
    } catch (err) {
      setError(errorMessage(err, "Could not load content."));
      if (!isAuthenticated()) setAuthed(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) refresh();
  }, [authed, refresh]);

  const signOut = () => {
    clearToken();
    setAuthed(false);
    setEditing(null);
  };

  const removePost = async (post) => {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await deletePost(post.slug);
      setPosts((prev) => prev.filter((p) => p.slug !== post.slug));
      say("Post deleted.");
    } catch (err) {
      setError(errorMessage(err, "The post could not be deleted."));
    } finally {
      setBusy(false);
    }
  };

  const removeProject = async (project) => {
    if (!window.confirm(`Delete “${project.title}”? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await deleteProject(project.slug);
      setProjects((prev) => prev.filter((p) => p.slug !== project.slug));
      say("Project deleted.");
    } catch (err) {
      setError(errorMessage(err, "The project could not be deleted."));
    } finally {
      setBusy(false);
    }
  };

  const deploy = async () => {
    setBusy(true);
    try {
      const { message } = await triggerDeploy();
      say(message || "Rebuild started.");
    } catch (err) {
      setError(errorMessage(err, "The rebuild could not be started."));
    } finally {
      setBusy(false);
    }
  };

  if (!authed) {
    return <AdminLogin onAuthenticated={() => setAuthed(true)} />;
  }

  const q = query.trim().toLowerCase();
  const match = (post) =>
    !q || post.title.toLowerCase().includes(q) || post.slug.includes(q);
  const matchProject = (project) =>
    !q ||
    project.title.toLowerCase().includes(q) ||
    project.slug.includes(q) ||
    (project.locality || "").toLowerCase().includes(q);
  const visiblePosts = posts.filter(match);
  const visibleProjects = projects.filter(matchProject);

  if (editing) {
    const Editor = editing.kind === "posts" ? PostEditor : ProjectEditor;
    return (
      <div className="min-h-screen bg-paper">
        <AdminHeader onSignOut={signOut} />
        <Container className="py-10">
          <Button
            variant="ghost"
            onClick={() => setEditing(null)}
            className="mb-6 rounded-lg px-3"
            data-testid="editor-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to content
          </Button>
          <div className="card-gb mx-auto max-w-3xl p-6 md:p-8">
            <h1 className="mb-6 text-[26px] font-extrabold tracking-tight">
              {editing.item
                ? `Edit ${editing.kind === "posts" ? "post" : "project"}`
                : `New ${editing.kind === "posts" ? "post" : "project"}`}
            </h1>
            <Editor
              key={editing.item ? editing.item.slug : "new"}
              original={editing.item}
              onSaved={(message) => {
                setEditing(null);
                say(message);
                refresh();
              }}
              onCancel={() => setEditing(null)}
            />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper" data-testid="admin-shell">
      <AdminHeader onSignOut={signOut} />
      <Container className="py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="display text-[34px] md:text-[42px]">Content</h1>
            <p className="mt-2 max-w-[52ch] text-[15px] text-ink/65">
              Posts and projects are written to the database immediately. The public
              site picks up changes when you publish a rebuild.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button
              variant="outline"
              onClick={refresh}
              disabled={loading || busy}
              className="h-11 rounded-lg px-4"
              data-testid="admin-refresh"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              onClick={deploy}
              disabled={busy}
              className="h-11 rounded-lg bg-green px-5 text-[14px] font-bold text-ink hover:bg-green-600"
              data-testid="admin-deploy"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Publish site
            </Button>
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-[14px] font-medium text-red-700"
          >
            {error}
          </p>
        ) : null}

        <div className="relative mt-8 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by title or slug"
            aria-label="Filter content"
            className={`${inputClass} h-11 pl-9`}
            data-testid="admin-filter"
          />
        </div>

        <div className="mt-8 grid gap-8">
          <section className="card-gb overflow-hidden" data-testid="admin-posts">
            <SectionHead
              title="Posts"
              count={visiblePosts.length}
              action={
                <Button
                  onClick={() => setEditing({ kind: "posts", item: null })}
                  className="h-9 rounded-lg bg-green px-4 text-[13px] font-bold text-ink hover:bg-green-600"
                  data-testid="admin-post-new"
                >
                  <Plus className="mr-1.5 h-4 w-4" strokeWidth={2.5} />
                  New post
                </Button>
              }
            />
            {visiblePosts.length === 0 ? (
              <Empty>No posts yet. Create the first one.</Empty>
            ) : (
              <ul className="divide-y divide-divider" data-testid="admin-post-list">
                {visiblePosts.map((post) => (
                  <PostRow
                    key={post.slug}
                    post={post}
                    busy={busy}
                    onEdit={(item) => setEditing({ kind: "posts", item })}
                    onDelete={removePost}
                  />
                ))}
              </ul>
            )}
          </section>

          <section className="card-gb overflow-hidden" data-testid="admin-projects">
            <SectionHead
              title="Projects"
              count={visibleProjects.length}
              action={
                <Button
                  onClick={() => setEditing({ kind: "projects", item: null })}
                  className="h-9 rounded-lg bg-green px-4 text-[13px] font-bold text-ink hover:bg-green-600"
                  data-testid="admin-project-new"
                >
                  <Plus className="mr-1.5 h-4 w-4" strokeWidth={2.5} />
                  New project
                </Button>
              }
            />
            {visibleProjects.length === 0 ? (
              <Empty>No projects yet. Create the first one.</Empty>
            ) : (
              <ul className="divide-y divide-divider" data-testid="admin-project-list">
                {visibleProjects.map((project) => (
                  <ProjectRow
                    key={project.slug}
                    project={project}
                    busy={busy}
                    onEdit={(item) => setEditing({ kind: "projects", item })}
                    onDelete={removeProject}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>

        <p className="mono-label mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-ink/40">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" /> {posts.length} posts ·{" "}
            {projects.length} projects
          </span>
          <a
            href={CMS_BASE_URL.replace(/\/api.*$/, "") + "/docs"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-ink"
          >
            <ExternalLink className="h-3.5 w-3.5" /> API docs
          </a>
        </p>
      </Container>

      {toast ? (
        <div
          role="status"
          data-testid="admin-toast"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-[14px] font-semibold text-paper shadow-lg"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}