import "./App.css";

const projects = [
  { title: "Kopi Sippio", type: "Branding" },
  { title: "Between Buns", type: "Branding" },
  { title: "Nexora Systems", type: "Logo" },
  { title: "Kopi Sippio", type: "Branding" },
  { title: "Between Buns", type: "Branding" },
  { title: "Nexora Systems", type: "Logo" },
  { title: "Kopi Sippio", type: "Branding" },
  { title: "Between Buns", type: "Branding" },
  { title: "Nexora Systems", type: "Logo" },
];

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

      <section className="marquee">
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
      </section>

      <section className="intro-text">
        <p>
          We are a <strong>creative design agency</strong> committed to crafting
          impactful visual experiences and delivering diverse{" "}
          <strong>design solutions</strong> that build memorable brands across
          the globe.
        </p>
      </section>

      <section className="featured-projects">
        <p>Projects</p>
        <h2>We did these</h2>

        <div className="project-grid dark">
          {projects.slice(0, 6).map((project, index) => (
            <div className="project-card" key={index}>
              <div className="project-img"></div>
              <h3>{project.title}</h3>
              <p>{project.type}</p>
            </div>
          ))}
        </div>

        <a className="view-more" href="/projects">
          View More ↓
        </a>
      </section>

      <section className="story-section">
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
          <a href="/about">Read About us →</a>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Projects() {
  return (
    <>
      <Navbar />

      <main className="page">
        <h1 className="page-title center">Projects</h1>

        <div className="project-grid">
          {projects.map((project, index) => (
            <div className="project-card" key={index}>
              <div className="project-img"></div>
              <h3>{project.title}</h3>
              <p>{project.type}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}

function About() {
  return (
    <div className="about-screen">
      <Navbar />

      <main className="about-page">
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
      </main>

      <Footer />
    </div>
  );
}

function Contact() {
  return (
    <div className="contact-screen">
      <Navbar />

      <main className="contact-page">
        <h1>Get in touch.</h1>

        <form className="contact-form">
          <textarea placeholder="Tell what you need us to create...*" />

          <div>
            <input type="email" placeholder="email*" />
            <input type="text" placeholder="phone number" />

            <div className="form-buttons">
              <button type="button">
                Send <span>→</span>
              </button>
              <button type="button">
                Sent <span>✓</span>
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

function ProjectDetail() {
  return (
    <>
      <Navbar />

      <main className="detail-page">
        <p className="label">Project</p>
        <h1>Between Buns</h1>
        <p>
          Lorem ipsum dolor sit amet. Sit iste necessitatibus ut recusandae
          corrupti eos sunt officiis sit possimus vero?
        </p>

        <div className="large-img"></div>
        <div className="large-img"></div>
        <div className="large-img"></div>
        <div className="large-img"></div>
      </main>

      <Footer />
    </>
  );
}

function App() {
  const path = window.location.pathname;

  if (path === "/about") return <About />;
  if (path === "/projects") return <Projects />;
  if (path === "/contact") return <Contact />;
  if (path === "/project/between-buns") return <ProjectDetail />;

  return <Home />;
}

export default App;