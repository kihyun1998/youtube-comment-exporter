# 블로그 & SNS 홍보 전략

## 1. X (Twitter) 홍보

### 런칭 트윗 (영문)
```
I built a free Chrome extension to export YouTube comments 📥

✅ CSV / JSON export
✅ All replies included
✅ 8x parallel fetching
✅ Real-time progress bar
✅ 16 languages supported
✅ Open source

Perfect for creators, researchers & data archivists.

🔗 Chrome Web Store: [link]
🔗 GitHub: [link]
```

### 런칭 트윗 (한국어)
```
유튜브 댓글을 CSV/JSON으로 내보내는 크롬 확장 프로그램을 만들었습니다 📥

✅ 클릭 한 번으로 전체 댓글 + 답글 내보내기
✅ 8배 병렬 수집으로 빠른 속도
✅ 실시간 진행률 바
✅ 16개 언어 지원
✅ 오픈소스

크리에이터, 마케터, 연구자분들에게 유용합니다.

🔗 크롬 웹스토어: [link]
🔗 GitHub: [link]
```

### 쓰레드 (Thread) 구성
```
1/6 🧵 유튜브 댓글 수천 개를 분석해야 했는데 수동 복사는 불가능했습니다.
그래서 직접 만들었습니다.

2/6 YouTube Comment Exporter는 어떤 영상에서든
모든 댓글과 답글을 CSV 또는 JSON으로 내보냅니다.

3/6 핵심 기능:
- 8배 병렬 요청으로 빠른 수집
- 실시간 진행률 + 취소 기능
- 스레드별 분할 내보내기
- 파일명 커스터마이징

4/6 기술 스택:
- React 19 + TypeScript
- WXT (브라우저 확장 프레임워크)
- Tailwind CSS 4 + shadcn/ui
- Zustand 상태관리

5/6 16개 언어 지원:
한국어, 영어, 일본어, 중국어, 스페인어, 포르투갈어,
독일어, 프랑스어, 힌디어, 인도네시아어 등

6/6 무료이고 오픈소스입니다.
🔗 Chrome Web Store: [link]
🔗 GitHub: [link]

피드백 환영합니다! 🙏
```

---

## 2. Hacker News (Show HN)

### 제목
```
Show HN: YouTube Comment Exporter – Export all YouTube comments to CSV/JSON
```

### 본문
```
Hi HN,

I built a browser extension that exports all comments and replies
from any YouTube video to CSV or JSON.

Motivation: I needed to analyze YouTube comments for research but
there's no built-in export. Manual copying doesn't scale.

Technical highlights:
- 8x concurrent API requests with a custom concurrency manager
- React 19 + TypeScript + WXT framework
- Zustand for state management
- i18next for 16-language support
- Available for Chrome and Firefox

The extension uses YouTube Data API v3 (free tier is sufficient
for most use cases).

GitHub: [link]
Chrome Web Store: [link]

Happy to discuss the technical decisions or answer any questions!
```

---

## 3. 개발 블로그 글

### 글 제목 아이디어
- "유튜브 댓글 1만 개를 내보내는 크롬 확장 프로그램을 만들었습니다"
- "Chrome Extension으로 YouTube 댓글 수집기 만들기 (React 19 + WXT)"
- "How I Built a YouTube Comment Exporter with React 19 and WXT"

### 글 구성 (아웃라인)

```markdown
## 도입
- 왜 만들었는가? (동기, 문제 상황)
- 기존 도구의 한계

## 기술 선택
- WXT를 선택한 이유 (vs Plasmo, CRXjs)
- React 19 새 기능 활용
- Tailwind CSS 4 + shadcn/ui 조합
- Zustand으로 확장 프로그램 상태 관리

## 핵심 구현
- YouTube Data API v3 연동
- 8x 병렬 요청 동시성 관리 (runWithConcurrency)
- CSV/JSON 내보내기 로직
- 16개 언어 i18n 구현

## 어려웠던 점
- API 할당량 관리
- 대량 데이터 처리 성능
- 크로스 브라우저 호환성 (Chrome/Firefox)

## 결과 & 배운 점
- 사용자 반응
- 개선 계획

## 링크
- GitHub / Chrome Web Store / Firefox Add-ons
```

### 게시 플랫폼
- **한국어**: velog, tistory, brunch
- **영어**: dev.to, hashnode, medium
- **양쪽**: 개인 블로그

---

## 4. 기타 커뮨니티

### Discord / Slack
- 개발자 커뮤니티 (예: WXT Discord, React 한국어 Discord)
- YouTube 크리에이터 커뮤니티

### 한국 커뮤니티
- **GeekNews** (긱뉴스) — 한국판 Hacker News, 개발 도구 공유에 적합
- **개발자 커뮤니티** — OKKY, 인프런 커뮤니티
- **디시인사이드 프로그래밍 갤러리** — 가벼운 톤으로 공유

---

## 홍보 일정 예시

| 일차 | 활동 |
|------|------|
| D-7 | 블로그 글 초안 작성, 스크린샷/GIF 준비 |
| D-3 | 블로그 글 발행 (velog/dev.to) |
| D-1 | Product Hunt 런칭 준비 최종 확인 |
| D-Day | Product Hunt 런칭 + X 트윗 + Reddit (r/chrome_extensions) |
| D+1 | Reddit (r/youtube) 게시 |
| D+2 | Hacker News Show HN 게시 |
| D+3 | Reddit (r/DataHoarder) 게시 |
| D+5 | 한국 커뮤니티 (GeekNews, OKKY) 공유 |
| D+7 | 결과 분석 및 피드백 반영 |

---

## 공통 팁

1. **일관된 메시지**: 모든 채널에서 핵심 가치("가장 간단한 유튜브 댓글 내보내기")를 일관되게 전달
2. **비주얼 필수**: 텍스트만으로는 주목받기 어려움, 스크린샷/GIF 항상 첨부
3. **피드백 즉시 반영**: 커뮤니티에서 받은 피드백을 빠르게 반영하면 신뢰와 관심 상승
4. **성과 공유**: 설치 수, 별 수 등 마일스톤 달성 시 업데이트 트윗으로 지속적 노출
5. **감사 표현**: 피드백, 별, 공유에 대해 항상 감사 표현
