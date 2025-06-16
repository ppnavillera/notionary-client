import { ChangeEvent, FormEvent, useState } from "react";
import styled from "styled-components";

import loadingImage from "./assets/loading.gif";
import { getDefinition } from "./api";

interface Result {
  word: string;
  definition1: string;
  definition2: string | null;
  example: string;
  synonyms: string | null;
  antonyms: string | null;
}

function App() {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [result, setResult] = useState<Result | null>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onConfirm = () => {
    // 부드러운 전환을 위해 상태 초기화를 약간 지연시킬 수 있지만, 여기서는 즉시 실행합니다.
    setResult(null);
    setValue("");
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value.trim()) return; // 빈 값은 제출하지 않도록 방지
    setLoading(true);
    try {
      const result = await getDefinition(value);
      setResult(result.data);
    } catch (error) {
      console.error("Error fetching word:", error);
      // 사용자에게 에러 피드백을 주는 UI를 추가할 수도 있습니다.
      alert("Could not find the definition for that word.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Body>
      <Container>
        {!loading && !result && (
          <InputSection>
            <Title>Dictionary</Title>
            <Form onSubmit={onSubmit}>
              <Input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="Enter a word"
              />
              <SubmitButton type="submit">Search</SubmitButton>
            </Form>
          </InputSection>
        )}
        {loading && (
          <LoadingContainer>
            <img src={loadingImage} alt="Loading" style={{ width: "80px" }} />
          </LoadingContainer>
        )}
        {!loading && result && (
          <ResponseSection>
            <Header>
              <WordTitle>{result.word}</WordTitle>
            </Header>
            <RowsContainer>
              <LongRow>
                <Key>Definition 1:</Key>
                <Value>{result.definition1}</Value>
              </LongRow>
              {result.definition2 && (
                <LongRow>
                  <Key>Definition 2:</Key>
                  <Value>{result.definition2}</Value>
                </LongRow>
              )}
              <LongRow>
                <Key>Example:</Key>
                <Value>{result.example}</Value>
              </LongRow>
              {result.synonyms && (
                <LongRow>
                  <Key>Synonyms:</Key>
                  <Value>{result.synonyms}</Value>
                </LongRow>
              )}
              {result.antonyms && (
                <LongRow>
                  <Key>Antonyms:</Key>
                  <Value>{result.antonyms}</Value>
                </LongRow>
              )}
            </RowsContainer>
            <ButtonContainer>
              <ConfirmButton onClick={onConfirm}>Search Another</ConfirmButton>
            </ButtonContainer>
          </ResponseSection>
        )}
      </Container>
    </Body>
  );
}

export default App;

// --- Styled Components (디자인 개선) ---

const Body = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f7f9;
  width: 300px;
  height: 400px;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 24px;
  background-color: white;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.07);
  box-sizing: border-box;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 24px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  color: #2c3e50;
  font-weight: 800;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &::placeholder {
    color: #a8b0c3;
  }

  &:focus {
    outline: none;
    border-color: #e44d26;
    box-shadow: 0 0 0 3px rgba(228, 77, 38, 0.1);
  }
`;

const BaseButton = styled.button`
  color: white;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;

  &:hover {
    background-color: #c33d16; /* Darker shade */
  }

  &:active {
    transform: scale(0.98);
  }
`;

const SubmitButton = styled(BaseButton)`
  width: 100%;
  background-color: #e44d26;
`;

const ConfirmButton = styled(BaseButton)`
  background-color: #e44d26;
  padding: 10px 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const ResponseSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  text-align: left;
`;

const Header = styled.div`
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f2f5;
  margin-bottom: 16px;
`;

const WordTitle = styled.h2`
  margin: 0;
  color: #e44d26;
  font-size: 24px;
  font-weight: 700;
  text-transform: capitalize;
`;

const RowsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex-grow: 1; /* 컨텐츠가 남는 공간을 모두 차지하도록 */
  overflow-y: auto; /* 내용이 많으면 스크롤 */
  padding-right: 8px; /* 스크롤바 공간 확보 */
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  font-size: 14px;
`;

const LongRow = styled(Row)`
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
`;

const Key = styled.span`
  font-weight: 600;
  color: #34495e;
  flex-shrink: 0;
`;

const Value = styled.span`
  color: #555;
  line-height: 1.6;
  word-break: break-word; /* 긴 단어가 영역을 벗어나는 것을 방지 */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 16px; /* 내용과의 간격 */
  padding-top: 16px; /* 위쪽 패딩 */
  border-top: 1px solid #f0f2f5;
`;
