import type { CSSProperties } from "react";
import type { Metadata } from "next";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import "./globals.css";
import content from "@/content/site.json";
import { designTokens } from "@/design-tokens";

const configuredUrl = content.seo.siteUrl.startsWith("[[") ? undefined : content.seo.siteUrl;

export const metadata: Metadata = {
  title: content.seo.title,
  description: content.seo.description,
  ...(configuredUrl ? { metadataBase: new URL(configuredUrl) } : {}),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    title: content.seo.title,
    description: content.seo.description,
    url: "/",
    siteName: content.brand.name,
    images: [{ url: "/og-modern.png", width: 1200, height: 630, alt: content.seo.ogAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: content.seo.title,
    description: content.seo.description,
    images: ["/og-modern.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

const tokenStyles = {
  "--color-primary": designTokens.colors.primary,
  "--color-primary-soft": designTokens.colors.primarySoft,
  "--color-accent": designTokens.colors.accent,
  "--color-accent-hover": designTokens.colors.accentHover,
  "--color-accent-soft": designTokens.colors.accentSoft,
  "--color-accent-ink": designTokens.colors.accentInk,
  "--color-paper": designTokens.colors.paper,
  "--color-paper-deep": designTokens.colors.paperDeep,
  "--color-surface": designTokens.colors.surface,
  "--color-ink": designTokens.colors.ink,
  "--color-muted": designTokens.colors.muted,
  "--color-on-dark": designTokens.colors.onDark,
  "--color-on-dark-muted": designTokens.colors.onDarkMuted,
  "--color-line": designTokens.colors.line,
  "--color-input-border": designTokens.colors.inputBorder,
  "--color-danger": designTokens.colors.danger,
  "--color-footer": designTokens.colors.footer,
  "--type-body": designTokens.type.body,
  "--type-small": designTokens.type.small,
  "--type-lead": designTokens.type.lead,
  "--type-display": designTokens.type.display,
  "--type-section": designTokens.type.section,
  "--type-service": designTokens.type.service,
  "--space-section-desktop": designTokens.spacing.sectionDesktop,
  "--space-section-mobile": designTokens.spacing.sectionMobile,
  "--space-gutter-desktop": designTokens.spacing.gutterDesktop,
  "--space-gutter-mobile": designTokens.spacing.gutterMobile,
  "--layout-max": designTokens.spacing.maxWidth,
  "--motion-duration": designTokens.motion.duration,
  "--motion-distance": designTokens.motion.distance,
} as CSSProperties;

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: content.brand.name,
  alternateName: content.brand.nameLatin,
  description: content.seo.description,
  foundingDate: content.brand.founded,
  telephone: content.brand.phoneDisplay,
  ...(configuredUrl ? { url: configuredUrl, logo: `${configuredUrl}${content.brand.logoHorizontal}` } : {}),
  address: {
    "@type": "PostalAddress",
    streetAddress: "حي إشبيلية",
    addressLocality: "الرياض",
    addressCountry: "SA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body style={tokenStyles}>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      </body>
    </html>
  );
}
