import React, { useEffect, useRef } from "react"
import { graphql, HeadProps } from "gatsby"
import styled, { keyframes } from "styled-components"
import mediumZoom from "medium-zoom"
import SEO from "../components/seo"
import withLayout from "../util/HOC/withLayout"
import Markdown from "../components/blog-post/markdown"
import CcStatement from "../components/blog-post/cc-statement"

interface Props {
  data: {
    markdownRemark: Blog
  }
}

function BlogSIV({ data, className }: Props & StyledComponentProps) {
  const { markdownRemark: post } = data // data.markdownRemark holds our post data
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return
    // Remove <a> wrappers around images so clicks don't open new windows
    contentRef.current.querySelectorAll("a > img, a .gatsby-resp-image-wrapper").forEach(el => {
      const anchor = el.closest("a")
      if (!anchor) return
      const parent = anchor.parentNode
      if (!parent) return
      while (anchor.firstChild) parent.insertBefore(anchor.firstChild, anchor)
      parent.removeChild(anchor)
    })
    const zoom = mediumZoom(contentRef.current.querySelectorAll("img"), {
      margin: 24,
      background: "rgba(0, 0, 0, 0.85)",
    })
    return () => zoom.detach()
  }, [])

  return (
    <>
      <div className={`blog-post-container ${className}`}>
        <div className="blog-post">
          <h1 className="title">{post.frontmatter.title}</h1>
          <hr className="divider"/>
          <p className="date">{post.frontmatter.date}</p>
          <div ref={contentRef}>
            <Markdown
              className="blog-post-content"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </div>
        </div>
      </div>
      <CcStatement />
    </>
  )
}

const BlogSIVwithLayout = withLayout(BlogSIV);

const expend = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const fade = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export default styled(BlogSIVwithLayout)`
  .title {
    text-align: center;
  }
  .date {
    text-align: center;
    color: #8c8c8c;
    animation: ${fade} 1s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .divider {
    animation: ${expend} 1s cubic-bezier(0.4, 0, 0.2, 1);
  }
`

export const Head = ({ data }: HeadProps<Props["data"]>) => (
  <SEO title={data.markdownRemark.frontmatter.title} description={data.markdownRemark.excerpt} />
)

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      excerpt(pruneLength: 250)
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`
