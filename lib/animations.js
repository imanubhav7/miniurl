import { gsap } from "gsap";

export const fadeScale = (el, delay = 0) => {
  if (!el) return;
  gsap.fromTo(el, { opacity: 0, y: 12, scale: 0.99 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out", delay });
};

export const fadeSlideUp = (el, delay = 0) => {
  if (!el) return;
  const rows = el.querySelectorAll("tbody tr");
  gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out", delay });
  gsap.fromTo(rows, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.04, ease: "power3.out", delay: delay + 0.05 });
};

export const floatHover = (el) => {
  if (!el) return;
  el.addEventListener("mouseenter", () => gsap.to(el, { y: -6, boxShadow: "0 18px 40px rgba(16,24,40,0.12)", duration: 0.32, ease: "power3.out" }));
  el.addEventListener("mouseleave", () => gsap.to(el, { y: 0, boxShadow: "var(--tw-shadow, 0 10px 30px rgba(16,24,40,0.06))", duration: 0.32, ease: "power3.out" }));
};