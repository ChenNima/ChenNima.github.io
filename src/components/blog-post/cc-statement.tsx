import React from "react"
import styled from "styled-components"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { graphql, useStaticQuery } from "gatsby"
import { useT } from "../../i18n"

const Image = () => {
  const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "CC-BY-NC-ND.png" }) {
        childImageSharp {
          gatsbyImageData(width: 88, layout: FIXED)
        }
      }
    }
  `)

  const image = getImage(data.placeholderImage)
  return image ? <GatsbyImage image={image} alt="CC BY-NC-ND" /> : null
}

const CcStatement = ({ className }: StyledComponentProps) => {
  const t = useT();
  return (
    <div className={className}>
      <Image />
      <p>
        {t("cc.text")}
        <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank">
          {t("cc.licenseName")}
        </a>
        {t("cc.suffix")}
      </p>
    </div>
  );
}

export default styled(CcStatement)`
margin-top: 5rem;
a {
  color: #E75A7C;
  font-weight: bolder;
}
`;
