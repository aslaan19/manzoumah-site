export const designTokens = {
  colors: {
    primary: "#0B2522",
    primarySoft: "#143A35",
    accent: "#B28A52",
    accentSoft: "#D9C5A5",
    paper: "#F5F3EE",
    surface: "#FFFFFF",
    ink: "#142523",
    muted: "#63716E",
    line: "#D9DEDB",
  },
  type: {
    body: "1rem",
    small: "0.875rem",
    lead: "1.1875rem",
    display: "clamp(2.75rem, 6.6vw, 5.75rem)",
    section: "clamp(2.1rem, 4vw, 3.7rem)",
    service: "clamp(2rem, 3.5vw, 3.25rem)",
  },
  spacing: {
    sectionDesktop: "clamp(7.5rem, 10vw, 10rem)",
    sectionMobile: "4.5rem",
    gutterDesktop: "2.5rem",
    gutterMobile: "1rem",
    maxWidth: "73.75rem",
  },
  motion: {
    duration: "400ms",
    distance: "16px",
  },
} as const;
