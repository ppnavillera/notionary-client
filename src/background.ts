// // src/background.ts

// chrome.runtime.onInstalled.addListener(() => {
//   // 컨텍스트 메뉴 생성
//   chrome.contextMenus.create({
//     id: "reactContextMenu",
//     title: "Notionary에서 '%s' 검색하기", // '%s'는 선택된 텍스트로 자동 대체됩니다.
//     contexts: ["selection"], // 텍스트를 선택했을 때만 메뉴가 보이도록 설정
//   });
//   console.log("컨텍스트 메뉴가 생성되었습니다.");
// });
// // chrome.contextMenus.onClicked.addListener((info, tab) => {
// //   // 클릭된 메뉴의 ID가 'reactContextMenu'인지 확인
// //   if (info.menuItemId === "reactContextMenu" && tab) {
// //     // 팝업(React 앱)에 메시지를 보냅니다.
// //     // 'tab.id'를 사용하여 특정 탭의 팝업에만 메시지를 보낼 수 있지만,
// //     // 일반적으로 팝업이 열려있지 않을 수 있으므로, 실행 중인 모든 팝업에 보낼 수 있습니다.
// //     // 여기서는 팝업이 열려있을 때를 가정하고 메시지를 보냅니다.
// //     // 더 나은 방법은 storage에 저장하고 팝업이 열릴 때 읽어오는 것입니다.
// //     chrome.runtime.sendMessage({
// //       type: "CONTEXT_MENU_CLICK",
// //       selectionText: info.selectionText || "선택된 텍스트가 없습니다.",
// //     });
// //   }
// // });

// // src/background.ts
// chrome.action.onClicked.addListener(async (tab) => {
//   // 로그인 상태 확인
//   const { session } = await chrome.storage.local.get("session");

//   if (!session) {
//     // 로그인 안 된 경우 웹페이지 열기
//     chrome.tabs.create({
//       url: "https://your-domain.com?from=extension",
//     });
//   } else {
//     // 로그인된 경우 popup 열기
//     chrome.action.openPopup();
//   }
// });

// // src/background.ts에 추가
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === "AUTH_SUCCESS" && message.session) {
//     // 세션 저장
//     chrome.storage.local.set({ session: message.session }, () => {
//       // popup 활성화
//       chrome.action.setPopup({ popup: "index.html" });

//       // 탭 닫기
//       if (sender.tab?.id) {
//         chrome.tabs.remove(sender.tab.id);
//       }
//     });
//   }
// });

// // // 사용하지 않는 '_sender' 인자를 통해 ESLint 규칙을 준수합니다.
// // chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
// //   if (request.action === "login") {
// //     console.log(
// //       "[BACKGROUND] 'login' 요청 수신. 실제 로그인 로직을 실행합니다."
// //     );

// //     const handleLogin = async () => {
// //       try {
// //         const { data, error } = await supabase.auth.signInWithOAuth({
// //           provider: "google",
// //           options: {
// //             redirectTo: chrome.identity.getRedirectURL(),
// //             skipBrowserRedirect: true,
// //           },
// //         });

// //         if (error) throw error;

// //         const responseUrl = await new Promise<string | undefined>((resolve) => {
// //           chrome.identity.launchWebAuthFlow(
// //             { url: data.url, interactive: true },
// //             resolve
// //           );
// //         });

// //         if (!responseUrl) {
// //           console.log(
// //             "[BACKGROUND] 로그인 흐름이 사용자에 의해 취소되었습니다."
// //           );
// //           return;
// //         }

// //         const url = new URL(responseUrl);
// //         const hash = new URLSearchParams(url.hash.substring(1));
// //         const accessToken = hash.get("access_token");
// //         const refreshToken = hash.get("refresh_token");

// //         if (!accessToken || !refreshToken) {
// //           throw new Error("URL에서 토큰을 찾을 수 없습니다.");
// //         }

// //         const { data: sessionData, error: sessionError } =
// //           await supabase.auth.setSession({
// //             access_token: accessToken,
// //             refresh_token: refreshToken,
// //           });

// //         if (sessionError) throw sessionError;

// //         if (sessionData.session) {
// //           await chrome.storage.local.set({ session: sessionData.session });
// //           console.log(
// //             "[BACKGROUND] 로그인 성공! 세션이 스토리지에 저장되었습니다."
// //           );
// //         }
// //       } catch (e) {
// //         console.error("[BACKGROUND] 로그인 처리 중 에러 발생:", e);
// //       }
// //     };

// //     handleLogin();
// //     // 비동기 작업이 있음을 Chrome에 알리기 위해 true를 반환합니다.
// //     return true;
// //   }
// // });

// src/background.ts
import { supabase } from "./supabaseClient"; // 필요 시 import

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "reactContextMenu",
    title: "Notionary에서 '%s' 검색하기",
    contexts: ["selection"],
  });
});
// src/background.ts
chrome.action.onClicked.addListener(async () => {
  console.log("[BACKGROUND] Extension 아이콘 클릭됨");
  // 현재 popup 상태 확인
  const popup = await chrome.action.getPopup({});
  console.log("[BACKGROUND] 현재 popup:", popup);
  const storage = await chrome.storage.local.get("session");
  console.log("[BACKGROUND] 저장된 세션:", storage.session);

  if (!storage.session) {
    console.log("[BACKGROUND] 세션 없음 - 새 창 열기");

    // popup이 설정되어 있다면 비활성화
    if (popup) {
      await chrome.action.setPopup({ popup: "" });
      console.log("[BACKGROUND] 기존 popup 비활성화");
    }

    // URL에 반드시 ?from=extension 파라미터 포함
    const url = "http://localhost:3000/?from=extension";
    console.log("[BACKGROUND] 열리는 URL:", url);

    chrome.tabs.create({
      url: url,
    });
  } else {
    console.log("[BACKGROUND] 세션 있음 - popup 열기");
    await chrome.action.setPopup({ popup: "index.html" });
    chrome.action.openPopup();
  }
});

// 메시지 수신 핸들러
chrome.runtime.onMessage.addListener((message, sender) => {
  console.log("[BACKGROUND] 메시지 수신:", message);

  if (message.type === "AUTH_SUCCESS" && message.session) {
    chrome.storage.local.set({ session: message.session }, async () => {
      console.log("[BACKGROUND] 세션 저장 완료:", message.session);

      // popup 활성화
      await chrome.action.setPopup({ popup: "index.html" });

      console.log("[BACKGROUND] Popup 활성화 완료");
    });
  }

  return true;
});
