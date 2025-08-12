// src/App.styles.ts

import styled from "styled-components";

// --- 기본 레이아웃 ---
export const Body = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f7f9;
  width: 300px;
  height: 400px;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
`;

export const Container = styled.div`
  position: relative;
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

// --- 초기 화면 (idle) ---
export const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 24px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  color: #2c3e50;
  font-weight: 800;
`;

export const LogoutButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
  
  &:hover {
    background-color: #f0f2f5;
    color: #e44d26;
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
`;

export const Input = styled.input`
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

// --- 로딩 화면 (loading, saving) ---
export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

// --- 결과 화면 (success) ---
export const ResponseSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  text-align: left;
`;

export const Header = styled.div`
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f2f5;
  margin-bottom: 16px;
`;

export const WordTitle = styled.h2`
  margin: 0;
  color: #e44d26;
  font-size: 24px;
  font-weight: 700;
  text-transform: capitalize;
`;

export const Pronunciation = styled.div`
  margin: 4px 0 0 0;
  color: #666;
  font-size: 16px;
  font-style: italic;
  font-family: 'Charis SIL', 'DejaVu Sans', monospace;
`;

export const RowsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 8px;
`;

export const Row = styled.div`
  display: flex;
  gap: 8px;
  font-size: 14px;
`;

export const LongRow = styled(Row)`
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
`;

export const Key = styled.span`
  font-weight: 600;
  color: #34495e;
  flex-shrink: 0;
`;

export const Value = styled.span`
  color: #555;
  line-height: 1.6;
  word-break: break-word;
`;
export const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* 태그가 많으면 다음 줄로 넘어감 */
  gap: 8px; /* 태그 사이의 간격 */
  width: 100%;
`;

export const Tag = styled.span`
  background-color: #f0f2f5; /* 부드러운 배경색 */
  color: #555;
  padding: 4px 10px;
  border-radius: 12px; /* 둥근 모서리 (알약 모양) */
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap; /* 태그 내용은 줄바꿈되지 않도록 */
`;

// --- 저장 완료 화면 (saved) ---
export const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 16px;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
`;

export const SuccessIcon = styled.div`
  color: #2ecc71;
`;

export const SuccessMessage = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
`;

export const UrlContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f2f5;
  border-radius: 8px;
  padding: 8px 12px;
  width: 100%;
  box-sizing: border-box;
  margin-top: 8px;
  margin-bottom: 16px;
`;

export const StyledLink = styled.a`
  font-family: "Courier New", Courier, monospace;
  font-size: 13px;
  color: #3498db;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1; /* 남는 공간을 모두 차지 */
  text-align: left;

  &:hover {
    text-decoration: underline;
  }
`;

export const CopyButton = styled.button`
  background: none;
  border: 1px solid #dcdfe6;
  color: #555;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 12px;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e1e5ea;
    border-color: #c0c4cc;
  }
  &:active {
    transform: scale(0.95);
  }
`;

// --- 공용 버튼 스타일 ---
const buttonTransitions = `
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  &:active {
    transform: scale(0.98);
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  background-color: #e44d26;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  ${buttonTransitions}

  &:hover {
    background-color: #c33d16;
  }
`;

const ActionButtonBase = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  ${buttonTransitions}
`;

export const PrimaryButton = styled(ActionButtonBase)`
  background-color: #e44d26;
  color: white;

  &:hover {
    background-color: #c33d16;
  }
`;

export const SecondaryButton = styled(ActionButtonBase)`
  background-color: #f0f2f5;
  color: #34495e;

  &:hover {
    background-color: #e1e5ea;
  }
`;

export const GhostButton = styled(ActionButtonBase)`
  background: transparent;
  color: #555e68; // 약간 톤 다운된 텍스트 색상

  &:hover {
    background-color: #f0f2f5; // Secondary 버튼의 기본 배경색과 동일
  }
`;

// 오른쪽 버튼 그룹을 위한 컨테이너 (새로 추가)
export const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
`;

// ButtonContainer 스타일 수정
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between; // 양쪽 끝으로 요소를 분리
  align-items: center; // 세로 중앙 정렬
  width: 100%;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f2f5;
`;
