import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { supabase } from "./lib/supabaseClient";
import Admin from "./Admin";
import "./App.css";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("projects")
      .select("*, project_images(url, position)")
      .order("position", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("Failed to load projects:", error);
          setProjects([]);
        } else {
          setProjects(
            (data || []).map((project) => ({
              ...project,
              images: (project.project_images || [])
                .slice()
                .sort((a, b) => a.position - b.position),
            }))
          );
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { projects, loading };
}

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const [ref, inView] = useInView();

  return (
    <Tag
      ref={ref}
      className={`reveal${inView ? " in-view" : ""}${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function Navbar({ merged }) {
  const path = window.location.pathname;

  return (
    <nav className={merged ? "navbar navbar--merged" : "navbar"}>
      <img src="/logo.png" alt="Undo Culture" className="logo" />

      <div className="nav-links">
        <a href="/" className={path === "/" ? "active" : ""}>
          Home
        </a>
        <a href="/about" className={path === "/about" ? "active" : ""}>
          About
        </a>
        <a href="/projects" className={path === "/projects" ? "active" : ""}>
          Projects
        </a>
        <a href="/contact" className="contact-btn">
          <span className="circle" aria-hidden="true"></span>
          <span className="arr-1" aria-hidden="true">
            →
          </span>
          <span className="btn-text">Get in touch</span>
          <span className="arr-2" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <p>Undo Culture.</p>
        <p>
          TinkerSpace, Kalamassery,
          <br />
          Kochi.
        </p>
      </div>

      <div className="footer-right">
        <p>+91 9544284196</p>
        <p>undoculture@gmail.com</p>
        <p>
          <a
            href="https://www.instagram.com/undoculture/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          &nbsp;{" "}
          <a
            href="https://www.linkedin.com/company/undoculture/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          &nbsp;{" "}
          <a
            href="https://www.behance.net/undo-culture"
            target="_blank"
            rel="noopener noreferrer"
          >
            Behance
          </a>
        </p>
      </div>
    </footer>
  );
}

function Home() {
  const { projects, loading } = useProjects();

  return (
    <>
      <Navbar merged />

      <section className="hero-box">
        <div>
          <h1>
            <span>Undo</span> the
            <br />
            ordinary<span>.</span>
          </h1>
        </div>

        <ul>
          <li>Branding</li>
          <li>UI/UX Designs</li>
          <li>Social Media Creatives</li>
          <li>Posters</li>
        </ul>
      </section>

      <Reveal as="section" className="marquee">
        <div className="marquee-track">
          <span>BETWEEN BUNS</span>
          <span>BETWEEN BUNS</span>
          <span>BETWEEN BUNS</span>
          <span>BETWEEN BUNS</span>
          <span>BETWEEN BUNS</span>
          <span aria-hidden="true">BETWEEN BUNS</span>
          <span aria-hidden="true">BETWEEN BUNS</span>
          <span aria-hidden="true">BETWEEN BUNS</span>
          <span aria-hidden="true">BETWEEN BUNS</span>
          <span aria-hidden="true">BETWEEN BUNS</span>
        </div>
      </Reveal>

      <Reveal as="section" className="intro-text">
        <p>
          We are a <strong>creative design agency</strong> committed to crafting
          impactful visual experiences and delivering diverse{" "}
          <strong>design solutions</strong> that build memorable brands across
          the globe.
        </p>
      </Reveal>

      <section className="featured-projects">
        <p>Projects</p>
        <h2>We did these</h2>

        {!loading && projects.length === 0 ? (
          <p className="projects-empty">More work coming soon.</p>
        ) : (
          <div className="project-grid dark">
            {projects.slice(0, 6).map((project, index) => (
              <Reveal
                as="a"
                href={`/projects/${project.slug}`}
                className="project-card"
                key={project.id}
                style={{ transitionDelay: `${(index % 3) * 100}ms` }}
              >
                <div className="project-img">
                  {project.cover_image_url && (
                    <img src={project.cover_image_url} alt={project.title} />
                  )}
                </div>
                <h3>{project.title}</h3>
                <p>{project.type}</p>
              </Reveal>
            ))}
          </div>
        )}

        <a className="view-more" href="/projects">
          View More <span className="arrow-down">↓</span>
        </a>
      </section>

      <Reveal as="section" className="story-section">
        <div>
          <p>Projects</p>
          <h2>
            Designs that
            <br />
            tells stories.
          </h2>
        </div>

        <div>
          <p>
            Lorem ipsum dolor sit amet. Sit iste necessitatibus ut recusandae
            corrupti eos sunt officiis sit possimus vero?
          </p>
          <a href="/about">
            Read About us <span className="arrow-right">→</span>
          </a>
        </div>
      </Reveal>

      <Footer />
    </>
  );
}

function Projects() {
  const { projects, loading } = useProjects();

  return (
    <>
      <Navbar />

      <main className="page">
        <h1 className="page-title center">Projects</h1>

        {!loading && projects.length === 0 ? (
          <p className="projects-empty">More work coming soon.</p>
        ) : (
          <div className="project-grid">
            {projects.map((project, index) => (
              <Reveal
                as="a"
                href={`/projects/${project.slug}`}
                className="project-card"
                key={project.id}
                style={{ transitionDelay: `${(index % 3) * 100}ms` }}
              >
                <div className="project-img">
                  {project.cover_image_url && (
                    <img src={project.cover_image_url} alt={project.title} />
                  )}
                </div>
                <h3>{project.title}</h3>
                <p>{project.type}</p>
              </Reveal>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

function About() {
  return (
    <div className="about-screen">
      <Navbar />

      <Reveal as="main" className="about-page">
        <p className="label">About</p>
        <h1>
          Designs that
          <br />
          tells stories.
        </h1>

        <p className="about-text">
          Undo Culture is a creative design company focused on building strong
          and meaningful visual identities for brands, companies, and modern
          businesses. The studio combines strategy, aesthetics, and storytelling
          to create designs that are visually distinctive and emotionally
          memorable.
        </p>
      </Reveal>

      <Footer />
    </div>
  );
}

function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  return (
    <div className="contact-screen">
      <Navbar />

      <main className="contact-page">
        <h1>Get in touch.</h1>

        <form
          className="contact-form"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            const message = form.message.value;
            const email = form.email.value;
            const phone = form.phone.value;

            setStatus("sending");

            emailjs
              .send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                  title: phone,
                  name: phone,
                  time: new Date().toLocaleString(),
                  message,
                  email,
                },
                { publicKey: EMAILJS_PUBLIC_KEY }
              )
              .then(() => {
                form.reset();
                setStatus("sent");
                setTimeout(() => setStatus("idle"), 3000);
              })
              .catch((err) => {
                console.error("EmailJS send failed:", err);
                setStatus("error");
                setTimeout(() => setStatus("idle"), 3000);
              });
          }}
        >
          <textarea name="message" placeholder="Tell what you need us to create...*" />

          <div>
            <input type="email" name="email" placeholder="email*" required />
            <input type="text" name="phone" placeholder="phone number" />

            <button
              type="submit"
              className={status === "sent" ? "sent" : ""}
              disabled={status === "sending"}
            >
              {status === "sending"
                ? "Sending..."
                : status === "sent"
                  ? "Sent"
                  : status === "error"
                    ? "Try again"
                    : "Send"}{" "}
              <span key={status} className="icon-pop">
                {status === "sent" ? "✓" : "→"}
              </span>
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

function ProjectDetail({ slug }) {
  // undefined = loading, null = not found, object = loaded
  const [project, setProject] = useState(undefined);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("projects")
      .select("*, project_images(url, position)")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setProject(null);
        } else {
          setProject({
            ...data,
            images: (data.project_images || [])
              .slice()
              .sort((a, b) => a.position - b.position),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <>
      <Navbar />

      <main className="detail-page">
        {project === undefined ? null : project === null ? (
          <>
            <p className="label">Project</p>
            <h1>Not found</h1>
            <p>This project doesn&apos;t exist or may have been removed.</p>
          </>
        ) : (
          <>
            <p className="label">Project</p>
            <h1>{project.title}</h1>
            <p>{project.description}</p>

            {project.images.map((img, i) => (
              <Reveal
                as="div"
                className="large-img"
                key={img.url}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <img src={img.url} alt={`${project.title} ${i + 1}`} />
              </Reveal>
            ))}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

function App() {
  const path = window.location.pathname;

  if (path === "/admin") return <Admin />;

  let page;
  if (path === "/about") {
    page = <About />;
  } else if (path === "/projects") {
    page = <Projects />;
  } else if (path === "/contact") {
    page = <Contact />;
  } else {
    const projectMatch = path.match(/^\/projects\/([^/]+)\/?$/);
    page = projectMatch ? <ProjectDetail slug={projectMatch[1]} /> : <Home />;
  }

  return <div className="page-transition">{page}</div>;
}

export default App;