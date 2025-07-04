// src/App.tsx

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import loadingImage from "./assets/loading.gif";
import { getDefinition, saveToNotion, signOut } from "./api";
import { Result } from "./interface";
import * as S from "./App.styles"; // 스타일 컴포넌트들을 S 라는 이름으로 모두 가져오기
import { User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

type Status = "idle" | "loading" | "success" | "error" | "saving" | "saved";

function App() {
  const [status, setStatus] = useState<Status>("idle");
  const [value, setValue] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [url, setUrl] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // 1. 검색 로직을 useCallback으로 감싸서 불필요한 재생성 방지
  const performSearch = useCallback(async (word: string) => {
    if (!word.trim()) return;
    setStatus("loading");
    try {
      const apiResult = await getDefinition(word);
      if (!apiResult || !apiResult.data) {
        throw new Error("No data found for the given word.");
      }
      setResult(apiResult.data);
      setStatus("success");
    } catch (error) {
      console.error("Error fetching word:", error);
      setStatus("error"); // 👈 에러 상태를 명시적으로 보여주는 것이 더 좋을 수 있습니다.
      alert("Could not find the definition for that word.");
    }
  }, []);

  // useEffect(() => {
  //   console.log("[EFFECT-1] useEffect 실행됨 (팝업 열림)");
  //   setLoading(true);

  //   const checkSession = async () => {
  //     console.log("[EFFECT-2] 스토리지에서 세션 가져오기 시도...");
  //     const result = await chrome.storage.local.get("session");

  //     if (result && result.session) {
  //       console.log("[EFFECT-3] 스토리지에서 세션 발견!", result.session);
  //       await supabase.auth.setSession(result.session);
  //     } else {
  //       console.log("[EFFECT-3] 스토리지에 저장된 세션 없음.");
  //     }
  //     setLoading(false);
  //   };

  //   checkSession();

  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     console.log(
  //       `[AUTH-CHANGE] onAuthStateChange 이벤트 발생: ${_event}`,
  //       session
  //     );
  //     setUser(session?.user ?? null);
  //   });

  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, []);
  useEffect(() => {
    const checkSession = async () => {
      const { session } = await chrome.storage.local.get("session");
      if (session) {
        await supabase.auth.setSession(session);
        setUser(session.user); // user 상태도 설정
      }
      setLoading(false);
    };

    checkSession();

    // auth state 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    console.log("[LOGOUT-1] 로그아웃 시작");
    await signOut();
    console.log("[LOGOUT-2] 스토리지에서 세션 삭제 시도...");
    await chrome.storage.local.remove("session");
    console.log("[LOGOUT-3] 스토리지에서 세션 삭제 완료");

    // popup 비활성화 - 빈 문자열로 설정
    await chrome.action.setPopup({ popup: "" });
    console.log("[LOGOUT-4] Popup 비활성화 완료");

    setUser(null);

    // popup 창 닫기
    window.close();
  };
  // const handleLogin = () => {
  //   // 이제 그냥 백그라운드에 메시지만 보냅니다.
  //   chrome.runtime.sendMessage({ action: "login" });
  // };

  if (loading) {
    return <div>로딩 중...</div>;
  }
  // 👈 중복된 로딩 블록 제거됨

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleCopyUrl = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => alert("URL copied to clipboard!"));
  };

  const onSave = async () => {
    if (!result) return;
    setStatus("saving");
    try {
      const response = await saveToNotion(result);
      setUrl(response);
      setStatus("saved");
      setResult(null);
      setValue("");
    } catch (error) {
      console.error("Error saving to Notion:", error);
      setStatus("error");
      alert("Could not save the definition to Notion.");
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performSearch(value);
  };

  // 4. handleRetry 기능 구현
  const handleRetry = () => {
    performSearch(value);
  };
  // 로그인 버튼 렌더링 부분 수정
  const renderNotLoggedIn = () => (
    <S.Container>
      <S.Title>Notionary</S.Title>
      <p>Extension 아이콘을 클릭하여 로그인하세요</p>
    </S.Container>
  );

  const main = () => (
    <S.Container>
      {status === "idle" && (
        <S.InputSection>
          <S.Title>Notionary</S.Title>
          <S.Form onSubmit={onSubmit}>
            <S.Input
              type="text"
              value={value}
              onChange={handleChange}
              placeholder="Enter a word"
            />
            <S.SubmitButton type="submit">Search</S.SubmitButton>
          </S.Form>
          <button onClick={handleLogout}>logout</button>
        </S.InputSection>
      )}

      {(status === "loading" || status === "saving") && (
        <S.LoadingContainer>
          <img src={loadingImage} alt="Loading..." style={{ width: "80px" }} />
        </S.LoadingContainer>
      )}

      {status === "success" && result && (
        <S.ResponseSection>
          <S.Header>
            <S.WordTitle>{result.word}</S.WordTitle>
          </S.Header>
          <S.RowsContainer>
            <S.LongRow>
              <S.Key>Definition 1:</S.Key>
              <S.Value>{result.definition1}</S.Value>
            </S.LongRow>
            {result.definition2 && (
              <S.LongRow>
                <S.Key>Definition 2:</S.Key>
                <S.Value>{result.definition2}</S.Value>
              </S.LongRow>
            )}
            <S.LongRow>
              <S.Key>Example:</S.Key>
              <S.Value>{result.example}</S.Value>
            </S.LongRow>
            {result.synonyms && (
              <S.LongRow>
                <S.Key>Synonyms:</S.Key>{" "}
                {/* 각 동의어를 Tag로 만들기 위해 컨테이너와 map 함수 사용 */}
                <S.TagContainer>
                  {result.synonyms.map((synonym) => (
                    <S.Tag key={synonym}>{synonym}</S.Tag>
                  ))}
                </S.TagContainer>
              </S.LongRow>
            )}
            {result.antonyms && (
              <S.LongRow>
                <S.Key>Antonyms:</S.Key>
                <S.Value>{result.antonyms.join(",")}</S.Value>
              </S.LongRow>
            )}
          </S.RowsContainer>
          <S.ButtonContainer>
            {/* 왼쪽 (Tertiary Action) */}
            <S.GhostButton onClick={() => setStatus("idle")}>
              Home
            </S.GhostButton>

            {/* 오른쪽 (Primary/Secondary Actions) */}
            <S.ActionGroup>
              <S.SecondaryButton onClick={handleRetry}>Retry</S.SecondaryButton>
              <S.PrimaryButton onClick={onSave}>Save</S.PrimaryButton>
            </S.ActionGroup>
          </S.ButtonContainer>
        </S.ResponseSection>
      )}

      {status === "saved" && (
        <S.SuccessContainer>
          <S.SuccessIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </S.SuccessIcon>
          <S.SuccessMessage>Saved to Notion!</S.SuccessMessage>
          <S.UrlContainer>
            <S.StyledLink href={url} target="_blank" rel="noopener noreferrer">
              {url.length > 25 ? `${url.substring(0, 25)}...` : url}
            </S.StyledLink>
            <S.CopyButton onClick={handleCopyUrl}>Copy</S.CopyButton>
          </S.UrlContainer>
          <S.PrimaryButton onClick={() => setStatus("idle")}>
            Search Another Word
          </S.PrimaryButton>
        </S.SuccessContainer>
      )}
    </S.Container>
  );

  // return 부분 수정
  return <S.Body>{!user ? renderNotLoggedIn() : main()}</S.Body>;
}

export default App;
