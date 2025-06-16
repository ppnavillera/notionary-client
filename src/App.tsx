// src/App.tsx

import { ChangeEvent, FormEvent, useState } from "react";
import loadingImage from "./assets/loading.gif";
import { getDefinition, saveToNotion } from "./api";
import { Result } from "./interface";
import * as S from "./App.styles"; // 스타일 컴포넌트들을 S 라는 이름으로 모두 가져오기

type Status = "idle" | "loading" | "success" | "error" | "saving" | "saved";

function App() {
  const [status, setStatus] = useState<Status>("idle");
  const [value, setValue] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [url, setUrl] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url).then(() => {
      alert("URL copied to clipboard!");
      // (선택) 복사 성공 시 사용자에게 알림. 예: alert('Copied!');
    });
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
    if (!value.trim()) return;
    setStatus("loading");
    try {
      const result = await getDefinition(value);
      setResult(result.data);
      setStatus("success");
    } catch (error) {
      console.error("Error fetching word:", error);
      setStatus("idle"); // 에러 후 초기화면으로
      alert("Could not find the definition for that word.");
    }
  };

  const handleRetry = () => {
    if (!value) {
      setStatus("idle");
      return;
    }
    const form = document.createElement("form");
    onSubmit(new FormEvent(form));
  };

  return (
    <S.Body>
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
          </S.InputSection>
        )}

        {(status === "loading" || status === "saving") && (
          <S.LoadingContainer>
            <img
              src={loadingImage}
              alt="Loading..."
              style={{ width: "80px" }}
            />
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
                  <S.Key>Synonyms:</S.Key>
                  <S.Value>{result.synonyms}</S.Value>
                </S.LongRow>
              )}
              {result.antonyms && (
                <S.LongRow>
                  <S.Key>Antonyms:</S.Key>
                  <S.Value>{result.antonyms}</S.Value>
                </S.LongRow>
              )}
            </S.RowsContainer>
            <S.ButtonContainer>
              <S.SecondaryButton onClick={handleRetry}>Retry</S.SecondaryButton>
              <S.PrimaryButton onClick={onSave}>Save</S.PrimaryButton>
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
              <S.StyledLink
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
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
    </S.Body>
  );
}

export default App;
