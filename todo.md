# TODO

## 기능 변경
- **아이콘 변경**
  - `utils/MyIcons.tsx`: 기존 아이콘 파일을 새로운 아이콘 파일로 교체
  - `components/sidepanel/Header.tsx`: 사이드 패널 헤더의 아이콘을 변경된 아이콘으로 업데이트
  - `options/layout.tsx`: 사이드바 메뉴의 아이콘을 새로운 아이콘으로 교체

- **로그인 기능 제거 및 API Key 사용으로 전환**
  - `options/pages/ApiKeyPage.tsx`: 로그인 관련 코드를 제거하고, API Key 입력 및 저장 기능 강화
  - `libs/chatbot/open-ai/open-ai-api.ts`: 인증 방식을 API Key 기반으로 변경 (`getOpenAIAuthToken` 메서드 수정)
  - `background/index.ts`: 로그인 관련 메시지 핸들러 제거 및 API Key 기반 인증 로직 추가
  - `options/component/AiEnginePage.tsx`: 로그인 상태 확인 로직 제거 및 API Key 입력 여부 확인 로직으로 대체

- **동시에 여러 AI 사용 기능 제거 및 단일 AI 선택으로 수정**
  - `options/component/AiEnginePage.tsx`: 다중 AI 선택 로직 제거 및 단일 AI 선택을 가능하게 하는 UI 및 상태 관리 로직 구현
  - `libs/open-ai/open-panel.ts`: 여러 AI를 처리하는 로직을 단순화하여 하나의 AI만 처리하도록 수정
  - `libs/chatbot/openai/index.ts`: 다중 AI 지원 로직 제거 및 단일 AI 모델만 지원하도록 수정

- **AI 검색 기능 삭제**
  - `options/component/AiEnginePage.tsx`: AI 검색 관련 UI 컴포넌트 및 상태 관리 제거
  - `libs/open-ai/open-panel.ts`: AI 검색과 관련된 로직 삭제
  - `sidepanel/pages/conversation.tsx`: AI 검색과 관련된 인터페이스 요소와 기능 제거

- **사이드 패널에 "Option" 아이콘 추가**
  - `options/layout.tsx`: 사이드바 메뉴에 "Option" 아이콘과 해당 아이콘 클릭 시 설정 페이지로 이동하는 기능 추가
  - `components/sidepanel/Header.tsx`: 사이드 패널 헤더에 "Option" 아이콘 추가 및 클릭 시 설정 페이지로 이동하도록 이벤트 핸들러 설정
  - `utils/MyIcons.tsx`: 새로운 "Option" 아이콘 추가 및 사용 가능하도록 설정

## 테스트 추가
- **테스트 환경 설정**
  - `jest.config.js` 파일 생성 및 설정
  - `jest.setup.ts` 파일 생성 및 초기 설정 추가
  - `package.json`에 테스트 스크립트 추가 (`test`, `test:watch`, `test:coverage`)

- **테스트 작성**
  - `options/pages/ApiKeyPage.test.tsx`: `ApiKeyPage` 컴포넌트 테스트 작성
  - `utils.test.ts`: `getGoogleQuery` 함수 테스트 작성
  - `background/index.test.ts`: 백그라운드 스크립트 테스트 작성

- **테스트 실행**
  - `npm run test`: 테스트 실행
  - `npm run test:watch`: 변경 사항 감지하여 실시간 테스트 실행
  - `npm run test:coverage`: 테스트 커버리지 확인

- **추가 권장 사항**
  - **테스트 커버리지 증가**: 가능한 많은 코드 경로를 테스트하여 버그 사전 방지
  - **스냅샷 테스트 추가**: React 컴포넌트의 UI가 의도한 대로 렌더링되는지 확인
  - **모의(Mock) 함수 사용 강화**: 외부 의존성(예: API 호출)을 모의하여 테스트 신뢰성 향상
  - **CI 통합 설정**: GitHub Actions와 같은 CI 도구를 사용하여 코드 푸시 시 자동으로 테스트가 실행되도록 설정

## 문서 업데이트
- **README.md 및 기타 문서 파일 업데이트**: 변경된 기능과 사용 방법 반영
- **주석 정리 및 코드 문서화**: 코드 내 주석 추가 및 정리하여 가독성 향상

## 코드 정리 및 최적화
- **사용하지 않는 코드 및 의존성 제거**: 코드베이스를 깔끔하게 유지
- **코드 최적화**: 성능 향상을 위한 코드 리팩토링

## 배포 준비
- **빌드 및 패키징 확인**: 프로덕션 빌드가 정상적으로 작동하는지 확인
- **브라우저 스토어 등록 준비**: 필요한 메타데이터 및 스크린샷 준비
- **최종 테스트 수행**: 실제 환경에서의 최종 테스트로 안정성 검증

