export default function (eleventyConfig) {
  const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || "/";

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return new Date(dateObj).toISOString().split("T")[0];
  });

  eleventyConfig.addTransform("pathPrefix", function (content) {
    if (!this.page.outputPath || !this.page.outputPath.endsWith(".html")) {
      return content;
    }

    if (pathPrefix === "/") {
      return content;
    }

    const normalizedPathPrefix = pathPrefix.endsWith("/")
      ? pathPrefix.slice(0, -1)
      : pathPrefix;

    return content.replace(
      /\b(href|src)="\/(?!\/)/g,
      `$1="${normalizedPathPrefix}/`,
    );
  });

  eleventyConfig.addPassthroughCopy({
    "node_modules/modern-normalize/modern-normalize.css":
      "vendor/modern-normalize.css",
    "src/assets": "assets",
    "src/scripts": "scripts",
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
    pathPrefix,
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
