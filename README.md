# Notionary 📖

**Notionary**는 영어 단어의 정의를 빠르게 검색하고 Notion에 자동으로 저장하는 Chrome 확장 프로그램입니다. AI 기반 단어 검색과 개인 학습 노트 관리를 하나로 통합한 언어 학습 도구입니다.

## ✨ 주요 기능

### 🔍 **AI 기반 단어 검색**
- Gemini AI를 활용한 정확한 영어 단어 정의 제공
- 발음 기호 (IPA) 표시
- 다양한 의미 제공 (Definition 1, Definition 2)
- 실제 사용 예문
- 동의어(Synonyms)와 반의어(Antonyms) 태그

### 📝 **Notion 연동**
- 검색한 단어를 자동으로 Notion 데이터베이스에 저장
- 개인 단어장 구축 및 복습 관리
- 저장된 Notion 페이지로 직접 링크 제공

### 🔐 **간편한 인증**
- Google OAuth를 통한 안전한 로그인
- Supabase 기반 사용자 세션 관리
- Chrome 스토리지를 활용한 지속적인 로그인 상태 유지

## 🏗️ 기술 스택

### Frontend
- **React** 19.0.0 - 사용자 인터페이스
- **TypeScript** - 타입 안전성
- **Styled Components** - CSS-in-JS 스타일링
- **Vite** - 빠른 개발 및 빌드 도구

### Backend & Services
- **Supabase** - 인증 및 데이터베이스
- **Gemini API** - AI 기반 단어 정의 검색
- **Notion API** - 개인 노트 저장

### Chrome Extension
- **Manifest V3** - 최신 Chrome 확장 프로그램 표준
- **Service Worker** - 백그라운드 스크립트
- **Content Scripts** - 웹페이지와의 상호작용

## 🚀 설치 및 개발

### 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 코드 검사
npm run lint
```

### Chrome 확장 프로그램 설치

1. `npm run build`로 프로젝트 빌드
2. Chrome에서 `chrome://extensions/` 접속
3. "개발자 모드" 활성화
4. "압축해제된 확장 프로그램 로드" 클릭
5. `dist` 폴더 선택

## 📁 프로젝트 구조

```
src/
├── App.tsx              # 메인 React 컴포넌트
├── App.styles.ts        # Styled Components 스타일
├── background.ts        # Chrome 확장 프로그램 백그라운드 스크립트
├── content.ts           # 웹페이지 상호작용을 위한 Content Script
├── api.ts              # API 호출 함수들
├── interface.ts         # TypeScript 타입 정의
├── supabaseClient.ts    # Supabase 클라이언트 설정
└── assets/              # 이미지 및 정적 파일
```

## 🎯 사용 방법

1. **설치 후 첫 사용**
   - 확장 프로그램 아이콘 클릭
   - Google 계정으로 로그인
   - Notion 연동 설정

2. **단어 검색**
   - 확장 프로그램 팝업에서 영어 단어 입력
   - "Search" 버튼 클릭
   - AI가 제공하는 상세한 정의 확인

3. **Notion 저장**
   - 검색 결과 화면에서 "Save" 버튼 클릭
   - 자동으로 개인 Notion 데이터베이스에 저장
   - 저장된 페이지 링크로 바로 이동 가능

## 🔮 향후 개발 예정 기능

### 🖱️ **Context Menu Integration**
웹페이지에서 텍스트를 드래그하고 우클릭하면 바로 Notionary에서 검색할 수 있는 기능을 개발 중입니다.

**구현 예정 기능:**
- 텍스트 선택 후 우클릭 메뉴에서 "Notionary에서 검색" 옵션
- Content Script를 통한 선택된 텍스트 자동 전달
- 팝업 없이도 빠른 단어 검색 가능

### 🔄 **Advanced Retry System**
현재의 단순한 재시도 기능을 개선하여, 이전 응답과는 다른 새로운 정의를 제공하는 시스템을 구축할 예정입니다.

**구현 예정 기능:**
- 이전 검색 결과 기록 저장
- Retry 시 다른 정의나 다른 관점의 설명 요청
- 검색 히스토리 기반 학습 개선
- 사용자별 맞춤형 정의 제공

### 📊 **Learning Analytics**
- 검색한 단어들의 통계 및 학습 진도 추적
- 복습이 필요한 단어 추천 시스템
- 학습 성과 시각화 대시보드

### 🌐 **Multi-language Support**
- 한국어-영어 뿐만 아니라 다양한 언어 쌍 지원
- 언어별 발음 가이드 제공

## 📝 개인 프로젝트

이 프로젝트는 개인 학습과 개발 목적으로 만들어진 프로젝트입니다.

## 🔗 관련 링크

- [Supabase](https://supabase.com/) - Backend as a Service
- [Notion API](https://developers.notion.com/) - Note-taking integration
- [Chrome Extensions](https://developer.chrome.com/docs/extensions/) - Browser extension development
- [Gemini API](https://ai.google.dev/) - AI-powered definitions

---

**Notionary**와 함께 더 스마트한 언어 학습을 시작해보세요! 🚀