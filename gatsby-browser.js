/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
require("github-markdown-css/github-markdown-light.css");
require(`${__dirname}/src/css/bootstrap.min.css`)
require(`${__dirname}/src/css/open-iconic-bootstrap.scss`)
require(`${__dirname}/src/css/css-override.scss`)

const React = require("react");
const { I18nProvider } = require("./src/i18n");

exports.wrapRootElement = ({ element }) => (
  React.createElement(I18nProvider, null, element)
);