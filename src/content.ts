// src/content.ts
console.log("[CONTENT] Content script 시작됨");

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

function init() {
  console.log("[CONTENT] DOM 준비됨, URL:", window.location.href);

  if (window.location.search.includes("from=extension")) {
    console.log("[CONTENT] Extension 플래그 설정");
    document.body.setAttribute("data-from-extension", "true");
  }

  window.addEventListener("message", (event) => {
    // React DevTools 메시지 무시
    if (event.data.source && event.data.source.includes("react-devtools")) {
      return;
    }

    console.log("[CONTENT] 유효한 메시지 수신:", event.data);

    if (event.origin !== window.location.origin) return;

    if (event.data.type === "NOTIONARY_AUTH_SUCCESS") {
      console.log("[CONTENT] AUTH_SUCCESS 메시지 처리");

      chrome.runtime.sendMessage(
        {
          type: "AUTH_SUCCESS",
          session: event.data.session,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              "[CONTENT] 메시지 전송 에러:",
              chrome.runtime.lastError
            );
          } else {
            console.log("[CONTENT] 메시지 전송 성공");
          }
        }
      );
    }
  });
}
