/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { ReactNode } from "react"
import { Container } from "react-bootstrap"
import Header from "./header"
import styled from "styled-components"
import Footer from "./footer"

interface Props {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className }: Props) => {
  return (
    <>
      <Header />
      <Container className={className}>
        <main>{children}</main>
      </Container>
      <Footer/>
    </>
  )
}

export default styled(Layout)`
  padding-top: 130px;
  min-height: calc(100vh - 81px);
  position: relative;
`
