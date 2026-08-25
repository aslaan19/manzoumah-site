"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import content from "@/content/site.json";

type FormErrors = Partial<Record<"organization" | "contactName" | "role" | "mobile" | "service" | "summary", string>>;
type IntroPhase = "visible" | "leaving" | "hidden";

function ArrowIcon() {
  return <span className="arrow" aria-hidden="true">←</span>;
}

function BrandIntro({ phase, onSkip }: { phase: IntroPhase; onSkip: () => void }) {
  if (phase === "hidden") return null;

  return (
    <div className={`brand-intro intro-${phase}`} role="status" aria-label={content.intro.ariaLabel}>
      <div className="intro-blueprint" aria-hidden="true">
        <span className="intro-ring intro-ring-one" />
        <span className="intro-ring intro-ring-two" />
        <span className="intro-axis intro-axis-one" />
        <span className="intro-axis intro-axis-two" />
      </div>
      <div className="intro-stage">
        <p className="intro-eyebrow">{content.intro.eyebrow}</p>
        <div className="intro-logo-reveal">
          <Image
            className="intro-logo"
            src={content.brand.logoTransparent}
            width={512}
            height={487}
            alt={content.brand.logoAlt}
            priority
          />
        </div>
        <h2>{content.intro.headline}</h2>
      </div>
      <div className="intro-progress" aria-hidden="true">
        <div><span /></div>
        <p>{content.intro.progress}</p>
        <b>{content.intro.step}</b>
      </div>
      <button className="intro-skip" type="button" onClick={onSkip}>{content.intro.skip}</button>
    </div>
  );
}

function ProcessDiagram({ steps, label, id }: { steps: string[]; label: string; id: string }) {
  const positions = [810, 630, 450, 270, 90];

  return (
    <div className="process-wrap">
      <svg className="process-svg" viewBox="0 0 900 170" role="img" aria-label={label}>
        <defs>
          <marker id={`arrow-${id}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L8,4 L0,8 Z" fill="currentColor" />
          </marker>
        </defs>
        {positions.slice(0, -1).map((position, index) => (
          <line key={position} x1={position - 60} y1="85" x2={positions[index + 1] + 60} y2="85" markerEnd={`url(#arrow-${id})`} />
        ))}
        {steps.map((step, index) => (
          <g key={step} transform={`translate(${positions[index]} 85)`}>
            <circle r="58" />
            <text x="0" y="5" textAnchor="middle" direction="rtl">{step}</text>
          </g>
        ))}
      </svg>
      <ol className="process-mobile" aria-label={label}>
        {steps.map((step) => <li key={step}>{step}</li>)}
      </ol>
    </div>
  );
}

function ContactForm() {
  const [errors, setErrors] = useState<FormErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = {
      organization: String(form.get("organization") || "").trim(),
      contactName: String(form.get("contactName") || "").trim(),
      role: String(form.get("role") || "").trim(),
      mobile: String(form.get("mobile") || "").replace(/[\s-]/g, ""),
      service: String(form.get("service") || "").trim(),
      summary: String(form.get("summary") || "").trim(),
    };
    const nextErrors: FormErrors = {};
    const requiredKeys = ["organization", "contactName", "role", "service"] as const;
    requiredKeys.forEach((key) => {
      if (!values[key]) nextErrors[key] = content.contact.errors.required;
    });
    if (!/^(?:05\d{8}|\+9665\d{8})$/.test(values.mobile)) nextErrors.mobile = content.contact.errors.mobile;
    if (values.summary.length < 10) nextErrors.summary = content.contact.errors.summary;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const labels = content.contact.messageLabels;
    const message = [
      content.contact.messageIntro,
      "",
      `${labels.organization}: ${values.organization}`,
      `${labels.contactName}: ${values.contactName}`,
      `${labels.role}: ${values.role}`,
      `${labels.mobile}: ${values.mobile}`,
      `${labels.service}: ${values.service}`,
      `${labels.summary}: ${values.summary}`,
    ].join("\n");
    window.open(`${content.brand.whatsappUrl}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  const fields = content.contact.fields;
  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-heading">
        <h3>{content.contact.formTitle}</h3>
        <p>{content.contact.requiredNote}</p>
      </div>
      <div className="form-grid">
        <label>
          <span>{fields.organization}</span>
          <input name="organization" autoComplete="organization" aria-invalid={Boolean(errors.organization)} />
          {errors.organization && <small className="field-error">{errors.organization}</small>}
        </label>
        <label>
          <span>{fields.contactName}</span>
          <input name="contactName" autoComplete="name" aria-invalid={Boolean(errors.contactName)} />
          {errors.contactName && <small className="field-error">{errors.contactName}</small>}
        </label>
        <label>
          <span>{fields.role}</span>
          <input name="role" autoComplete="organization-title" aria-invalid={Boolean(errors.role)} />
          {errors.role && <small className="field-error">{errors.role}</small>}
        </label>
        <label>
          <span>{fields.mobile}</span>
          <input name="mobile" inputMode="tel" autoComplete="tel" dir="ltr" placeholder={fields.mobilePlaceholder} aria-invalid={Boolean(errors.mobile)} />
          {errors.mobile && <small className="field-error">{errors.mobile}</small>}
        </label>
        <label className="form-full">
          <span>{fields.service}</span>
          <select name="service" defaultValue="" aria-invalid={Boolean(errors.service)}>
            <option value="" disabled>{fields.servicePlaceholder}</option>
            {content.contact.serviceOptions.map((option) => <option value={option} key={option}>{option}</option>)}
          </select>
          {errors.service && <small className="field-error">{errors.service}</small>}
        </label>
        <label className="form-full">
          <span>{fields.summary}</span>
          <textarea name="summary" rows={4} placeholder={fields.summaryPlaceholder} aria-invalid={Boolean(errors.summary)} />
          {errors.summary && <small className="field-error">{errors.summary}</small>}
        </label>
      </div>
      <button className="button button-primary form-submit" type="submit">
        <span>{content.contact.submit}</span><ArrowIcon />
      </button>
    </form>
  );
}

export default function Home() {
  const [introPhase, setIntroPhase] = useState<IntroPhase>("visible");
  const availableMetrics = useMemo(
    () => content.metrics.items.filter((item) => item.value && !item.value.startsWith("[[")),
    [],
  );

  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));

    const impactScene = document.querySelector<HTMLElement>(".impact-sequence");
    let scrollFrame = 0;
    const updateScrollProgress = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
        document.documentElement.style.setProperty("--page-progress", String(progress));
        if (impactScene) {
          const bounds = impactScene.getBoundingClientRect();
          const travel = Math.max(1, impactScene.offsetHeight - window.innerHeight);
          const sceneProgress = Math.min(1, Math.max(0, -bounds.top / travel));
          const activeStep = Math.min(3, Math.floor(sceneProgress * 4));
          impactScene.style.setProperty("--impact-progress", String(sceneProgress));
          impactScene.dataset.step = String(activeStep);
        }
        scrollFrame = 0;
      });
    };
    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateScrollProgress);
      window.cancelAnimationFrame(scrollFrame);
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  useEffect(() => {
    const introKey = "manzoumah-intro-seen";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadySeen = window.sessionStorage.getItem(introKey) === "1";

    if (reducedMotion || alreadySeen) {
      const quickHideTimer = window.setTimeout(() => {
        setIntroPhase("hidden");
        document.body.classList.add("site-ready");
      }, 0);
      return () => window.clearTimeout(quickHideTimer);
    }

    document.body.classList.add("intro-open");
    const leaveTimer = window.setTimeout(() => setIntroPhase("leaving"), 1700);
    const hideTimer = window.setTimeout(() => {
      setIntroPhase("hidden");
      document.body.classList.remove("intro-open");
      document.body.classList.add("site-ready");
      window.sessionStorage.setItem(introKey, "1");
    }, 2450);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
      document.body.classList.remove("intro-open");
    };
  }, []);

  function skipIntro() {
    window.sessionStorage.setItem("manzoumah-intro-seen", "1");
    setIntroPhase("leaving");
    window.setTimeout(() => {
      setIntroPhase("hidden");
      document.body.classList.remove("intro-open");
      document.body.classList.add("site-ready");
    }, 700);
  }

  return (
    <>
      <BrandIntro phase={introPhase} onSkip={skipIntro} />
      <div className="page-progress" aria-hidden="true"><span /></div>
      <a className="skip-link" href="#main-content">{content.accessibility.skipToContent}</a>
      <header className={`site-header ${introPhase === "hidden" ? "site-ready" : ""}`}>
        <div className="shell header-inner">
          <a className="wordmark" href="#top" aria-label={content.navigation.homeLabel}>
            <Image
              className="brand-logo brand-logo-header"
              src={content.brand.logoHeader}
              width={380}
              height={83}
              alt={content.brand.logoAlt}
              priority
            />
          </a>
          <nav aria-label={content.navigation.label}>
            {content.navigation.items.map((item, index) => (
              <a className={`${index < 3 ? "nav-wide" : ""} ${index === content.navigation.items.length - 1 ? "nav-cta" : ""}`} href={item.href} key={item.href}>{item.label}</a>
            ))}
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className={`hero ${introPhase === "hidden" ? "hero-ready" : ""}`} id="top">
          <div className="hero-gridlines" aria-hidden="true" />
          <div className="hero-ghost" aria-hidden="true">الإسناد</div>
          <div className="hero-meta" aria-hidden="true">
            <span>{content.hero.practiceLabel}</span>
            <span>{content.hero.locationLabel}</span>
          </div>
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow">{content.hero.eyebrow}</p>
              <h1>
                <span>{content.hero.titleLineOne}</span>
                <em>{content.hero.titleAccent}</em>
                <span>{content.hero.titleLineTwo}</span>
                <strong>{content.hero.titleTail}</strong>
              </h1>
              <p className="lead">{content.hero.description}</p>
              <div className="hero-actions">
                <a className="button button-primary" href={content.brand.whatsappUrl} target="_blank" rel="noreferrer">
                  <span>{content.hero.primaryCta}</span><ArrowIcon />
                </a>
                <a className="button button-secondary" href="#services">
                  <span>{content.hero.secondaryCta}</span><ArrowIcon />
                </a>
              </div>
            </div>
            <aside className="journey-card" aria-label={content.hero.journeyLabel}>
              <div className="journey-heading"><span>01 / 04</span><p>{content.hero.journeyLabel}</p></div>
              <ol>
              {content.hero.journeySteps.map((step, index) => (
                <li className="journey-step" key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong>
                </li>
              ))}
              </ol>
            </aside>
          </div>
          <div className="shell hero-statement">
            <strong>{content.hero.statementLabel}</strong>
            <p>{content.hero.statement}</p>
            <span aria-hidden="true">↙</span>
          </div>
          <a className="hero-scroll" href="#delegation"><span>{content.hero.scrollLabel}</span><i aria-hidden="true" /></a>
        </section>

        <section className="trust" aria-labelledby="trust-heading">
          <div className="shell trust-grid">
            <div>
              <p className="eyebrow dark" id="trust-heading">{content.trust.title}</p>
              <small>{content.trust.note}</small>
            </div>
            <div className="trust-names">
              {content.trust.organizations.map((organization) => (
                <div className="trust-item" key={organization.name}>
                  {organization.logo ? (
                    <Image src={organization.logo} width={180} height={64} alt={organization.name} />
                  ) : <span>{organization.name}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="impact-sequence" data-step="0" aria-label={content.impactSequence.ariaLabel}>
          <div className="impact-sticky">
            <div className="impact-ghost" aria-hidden="true">{content.brand.name}</div>
            <div className="shell impact-shell">
              <div className="impact-intro">
                <p className="eyebrow">{content.impactSequence.eyebrow}</p>
                <h2>{content.impactSequence.title}</h2>
                <p>{content.impactSequence.description}</p>
              </div>
              <div className="impact-stage">
                <div className="impact-mark" aria-hidden="true"><i /><i /><i /><i /></div>
                <ol className="impact-steps">
                  {content.impactSequence.steps.map((step) => (
                    <li className="impact-step" key={step.number}>
                      <span>{step.number}</span>
                      <p>{step.kicker}</p>
                      <h3>{step.title}</h3>
                      <div>{step.description}</div>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="impact-footer">
                <div className="impact-progress-line"><span /></div>
                <div className="impact-nav" aria-hidden="true">
                  {content.impactSequence.steps.map((step) => <span key={step.number}>{step.number}</span>)}
                </div>
                <p>{content.impactSequence.scrollHint}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section delegation" id="delegation">
          <div className="shell reveal">
            <div className="delegation-top grid-12">
              <div className="section-index"><span>01</span></div>
              <div className="section-heading">
                <p className="eyebrow dark">{content.delegation.eyebrow}</p>
                <h2>{content.delegation.title}</h2>
              </div>
              <div className="delegation-copy">
                {content.delegation.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </div>
            <div className="outcome-grid">
              {content.delegation.outcomes.map((outcome, index) => (
                <article key={outcome.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{outcome.title}</h3>
                  <p>{outcome.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="services" id="services">
          <div className="shell services-intro reveal">
            <span className="services-number">{content.servicesIntro.number}</span>
            <div><p className="eyebrow">{content.servicesIntro.eyebrow}</p><h2>{content.servicesIntro.title}</h2></div>
            <p>{content.servicesIntro.description}</p>
          </div>

          {content.services.map((service, serviceIndex) => (
            <article className="service" key={service.number}>
              <div className="shell service-chapter reveal">
                <div className="service-sticky">
                  <div className="service-number">{service.number}</div>
                  <div className="service-title"><span>{content.servicesIntro.serviceLabel}</span><h3>{service.title}</h3></div>
                  <p>{service.description}</p>
                </div>
                <div className="service-body">
                  <div className="service-deliverables">
                    <h4>{service.deliverablesTitle}</h4>
                    <div className="deliverable-list">
                      {service.deliverables.map((deliverable, index) => (
                        <div className="deliverable" key={deliverable.title}>
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          <div><strong>{deliverable.title}</strong><p>{deliverable.description}</p></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <ProcessDiagram steps={service.process} label={service.diagramLabel} id={`service-${serviceIndex}`} />
                  <div className="diagnostic">
                    <h4>{service.diagnosticTitle}</h4>
                    <ul>
                      {service.questions.map((question) => <li key={question}>{question}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
          <div className="shell services-outro reveal">
            <p className="eyebrow">{content.servicesOutro.eyebrow}</p>
            <h3>{content.servicesOutro.title}</h3>
            <a className="button button-primary" href="#contact"><span>{content.servicesOutro.cta}</span><ArrowIcon /></a>
          </div>
        </section>

        <section className="section methodology" id="methodology">
          <div className="shell reveal">
            <div className="section-title-row grid-12">
              <p className="eyebrow dark">{content.methodology.eyebrow}</p>
              <h2>{content.methodology.title}</h2>
            </div>
            <ol className="method-steps">
              {content.methodology.steps.map((step) => (
                <li key={step.number}>
                  <span>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section why-us" id="why-us">
          <div className="shell reveal">
            <div className="section-title-row grid-12">
              <p className="eyebrow">{content.whyUs.eyebrow}</p>
              <h2>{content.whyUs.title}</h2>
            </div>
            <div className="why-grid">
              {content.whyUs.points.map((point) => (
                <article key={point.number}>
                  <span>{point.number}</span><h3>{point.title}</h3><p>{point.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {availableMetrics.length > 0 && (
          <section className="metrics" aria-labelledby="metrics-heading">
            <div className="shell reveal">
              <h2 id="metrics-heading">{content.metrics.title}</h2>
              <div className="metrics-grid">
                {availableMetrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
              </div>
            </div>
          </section>
        )}

        <section className="section contact" id="contact">
          <div className="shell reveal">
            <div className="contact-heading grid-12">
              <p className="eyebrow dark">{content.contact.eyebrow}</p>
              <h2>{content.contact.title}</h2>
              <p>{content.contact.description}</p>
            </div>
            <div className="contact-layout">
              <ContactForm />
              <aside className="direct-contact">
                <div>
                  <h3>{content.contact.directTitle}</h3>
                  <p>{content.contact.directDescription}</p>
                </div>
                <a className="direct-whatsapp" href={content.brand.whatsappUrl} target="_blank" rel="noreferrer">
                  <span>{content.contact.whatsappCta}</span><ArrowIcon />
                </a>
                <dl>
                  <div><dt>{content.contact.phoneLabel}</dt><dd><a dir="ltr" href={content.brand.phoneHref}>{content.brand.phoneDisplay}</a></dd></div>
                  <div><dt>{content.contact.addressLabel}</dt><dd>{content.brand.address}</dd></div>
                </dl>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="shell footer-grid">
          <div>
            <a className="footer-brand" href="#top" aria-label={content.navigation.homeLabel}>
              <Image
                className="brand-logo brand-logo-footer"
                src={content.brand.logoTransparent}
                width={512}
                height={487}
                alt={content.brand.logoAlt}
              />
            </a>
            <p>{content.brand.tagline}</p>
          </div>
          <div><a dir="ltr" href={content.brand.phoneHref}>{content.brand.phoneDisplay}</a><p>{content.brand.address}</p></div>
          <div><p>{content.footer.founded}</p><p>{content.footer.copyright}</p><a href="#top">{content.footer.backToTop} <ArrowIcon /></a></div>
        </div>
      </footer>

      <a className="floating-whatsapp" href={content.brand.whatsappUrl} target="_blank" rel="noreferrer" aria-label={content.accessibility.floatingWhatsapp}>
        <span>{content.hero.primaryCta}</span><ArrowIcon />
      </a>
    </>
  );
}
