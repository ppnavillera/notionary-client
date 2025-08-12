// src/background.ts

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
  const storage = await chrome.storage.local.get(["session", "notionSetup"]);
  console.log("[BACKGROUND] 저장된 세션:", storage.session);

  if (!storage.session) {
    console.log("[BACKGROUND] 세션 없음 - 새 창 열기");

    // popup이 설정되어 있다면 비활성화
    if (popup) {
      await chrome.action.setPopup({ popup: "" });
      console.log("[BACKGROUND] 기존 popup 비활성화");
    }

    // URL에 반드시 ?from=extension 파라미터 포함
    const url =
      "https://689a2120d8b1fe449ae3d1b6--dazzling-madeleine-81d74c.netlify.app/?from=extension";
    console.log("[BACKGROUND] 열리는 URL:", url);

    chrome.tabs.create({
      url: url,
    });
  } else if (!storage.notionSetup) {
    // 로그인은 됐지만 Notion 설정 안 됨
    console.log("[BACKGROUND] Notion 설정 안 됨 - 설정 페이지 열기");
    chrome.tabs.create({
      url: "https://689a2120d8b1fe449ae3d1b6--dazzling-madeleine-81d74c.netlify.app/main?from=extension",
    });
  } else {
    // 모두 완료
    console.log("[BACKGROUND] 모든 설정 완료 - popup 열기");
    await chrome.action.setPopup({ popup: "index.html" });
    chrome.action.openPopup();
  }
});

// // 메시지 수신 핸들러
// chrome.runtime.onMessage.addListener((message, sender) => {
//   console.log("[BACKGROUND] 메시지 수신:", message);

//   if (message.type === "AUTH_SUCCESS" && message.session) {
//     chrome.storage.local.set(
//       {
//         session: message.session,
//         notionSetup: message.hasNotionSetup || false, // 서버에서 받은 상태 저장
//       },
//       async () => {
//         console.log("[BACKGROUND] 세션 및 Notion 상태 저장:", {
//           hasSession: true,
//           notionSetup: message.hasNotionSetup,
//         });

//         // Notion 설정이 이미 되어있으면 popup 활성화
//         if (message.hasNotionSetup) {
//           await chrome.action.setPopup({ popup: "index.html" });
//         }
//       }
//     );
//   }
//   // Notion 설정 완료 처리
//   if (message.type === "NOTION_SETUP_COMPLETE") {
//     chrome.storage.local.set({ notionSetup: true }, async () => {
//       console.log("[BACKGROUND] Notion 설정 완료 저장");
//       // 이제 popup 활성화
//       await chrome.action.setPopup({ popup: "index.html" });
//     });
//   }
//   return true;
// });

chrome.runtime.onMessage.addListener((message) => {
  console.log("[BACKGROUND] 메시지 수신 상세:", {
    type: message.type,
    hasSession: !!message.session,
    hasNotionSetup: message.hasNotionSetup,
    messageKeys: Object.keys(message),
  });

  if (message.type === "AUTH_SUCCESS" && message.session) {
    const storageData = {
      session: message.session,
      notionSetup: message.hasNotionSetup === true,
    };

    console.log("[BACKGROUND] 저장할 데이터:", storageData);

    chrome.storage.local.set(storageData, async () => {
      console.log("[BACKGROUND] 저장 완료");

      // 저장된 데이터 확인
      const saved = await chrome.storage.local.get(["session", "notionSetup"]);
      console.log("[BACKGROUND] 저장 확인:", {
        hasSession: !!saved.session,
        notionSetup: saved.notionSetup,
      });

      if (message.hasNotionSetup === true) {
        await chrome.action.setPopup({ popup: "index.html" });
        console.log("[BACKGROUND] Popup 활성화 완료");
      }
    });
  }

  return true;
});
