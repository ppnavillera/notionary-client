// src/content.ts
console.log("[CONTENT] Content script 시작됨");

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
console.log("[CONTENT] Content script 로드됨 - URL:", window.location.href);

// main 페이지에서 강제로 체크
if (window.location.pathname === "/main") {
  console.log("[CONTENT] Main 페이지에서 실행 중");
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
      console.log("[CONTENT] AUTH_SUCCESS 처리:", {
        hasSession: !!event.data.session,
        hasNotionSetup: event.data.hasNotionSetup,
      });

      chrome.runtime.sendMessage(
        {
          type: "AUTH_SUCCESS",
          session: event.data.session,
          hasNotionSetup: event.data.hasNotionSetup, // 추가
        },
        () => {
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
    // Notion 설정 완료 메시지 처리 추가
    if (event.data.type === "NOTIONARY_NOTION_SETUP_COMPLETE") {
      console.log("[CONTENT] Notion 설정 완료 메시지 전달");
      chrome.runtime.sendMessage({
        type: "NOTION_SETUP_COMPLETE",
      });
    }
  });
}
