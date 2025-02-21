import { useState } from "react";
import styled from "styled-components";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function App() {
  const [color, setColor] = useState("black");
  const [loading, setLoading] = useState(true);

  const onClick = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // // chrome:// URL인지 확인
      // if (!tab.url || tab.url.startsWith("chrome://")) {
      //   console.error("Cannot modify chrome:// pages");
      //   return;
      // }

      console.log("Current tab ID:", tab.id);
      await chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        func: function (color) {
          document.body.style.backgroundColor = color;
          console.log("Changing background color to:", color);
        },
        args: [color],
      });
    } catch (error) {
      console.error("Error executing script:", error);
    }
  };

  const onSubmit = async () => {};

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

  const Key = styled.span`
    font-size: 14px;
    font-weight: 700;
    /* font-weight: bold; */
    color: #555;
  `;
  const Value = styled.span`
    font-size: 14px;
    /* font-weight: 400; */
  `;

  return (
    <Body>
      <Container>
        {!loading ? (
          <InputSection>
            <Title>Enter a Word</Title>
            <Form>
              <Input type="text" placeholder="Enter word here" />
              <SubmitButton>Submit</SubmitButton>
            </Form>
          </InputSection>
        ) : (
          // <ResponseSection>
          //   {/* <Title>Notion Dictionary</Title> */}
          //   <Definition>Definition</Definition>
          //   <RowsContainer>
          //     <Row>
          //       <Key>Word:</Key>
          //       <Value></Value>
          //     </Row>
          //     <Row>
          //       <Key>Definition 1:</Key>
          //       <Value>Definition 1</Value>
          //     </Row>
          //     <Row>
          //       <Key>Definition 2:</Key>
          //       <Value>Definition 2</Value>
          //     </Row>
          //     <Row>
          //       <Key>Example:</Key>
          //       <Value>Example</Value>
          //     </Row>
          //     <Row>
          //       <Key>Synonyms:</Key>
          //       <Value>Synonyms</Value>
          //     </Row>
          //     <Row>
          //       <Key>Antonyms:</Key>
          //       <Value>Antonyms</Value>
          //     </Row>
          //   </RowsContainer>
          //   <ConfirmButton>Confirm</ConfirmButton>
          // </ResponseSection>
          <DotLottieReact
            src="/loading.json"
            autoplay
            loop={true}
            style={{ width: "100px", height: "200px" }}
          />
        )}
      </Container>
    </Body>
  );
}

export default App;
