export default defineContentScript({
  matches: ["*://*.youtube.com/*"],
  main() {
    browser.runtime.onMessage.addListener((message) => {
      if (message.type === "GET_VIDEO_ID") {
        const url = new URL(window.location.href);
        const videoId = url.searchParams.get("v");
        return Promise.resolve({ videoId });
      }
    });
  },
});
