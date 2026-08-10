import { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";

const BUCKET = "project-images";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uploadImage(file) {
  const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}${file.name.slice(file.name.lastIndexOf("."))}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function LoginForm({ onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="admin-login">
      <h1>Admin</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitting(true);
          setError("");
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          setSubmitting(false);
          if (error) {
            setError(error.message);
          } else {
            onLoggedIn();
          }
        }}
      >
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="admin-error">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function ProjectForm({ existingSlugs, initialProject, onSaved, onCancel }) {
  const isEditing = Boolean(initialProject);
  const [title, setTitle] = useState(initialProject?.title || "");
  const [type, setType] = useState(initialProject?.type || "");
  const [description, setDescription] = useState(
    initialProject?.description || ""
  );
  const [coverFile, setCoverFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(
    initialProject?.images || []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      className="admin-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
          let coverUrl = initialProject?.cover_image_url || null;
          if (coverFile) coverUrl = await uploadImage(coverFile);

          const newGalleryUrls = [];
          for (const file of galleryFiles) {
            newGalleryUrls.push(await uploadImage(file));
          }

          let projectId = initialProject?.id;

          if (isEditing) {
            const { error } = await supabase
              .from("projects")
              .update({ title, type, description, cover_image_url: coverUrl })
              .eq("id", projectId);
            if (error) throw error;
          } else {
            let slug = slugify(title);
            let suffix = 2;
            while (existingSlugs.includes(slug)) {
              slug = `${slugify(title)}-${suffix}`;
              suffix += 1;
            }

            const { data, error } = await supabase
              .from("projects")
              .insert({
                slug,
                title,
                type,
                description,
                cover_image_url: coverUrl,
              })
              .select()
              .single();
            if (error) throw error;
            projectId = data.id;
          }

          if (newGalleryUrls.length > 0) {
            const startPosition = existingImages.length;
            const { error } = await supabase.from("project_images").insert(
              newGalleryUrls.map((url, i) => ({
                project_id: projectId,
                url,
                position: startPosition + i,
              }))
            );
            if (error) throw error;
          }

          setSaving(false);
          onSaved();
        } catch (err) {
          setSaving(false);
          setError(err.message || "Something went wrong. Please try again.");
        }
      }}
    >
      <h2>{isEditing ? `Edit "${initialProject.title}"` : "Add a project"}</h2>

      <label>
        Title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      <label>
        Category
        <input
          type="text"
          placeholder="Branding, Logo, Poster..."
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
      </label>

      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>

      <label>
        Cover image
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverFile(e.target.files[0] || null)}
        />
      </label>

      {existingImages.length > 0 && (
        <div className="admin-existing-images">
          {existingImages.map((img) => (
            <div className="admin-thumb" key={img.url}>
              <img src={img.url} alt="" />
              <button
                type="button"
                onClick={async () => {
                  const { error } = await supabase
                    .from("project_images")
                    .delete()
                    .eq("project_id", initialProject.id)
                    .eq("url", img.url);
                  if (!error) {
                    setExistingImages((prev) =>
                      prev.filter((i) => i.url !== img.url)
                    );
                  }
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <label>
        Add gallery images
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setGalleryFiles([...e.target.files])}
        />
      </label>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-form-actions">
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | "new" | project object

  function fetchProjects() {
    return supabase
      .from("projects")
      .select("*, project_images(url, position)")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error) {
          setProjects(
            (data || []).map((p) => ({
              ...p,
              images: (p.project_images || [])
                .slice()
                .sort((a, b) => a.position - b.position),
            }))
          );
        }
        setLoading(false);
      });
  }

  async function reload() {
    setLoading(true);
    await fetchProjects();
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  if (editing) {
    return (
      <div className="admin-page">
        <ProjectForm
          existingSlugs={projects.map((p) => p.slug)}
          initialProject={editing === "new" ? null : editing}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
          onCancel={() => setEditing(null)}
        />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Projects</h1>
        <div className="admin-header-actions">
          <button type="button" onClick={() => setEditing("new")}>
            Add project
          </button>
          <button type="button" onClick={() => supabase.auth.signOut()}>
            Sign out
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p>No projects yet. Add your first one.</p>
      ) : (
        <ul className="admin-list">
          {projects.map((project) => (
            <li key={project.id}>
              <span className="admin-list-title">{project.title}</span>
              <span className="admin-list-type">{project.type}</span>
              <span className="admin-list-actions">
                <button type="button" onClick={() => setEditing(project)}>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (
                      !window.confirm(`Delete "${project.title}"? This can't be undone.`)
                    ) {
                      return;
                    }
                    await supabase.from("projects").delete().eq("id", project.id);
                    reload();
                  }}
                >
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Admin() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionChecked(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!sessionChecked) return null;

  return session ? (
    <Dashboard />
  ) : (
    <LoginForm onLoggedIn={() => {}} />
  );
}
