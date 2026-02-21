import styled from "styled-components"

// Extends github-markdown-css (.markdown-body class applied via className)
export default styled.article`
  /* Override github-markdown-css link color */
  a {
    color: #E75A7C;
    font-weight: bolder;
  }

  /* Inline code: distinct from code blocks */
  *:not(pre) > code {
    background: #F2F5EA;
    color: #fc5755;
    white-space: pre-wrap;
    word-break: break-word;
    margin: 0 3px;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.9em;
  }

  /* Code block base styles (before shiki replaces them) */
  pre {
    background: #24292e;
    color: #e1e4e8;
    border-radius: 8px;
    padding: 1.2em;
    overflow-x: auto;
    font-size: 0.9em;
    line-height: 1.6;
  }

  pre code {
    background: none;
    color: inherit;
    padding: 0;
    margin: 0;
    font-size: inherit;
    white-space: pre;
    word-break: normal;
  }

  /* Gatsby image wrappers */
  .gatsby-resp-image-wrapper {
    margin: 2rem auto;
  }

  img {
    max-width: 100%;
    height: auto;
    cursor: zoom-in;
  }
`;
