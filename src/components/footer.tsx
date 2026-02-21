import React from "react"
import styled from "styled-components"
import { Container } from "react-bootstrap"
import { useT } from "../i18n"

const Footer = ({className}: StyledComponentProps) => {
  const t = useT();
  return (
    <footer className={className}>
      <Container>
        <span className="unit">
          © {new Date().getFullYear()}, {t("footer.builtWith")}
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </span>
        <span className="unit">{t("footer.createdBy")}</span>
        <span className="unit">
          <a target="_blank" href="https://github.com/ChenNima">
            Github
          </a>
        </span>
        <span className="unit">
          <span className="oi oi-envelope-closed"></span>
          {` `}
          Email:
          {` `}
          <a href="mailto:fennu637@sina.com">
            fennu637@sina.com
          </a>
        </span>
      </Container>
    </footer>
  );
}

export default styled(Footer)`
  margin-top: 40px;
  padding: 10px 0;
  background: #00144a;
  color: #c7c7c7;
  a {
    color: white;
  }
  .unit {
    margin-right: 10px;
  }
`;
