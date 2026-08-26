"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import content from "@/content/site.json";

type IntroPhase = "visible" | "leaving" | "hidden";

function ArrowIcon() {
  return <span className="arrow" aria-hidden="true">←</span>;
}

function BrandMark({ className = "" }: { className?: string }) {
  return <span className={`brand-mark ${className}`} aria-hidden="true"><i /><i /><i /><i /></span>;
}

function BrandIntro({ phase, onSkip }: { phase: IntroPhase; onSkip: () => void }) {
  if (phase === "hidden") return null;

  return (
    <div className={`brand-intro intro-${phase}`} role="status" aria-label={content.intro.ariaLabel}>
      <div className="intro-atmosphere" aria-hidden="true"><i /><i /><i /></div>
      <div className="intro-outline" aria-hidden="true">منظومة</div>
      <div className="intro-points" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="intro-stage">
        <p className="intro-kicker">GOVERNMENT DELEGATION ADVISORY</p>
        <div className="intro-night-logo">
          <Image src="/brand/manzoma-footer-reference.png" width={211} height={126} alt={content.brand.logoAlt} priority />
        </div>
        <h2><span>جاهزية تسبق الفرصة.</span><strong>أثر يتبع التنفيذ.</strong></h2>
        <div className="intro-steps" aria-hidden="true"><span>جاهزية</span><span>منافسة</span><span>تنفيذ</span><span>أثر</span></div>
        <div className="intro-line" aria-hidden="true"><span /></div>
      </div>
      <div className="intro-meta" aria-hidden="true"><span>MANZOMA / RIYADH</span><span>01 — 04</span></div>
      <button className="intro-skip" type="button" onClick={onSkip}>{content.intro.skip}</button>
    </div>
  );
}

function KineticRail() {
  return (
    <div className="kinetic-rail" aria-hidden="true">
      <div className="kinetic-rail-track">
        {[0, 1, 2].flatMap((set) => content.hero.journeySteps.map((step, index) => (
          <span key={`${set}-${step}`}><i />{step}<b>{String(index + 1).padStart(2, "0")}</b></span>
        )))}
      </div>
    </div>
  );
}

function ImpactSequence() {
  return (
    <section className="impact-sequence" data-step="0" id="methodology" aria-label={content.impactSequence.ariaLabel}>
      <div className="impact-sticky">
        <div className="impact-ghost" aria-hidden="true">MANZOMA</div>
        <div className="shell impact-shell">
          <div className="impact-intro">
            <span className="section-tag">03 / METHOD</span>
            <p>{content.impactSequence.eyebrow}</p>
            <h2>{content.impactSequence.title}</h2>
            <small>{content.impactSequence.description}</small>
          </div>
          <div className="impact-stage">
            <div className="impact-orbit" aria-hidden="true"><BrandMark /></div>
            <ol className="impact-steps">
              {content.impactSequence.steps.map((step) => (
                <li key={step.number}>
                  <span>{step.number}</span>
                  <p>{step.kicker}</p>
                  <h3>{step.title}</h3>
                  <div>{step.description}</div>
                </li>
              ))}
            </ol>
          </div>
          <div className="impact-footer">
            <div className="impact-progress-line" aria-hidden="true"><span /></div>
            <div className="impact-nav" aria-hidden="true">
              {content.impactSequence.steps.map((step) => <span key={step.number}>{step.number}</span>)}
            </div>
            <p>{content.impactSequence.scrollHint}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [introPhase, setIntroPhase] = useState<IntroPhase>("visible");

  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal, .scroll-item"));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.14 },
    );
    elements.forEach((element) => observer.observe(element));

    const impactScene = document.querySelector<HTMLElement>(".impact-sequence");
    const kineticRail = document.querySelector<HTMLElement>(".kinetic-rail");
    const motionScenes = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-scene]"));
    let frame = 0;
    const updateScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        document.documentElement.style.setProperty("--page-progress", String(Math.min(1, window.scrollY / scrollable)));
        document.documentElement.style.setProperty("--scroll-offset", `${Math.min(window.scrollY, 900) * .08}px`);
        if (impactScene) {
          const bounds = impactScene.getBoundingClientRect();
          const travel = Math.max(1, impactScene.offsetHeight - window.innerHeight);
          const progress = Math.min(1, Math.max(0, -bounds.top / travel));
          impactScene.style.setProperty("--impact-progress", String(progress));
          impactScene.style.setProperty("--impact-rotation", `${progress * 160}deg`);
          impactScene.dataset.step = String(Math.min(3, Math.floor(progress * 4)));
        }
        if (kineticRail) {
          const bounds = kineticRail.getBoundingClientRect();
          const progress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
          kineticRail.style.setProperty("--rail-shift", `${progress * -24}vw`);
        }
        motionScenes.forEach((scene) => {
          const bounds = scene.getBoundingClientRect();
          const progress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
          scene.style.setProperty("--scene-progress", String(progress));
          scene.style.setProperty("--scene-shift", `${(progress - .5) * -70}px`);
        });
        frame = 0;
      });
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateScroll);
      window.cancelAnimationFrame(frame);
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  useEffect(() => {
    const introKey = "manzoumah-intro-v4";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || window.sessionStorage.getItem(introKey) === "1") {
      const timer = window.setTimeout(() => setIntroPhase("hidden"), 0);
      return () => window.clearTimeout(timer);
    }
    document.body.classList.add("intro-open");
    const leaveTimer = window.setTimeout(() => setIntroPhase("leaving"), 2650);
    const hideTimer = window.setTimeout(() => {
      setIntroPhase("hidden");
      document.body.classList.remove("intro-open");
      window.sessionStorage.setItem(introKey, "1");
    }, 3400);
    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
      document.body.classList.remove("intro-open");
    };
  }, []);

  function skipIntro() {
    window.sessionStorage.setItem("manzoumah-intro-v4", "1");
    setIntroPhase("leaving");
    window.setTimeout(() => {
      setIntroPhase("hidden");
      document.body.classList.remove("intro-open");
    }, 650);
  }

  const navigation = content.navigation.items.filter((_, index) => [0, 1, 3, 4].includes(index));

  return (
    <>
      <BrandIntro phase={introPhase} onSkip={skipIntro} />
      <div className="page-progress" aria-hidden="true"><span /></div>
      <a className="skip-link" href="#main-content">{content.accessibility.skipToContent}</a>

      <header className="site-header">
        <div className="shell header-inner">
          <a className="wordmark" href="#top" aria-label={content.navigation.homeLabel}>
            <Image src="/brand/manzoma-header-reference.png" width={211} height={119} alt={content.brand.logoAlt} priority />
          </a>
          <nav aria-label={content.navigation.label}>
            {navigation.map((item) => <a className={item.href === "#contact" ? "nav-cta" : ""} href={item.href} key={item.href}>{item.label}</a>)}
          </nav>
          <a className="header-action" href={content.brand.whatsappUrl} target="_blank" rel="noreferrer" aria-label={content.accessibility.floatingWhatsapp}><span>تواصل</span><ArrowIcon /></a>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="top">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-orbit" aria-hidden="true"><BrandMark /></div>
          <div className="shell hero-layout">
            <div className="hero-copy">
              <p className="eyebrow">{content.hero.eyebrow}</p>
              <h1>
                <span className="hero-title-line"><span>{content.hero.titleLineOne}</span><em>{content.hero.titleAccent}</em></span>
                <span className="hero-title-line"><strong>{content.hero.titleLineTwo}</strong><b>{content.hero.titleTail}</b></span>
              </h1>
              <p className="hero-lead">{content.hero.description}</p>
              <div className="hero-actions">
                <a className="button button-primary" href={content.brand.whatsappUrl} target="_blank" rel="noreferrer"><span>{content.hero.primaryCta}</span><ArrowIcon /></a>
                <a className="button button-ghost" href="#services"><span>{content.hero.secondaryCta}</span><ArrowIcon /></a>
              </div>
            </div>
            <aside className="hero-path" aria-label={content.hero.journeyLabel}>
              <div className="hero-path-head"><span>01 — 04</span><strong>{content.hero.journeyLabel}</strong></div>
              <ol>
                {content.hero.journeySteps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>)}
              </ol>
            </aside>
          </div>
          <div className="shell hero-foot"><span>{content.hero.locationLabel}</span><a href="#delegation">{content.hero.scrollLabel} <i /></a></div>
        </section>

        <section className="trust" aria-labelledby="trust-title">
          <div className="shell trust-layout">
            <div><span className="section-tag">TRUST</span><p id="trust-title">{content.trust.title}</p></div>
            <div className="trust-list">{content.trust.organizations.map((organization) => <strong key={organization.name}>{organization.name}</strong>)}</div>
          </div>
        </section>

        <KineticRail />

        <section className="section delegation" id="delegation" data-scroll-scene>
          <div className="shell reveal">
            <div className="section-heading compact-heading">
              <div><span className="section-tag">01 / VALUE</span><p>{content.delegation.eyebrow}</p></div>
              <h2>{content.delegation.title}</h2>
              <p>{content.delegation.paragraphs[0]}</p>
            </div>
            <div className="outcome-grid">
              {content.delegation.outcomes.map((outcome, index) => (
                <article className="scroll-item" key={outcome.title}><span>0{index + 1}</span><h3>{outcome.title}</h3><p>{outcome.description}</p></article>
              ))}
            </div>
          </div>
        </section>

        <section className="section services" id="services" data-scroll-scene>
          <div className="shell">
            <div className="section-heading reveal">
              <div><span className="section-tag">02 / SERVICES</span><p>{content.servicesIntro.eyebrow}</p></div>
              <h2>{content.servicesIntro.title}</h2>
              <p>{content.servicesIntro.description}</p>
            </div>
            <div className="service-grid">
              {content.services.map((service) => (
                <article className="service-card scroll-item" key={service.number}>
                  <div className="service-card-top"><span>{service.number}</span><BrandMark /></div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul>{service.deliverables.slice(0, 3).map((item) => <li key={item.title}>{item.title}</li>)}</ul>
                  <a href="#contact">ناقش الخدمة <ArrowIcon /></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <ImpactSequence />

        <section className="section why-us" id="why-us" data-scroll-scene>
          <div className="shell reveal">
            <div className="section-heading compact-heading light-heading">
              <div><span className="section-tag">04 / WHY US</span><p>{content.whyUs.eyebrow}</p></div>
              <h2>{content.whyUs.title}</h2>
            </div>
            <div className="why-grid">
              {content.whyUs.points.map((point) => <article className="scroll-item" key={point.number}><span>{point.number}</span><h3>{point.title}</h3><p>{point.description}</p></article>)}
            </div>
          </div>
        </section>

        <section className="section contact" id="contact" data-scroll-scene>
          <div className="shell contact-card reveal">
            <div>
              <span className="section-tag">05 / CONTACT</span>
              <p className="contact-kicker">{content.contact.eyebrow}</p>
              <h2>{content.contact.title}</h2>
              <p>{content.contact.description}</p>
            </div>
            <div className="contact-actions">
              <a className="button button-primary" href={content.brand.whatsappUrl} target="_blank" rel="noreferrer"><span>{content.contact.whatsappCta}</span><ArrowIcon /></a>
              <a className="contact-phone" dir="ltr" href={content.brand.phoneHref}>{content.brand.phoneDisplay}</a>
              <small>{content.brand.address}</small>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="shell footer-layout">
          <a className="footer-logo" href="#top" aria-label={content.navigation.homeLabel}><Image src="/brand/manzoma-footer-reference.png" width={211} height={126} alt={content.brand.logoAlt} /></a>
          <p>{content.brand.tagline}</p>
          <p>{content.footer.copyright}</p>
          <a href="#top">{content.footer.backToTop} <ArrowIcon /></a>
        </div>
      </footer>

      <a className="floating-whatsapp" href={content.brand.whatsappUrl} target="_blank" rel="noreferrer" aria-label={content.accessibility.floatingWhatsapp}><span>واتساب</span><ArrowIcon /></a>
    </>
  );
}
