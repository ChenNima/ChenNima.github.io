import React, { useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { useI18n } from "../i18n"
import type { TranslationKey } from "../i18n"

export interface Props {
  description?: string;
  title: string;
}

function SEO({ description, title }: Props) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const fullTitle = `${title} | ${site.siteMetadata.title}`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={site.siteMetadata.author} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
    </>
  )
}

export default SEO

export function useLocalizedTitle(titleKey: TranslationKey) {
  const { locale, t } = useI18n();
  useEffect(() => {
    const siteTitle = t("site.title");
    document.title = `${t(titleKey)} | ${siteTitle}`;
  }, [locale, titleKey, t]);
}
