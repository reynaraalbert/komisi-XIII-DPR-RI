"use client";

import { useEffect, useRef } from "react";

/**
 * Global motion system — one engine that animates the whole site (public site
 * AND admin CMS, desktop AND mobile) without touching every page.
 *
 *  - Text, headings, media, icons, cards, buttons, form fields, table rows and
 *    divider lines reveal with a polished staggered animation as they scroll
 *    into view (or as they are swiped into view in horizontal scrollers).
 *  - Anything inserted later (CMS data, modals, accordions, route changes) is
 *    picked up by a MutationObserver and animated too.
 *  - Purely CSS-driven (opacity / translate / scale) — see globals.css "Motion".
 *    No layout properties are animated, so it stays smooth on mobile.
 *  - Safe by design: respects prefers-reduced-motion, skips elements that are
 *    already animated (framer-motion inline styles, animate-* classes, tickers,
 *    hover-reveal overlays), cleans its classes after each animation, and has a
 *    sweep that force-reveals anything the IntersectionObserver missed so
 *    nothing can stay invisible.
 *  - Opt out for any element/subtree with the `data-no-reveal` attribute.
 */

type Kind =
  | "head"
  | "text"
  | "card"
  | "media"
  | "icon"
  | "btn"
  | "field"
  | "row"
  | "line"
  | "chrome";

const CANDIDATES =
  "h1,h2,h3,h4,h5,h6,p,blockquote,dt,dd,figcaption,li,img,video,iframe,canvas,svg," +
  "button,a,input,textarea,select,tr,hr,div,article,section,form,header,aside";

// Never animate these (or anything inside them).
const EXCLUDE =
  '[data-no-reveal],[class*="animate-"],.sr-only,nav,[role="menu"],[role="listbox"],[role="tooltip"],pre,option,datalist';

// Elements that manage their own opacity (hover overlays, tooltips…).
const OPACITY_CLS = /(^|\s)(opacity-|group-hover:|hover:opacity|transition-opacity|invisible|pointer-events-none)/;
const ICON_SIZE = /(^|\s)(w|h|size)-(5|6|7|8|9|10|11|12|14|16|20|24|28|32)(\s|$)/;
const BTN = /(^|\s)px-\S+/;
const ROUNDED = /(^|\s)rounded/;
const CARD_ROUND = /(^|\s)rounded-(lg|xl|2xl|3xl)(\s|$)/;
const CARD_SURFACE = /(^|\s)(border|border-\S+|shadow|shadow-\S+|glass-panel\S*|bg-\S+)(\s|$)/;
const NOT_CARD = /(^|\s)(px-\S+|rounded-full|inline-\S+|absolute|fixed|sticky)(\s|$)/;
const LINE_H = /(^|\s)h-(px|0\.5|1|1\.5)(\s|$)/;
const HSCROLL = /(overflow-x-(auto|scroll)|snap-x)/;

const MAX_STAGGER_MS = 420;
const STAGGER_STEP_MS = 55;

export default function MotionProvider() {
  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Nothing to do: show everything as-is.
    if (reduce || !("IntersectionObserver" in window)) {
      html.classList.remove("motion-boot");
      return;
    }

    const processed = new WeakSet<Element>();
    const pending = new Map<Element, Kind>();
    const stickyCache = new WeakMap<Element, boolean>();
    const timers = new Set<number>();
    let sweepTimer: number | null = null;

    const classOf = (el: Element) => el.getAttribute("class") || "";

    const isFixedOrSticky = (el: Element): boolean => {
      const cached = stickyCache.get(el);
      if (cached !== undefined) return cached;
      const pos = getComputedStyle(el).position;
      const v = pos === "fixed" || pos === "sticky";
      stickyCache.set(el, v);
      return v;
    };

    function classify(el: Element): Kind | null {
      if (el.closest(EXCLUDE)) return null;

      const cls = classOf(el);
      if (OPACITY_CLS.test(cls)) return null;

      // Already animated by framer-motion / inline styles.
      const style = el.getAttribute("style");
      if (style && /opacity|transform|translate|animation/.test(style)) return null;

      const tag = el.tagName.toLowerCase();

      // Sticky / fixed site chrome: gentle one-time entrance, never its children.
      if (tag === "header" || tag === "aside") {
        return isFixedOrSticky(el) ? "chrome" : null;
      }
      const chromeParent = el.parentElement?.closest("header,aside");
      if (chromeParent && isFixedOrSticky(chromeParent)) return null;

      switch (tag) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          return "head";
        case "p":
        case "blockquote":
        case "dt":
        case "dd":
        case "figcaption":
          return "text";
        case "li":
          if (!el.querySelector("p,h1,h2,h3,h4,h5,h6,li,div")) return "text";
          return isCard(cls) ? "card" : null;
        case "img":
        case "video":
        case "iframe":
        case "canvas":
          if (/(^|\s)inset-0(\s|$)/.test(cls)) return null; // decorative backgrounds
          return "media";
        case "svg":
          if (el.parentElement?.closest("svg")) return null;
          return ICON_SIZE.test(cls) ? "icon" : null;
        case "hr":
          return "line";
        case "tr":
          return el.parentElement?.tagName === "TBODY" ? "row" : null;
        case "input": {
          const t = (el as HTMLInputElement).type;
          if (t === "hidden" || t === "checkbox" || t === "radio" || t === "file") return null;
          return "field";
        }
        case "textarea":
        case "select":
          return "field";
        case "button":
        case "a":
          if (BTN.test(cls) && ROUNDED.test(cls)) return "btn";
          return isCard(cls) ? "card" : null;
        default: {
          // div / article / section / form
          if (
            el.childElementCount === 0 &&
            !el.textContent &&
            LINE_H.test(cls) &&
            /(^|\s)w-\S+/.test(cls) &&
            /(^|\s)bg-\S+/.test(cls)
          ) {
            return "line";
          }
          return isCard(cls) ? "card" : null;
        }
      }
    }

    function isCard(cls: string): boolean {
      return CARD_ROUND.test(cls) && CARD_SURFACE.test(cls) && !NOT_CARD.test(cls);
    }

    function cleanup(el: Element) {
      const toRemove: string[] = [];
      el.classList.forEach((c) => {
        if (c === "rv" || c === "rv-in" || c === "rv-x" || c.startsWith("rv-")) toRemove.push(c);
      });
      toRemove.forEach((c) => el.classList.remove(c));
      (el as HTMLElement).style.removeProperty("--rv-delay");
    }

    function reveal(el: Element, delay: number) {
      if (!pending.has(el)) return;
      pending.delete(el);
      io.unobserve(el);
      (el as HTMLElement).style.setProperty("--rv-delay", `${delay}ms`);
      el.classList.add("rv-in");

      const onEnd = (e: Event) => {
        if (e.target !== el) return; // ignore bubbled animationend from children
        el.removeEventListener("animationend", onEnd);
        cleanup(el);
      };
      el.addEventListener("animationend", onEnd);
      // Fallback so classes never linger if animationend does not fire.
      const t = window.setTimeout(() => {
        timers.delete(t);
        el.removeEventListener("animationend", onEnd);
        cleanup(el);
      }, delay + 2200);
      timers.add(t);
    }

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top ||
              a.boundingClientRect.left - b.boundingClientRect.left
          );
        visible.forEach((e, i) => reveal(e.target, Math.min(i * STAGGER_STEP_MS, MAX_STAGGER_MS)));
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 }
    );

    function mark(el: Element) {
      if (processed.has(el)) return;
      processed.add(el);

      const kind = classify(el);
      if (!kind) return;

      el.classList.add("rv", `rv-${kind}`);
      const parent = el.parentElement;
      if (parent && (kind === "card" || kind === "media") && HSCROLL.test(classOf(parent))) {
        el.classList.add("rv-x"); // swiped into view from the side
      }
      pending.set(el, kind);

      if (kind === "chrome") {
        reveal(el, 0);
      } else {
        io.observe(el);
      }
    }

    function scan(root: Element) {
      mark(root);
      root.querySelectorAll(CANDIDATES).forEach(mark);
    }

    // Safety net: reveal anything that is on screen but was never reported.
    function sweep() {
      const vh = window.innerHeight;
      Array.from(pending.keys()).forEach((el) => {
        const r = el.getBoundingClientRect();
        if ((r.width || r.height) && r.top < vh && r.bottom > 0) reveal(el, 0);
      });
    }
    sweepTimer = window.setInterval(sweep, 2000);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === 1) scan(n as Element);
        });
      }
    });

    // Wait a beat so React finishes hydrating before we touch the DOM.
    const bootTimer = window.setTimeout(() => {
      scan(document.body);
      html.classList.remove("motion-boot");
      mo.observe(document.body, { childList: true, subtree: true });
    }, 80);

    return () => {
      window.clearTimeout(bootTimer);
      if (sweepTimer) window.clearInterval(sweepTimer);
      timers.forEach((t) => window.clearTimeout(t));
      mo.disconnect();
      io.disconnect();
      // Never leave anything hidden if the engine is torn down.
      document.querySelectorAll(".rv").forEach(cleanup);
      html.classList.remove("motion-boot");
    };
  }, []);

  return <ScrollProgress />;
}

/** Thin brand-colored reading-progress bar at the top of every page. */
function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = barRef.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={barRef} className="scroll-progress" aria-hidden="true" data-no-reveal />;
}
