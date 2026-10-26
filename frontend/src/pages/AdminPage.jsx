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
  deleteAuthor,
  deleteCaseStudy,
  deletePost,
  deleteProject,
  errorMessage,
  fetchAuthors,
  fetchCaseStudies,
  fetchPosts,
  fetchProjects,
  fetchRegistrations,
  isAuthenticated,
  saveAuthor,
  saveCaseStudy,
  savePost,
  saveProject,
  slugify,
  triggerDeploy,
  updateAuthor,
  updateCaseStudy,
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
  review_text: "",
  review_video_url: "",
};

const BLANK_CASE_STUDY = {
  title: "",
  locality: "",
  city: "Lucknow",
  gb_id: "",
  plot_dimensions: "",
  area_sqft: "",
  package: "",
  owner: "",
  summary: "",
  challenge: "",
  solution: "",
  quote: "",
  duration_months: "",
  budget_lakhs: "",
  status: "draft",
  photos: "",
  cover_image_url: "",
};

const BLANK_AUTHOR = {
  name: "",
  title: "",
  bio: "",
  photo_url: "",
  social: {},
};

const SOCIAL_KEYS = [
  ["linkedin", "LinkedIn"],
  ["instagram", "Instagram"],
  ["youtube", "YouTube"],
  ["website", "Website"],
];

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
            alt={`Cover preview for ${form.title || "this post"}`}
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

      <Field
        label="Review"
        hint="The owner's words about this build, shown on the public project page. Leave empty if there is none."
        htmlFor="project-review"
      >
        <Textarea
          id="project-review"
          rows={3}
          value={form.review_text || ""}
          onChange={set("review_text")}
          className={areaClass}
          placeholder="“They delivered exactly what the quote promised…”"
          data-testid="project-review-text-input"
        />
      </Field>

      <Field
        label="Review video link"
        hint="A YouTube or Instagram link to a review / walkthrough video for this project. Leave empty if none."
        htmlFor="project-review-video"
      >
        <Input
          id="project-review-video"
          value={form.review_video_url || ""}
          onChange={set("review_video_url")}
          placeholder="https://youtube.com/… or https://instagram.com/reel/…"
          className={inputClass}
          data-testid="project-review-video-input"
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
/* Case studies                                                       */
/* ------------------------------------------------------------------ */

const CaseStudyRow = ({ study, onEdit, onDelete, busy }) => (
  <li
    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
    data-testid={`admin-case-study-${study.slug}`}
  >
    <div className="min-w-0">
      <p className="truncate font-bold">
        {study.gb_id ? <span className="mono-label mr-2 text-green-700">{study.gb_id}</span> : null}
        {study.title}
      </p>
      <p className="mono-label mt-1 text-ink/40">
        {[study.locality, study.city].filter(Boolean).join(", ") || "—"} ·{" "}
        {study.status === "published" ? "Published" : "Draft"}
      </p>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => onEdit(study)} className="rounded-lg">
        Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(study)}
        disabled={busy}
        aria-label={`Delete ${study.title}`}
        data-testid={`admin-case-study-delete-${study.slug}`}
        className="rounded-lg px-2 text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </li>
);

const CaseStudyEditor = ({ original, onSaved, onCancel }) => {
  const [form, setForm] = useState(() =>
    original
      ? {
          ...BLANK_CASE_STUDY,
          ...original,
          area_sqft: original.area_sqft ?? "",
          duration_months: original.duration_months ?? "",
          budget_lakhs: original.budget_lakhs ?? "",
          photos: photosToText(original.photos),
        }
      : BLANK_CASE_STUDY,
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

  const numOr = (v) => (v === "" || v == null ? null : Number(v));

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const payload = {
      ...form,
      slug: slugFor(form, original),
      gb_id: form.gb_id || null,
      area_sqft: numOr(form.area_sqft),
      duration_months: numOr(form.duration_months),
      budget_lakhs: numOr(form.budget_lakhs),
      photos: form.photos
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    };
    try {
      if (original) {
        await updateCaseStudy(original.slug, payload);
        onSaved("Case study updated.");
      } else {
        await saveCaseStudy(payload);
        onSaved("Case study created.");
      }
    } catch (err) {
      setError(errorMessage(err, "The case study could not be saved."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-5" data-testid="case-study-editor">
      <Field label="Title" htmlFor="cs-title">
        <Input
          id="cs-title"
          required
          value={form.title}
          onChange={set("title")}
          className={inputClass}
          data-testid="cs-title-input"
          placeholder="GB-216 | 1670 Sq.ft - Near Peeli kothi"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="GB ID" htmlFor="cs-gb-id" hint="Project reference, e.g. GB-216.">
          <Input
            id="cs-gb-id"
            value={form.gb_id}
            onChange={set("gb_id")}
            className={inputClass}
            data-testid="cs-gb-id-input"
            placeholder="GB-216"
          />
        </Field>
        <Field label="Status">
          <Select
            value={form.status}
            onValueChange={set("status")}
            data-testid="cs-status-select"
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
        <Field label="Locality" htmlFor="cs-locality">
          <Input
            id="cs-locality"
            value={form.locality}
            onChange={set("locality")}
            className={inputClass}
            data-testid="cs-locality-input"
            placeholder="Peeli kothi, Triveni Nagar"
          />
        </Field>
        <Field label="City" htmlFor="cs-city">
          <Input
            id="cs-city"
            value={form.city}
            onChange={set("city")}
            className={inputClass}
            data-testid="cs-city-input"
          />
        </Field>
        <Field label="Area (sq. ft.)" htmlFor="cs-area">
          <Input
            id="cs-area"
            type="number"
            min="0"
            value={form.area_sqft}
            onChange={set("area_sqft")}
            className={inputClass}
            data-testid="cs-area-input"
          />
        </Field>
        <Field label="Plot dimensions" htmlFor="cs-plot">
          <Input
            id="cs-plot"
            value={form.plot_dimensions}
            onChange={set("plot_dimensions")}
            className={inputClass}
            placeholder="30×50 ft"
            data-testid="cs-plot-input"
          />
        </Field>
        <Field label="Package" htmlFor="cs-package">
          <Input
            id="cs-package"
            value={form.package}
            onChange={set("package")}
            className={inputClass}
            placeholder="Gold"
            data-testid="cs-package-input"
          />
        </Field>
        <Field label="Owner" htmlFor="cs-owner" hint="Shown under the quote.">
          <Input
            id="cs-owner"
            value={form.owner}
            onChange={set("owner")}
            className={inputClass}
            data-testid="cs-owner-input"
            placeholder="Delhi-based family"
          />
        </Field>
        <Field label="Duration (months)" htmlFor="cs-duration">
          <Input
            id="cs-duration"
            type="number"
            min="0"
            value={form.duration_months}
            onChange={set("duration_months")}
            className={inputClass}
            data-testid="cs-duration-input"
          />
        </Field>
        <Field label="Budget (₹ lakh)" htmlFor="cs-budget">
          <Input
            id="cs-budget"
            type="number"
            min="0"
            step="0.5"
            value={form.budget_lakhs}
            onChange={set("budget_lakhs")}
            className={inputClass}
            data-testid="cs-budget-input"
          />
        </Field>
      </div>

      <Field label="Summary" htmlFor="cs-summary" hint="The one-line subhead.">
        <Textarea
          id="cs-summary"
          rows={2}
          value={form.summary}
          onChange={set("summary")}
          className={areaClass}
          data-testid="cs-summary-input"
          placeholder="Living in Delhi. Building a Home in Lucknow."
        />
      </Field>

      <Field label="Challenge" htmlFor="cs-challenge">
        <Textarea
          id="cs-challenge"
          rows={3}
          value={form.challenge}
          onChange={set("challenge")}
          className={areaClass}
          data-testid="cs-challenge-input"
        />
      </Field>

      <Field label="Solution" htmlFor="cs-solution">
        <Textarea
          id="cs-solution"
          rows={3}
          value={form.solution}
          onChange={set("solution")}
          className={areaClass}
          data-testid="cs-solution-input"
        />
      </Field>

      <Field label="Owner quote" htmlFor="cs-quote">
        <Textarea
          id="cs-quote"
          rows={2}
          value={form.quote}
          onChange={set("quote")}
          className={areaClass}
          data-testid="cs-quote-input"
        />
      </Field>

      <Field
        label="Photos"
        hint="One image URL per line. The first is used as the cover."
        htmlFor="cs-photos"
      >
        <Textarea
          id="cs-photos"
          rows={4}
          value={form.photos}
          onChange={set("photos")}
          className={areaClass}
          data-testid="cs-photos-input"
        />
      </Field>

      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={onPickFile}
          data-testid="cs-photo-file"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="rounded-lg"
          data-testid="cs-photo-upload"
        >
          <ImagePlus className="mr-2 h-4 w-4" />
          {uploading ? "Uploading…" : "Upload and add"}
        </Button>
      </div>

      <Field label="Cover image URL" htmlFor="cs-cover">
        <Input
          id="cs-cover"
          value={form.cover_image_url}
          onChange={set("cover_image_url")}
          placeholder="https://…"
          className={inputClass}
          data-testid="cs-cover-input"
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
          data-testid="cs-save"
          className="rounded-lg bg-green px-8 text-[15px] font-bold text-ink hover:bg-green-600"
        >
          {busy ? "Saving…" : original ? "Save changes" : "Create case study"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="rounded-lg px-5">
          Cancel
        </Button>
      </div>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/* Authors                                                            */
/* ------------------------------------------------------------------ */

const AuthorRow = ({ author, onEdit, onDelete, busy }) => (
  <li
    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
    data-testid={`admin-author-${author.slug}`}
  >
    <div className="flex min-w-0 items-center gap-3">
      {author.photo_url ? (
        <img
          src={author.photo_url}
          alt={author.name}
          className="h-10 w-10 shrink-0 rounded-full object-cover border border-divider"
        />
      ) : (
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-wash-yellow text-[15px] font-bold text-ink/60">
          {(author.name || "?").charAt(0)}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate font-bold">{author.name}</p>
        <p className="mono-label mt-0.5 text-ink/40 truncate">
          {author.title || "—"} · /{author.slug}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => onEdit(author)} className="rounded-lg">
        Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(author)}
        disabled={busy}
        aria-label={`Delete ${author.name}`}
        data-testid={`admin-author-delete-${author.slug}`}
        className="rounded-lg px-2 text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </li>
);

const AuthorEditor = ({ original, onSaved, onCancel }) => {
  const [form, setForm] = useState(() =>
    original
      ? {
          ...BLANK_AUTHOR,
          ...original,
          social: { ...BLANK_AUTHOR.social, ...(original.social || {}) },
        }
      : BLANK_AUTHOR,
  );
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const set = (key) => (value) =>
    setForm((prev) => ({ ...prev, [key]: value?.target ? value.target.value : value }));
  const setSocial = (channel) => (value) =>
    setForm((prev) => ({ ...prev, social: { ...prev.social, [channel]: value.target.value } }));

  const onPickFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const { url } = await uploadImage(file);
      setForm((prev) => ({ ...prev, photo_url: url }));
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
    // Blank channel URLs are dropped so the bio page only renders real links.
    const social = Object.fromEntries(
      Object.entries(form.social || {})
        .map(([k, v]) => [k, String(v || "").trim()])
        .filter(([, v]) => v),
    );
    const payload = {
      ...form,
      slug: original ? original.slug : slugFor(form, null),
      social,
    };
    try {
      if (original) {
        await updateAuthor(original.slug, payload);
        onSaved("Author updated.");
      } else {
        await saveAuthor(payload);
        onSaved("Author created.");
      }
    } catch (err) {
      setError(errorMessage(err, "The author could not be saved."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-5" data-testid="author-editor">
      <Field label="Name" hint="Shown in the byline; the slug is derived from it." htmlFor="author-name">
        <Input
          id="author-name"
          required
          value={form.name}
          onChange={set("name")}
          className={inputClass}
          data-testid="author-name-input"
          placeholder="Er. Virendra Kumar Nishad"
        />
      </Field>

      <Field label="Title" hint="The role or one-liner under the name." htmlFor="author-title">
        <Input
          id="author-title"
          value={form.title}
          onChange={set("title")}
          className={inputClass}
          data-testid="author-title-input"
          placeholder="Chairman & Managing Director"
        />
      </Field>

      <Field label="Bio" htmlFor="author-bio">
        <Textarea
          id="author-bio"
          rows={4}
          value={form.bio}
          onChange={set("bio")}
          className={areaClass}
          data-testid="author-bio-input"
        />
      </Field>

      <Field label="Photo">
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onPickFile}
            data-testid="author-photo-file"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="rounded-lg"
            data-testid="author-photo-upload"
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            {uploading ? "Uploading…" : "Upload"}
          </Button>
          <Input
            value={form.photo_url}
            onChange={set("photo_url")}
            placeholder="https://…"
            className={`${inputClass} flex-1`}
            data-testid="author-photo-url-input"
          />
        </div>
        {form.photo_url ? (
          <img
            src={form.photo_url}
            alt={`Photo preview for ${form.name || "this author"}`}
            className="mt-3 h-20 w-20 rounded-full border border-divider object-cover"
          />
        ) : null}
      </Field>

      <Field label="Social links" hint="Only filled-in channels appear on the author page.">
        <div className="grid gap-3">
          {SOCIAL_KEYS.map(([key, label]) => (
            <div key={key} className="flex items-center gap-3">
              <span className="w-20 shrink-0 mono-label text-[13px] text-ink/50">{label}</span>
              <Input
                value={form.social[key] || ""}
                onChange={setSocial(key)}
                placeholder={key === "website" ? "https://…" : `https://…/${key}`}
                className={`${inputClass} flex-1`}
                data-testid={`author-social-${key}-input`}
              />
            </div>
          ))}
        </div>
      </Field>

      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-[14px] font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3 border-t border-divider pt-5">
        <Button
          type="submit"
          disabled={busy || !form.name}
          data-testid="author-save"
          className="rounded-lg bg-green px-8 text-[15px] font-bold text-ink hover:bg-green-600"
        >
          {busy ? "Saving…" : original ? "Save changes" : "Create author"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="rounded-lg px-5">
          Cancel
        </Button>
      </div>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/* Registrations                                                      */
/* ------------------------------------------------------------------ */

const REG_TYPE_LABELS = {
  vendor: "Vendor",
  channel_partner: "Channel partner",
  hiring: "Hiring",
};

const RegistrationCard = ({ reg, index }) => {
  const extra = reg.category
    ? ` · ${reg.category}`
    : reg.experience_years
      ? ` · ${reg.experience_years}`
      : reg.role
        ? ` · ${reg.role}`
        : "";
  const waLink = reg.whatsapp_fallback
    ? `https://wa.me/${String(reg.whatsapp || reg.phone || "").replace(/[^0-9]/g, "")}`
    : null;
  return (
    <li className="px-5 py-4" data-testid={`admin-registration-${index}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-bold">
          {reg.name}
          <span className="ml-2 rounded-full bg-wash-yellow px-2 py-0.5 text-[11px] font-bold text-ink/60">
            {REG_TYPE_LABELS[reg.type] || reg.type}
          </span>
        </p>
        <span className="font-mono text-[11px] text-ink/40">{reg.created_at?.slice(0, 10)}</span>
      </div>
      <p className="mono-label mt-1.5 text-[12px] text-ink/50">
        {[reg.city, reg.phone, reg.email].filter(Boolean).join(" · ")}
        {reg.company_name ? ` · ${reg.company_name}` : ""}
        {extra}
      </p>
      {reg.message ? (
        <p className="mt-2 text-[13px] text-ink/70">{reg.message}</p>
      ) : null}
    </li>
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

// Tells the owner what the current state of one section actually is: still
// loading, ready with N items, or unavailable (a missing endpoint on a not-
// yet deployed backend). Shown above the list so "0" can no longer be mistaken
// for "we haven't done anything here" when the data just hasn't loaded.
const StatusBanner = ({ meta, noun, onRetry }) => {
  if (meta.status === "loading") {
    return (
      <p className="px-5 py-3 text-[13px] font-mono text-ink/50" role="status">
        Loading {noun}…
      </p>
    );
  }
  if (meta.status === "error") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-divider bg-red-50/60 px-5 py-3">
        <p className="text-[13px] font-medium text-red-700" role="alert">
          {meta.error || "This section could not be loaded."}{" "}
          <span className="text-red-600/80">
            The content service may not have this endpoint deployed yet.
          </span>
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="h-8 rounded-lg px-3 text-[12px]"
          data-testid={`admin-retry-${noun}`}
        >
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }
  return null;
};

// One dashboard tab per kind of work. Registrations and Authors are read-only
// views (their create/edit happens in the other tabs or on the site itself).
const TABS = [
  { key: "posts", label: "Blog posts", noun: "posts", testid: "admin-tab-posts" },
  { key: "projects", label: "Projects", noun: "projects", testid: "admin-tab-projects" },
  { key: "caseStudies", label: "Case studies", noun: "case studies", testid: "admin-tab-case-studies" },
  { key: "authors", label: "Authors", noun: "authors", testid: "admin-tab-authors" },
  { key: "registrations", label: "Registrations", noun: "registrations", testid: "admin-tab-registrations" },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(isAuthenticated);
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  // Per-section load status so one missing endpoint on a stale backend can
  // show "this section is unavailable" instead of blanking every list to 0.
  const [listMeta, setListMeta] = useState({
    posts: { status: "idle", error: "" },
    projects: { status: "idle", error: "" },
    caseStudies: { status: "idle", error: "" },
    authors: { status: "idle", error: "" },
    registrations: { status: "idle", error: "" },
  });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [query, setQuery] = useState("");
  // The dashboard is one tab per content type — review / edit / delete /
  // add-photos-later for each kind of work, as the owner asked.
  const [tab, setTab] = useState("posts");

  useEffect(() => {
    document.title = "Admin — Ghar Banwao";
  }, []);

  const say = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 4000);
  }, []);

  // Each section is fetched on its own so a missing endpoint on a not-yet
  // deployed backend (a 404 "Not Found") degrades that one section to a
  // status message instead of rejecting the whole Promise.all and blanking
  // every list to 0 — the bug that hid Projects, which had real data.
  const loadSection = useCallback(
    async (key, fetcher, setter) => {
      setListMeta((m) => ({ ...m, [key]: { status: "loading", error: "" } }));
      try {
        setter(await fetcher());
        setListMeta((m) => ({ ...m, [key]: { status: "ready", error: "" } }));
      } catch (err) {
        const message = errorMessage(err, "This section could not be loaded.");
        setListMeta((m) => ({ ...m, [key]: { status: "error", error: message } }));
        // Only a 401 (expired token) signs the admin out; anything else — a
        // missing endpoint, a network blip — is reported per-section instead.
        if (err.response && err.response.status === 401) {
          if (!isAuthenticated()) setAuthed(false);
        }
      }
    },
    []
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    setListMeta({
      posts: { status: "loading", error: "" },
      projects: { status: "loading", error: "" },
      caseStudies: { status: "loading", error: "" },
      authors: { status: "loading", error: "" },
      registrations: { status: "loading", error: "" },
    });
    await Promise.allSettled([
      loadSection("posts", () => fetchPosts(true), setPosts),
      loadSection("projects", () => fetchProjects(), setProjects),
      loadSection("caseStudies", () => fetchCaseStudies(true), setCaseStudies),
      loadSection("authors", () => fetchAuthors(), setAuthors),
      loadSection("registrations", () => fetchRegistrations(), setRegistrations),
    ]);
    setLoading(false);
  }, [loadSection]);

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

  const removeCaseStudy = async (study) => {
    if (!window.confirm(`Delete “${study.title}”? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await deleteCaseStudy(study.slug);
      setCaseStudies((prev) => prev.filter((s) => s.slug !== study.slug));
      say("Case study deleted.");
    } catch (err) {
      setError(errorMessage(err, "The case study could not be deleted."));
    } finally {
      setBusy(false);
    }
  };

  const removeAuthor = async (author) => {
    if (!window.confirm(`Delete “${author.name}”? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await deleteAuthor(author.slug);
      setAuthors((prev) => prev.filter((a) => a.slug !== author.slug));
      say("Author deleted.");
    } catch (err) {
      setError(errorMessage(err, "The author could not be deleted."));
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
  const matchCaseStudy = (study) =>
    !q ||
    study.title.toLowerCase().includes(q) ||
    study.slug.includes(q) ||
    (study.gb_id || "").toLowerCase().includes(q) ||
    (study.locality || "").toLowerCase().includes(q);
  const matchAuthor = (author) =>
    !q || author.name.toLowerCase().includes(q) || author.slug.includes(q);
  const matchRegistration = (reg) =>
    !q ||
    reg.name.toLowerCase().includes(q) ||
    String(reg.type || "").toLowerCase().includes(q) ||
    (reg.city || "").toLowerCase().includes(q);
  const visiblePosts = posts.filter(match);
  const visibleProjects = projects.filter(matchProject);
  const visibleCaseStudies = caseStudies.filter(matchCaseStudy);
  const visibleAuthors = authors.filter(matchAuthor);
  const visibleRegistrations = registrations.filter(matchRegistration);

  const counts = {
    posts: posts.length,
    projects: projects.length,
    caseStudies: caseStudies.length,
    authors: authors.length,
    registrations: registrations.length,
  };

  if (editing) {
    const Editor =
      editing.kind === "case-studies"
        ? CaseStudyEditor
        : editing.kind === "projects"
          ? ProjectEditor
          : editing.kind === "authors"
            ? AuthorEditor
            : PostEditor;
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
                ? `Edit ${
                    editing.kind === "case-studies"
                      ? "case study"
                      : editing.kind === "projects"
                        ? "project"
                        : editing.kind === "authors"
                          ? "author"
                          : "post"
                  }`
                : `New ${
                    editing.kind === "case-studies"
                      ? "case study"
                      : editing.kind === "projects"
                        ? "project"
                        : editing.kind === "authors"
                          ? "author"
                          : "post"
                  }`}
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
            <p className="mt-2 max-w-[58ch] text-[15px] text-ink/65">
              Manage each kind of work from its own tab — review what's already
              there, edit, delete, or add photos later. Changes hit the database
              immediately; the public site updates when you publish a rebuild.
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
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 rounded-lg border border-divider bg-paper px-4 text-[14px] font-semibold text-ink hover:bg-wash-yellow inline-flex items-center gap-2"
              data-testid="admin-search-console"
            >
              <ExternalLink className="h-4 w-4 text-ink/50" />
              Google Search Console
            </a>
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

        {/* Deploy config — only shown so a missing hook surfaces here, not as
            a mystery 503. "Publish site" is the action; this explains state. */}
        <p className="mono-label mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-ink/50">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {posts.length} posts · {projects.length} projects · {caseStudies.length} case
            studies · {authors.length} authors · {registrations.length} registrations
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
            placeholder="Filter by title, slug or name"
            aria-label="Filter content"
            className={`${inputClass} h-11 pl-9`}
            data-testid="admin-filter"
          />
        </div>

        {/* Per-type dashboard tabs */}
        <div className="mt-6 flex flex-wrap gap-1.5 border-b border-divider pb-px" role="tablist" data-testid="admin-tabs">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.key)}
                className={`h-10 rounded-t-lg px-4 text-[14px] font-bold transition-colors border border-b-0 ${
                  active
                    ? "border-divider bg-paper text-ink"
                    : "border-transparent text-ink/50 hover:text-ink"
                }`}
                data-testid={t.testid}
              >
                {t.label}
                <span className={`ml-1.5 font-mono text-[12px] ${active ? "text-green-700" : "text-ink/40"}`}>
                  {counts[t.key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active content type */}
        <div className="grid gap-8" data-testid={`admin-active-panel-${tab}`}>
          {tab === "posts" && (
            <section className="card-gb overflow-hidden" data-testid="admin-posts">
              <SectionHead
                title="Blog posts"
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
              <StatusBanner meta={listMeta.posts} noun="posts" onRetry={() => loadSection("posts", () => fetchPosts(true), setPosts)} />
              {listMeta.posts.status === "ready" &&
                (visiblePosts.length === 0 ? (
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
                ))}
            </section>
          )}

          {tab === "projects" && (
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
              <StatusBanner meta={listMeta.projects} noun="projects" onRetry={() => loadSection("projects", () => fetchProjects(), setProjects)} />
              {listMeta.projects.status === "ready" &&
                (visibleProjects.length === 0 ? (
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
                ))}
            </section>
          )}

          {tab === "caseStudies" && (
            <section className="card-gb overflow-hidden" data-testid="admin-case-studies">
              <SectionHead
                title="Case studies"
                count={visibleCaseStudies.length}
                action={
                  <Button
                    onClick={() => setEditing({ kind: "case-studies", item: null })}
                    className="h-9 rounded-lg bg-green px-4 text-[13px] font-bold text-ink hover:bg-green-600"
                    data-testid="admin-case-study-new"
                  >
                    <Plus className="mr-1.5 h-4 w-4" strokeWidth={2.5} />
                    New case study
                  </Button>
                }
              />
              <StatusBanner meta={listMeta.caseStudies} noun="case studies" onRetry={() => loadSection("caseStudies", () => fetchCaseStudies(true), setCaseStudies)} />
              {listMeta.caseStudies.status === "ready" &&
                (visibleCaseStudies.length === 0 ? (
                  <Empty>No case studies yet. Create the first one.</Empty>
                ) : (
                  <ul className="divide-y divide-divider" data-testid="admin-case-study-list">
                    {visibleCaseStudies.map((study) => (
                      <CaseStudyRow
                        key={study.slug}
                        study={study}
                        busy={busy}
                        onEdit={(item) => setEditing({ kind: "case-studies", item })}
                        onDelete={removeCaseStudy}
                      />
                    ))}
                  </ul>
                ))}
            </section>
          )}

          {tab === "authors" && (
            <section className="card-gb overflow-hidden" data-testid="admin-authors">
              <SectionHead
                title="Authors"
                count={visibleAuthors.length}
                action={
                  <Button
                    onClick={() => setEditing({ kind: "authors", item: null })}
                    className="h-9 rounded-lg bg-green px-4 text-[13px] font-bold text-ink hover:bg-green-600"
                    data-testid="admin-author-new"
                  >
                    <Plus className="mr-1.5 h-4 w-4" strokeWidth={2.5} />
                    New author
                  </Button>
                }
              />
              <StatusBanner meta={listMeta.authors} noun="authors" onRetry={() => loadSection("authors", () => fetchAuthors(), setAuthors)} />
              {listMeta.authors.status === "ready" &&
                (visibleAuthors.length === 0 ? (
                  <Empty>No authors yet. Create the first one.</Empty>
                ) : (
                  <ul className="divide-y divide-divider" data-testid="admin-author-list">
                    {visibleAuthors.map((author) => (
                      <AuthorRow
                        key={author.slug}
                        author={author}
                        busy={busy}
                        onEdit={(item) => setEditing({ kind: "authors", item })}
                        onDelete={removeAuthor}
                      />
                    ))}
                  </ul>
                ))}
            </section>
          )}

          {tab === "registrations" && (
            <section className="card-gb overflow-hidden" data-testid="admin-registrations">
              <SectionHead title="Registrations" count={visibleRegistrations.length} />
              <StatusBanner meta={listMeta.registrations} noun="registrations" onRetry={() => loadSection("registrations", () => fetchRegistrations(), setRegistrations)} />
              {listMeta.registrations.status === "ready" &&
                (visibleRegistrations.length === 0 ? (
                  <Empty>No registrations yet.</Empty>
                ) : (
                  <ul className="divide-y divide-divider" data-testid="admin-registration-list">
                    {visibleRegistrations.map((reg, i) => (
                      <RegistrationCard key={reg.id || i} reg={reg} index={i} />
                    ))}
                  </ul>
                ))}
            </section>
          )}
        </div>
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