# 디미고 입학상담 챗봇 v3 — GitHub Pages용

이 버전은 **생성형 AI가 아닌 공식 자료 검색형 FAQ**입니다. GitHub Pages만으로 무료 실행됩니다.

## 설치
1. 기존 GitHub 저장소 `korea9164-glitch/dimigo-admission-bot`의 `index.html`, `data/knowledge.json`, `data/config.json`을 교체합니다.
2. `Commit changes` 후 GitHub Pages 배포 완료를 확인합니다.
3. 사이트 강력 새로고침(Ctrl+Shift+R) 후 시험 질문을 입력합니다.

## 검토 상태
- 전형요항 10쪽: 확인 및 반영
- 학교 공지사항 11개: 웹 본문 확인 후 관련 FAQ 반영 (일부 첨부 PDF/이미지는 별도 확인 필요)
- 네이버 블로그 2개: 웹 접근 제한으로 본문 **미반영**. 링크만 목록에 보관.
- 등록 FAQ: **52개**
- 출처는 각 FAQ의 `sourceTitle`, `sourceUrl`에 저장.

## 주의 / 운영 전 검증 필요
- 일반전형 원서접수 시작일: 전형요항 11/12~13 vs. 11/1 게시 최신 공지 11/9~13. 최신 공지 기준으로 답변하되 학교 담당자 확인 권고.
- 특별전형 접수 마감 공지 본문에 '2026학년도' 표기가 있어 2027학년도와 혼재. 경쟁률 자료의 학년도 표기 확인 필요.
- 2028·2029학년도 사전예고 사항은 2027학년도 기준으로 적용하지 않음.
- 복잡한 서류 판정, 개인 합격 여부, 개별 인정점은 자동으로 결정하지 않음.
- 질문이 애매하거나 FAQ 검색이 불확실하면 카카오톡 상담으로 연결.
- 공개 전 30개 이상의 실제 학부모 질문으로 정확도·오답률을 꼭 테스트.

## 파일 수정
- `data/knowledge.json`: FAQ 추가 및 수정. 각 항목에 `question`, `variants`, `answer`, `status`, `sourceTitle`, `sourceUrl` 사용.
- `data/config.json`: 추천 질문 및 카카오톡 연결 주소
- `index.html`: 채팅 UI + 보수적 검색 함수 내장

## 카카오톡
학교 홈페이지 입학안내 메뉴에서 링크된 공식 채널: https://pf.kakao.com/_xmKrMn/chat

## 수신한 자료 목록
**PDF**: 2027학년도 신입생 입학전형요항 (2026-07-30)

**학교 공지**:
- [일반전형 2단계 출결처리 협조 공문 안내](https://dimigo-h.goeas.kr/dimigo-h/na/ntt/selectNttInfo.do?mi=13631&bbsId=6915&nttSn=1537418)
- [특별전형 1단계 결과 및 2단계 안내](https://dimigo-h.goeas.kr/dimigo-h/na/ntt/selectNttInfo.do?mi=13631&bbsId=6915&nttSn=1537118)
- [특별전형 모집 마감 및 접수 확인](https://dimigo-h.goeas.kr/dimigo-h/na/ntt/selectNttInfo.do?mi=13631&bbsId=6915&nttSn=1536954)
- [일반전형 원서접수 및 입학관리시스템 FAQ](https://dimigo-h.goeas.kr/dimigo-h/na/ntt/selectNttInfo.do?mi=13631&bbsId=6915&nttSn=1536010)
- [학교생활기록부Ⅱ PDF 저장방법](https://dimigo-h.goeas.kr/dimigo-h/na/ntt/selectNttInfo.do?mi=13631&bbsId=6915&nttSn=1532144)
- [검정고시자 고입내신 산출 참고자료](https://dimigo-h.goeas.kr/dimigo-h/na/ntt/selectNttInfo.do?mi=13631&bbsId=6915&nttSn=1531133)
- [일반면접과 심층면접 안내](https://dimigo-h.goeas.kr/dimigo-h/na/ntt/selectNttInfo.do?mi=13631&bbsId=6915&nttSn=1525010)
- [특별전형 제출서류 및 실적 작성 안내](https://dimigo-h.goeas.kr/dimigo-h/na/ntt/selectNttInfo.do?mi=13631&bbsId=6915&nttSn=1524153)
- [내신성적 산출 관련 자주 묻는 질문](https://dimigo-h.goeas.kr/dimigo-h/na/ntt/selectNttInfo.do?mi=13631&bbsId=6915&nttSn=1524004)
- [일반전형 소질·적성검사 안내](https://dimigo-h.goeas.kr/dimigo-h/na/ntt/selectNttInfo.do?mi=13631&bbsId=6915&nttSn=1523628)
- [2027학년도 입학전형 일정 안내](https://dimigo-h.goeas.kr/dimigo-h/na/ntt/selectNttInfo.do?mi=13631&bbsId=6915&nttSn=1523584)

**네이버 블로그 (접근 제한 / 미반영):**
- https://blog.naver.com/aboutdimigo/223630001790
- https://blog.naver.com/aboutdimigo/223630001131
