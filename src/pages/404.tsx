import React from "react"

import Layout from "../components/layout"
import SEO, { useLocalizedTitle } from "../components/seo"
import { useT } from "../i18n"

const NotFoundPage = () => {
  const t = useT();
  useLocalizedTitle("notFound.headTitle");

  return (
    <Layout>
      <h1>{t("notFound.title")}</h1>
      <p>{t("notFound.message")}</p>
    </Layout>
  )
}

export default NotFoundPage

export const Head = () => <SEO title="404: 未找到" />
