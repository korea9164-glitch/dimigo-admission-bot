# 디미고 입학상담 챗봇 — 1차 시범 버전

## 현재 구현된 기능
- Cloudflare Pages에서 실행되는 정적 웹앱 (AI API, 과금, 별도 서버 불필요)
- 등록된 FAQ의 질문·동의어·키워드에 기반한 보수적인 검색 및 답변
- 관련 공지 출처·URL 표시
- 검색 결과가 없거나 모호하면 카카오톡 상담 링크 안내
- 반응형 모바일/PC 디자인, 개인정보 입력 주의 문구, 시범 운영 표시

**주의:** 이것은 생성형 AI가 아니라 무료 FAQ 검색형 챗봇입니다. 처음에는 공식 자료를 받지 않아 `data/knowledge.json`의 `entries`가 비어 있으므로 모든 질문은 상담 안내로 연결됩니다. 실제 운영 전 학교 공식 자료를 검증하여 추가하세요.

## 1. 자료 등록 방법

`data/knowledge.json`을 편집하세요. `data/knowledge.example.json`에 예시 형식이 있습니다.

```json
{
  "version": "2027-1",
  "updatedAt": "2026-11-10",
  "entries": [
    {
      "id": "unique-id",
      "status": "published",
      "question": "[대표 질문]",
      "variants": ["[같은 뜻의 질문]"],
      "keywords": ["[관련 핵심어 1]", "[관련 핵심어 2]"],
      "answer": "[공식 자료로 검증한 답변]",
      "sourceTitle": "[공식 공지 제목]",
      "sourceUrl": "https://[실제 공지 URL]"
    }
  ]
}
```

- `status`를 `published`로 작성한 항목만 공개됩니다.
- 서로 비슷하지만 답이 다른 질문은 주의해서 구분하세요. 매칭이 애매하면 상담 연결로 처리됩니다.
- `sourceUrl`은 `https://` 또는 `http://`만 허용하며, 출처 페이지가 없으면 비워도 됩니다.
- JSON 파일에는 실제 검증된 내용만 넣으세요.
- 원서번호, 수험생 개인정보를 넣지 마세요.

## 2. 카카오톡 연결

`data/config.json` 안의 `kakaoUrl`에 카카오톡 채널 또는 오픈채팅 링크를 입력하세요.

```json
"kakaoUrl": "https://pf.kakao.com/실제채널ID/chat"
```

실제 발급된 주소를 사용하세요. 빈 문자열이면 링크 대신 '등록 전'으로 표시됩니다.

## 3. 로컬 테스트

터미널에서 이 폴더로 이동 후:

```bash
python -m http.server 8000
```

브라우저에서 `http://localhost:8000` 열기. `index.html`을 파일 더블클릭으로 열면 fetch가 막힐 수 있습니다.

## 4. Cloudflare Pages에 올리기 (간단한 방법)

1. Cloudflare 무료 계정 생성 및 로그인.
2. Workers & Pages > Pages 프로젝트 생성 > 직접 업로드(Direct Upload) 선택.
3. 이 폴더의 내용이 **최상위에 들어가도록** ZIP을 업로드하거나 폴더를 업로드. (`index.html`이 루트에 있어야 합니다.)
4. 배포 완료 후 Cloudflare가 발급한 `*.pages.dev` 주소에서 확인.
5. 학교 홈페이지에서 해당 주소로 연결하는 버튼/링크 추가.

**중요:** 이 패키지는 Cloudflare **Pages 정적 호스팅**용입니다. `workers.dev`에 자바스크립트 Worker 코드로 붙여넣는 방식과 다릅니다. Cloudflare UI 명칭은 변경될 수 있습니다.

## 5. 수정 및 재배포

- 자주 묻는 질문 수정: `data/knowledge.json`
- 카카오톡 링크·추천 질문 수정: `data/config.json`
- 디자인 수정: `assets/style.css`
- 소스 수정 후 Cloudflare Pages에 다시 배포해야 반영됩니다.

## 기능 및 보안 한계

- 이 버전에는 생성형 AI, PDF 자동 읽기, 관리자 로그인, 상담 통계, 데이터베이스가 없습니다.
- 자동 답변은 등록된 JSON 항목에서 유사 질문을 찾아 안내하는 방식이며, 잘못 매칭될 가능성이 있어 공개 전 질문 테스트가 필요합니다.
- 채팅 질문 자체를 개발자 서버로 전송·저장하지 않습니다. 일반 웹 호스팅 요청 로그 등은 Cloudflare 운영 정책에 따릅니다.
- 개인정보를 입력하지 않도록 고지하지만 브라우저 입력 자체를 원천 차단하지는 않습니다.
- 24시간 무중단 서비스나 완전한 0원 운영을 보증하지 않습니다(서비스 정책·트래픽 제한에 따름).
- `X-Frame-Options: DENY`와 CSP `frame-ancestors 'none'`을 사용하여 iframe 임베드를 차단합니다. 학교 홈페이지에 **링크**로 연결하는 용도입니다.

## v2 디자인 업데이트 (2026-11-10)
- ChatGPT 스타일의 사이드바, 웰컴 화면, 메시지 목록, 하단 입력창으로 디자인 개편
- 모바일 메뉴 대응 및 빠른 질문 제공
- **GitHub Pages 하위 경로 지원:** `/assets/...` 및 `/data/...` 절대 경로를 `./assets/...`, `./data/...` 상대 경로로 수정
- 기존 공식 FAQ 검색/출처 표시/카카오톡 상담 연결 기능 유지
- GitHub에서 기존 파일을 교체하면 GitHub Pages가 자동으로 새 버전을 배포합니다.
