import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const Image = () => {
  const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "logo.png" }) {
        childImageSharp {
          gatsbyImageData(width: 300, layout: CONSTRAINED)
        }
      }
    }
  `)

  const image = getImage(data.placeholderImage)
  return image ? <GatsbyImage image={image} alt="logo" /> : null
}

export default Image
