import { Link } from "gatsby"
import React from "react"
import { Navbar, Container, Nav } from "react-bootstrap"
import Image from "./image";
import styled from "styled-components"
import { useI18n, Locale } from "../i18n"

interface Props {
  className?: string;
}
const Header = ({ className }: Props) => {
  const { locale, setLocale, t } = useI18n();
  const toggleLocale = () => setLocale(locale === "zh" ? "en" : "zh");
  const toggleLabel = locale === "zh" ? "EN" : "中文";

  return (
    <Navbar bg="dark" variant="dark" className={className} fixed="top">
      <Container>
        <Link to="/" className="d-flex align-items-center navbar-brand">
          <div className="image-container">
            <Image />
          </div>
          <span
            className="site-title nav-link"
          >
            {t("site.title")}
          </span>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Link
              to="/blog"
              className="nav-link blog-link nav-link"
            >
              {t("header.blog")}
            </Link>
          </Nav>
          <Nav>
            <span
              role="button"
              tabIndex={0}
              className="lang-toggle nav-link"
              onClick={toggleLocale}
              onKeyDown={(e) => { if (e.key === "Enter") toggleLocale(); }}
            >
              {toggleLabel}
            </span>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default styled(Header)`
  padding-top: .5rem !important;
  padding-bottom: .5rem !important;
  .navbar-brand {
    margin-right: 0;
  }
  .image-container {
    margin-top: -5px;
    width: 60px;
    margin-right: 5px;
  }
  .site-title {
    font-size: 1.2rem;
  }
  .blog-link {
    font-size: 1rem;
  }
  .nav-link {
    color: white;
    text-decoration: none;
  }
  .navbar-nav {
    margin: 0 !important;
  }
  .lang-toggle {
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 4px;
    padding: 2px 8px !important;
    font-size: 0.85rem;
    &:hover {
      border-color: white;
      background: rgba(255, 255, 255, 0.1);
    }
  }
`
