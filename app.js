import define from "./index.js";
import {Runtime} from "./runtime.js";

const mapRoot = document.querySelector("#map-root");
const controlsRoot = document.querySelector("#controls-root");
const downloadRoot = document.querySelector("#download-root");
const shareLink = document.querySelector("#share-link");
const shareSummary = document.querySelector("#share-summary");

function logCellError(error, name) {
  const cellName = name ? ` "${name}"` : "";
  console.error(`Observable cell${cellName} failed`, error);
}

function createNodeObserver(container, onFulfilled) {
  return {
    _node: container,
    pending() {
      container.dataset.loading = "true";
    },
    fulfilled(value, name) {
      container.dataset.loading = "false";

      if (value instanceof Node) {
        container.replaceChildren(value);
      } else if (value == null) {
        container.replaceChildren();
      } else {
        container.textContent = String(value);
      }

      onFulfilled?.(value, name);
    },
    rejected(error, name) {
      container.dataset.loading = "false";
      container.innerHTML = '<p class="error-message">This panel could not be loaded.</p>';
      logCellError(error, name);
    }
  };
}

function createSilentObserver(onFulfilled) {
  return {
    _node: document.body,
    pending() {},
    fulfilled(value, name) {
      onFulfilled?.(value, name);
    },
    rejected(error, name) {
      logCellError(error, name);
    }
  };
}

function buildShareUrl(settings) {
  const url = new URL(window.location.href);
  url.searchParams.set("mode", settings.mode.k);
  url.searchParams.set("who", settings.who.k);
  url.searchParams.set("reference", settings.reference.k);
  url.searchParams.set("density", String(settings.min_density));
  return url;
}

function syncShareState(settings) {
  const shareUrl = buildShareUrl(settings);
  const nextRelativeUrl = `${shareUrl.pathname}${shareUrl.search}${shareUrl.hash}`;
  const currentRelativeUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (nextRelativeUrl !== currentRelativeUrl) {
    window.history.replaceState(null, "", nextRelativeUrl);
  }

  shareSummary.textContent =
    `${settings.who.lbl} · ${settings.mode.lbl} · ${settings.reference.lbl} · density cutoff ${settings.min_density}`;
  shareLink.href = shareUrl.toString();
  shareLink.textContent = shareUrl.toString();
}

async function handleSvgDownload() {
  const downloadSvgMap = await main.value("download_svg_map");
  await downloadSvgMap();
}

const runtime = new Runtime();
const main = runtime.module(define, (name) => {
  if (name === "map_display") {
    return createNodeObserver(mapRoot);
  }

  if (name === "viewof map_settings") {
    return createNodeObserver(controlsRoot);
  }

  if (name === "viewof get_svg") {
    return createNodeObserver(downloadRoot, (value) => {
      const button = value instanceof Node ? downloadRoot.querySelector("button") : null;

      if (button) {
        button.type = "button";
        button.addEventListener("click", handleSvgDownload);
      }
    });
  }

  if (name === "map_settings") {
    return createSilentObserver(syncShareState);
  }

  return undefined;
});
