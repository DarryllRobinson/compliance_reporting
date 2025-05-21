const { generateSitemap } = require("./generateSitemap");
const chokidar = require("chokidar");
const path = require("path");

const contentDir = path.join(__dirname, "../public/content");

console.log("👀 Watching FAQ content directory for changes...");

const watcher = chokidar.watch(path.join(contentDir, "faq.md"), {
  ignored: /(^|[/\\])\../, // ignore dotfiles
  persistent: true,
  depth: 0,
});

const triggerUpdate = () => {
  try {
    generateSitemap();
  } catch (err) {
    console.error("⚠️ Error during FAQ sitemap update:", err);
  }
};

watcher.on("change", triggerUpdate).on("ready", () => {
  console.log("✅ FAQ Watcher is running.");
});
