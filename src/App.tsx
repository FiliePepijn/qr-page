import { useEffect, useRef, useMemo } from "react";
import type { ReactNode } from "react";
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
  FaWhatsapp,
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

  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const dragInstancesRef = useRef<Draggable[]>([]);

  const links = useMemo<LinkItem[]>(
    () => [
      { id: "portfolio", text: "Portfolio", href: "https://platour.net", icon: <FaBriefcase /> },
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
      { id: "snapchat", text: "Snapchat", href: "https://snapchat.com/t/1PJxYLmh", icon: <FaSnapchat /> },
      { id: "github", text: "GitHub", href: "https://github.com/FiliePepijn", icon: <FaGithub /> },
      {
        id: "spotify",
        text: "Spotify",
        href: "https://open.spotify.com/user/31lnbagl6q4eogohjrry5y57dyce",
        icon: <FaSpotify />,
      },
      { id: "email", text: "E-mail", href: "mailto:Qr@Platour.net", icon: <Mail /> },
      { id: "discord", text: "Discord", href: "https://discord.com/users/FiliePepijn#0001", icon: <FaDiscord /> },
      { id: "whatsapp", text: "WhatsApp", href: "https://wa.me/message/", icon: <FaWhatsapp /> },
    ],
    []
  );

  linksRef.current = [];

  // Entrance animations
  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll(".reveal"),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power4.out", stagger: 0.1 }
      );
    }
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.04, delay: 0.4 }
      );
    }
  }, []);

  // Magnetic drag between link cells
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
          const draggedCenterX =
            draggedEl.offsetLeft + draggedEl.offsetWidth / 2 + this.x;
          const draggedCenterY =
            draggedEl.offsetTop + draggedEl.offsetHeight / 2 + this.y;

          validLinks.forEach((other) => {
            if (other === draggedEl) return;
            const otherCenterX = other.offsetLeft + other.offsetWidth / 2;
            const otherCenterY = other.offsetTop + other.offsetHeight / 2;
            const dx = draggedCenterX - otherCenterX;
            const dy = draggedCenterY - otherCenterY;
            const dist = Math.hypot(dx, dy);

            const threshold = 130;
            const maxPush = 40;

            if (dist < threshold && dist > 0.1) {
              const angle = Math.atan2(dy, dx);
              const pushFactor = 1 - dist / threshold;
              const pushAmount = maxPush * gsap.parseEase("power2.out")(pushFactor);
              gsap.to(other, {
                x: Math.cos(angle + Math.PI) * pushAmount,
                y: Math.sin(angle + Math.PI) * pushAmount,
                duration: 0.28,
                ease: "power2.out",
                overwrite: "auto",
              });
            } else {
              gsap.to(other, { x: 0, y: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
            }
          });
        },
        onDragEnd() {
          gsap.to(draggedEl, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.7)" });
          validLinks.forEach((other) =>
            gsap.to(other, { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1, 0.8)", overwrite: "auto" })
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
    <div className="phone-shell relative h-dvh overflow-hidden bg-ink font-satoshi text-white selection:bg-brand selection:text-ink bg-grain">
      {/* NOISE / GRAIN OVERLAY */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[200] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* SCANNER LINE */}
      <div className="fixed inset-0 pointer-events-none z-[190] overflow-hidden opacity-10">
        <div className="w-full h-[2px] bg-brand absolute top-0 left-0 animate-scanner-line" />
      </div>

      <section className="p-2 sm:p-3 md:p-4 max-w-3xl mx-auto h-dvh flex flex-col justify-center">
        <div className="border-2 border-brand bg-black overflow-hidden flex flex-col h-full max-h-[900px] min-h-0 shadow-[16px_16px_0px_0px_rgba(255,122,0,0.1)] rounded-sm">
          {/* TOP STATUS BAR */}
          <div className="h-9 sm:h-10 shrink-0 border-b-2 border-brand/30 bg-ink flex items-center justify-between px-4">
            <div className="flex gap-2 items-center">
              <span className="font-brutalist-mono text-[10px] text-brand uppercase tracking-tighter">
                //CONTACT_CARD
              </span>
              <div className="w-2.5 h-2.5 bg-brand rounded-full animate-pulse" />
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-1.5 bg-brand/20 rounded-full" />
              <div className="w-8 h-1.5 bg-brand/20 rounded-full" />
              <div className="w-6 h-1.5 bg-brand/20 rounded-full" />
            </div>
          </div>

          {/* IDENTITY HEADER */}
          <div
            ref={heroRef}
            className="relative shrink-0 bg-ink border-b-2 border-brand/30 p-3 sm:p-5 flex flex-col gap-3 sm:gap-4 overflow-hidden"
          >
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-grid-lines" />

            <div className="relative z-10 flex items-center gap-4 sm:gap-6">
              {/* PORTRAIT SCAN FRAME */}
              <div className="reveal relative size-20 sm:size-28 shrink-0 border-2 border-brand bg-black overflow-hidden">
                <div className="absolute inset-0 bg-grid-lines opacity-30 pointer-events-none z-10" />
                <img
                  src={profileImageUrl}
                  alt="Pepijn Latour"
                  className="h-full w-full object-cover grayscale contrast-125"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/160x160/000000/FF7A00?text=PL";
                  }}
                />
                <div className="absolute left-0 w-full h-[2px] bg-brand/70 z-20 animate-scan-sweep pointer-events-none" />
                <span className="absolute bottom-1 left-1 font-brutalist-mono text-[8px] text-brand bg-black/60 px-1 uppercase z-20">
                  ID:OK
                </span>
              </div>

              {/* NAME */}
              <div className="flex flex-col">
                <span className="reveal font-brutalist-mono text-[10px] sm:text-xs text-brand uppercase tracking-[0.25em] mb-1">
                  Subject_Identified
                </span>
                <h1
                  className="reveal font-clash font-bold text-brand uppercase tracking-tighter leading-[0.8]"
                  style={{ fontSize: "clamp(2.25rem, 11vw, 5rem)" }}
                >
                  Pepijn
                </h1>
                <h2
                  className="reveal font-clash font-bold text-white uppercase tracking-tighter leading-[0.8]"
                  style={{ fontSize: "clamp(1.5rem, 7vw, 3.25rem)" }}
                >
                  Latour<span className="text-brand">.</span>
                </h2>
              </div>
            </div>

            {/* TAGLINE CHIP */}
            <div className="reveal relative z-10 self-start bg-brand text-ink px-3 py-1 font-satoshi font-black uppercase tracking-tighter text-sm sm:text-lg -rotate-1 shadow-[4px_4px_0px_0px_white]">
              UX/UI Designer &amp; Web-Developer
            </div>

            {/* PARAMETER FEED */}
            <div className="reveal relative z-10 grid grid-cols-2 gap-x-6 gap-y-1.5 font-brutalist-mono text-[10px] sm:text-[11px] uppercase">
              {[
                ["Location", "Helmond, NL"],
                ["Nodes", "09_LINKED"],
                ["Data_State", "Synchronized"],
                ["Protocol", "Tap_To_Open"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-white/10 pb-1">
                  <span className="opacity-40">{k}</span>
                  <span className="text-brand">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LINKS SECTION HEADER */}
          <div className="flex shrink-0 items-center justify-between px-4 py-2 bg-ink border-b-2 border-brand/30">
            <span className="font-brutalist-mono text-[10px] sm:text-xs text-brand uppercase tracking-[0.2em]">
              Connection_Nodes
            </span>
            <span className="font-brutalist-mono text-[10px] sm:text-xs opacity-40 uppercase tracking-[0.2em]">
              [ Drag_Enabled ]
            </span>
          </div>

          {/* LINKS GRID — always 3x3 */}
          <div ref={gridRef} className="grid grid-cols-3 grid-rows-3 gap-2 sm:gap-3 p-3 sm:p-4 bg-ink flex-1 min-h-0">
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
                style={{ touchAction: "none" }}
                className="interactive-card group relative flex h-full min-h-0 flex-col items-center justify-center gap-1.5 overflow-hidden border-2 border-brand/40 bg-black transition-colors duration-150 hover:border-brand focus-visible:border-brand focus-visible:outline-none"
              >
                {/* index tag */}
                <span className="absolute top-1.5 left-2 font-brutalist-mono text-[9px] text-brand/60 group-hover:text-ink transition-colors z-10">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {/* hover fill */}
                <div className="absolute inset-0 bg-brand translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

                <span className="relative z-10 text-2xl sm:text-3xl text-brand transition-colors duration-150 group-hover:text-ink">
                  {link.icon}
                </span>
                <span className="relative z-10 font-brutalist-mono text-[9px] sm:text-[11px] uppercase tracking-[0.12em] text-white transition-colors duration-150 group-hover:text-ink">
                  {link.text}
                </span>
              </a>
            ))}
          </div>

          {/* BOTTOM BAR */}
          <div className="h-10 sm:h-11 shrink-0 bg-ink border-t-2 border-brand/30 flex items-center px-4 gap-4 overflow-x-auto no-scrollbar">
            <span className="font-brutalist-mono text-[9px] sm:text-[10px] text-brand uppercase tracking-[0.2em] flex-shrink-0">
              © 2026 Latour, P.
            </span>
            <div className="ml-auto flex items-center gap-2 flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
              <span className="font-brutalist-mono text-[9px] opacity-40 uppercase tracking-widest">
                Connection_Secure
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
