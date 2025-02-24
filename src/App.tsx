import { ChangeEvent, FormEvent, useState } from "react";
import styled from "styled-components";
import { getWord } from "./api";
import loadingImage from "./assets/loading.gif";

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

  // const onClick = async () => {
  //   try {
  //     const [tab] = await chrome.tabs.query({
  //       active: true,
  //       currentWindow: true,
  //     });

  //     // // chrome:// URL인지 확인
  //     // if (!tab.url || tab.url.startsWith("chrome://")) {
  //     //   console.error("Cannot modify chrome:// pages");
  //     //   return;
  //     // }

  //     console.log("Current tab ID:", tab.id);
  //     await chrome.scripting.executeScript({
  //       target: { tabId: tab.id! },
  //       func: function (color) {
  //         document.body.style.backgroundColor = color;
  //         console.log("Changing background color to:", color);
  //       },
  //       args: [color],
  //     });
  //   } catch (error) {
  //     console.error("Error executing script:", error);
  //   }
  // };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    console.log(value);
  };

  const onConfirm = () => {
    setLoading(false);
    setResult(null);
    setValue("");
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await getWord(value);
      // const result = {
      //   data: {
      //     word: "apple",
      //     definition1: "a round fruvvvvvvvvvvvvvvvvvit",
      //     definition2: "the tree ",
      //     example: "He picked an apple from the tree.",
      //     synonyms: "fruit, pome",
      //     antonyms: "hello",
      //   },
      // };
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      setResult(result.data);
    } catch (error) {
      console.error("Error fetching word:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderSynonymsAntonyms = (label: string, items: string) => {
    return items.length < 20 ? (
      <Row>
        <Key>{label}:</Key>
        <Value>{items}</Value> {/* 문자열 그대로 출력 */}
      </Row>
    ) : (
      <LongRow>
        <Key>{label}:</Key>
        <Value>{items}</Value> {/* 문자열 그대로 출력 */}
      </LongRow>
    );
  };

  return (
    <Body>
      <Container>
        {!loading && !result && (
          <InputSection>
            <Title>Enter a Word</Title>
            <Form onSubmit={onSubmit}>
              <Input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="Enter word here"
              />
              <SubmitButton>Submit</SubmitButton>
            </Form>
          </InputSection>
        )}
        {loading && (
          <img src={loadingImage} alt="Loading" style={{ width: "100px" }} />
        )}
        {!loading && result && (
          <ResponseSection>
            {/* <Title>Notion Dictionary</Title> */}
            <Definition>Definition</Definition>
            <RowsContainer>
              <Row>
                <Key>Word:</Key>
                <Value>{result.word}</Value>
              </Row>
              <Row>
                <Key>Definition 1:</Key>
                <Value>{result.definition1}</Value>
              </Row>
              <Row>
                <Key>Definition 2:</Key>
                <Value>{result.definition2}</Value>
              </Row>
              <LongRow>
                <Key>Example:</Key>
                <Value>{result.example}</Value>
              </LongRow>

              {result.synonyms &&
                renderSynonymsAntonyms("Synonyms", result.synonyms)}
              {result.antonyms &&
                renderSynonymsAntonyms("Antonyms", result.antonyms)}
              {/* {result.synonyms?.length !== undefined &&
              result.synonyms.length < 20 ? (
                <Row>
                  <Key>Synonyms:</Key>
                  <Value>{result.synonyms}</Value>
                </Row>
              ) : (
                <LongRow>
                  <Key>Synonyms:</Key>
                  <Value>{result.synonyms}</Value>
                </LongRow>
              )}
              {result.antonyms?.length !== undefined &&
              result.antonyms.length < 20 ? (
                <Row>
                  <Key>Antonyms:</Key>
                  <Value>{result.antonyms}</Value>
                </Row>
              ) : (
                <LongRow>
                  <Key>Antonyms:</Key>
                  <Value>{result.antonyms}</Value>
                </LongRow>
              )} */}
            </RowsContainer>
            <ConfirmButton onClick={onConfirm}>Confirm</ConfirmButton>
          </ResponseSection>
        )}
      </Container>
    </Body>
  );
}

export default App;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9f5f0;
  /* min-width: 50vh;
height: 100vh; */
  /* width: 100%; */
  width: 300px;
  /* height: auto; */
  height: 400px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* min-width: 200px; */
  width: 80%;
  max-width: 600px;
  /* padding: 40px 50px; */
  padding: 20px;
  background-color: white;
  /* border-radius: 10px;
box-shadow: 0px 1px 5px 0 rgba(0, 0, 0, 0.5); */
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.05);
`;

const InputSection = styled.div`
  gap: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 5px;
  width: 100%;
  min-height: 200px;
`;

const Title = styled.div`
  margin: 0px;
  /* text-align: center; */
  /* font-size: 32px; */
  font-size: 26px;
  color: #e44d26;
  font-family: "Pretendard";
  font-weight: 700;
  /* text-shadow: 1px 1px 1px rgba(185, 176, 176, 0.5); */
`;

const Form = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* margin-top: 20px; */
  gap: 15px;
  width: 100%;
`;

const Input = styled.input`
  padding: 10px 16px;
  /* width: 70%; */
  /* flex: 0 0 70%; */
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
`;

const SubmitButton = styled.button`
  background-color: #e44d26;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
`;

const ConfirmButton = styled.button`
  background-color: #e44d26;
  color: white;
  padding: 8px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
`;

// const LoadingContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
//   background-color: rgba(0, 0, 0, 0.5);
//   width: 100%;
// `;

const ResponseSection = styled.div`
  /* display: none; */
  /* text-align: left;
margin-top: 30px; */
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
`;
const Definition = styled.div`
  color: #e44d26;
  font-size: 22px;
  font-family: "Pretendard";
  font-weight: 700;
  padding-bottom: 10px;
  border-bottom: 2px solid #e44d26;
  width: 100%;
`;

const RowsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* gap: 1em; */
  padding-top: 15px;
  padding-bottom: 25px;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  /* justify-content: center; */
  align-items: center;
  font-family: "Pretendard";
  gap: 8px;
`;

const LongRow = styled(Row)`
  flex-direction: column;
  gap: 4px;
  align-items: start;
`;

const Key = styled.span`
  font-size: 14px;
  font-weight: 700;
  /* font-weight: bold; */
  color: #555;
  flex-shrink: 0;
`;
const Value = styled.span`
  font-size: 14px;
  /* font-weight: 400; */
`;
