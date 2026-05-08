import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

const ANIM_INITIAL = { filter: "blur(10px)", opacity: 0, y: 20 };
const ANIM_TRANSITION = { duration: 0.85, ease: "easeOut" };

function ArrowUpRightIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 17L17 7"></path>
      <path d="M7 7h10v10"></path>
    </svg>
  );
}

function PlayIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <polygon points="6 4 20 12 6 20 6 4"></polygon>
    </svg>
  );
}

function FadingVideo({ src, className, style }) {
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const fadingOutRef = useRef(false);
  const FADE_MS = 500;
  const FADE_OUT_LEAD = 0.55;

  const fadeTo = (targetOpacity, duration = FADE_MS) => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const current = Number.parseFloat(videoEl.style.opacity || "0");
    const startOpacity = Number.isFinite(current) ? current : 0;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const nextOpacity = startOpacity + (targetOpacity - startOpacity) * t;
      videoEl.style.opacity = String(nextOpacity);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return undefined;

    const onLoadedData = () => {
      videoEl.style.opacity = "0";
      videoEl.play().catch(() => { });
      fadeTo(1);
    };

    const onTimeUpdate = () => {
      if (!videoEl.duration || !Number.isFinite(videoEl.duration)) return;
      const remaining = videoEl.duration - videoEl.currentTime;
      if (!fadingOutRef.current && remaining <= FADE_OUT_LEAD && remaining > 0) {
        fadingOutRef.current = true;
        fadeTo(0);
      }
    };

    const onEnded = () => {
      videoEl.style.opacity = "0";
      window.setTimeout(() => {
        videoEl.currentTime = 0;
        videoEl.play().catch(() => { });
        fadingOutRef.current = false;
        fadeTo(1);
      }, 100);
    };

    videoEl.addEventListener("loadeddata", onLoadedData);
    videoEl.addEventListener("timeupdate", onTimeUpdate);
    videoEl.addEventListener("ended", onEnded);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      videoEl.removeEventListener("loadeddata", onLoadedData);
      videoEl.removeEventListener("timeupdate", onTimeUpdate);
      videoEl.removeEventListener("ended", onEnded);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      playsInline
      preload="auto"
      className={className}
      style={{ opacity: 0, ...style }}
    />
  );
}

function BlurText({ text, className }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const words = useMemo(() => text.split(" "), [text]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <p
      ref={containerRef}
      className={className}
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", rowGap: "0.1em" }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={
            isVisible
              ? {
                filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                opacity: [0, 0.5, 1],
                y: [50, -5, 0],
              }
              : { filter: "blur(10px)", opacity: 0, y: 50 }
          }
          transition={{
            duration: 0.7,
            times: [0, 0.5, 1],
            ease: "easeOut",
            delay: (index * 100) / 1000,
          }}
          style={{ display: "inline-block", marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

function Navbar() {
  const links = ["Dashboard", "Resume Analysis", "Question Gen", "Prep Plan", "ATS Builder"];
  return (
    <nav className="fixed inset-x-0 top-4 z-50 px-8 lg:px-16">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between">
        <div className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full">
          <span className="font-heading text-3xl italic leading-none text-white">i</span>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <div className="liquid-glass flex items-center rounded-full px-1.5 py-1.5">
            <a href="/dashboard" className="px-3 py-2 text-sm font-medium text-white/90 font-body">Dashboard</a>
            <a href="/dashboard/analysis/new" className="px-3 py-2 text-sm font-medium text-white/90 font-body">Resume Analysis</a>
            <a href="/dashboard/ats" className="px-3 py-2 text-sm font-medium text-white/90 font-body">ATS Builder</a>
          </div>
          <a
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black whitespace-nowrap"
          >
            Get Started
            <ArrowUpRightIcon className="h-4 w-4" />
          </a>
        </div>
        <div className="h-12 w-12 opacity-0" aria-hidden="true"></div>
      </div>
    </nav>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="liquid-glass w-[220px] rounded-[1.25rem] p-5">
      <div className="mb-8">{icon}</div>
      <div className="font-heading text-4xl italic leading-none tracking-[-1px] text-white">{value}</div>
      <p className="mt-2 text-xs font-body font-light text-white">{label}</p>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <FadingVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
        className="absolute left-1/2 top-0 z-0 -translate-x-1/2 object-cover object-top"
        style={{ width: "120%", height: "120%" }}
      />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center px-4 pt-24 text-center">
          <motion.div
            initial={ANIM_INITIAL}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ ...ANIM_TRANSITION, delay: 0.4 }}
          >
            <div className="liquid-glass inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">New</span>
              <span className="text-sm text-white/90">Now includes Dashboard, ATS scoring, and guided prep plans</span>
            </div>
          </motion.div>

          <div className="mt-8">
            <BlurText
              text="Your AI Command Center for Interview Preparation"
              className="max-w-2xl justify-center font-heading text-6xl italic leading-[0.8] tracking-[-4px] text-white md:text-7xl lg:text-[5.5rem]"
            />
          </div>

          <motion.p
            className="mt-4 max-w-2xl text-sm font-body font-light leading-tight text-white md:text-base"
            initial={ANIM_INITIAL}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ ...ANIM_TRANSITION, delay: 0.8 }}
          >
            Analyze your resume, generate role-specific questions, plan daily prep, and improve ATS readiness with one
            unified workflow built for faster interview wins.
          </motion.p>

          <motion.div
            className="mt-6 flex items-center gap-6"
            initial={ANIM_INITIAL}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ ...ANIM_TRANSITION, delay: 1.1 }}
          >
            <a
              href="/login"
              className="liquid-glass-strong inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white"
            >
              <span>Get Started</span>
              <ArrowUpRightIcon className="h-5 w-5" />
            </a>
            <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-white">
              <span>Watch Demo</span>
              <PlayIcon className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            className="mt-8 flex items-stretch gap-4"
            initial={ANIM_INITIAL}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ ...ANIM_TRANSITION, delay: 1.3 }}
          >
            <StatCard
              value="77%"
              label="Average interview readiness score"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-7 w-7 text-white"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M8.8 12.8 11 15l4.5-5"></path>
                </svg>
              }
            />
            <StatCard
              value="5x"
              label="Faster prep with AI workflow automation"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-7 w-7 text-white"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M8 9.5h8M8 12h5M8 14.5h8"></path>
                </svg>
              }
            />
          </motion.div>
        </div>

        <motion.div
          className="flex flex-col items-center gap-4 pb-8"
          initial={ANIM_INITIAL}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ ...ANIM_TRANSITION, delay: 1.4 }}
        >
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white">
            Everything you need from first draft resume to final round confidence
          </div>
          <div className="flex flex-wrap items-center justify-center gap-12 text-2xl tracking-tight text-white md:gap-16 md:text-3xl">
            {["Dashboard", "Resume Analysis", "Question Gen", "Prep Plan", "ATS Builder"].map((brand) => (
              <span key={brand} className="font-heading italic">
                {brand}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CapabilityCard({ iconPath, tags, title, body }) {
  return (
    <div className="liquid-glass flex min-h-[360px] flex-col rounded-[1.25rem] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="liquid-glass flex h-11 w-11 items-center justify-center rounded-[0.75rem]">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white" aria-hidden="true">
            <path d={iconPath}></path>
          </svg>
        </div>
        <div className="flex max-w-[70%] flex-wrap justify-end gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-[11px] font-body text-white/90 whitespace-nowrap">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex-1"></div>
      <div className="mt-6">
        <h3 className="font-heading text-3xl italic leading-none tracking-[-1px] text-white md:text-4xl">{title}</h3>
        <p className="mt-3 max-w-[32ch] text-sm font-body font-light leading-snug text-white/90">{body}</p>
      </div>
    </div>
  );
}

function CapabilitiesSection() {
  const cards = [
    {
      title: "Dashboard",
      body: "Track your overall interview readiness in one place with score snapshots, activity history, and daily action prompts.",
      iconPath:
        "M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z",
      tags: ["Overview", "Activity Log", "Readiness", "Quick Actions"],
    },
    {
      title: "Resume Analysis",
      body: "Upload your resume to receive AI scoring, keyword gap detection, and actionable improvements to increase interview callbacks.",
      iconPath:
        "M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z",
      tags: ["ATS Score", "Keyword Match", "Section Feedback", "PDF Upload"],
    },
    {
      title: "Question Gen",
      body: "Generate targeted interview questions by role, company, and experience level with adaptive follow-up prompts.",
      iconPath:
        "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z",
      tags: ["Behavioral", "Technical", "Role Based", "Follow-ups"],
    },
    {
      title: "Prep Plan",
      body: "Build a structured day-by-day roadmap that converts weak areas into strengths before each interview milestone.",
      iconPath:
        "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z",
      tags: ["Daily Tasks", "Milestones", "Priority Areas", "Progress"],
    },
    {
      title: "ATS Builder",
      body: "Create ATS-friendly resume versions tailored to specific job descriptions while preserving your best achievements and impact.",
      iconPath:
        "M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm2-3h10v-2H7v2Zm0-4h10v-2H7v2Zm0-4h7V8H7v2Z",
      tags: ["JD Targeting", "ATS Safe", "Bullet Rewrite", "Versioning"],
    },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <FadingVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="relative z-10 flex min-h-screen flex-col px-8 pb-10 pt-24 md:px-16 lg:px-20">
        <div className="mb-auto">
          <motion.p
            className="mb-6 text-sm font-body text-white/80"
            initial={ANIM_INITIAL}
            whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={ANIM_TRANSITION}
            viewport={{ once: true, amount: 0.2 }}
          >
            // Capabilities
          </motion.p>
          <motion.h2
            className="font-heading text-6xl italic leading-[0.9] tracking-[-3px] text-white md:text-7xl lg:text-[6rem]"
            initial={ANIM_INITIAL}
            whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ ...ANIM_TRANSITION, delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            Platform
            <br />
            capabilities
          </motion.h2>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
            {cards.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={ANIM_INITIAL}
                whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                transition={{ ...ANIM_TRANSITION, delay: 0.15 + idx * 0.12 }}
                viewport={{ once: true, amount: 0.15 }}
              >
                <CapabilityCard {...card} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AiInterviewLandingPage() {
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === "string" && args[0].includes("Each child in a list should have a unique")) return;
      originalError(...args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <main className="bg-black text-white">
      <HeroSection />
      <CapabilitiesSection />
    </main>
  );
}

