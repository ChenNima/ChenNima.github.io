/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

const React = require("react");
const { I18nProvider } = require("./src/i18n");

exports.wrapRootElement = ({ element }) => (
  React.createElement(I18nProvider, null, element)
);

exports.onRenderBody = ({ setHtmlAttributes }) => {
  setHtmlAttributes({ lang: "zh" });
};
