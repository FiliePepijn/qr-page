import { useEffect, useRef, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import {
  FaBriefcase,
  FaLinkedin,
  FaInstagram,
  FaSnapchat,
  FaGithub,
  FaSpotify,
  FaDiscord,
} from "react-icons/fa";
import { Mail } from "lucide-react";

gsap.registerPlugin(Draggable);

type LinkItem = {
  id: string;
  text: string;
  href: string;
  icon: ReactNode;
};

export default function App() {
  const profileImageUrl = "/assets/img/pepijn.png";

  // Refs
  const profileImageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const dragInstancesRef = useRef<Draggable[]>([]);


  const links = useMemo<LinkItem[]>(
    () => [
      {
        id: "portfolio",
        text: "Portfolio",
        href: "https://platour.net",
        icon: <FaBriefcase />,
      },
      {
        id: "linkedin",
        text: "LinkedIn",
        href: "https://www.linkedin.com/in/pepijn-latour-a70055276/",
        icon: <FaLinkedin />,
      },
      {
        id: "instagram",
        text: "Instagram",
        href: "https://www.instagram.com/pepijn_latour/",
        icon: <FaInstagram />,
      },
      {
        id: "snapchat",
        text: "Snapchat",
        href: "https://snapchat.com/t/1PJxYLmh",
        icon: <FaSnapchat />,
      },
      {
        id: "github",
        text: "GitHub",
        href: "https://github.com/FiliePepijn",
        icon: <FaGithub />,
      },
      {
        id: "spotify",
        text: "Spotify",
        href: "https://open.spotify.com/user/31lnbagl6q4eogohjrry5y57dyce",
        icon: <FaSpotify />,
      },
      {
        id: "email",
        text: "E-mail",
        href: "mailto:Qr@Platour.net",
        icon: <Mail />,
      },
      {
        id: "discord",
        text: "Discord",
        href: "https://discord.com/users/FiliePepijn#0001",
        icon: <FaDiscord />,
      },
    ],
    []
  );

  // Floating orbs
  const floatingOrbs = useMemo(() => {
    const colors = [
      "rgba(239, 68, 68, 0.32)",
      "rgba(59, 130, 246, 0.34)",
      "rgba(249, 115, 22, 0.3)",
      "rgba(14, 165, 233, 0.28)",
      "rgba(16, 185, 129, 0.26)",
    ];
    const animations = ["float", "floatReverse", "floatWide", "floatPulse"];

    return Array.from({ length: 7 }, (_, index) => {
      const size = 220 + Math.random() * 320;
      const top = -10 + Math.random() * 120;
      const left = -12 + Math.random() * 124;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const fadeStop = 45 + Math.random() * 28;
      const gradientX = 10 + Math.random() * 80;
      const gradientY = 10 + Math.random() * 80;
      const animation = animations[index % animations.length];

      const style = {
        width: `${size}px`,
        height: `${size}px`,
        top: `${top}%`,
        left: `${left}%`,
        background: `radial-gradient(circle at ${gradientX}% ${gradientY}%, ${color}, transparent ${fadeStop}%)`,
        transform: "translate(-50%, -50%)",
        opacity: 0.3 + Math.random() * 0.5,
        filter: `blur(${18 + Math.random() * 22}px)`,
      } as CSSProperties & Record<string, string>;

      style["--float-duration"] = `${10 + Math.random() * 12}s`;
      style["--float-delay"] = `${-Math.random() * 8}s`;
      style["--float-animation"] = animation;

      return style;
    });
  }, []);

  linksRef.current = [];

  // Entrance animations
  useEffect(() => {
    if (!profileImageRef.current || !svgRef.current || !heroTitleRef.current)
      return;

    gsap.fromTo(
      heroTitleRef.current,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );

    gsap.fromTo(
      profileImageRef.current,
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.9, ease: "back.out(1.4)", delay: 0.1 }
    );

    gsap.fromTo(
      svgRef.current,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, ease: "power2.out", delay: 0.25 }
    );
  }, []);

  // Animate grid on mount
  useEffect(() => {
    if (!gridRef.current) return;
    gsap.fromTo(
      gridRef.current.children,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.05,
      }
    );
  }, []);

  // Drag logic
  useEffect(() => {
    const validLinks = linksRef.current.filter(
      (el): el is HTMLAnchorElement => el !== null
    );

    dragInstancesRef.current.forEach((d) => d.kill());
    dragInstancesRef.current = [];

    validLinks.forEach((draggedEl) => {

      const drag = Draggable.create(draggedEl, {
        type: "x,y",
        bounds: draggedEl.closest(".phone-shell") || undefined,
        edgeResistance: 0.65,
        inertia: true,
        dragResistance: 0.18,
        onDrag(this: Draggable) {
          const draggedX = this.x;
          const draggedY = this.y;

          const draggedCenterX =
            draggedEl.offsetLeft + draggedEl.offsetWidth / 2 + draggedX;
          const draggedCenterY =
            draggedEl.offsetTop + draggedEl.offsetHeight / 2 + draggedY;

          validLinks.forEach((other) => {
            if (other === draggedEl) return;
            const otherCenterX = other.offsetLeft + other.offsetWidth / 2;
            const otherCenterY = other.offsetTop + other.offsetHeight / 2;
            const dx = draggedCenterX - otherCenterX;
            const dy = draggedCenterY - otherCenterY;
            const dist = Math.hypot(dx, dy);

            const threshold = 130;
            const maxPush = 44;

            if (dist < threshold && dist > 0.1) {
              const angle = Math.atan2(dy, dx);
              const pushFactor = 1 - dist / threshold;
              const pushAmount =
                maxPush * gsap.parseEase("power2.out")(pushFactor);

              gsap.to(other, {
                x: Math.cos(angle + Math.PI) * pushAmount,
                y: Math.sin(angle + Math.PI) * pushAmount,
                duration: 0.28,
                ease: "power2.out",
                overwrite: "auto",
              });
            } else {
              gsap.to(other, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto",
              });
            }
          });
        },
        onDragEnd() {
          gsap.to(draggedEl, {
            x: 0,
            y: 0,
            scale: 1,
            boxShadow: "0 12px 28px rgba(15,23,42,0.20)",
            duration: 0.5,
            ease: "elastic.out(1, 0.7)",
          });
          validLinks.forEach((other) =>
            gsap.to(other, {
              x: 0,
              y: 0,
              duration: 0.45,
              ease: "elastic.out(1, 0.8)",
              overwrite: "auto",
            })
          );
        },
      })[0];

      dragInstancesRef.current.push(drag);
    });

    return () => {
      dragInstancesRef.current.forEach((d) => d.kill());
      dragInstancesRef.current = [];
    };
  }, [links.length]);

  return (
    <div className="phone-shell relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-slate-950 px-5 py-8 text-white sm:px-8 sm:py-10">
      {/* Background */}

      <div aria-hidden className="pointer-events-none absolute inset-0">
        {floatingOrbs.map((style, index) => (
          <div key={index} className="floating-orb" style={style} />
        ))}

        {/* Moving dots */}
        <div className="moving-dots" />
      </div>

      <main className="relative z-10 flex w-full max-w-3xl flex-col gap-6 sm:gap-10">
        {/* Grid Section */}

        <section className="flex w-full flex-col gap-6 rounded-3xl bg-white/5 p-5 shadow-lg backdrop-blur-xl sm:gap-8 sm:p-6">
          <div className="flex flex-row items-center justify-between gap-5 sm:flex-row sm:items-stretch sm:justify-between">
            {/* Profile Image */}
            <div
              ref={profileImageRef}
              className="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-indigo-500/30 via-fuchsia-500/20 to-orange-400/30 shadow-[0_20px_45px_rgba(99,102,241,0.25)] sm:h-36 sm:w-36"
            >
              <img
                src={profileImageUrl}
                alt="Pepijn Latour"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/160x160/f87171/ffffff?text=Img+Error";
                }}
              />
            </div>

            {/* SVG + Caption */}
            <div
              ref={svgRef}
              className="relative flex h-28 w-40 items-center justify-center rounded-3xl border border-white/15 bg-white/10 p-3 shadow-inner sm:h-32 sm:w-48"
            >
              <img
                src="/assets/svg/platour.svg"
                alt="Platour logo"
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>

          <div
            ref={gridRef}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
          >
            {links.map((link, index) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                ref={(el) => {
                  linksRef.current[index] = el;
                }}
                data-link-id={link.id}
                className="interactive-card relative flex h-24 w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border border-white/10 bg-white/10 text-center font-semibold text-white shadow-lg backdrop-blur-md transition-transform duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 sm:h-36"
                style={{ touchAction: "none" }}
              >
                <span className="text-2xl sm:text-3xl">{link.icon}</span>
                <span className="text-[0.7rem] font-bold uppercase tracking-wide sm:text-sm">
                  {link.text}
                </span>
              </a>
            ))}
          </div>
        </section>

        <footer className="flex flex-col items-center gap-1 text-center text-[0.7rem] text-white/60 sm:flex-row sm:justify-between sm:text-xs">
          <span>Built with motion + love.</span>
          <span className="text-white/40">© 2025 Pepijn Latour</span>
        </footer>
      </main>
    </div>
  );
}
