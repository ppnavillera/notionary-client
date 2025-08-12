// src/api.ts

import axios from "axios";
import { Result } from "./interface";
import { supabase } from "./supabaseClient";

// const url = "http://127.0.0.1:54321/functions/v1";

const url = "https://nxogwwumniauclwarsbt.supabase.co/functions/v1";
// "https://nxogwwumniauclwarsbt.supabase.co/functions/v1/enkoextension";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

export async function getDefinition(word: string) {
  const geminiUrl = url + "/gemini";
  try {
    const response = await axios.post(
      geminiUrl,
      { word: word },
      {
        headers: {
          "Content-Type": "application/json", // JSON 형식 명시
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(err.response?.data || err.message);
    } else {
      console.error(err);
    }
  }
}

export async function saveToNotion(definition: Result) {
  const notionUrl = url + "/notion";

  // chrome.storage에서 세션 정보 가져오기
  const storage = await chrome.storage.local.get("session");

  if (!storage.session || !storage.session.user) {
    console.error("세션 정보가 없습니다. 로그인 상태를 확인하세요.");
    throw new Error("No session found");
  }

  const userId = storage.session.user.id;

  console.log("[SAVE-TO-NOTION] 사용자 ID:", userId);
  console.log("[SAVE-TO-NOTION] 정의 데이터:", definition);

  // axios를 사용하여 Notion API에 POST 요청을 보냅니다.
  try {
    const response = await axios.post(
      notionUrl,
      {
        data: definition,
        userId: userId, // 사용자 ID 추가
      }, // "word"로 수정
      {
        headers: {
          "Content-Type": "application/json", // JSON 형식 명시
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    // console.log(response.data.data.url);
    console.log(response.data);
    return response.data.data.url;
    // return;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(err.response?.data || err.message);
    } else {
      console.error(err);
    }
  }
}
// getDefinition, saveToNotion 함수는 그대로 둡니다.

// 로그아웃은 그대로 유지합니다.
export async function signOut() {
  await supabase.auth.signOut();
}
