import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Campaign 01",
    type: "Visual Identity",
    img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900",
  },
  {
    title: "Culture Drop",
    type: "Creative Direction",
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900",
  },
  {
    title: "Undo Lab",
    type: "Digital Experiment",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900",
  },
  {
    title: "Story System",
    type: "Brand Experience",
    img: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900",
  },
];

function App() {
  const previewRef = useRef(null);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const introTl = gsap.timeline({
      onComplete: () => {
        setIntroDone(true);
        document.body.style.overflow = "auto";

        gsap.fromTo(
          ".hero-line span",
          { y: "120%" },
          {
            y: "0%",
            stagger: 0.15,
            duration: 1.4,
            ease: "power4.out",
          }
        );
      },
    });

    introTl
      .fromTo(
        ".intro-word",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.18,
          duration: 0.8,
          ease: "power4.out",
        }
      )
      .to(".intro-word", {
        y: -80,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power4.in",
        delay: 0.4,
      })
      .to(".intro-loader", {
        y: "-100%",
        duration: 1,
        ease: "power4.inOut",
      });

    return () => {
      introTl.kill();
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });

    let rafId;

    function raf(time) {
      lenis.raf(time);
      ScrollTrigger.update();
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.fromTo(
        el,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );
    });

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const movePreview = (e, img) => {
    const preview = previewRef.current;
    if (!preview) return;

    preview.style.opacity = 1;
    preview.style.backgroundImage = `url(${img})`;
    preview.style.transform = `translate(${e.clientX + 25}px, ${
      e.clientY - 120
    }px)`;
  };

  const hidePreview = () => {
    if (!previewRef.current) return;
    previewRef.current.style.opacity = 0;
  };

  return (
    <>
      {!introDone && (
        <div className="intro-loader">
          <h1 className="intro-word">UNDO</h1>
          <h1 className="intro-word">CULTURE</h1>
          <h1 className="intro-word outline">UNDO</h1>
          <h1 className="intro-word outline">CULTURE</h1>
        </div>
      )}

      <main>
        <div className="cursor-preview" ref={previewRef}></div>

        <nav className="nav">
          <img src="/logo.png" alt="Undo Culture" className="logo" />

          <div>
            <a href="#work">Work</a>
            <a href="#info">Info</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        <section className="hero">
          <h1 className="hero-title">
            <div className="hero-line">
              <span>UNDO</span>
            </div>

            <div className="hero-line">
              <span>CULTURE</span>
            </div>
          </h1>

          <p className="hero-desc">
            Undo Culture is a creative space for bold visuals, stories,
            experiments and meaningful digital experiences.
          </p>
        </section>

        <section className="intro reveal" id="info">
          <p>
            We blend design, culture, motion and storytelling to create visual
            experiences that feel bold, emotional and unforgettable.
          </p>
        </section>

        <section className="work" id="work">
          <div className="section-head reveal">
            <p>Selected</p>
            <h2>Work</h2>
          </div>

          {projects.map((project, index) => (
            <div
              className="project reveal"
              key={project.title}
              onMouseMove={(e) => movePreview(e, project.img)}
              onMouseLeave={hidePreview}
            >
              <span>0{index + 1}</span>
              <h3>{project.title}</h3>
              <p>{project.type}</p>
            </div>
          ))}
        </section>

        <section className="skills reveal">
          <h2>Services</h2>

          <div>
            <span>Brand Identity</span>
            <span>Creative Direction</span>
            <span>Social Media Design</span>
            <span>Campaign Design</span>
            <span>Motion Graphics</span>
            <span>Web Experiences</span>
            <span>Visual Storytelling</span>
          </div>
        </section>

        <section className="contact reveal" id="contact">
          <p>Available for collaborations</p>
          <h2>Let’s build culture, visually.</h2>
          <a href="mailto:yourmail@gmail.com">yourmail@gmail.com</a>
        </section>
      </main>
    </>
  );
}

export default App;