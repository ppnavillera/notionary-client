// src/background.ts

import { supabase } from "./supabaseClient";

chrome.runtime.onInstalled.addListener(() => {
  // 컨텍스트 메뉴 생성
  chrome.contextMenus.create({
    id: "reactContextMenu",
    title: "Notionary에서 '%s' 검색하기", // '%s'는 선택된 텍스트로 자동 대체됩니다.
    contexts: ["selection"], // 텍스트를 선택했을 때만 메뉴가 보이도록 설정
  });
  console.log("컨텍스트 메뉴가 생성되었습니다.");
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // 클릭된 메뉴의 ID가 'reactContextMenu'인지 확인
  if (info.menuItemId === "reactContextMenu" && tab) {
    // 팝업(React 앱)에 메시지를 보냅니다.
    // 'tab.id'를 사용하여 특정 탭의 팝업에만 메시지를 보낼 수 있지만,
    // 일반적으로 팝업이 열려있지 않을 수 있으므로, 실행 중인 모든 팝업에 보낼 수 있습니다.
    // 여기서는 팝업이 열려있을 때를 가정하고 메시지를 보냅니다.
    // 더 나은 방법은 storage에 저장하고 팝업이 열릴 때 읽어오는 것입니다.
    chrome.runtime.sendMessage({
      type: "CONTEXT_MENU_CLICK",
      selectionText: info.selectionText || "선택된 텍스트가 없습니다.",
    });
  }
});

// 사용하지 않는 '_sender' 인자를 통해 ESLint 규칙을 준수합니다.
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "login") {
    console.log(
      "[BACKGROUND] 'login' 요청 수신. 실제 로그인 로직을 실행합니다."
    );

    const handleLogin = async () => {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: chrome.identity.getRedirectURL(),
            skipBrowserRedirect: true,
          },
        });

        if (error) throw error;

        const responseUrl = await new Promise<string | undefined>((resolve) => {
          chrome.identity.launchWebAuthFlow(
            { url: data.url, interactive: true },
            resolve
          );
        });

        if (!responseUrl) {
          console.log(
            "[BACKGROUND] 로그인 흐름이 사용자에 의해 취소되었습니다."
          );
          return;
        }

        const url = new URL(responseUrl);
        const hash = new URLSearchParams(url.hash.substring(1));
        const accessToken = hash.get("access_token");
        const refreshToken = hash.get("refresh_token");

        if (!accessToken || !refreshToken) {
          throw new Error("URL에서 토큰을 찾을 수 없습니다.");
        }

        const { data: sessionData, error: sessionError } =
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

        if (sessionError) throw sessionError;

        if (sessionData.session) {
          await chrome.storage.local.set({ session: sessionData.session });
          console.log(
            "[BACKGROUND] 로그인 성공! 세션이 스토리지에 저장되었습니다."
          );
        }
      } catch (e) {
        console.error("[BACKGROUND] 로그인 처리 중 에러 발생:", e);
      }
    };

    handleLogin();
    // 비동기 작업이 있음을 Chrome에 알리기 위해 true를 반환합니다.
    return true;
  }
});
