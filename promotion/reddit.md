# Reddit 홍보 전략

## 타겟 서브레딧

### 1차 타겟 (직접 관련)

#### r/youtube
- 구독자 수가 많고 YouTube 관련 도구에 관심 있는 유저가 모여 있음
- **주의**: 자기 홍보 규정이 엄격할 수 있으므로 규칙 확인 필수

#### r/chrome_extensions
- 크롬 확장 프로그램을 찾는 유저가 모인 커뮤니티
- 자기 홍보에 비교적 관대함

#### r/newchromextension
- 새로운 크롬 확장 프로그램을 소개하는 전용 서브레딧

### 2차 타겟 (관련 커뮤니티)

#### r/DataHoarder
- 데이터 아카이빙에 관심 있는 유저 → 댓글 백업 기능 강조

#### r/socialmedia
- 소셜미디어 마케터, 매니저가 모인 곳 → 분석 활용 사례 강조

#### r/webdev / r/SideProject
- 개발자 대상 → 기술 스택과 오픈소스 측면 강조

---

## 홍보글 템플릿

### r/chrome_extensions / r/newchromextension 용

**제목**: I built a Chrome extension to export YouTube comments to CSV/JSON

**본문**:
```
Hey everyone!

I built a browser extension that lets you export all comments and replies
from any YouTube video to CSV or JSON format.

**Why I made this:**
I needed to analyze comments on YouTube videos for research purposes,
but copying them manually was painfully slow. So I built this tool.

**Key features:**
- Export to CSV or JSON with one click
- Fetches ALL replies (nested included)
- 8x parallel requests for fast collection
- Real-time progress bar with cancel option
- Split export by comment threads
- Customizable filename templates
- Dark/Light theme
- Supports 16 languages

**Tech stack:** React 19, TypeScript, WXT, Tailwind CSS, Zustand

It's open source: [GitHub link]
Chrome Web Store: [Store link]

Would love to hear your feedback!
```

### r/youtube 용

**제목**: Free tool to download/export all YouTube comments to spreadsheet (CSV/JSON)

**본문**:
```
Hi r/youtube,

As a content creator, I often wanted to review all my video comments
in a spreadsheet but there was no easy way to do it.

So I built YouTube Comment Exporter — a free browser extension that
downloads every comment and reply from any video as CSV or JSON.

**How it works:**
1. Install the extension
2. Enter your free YouTube API key (from Google Cloud Console)
3. Go to any video, click the icon, and export

**What makes it useful:**
- Gets ALL comments including nested replies
- Fast — uses 8 parallel requests
- Shows real-time progress with cancel option
- Works with 16 languages
- Free and open source

Chrome Web Store: [Store link]
GitHub: [GitHub link]

Hope this helps fellow creators! Happy to answer any questions.
```

### r/DataHoarder 용

**제목**: Tool for archiving YouTube video comments before they disappear

**본문**:
```
Built a browser extension for bulk exporting YouTube comments to CSV/JSON.

Perfect for archiving comment sections before videos get taken down
or comments get deleted.

Features:
- Exports ALL comments + nested replies
- CSV and JSON formats
- 8x concurrent fetching for speed
- Split export by threads
- Customizable filenames
- Progress tracking with cancel

Open source: [GitHub link]
Chrome Web Store: [Store link]

Requires a free YouTube Data API v3 key from Google Cloud Console.
```

---

## 홍보 팁

1. **자기 홍보 규칙 확인**: 각 서브레딧의 규칙을 반드시 읽고, 자기 홍보 비율(보통 10% 규칙)을 지킬 것
2. **가치 제공 우선**: "내가 만들었다"보다 "이 도구가 어떤 문제를 해결한다"에 초점
3. **댓글에 적극 응답**: 질문이나 피드백에 빠르게 응답하여 신뢰 구축
4. **스크린샷/GIF 첨부**: 실제 사용 화면을 보여주면 클릭률 상승
5. **시간대 고려**: 미국 기준 오전 9-11시(EST)에 게시하면 노출 극대화
6. **크로스 포스팅 간격**: 같은 날 여러 서브레딧에 동시 게시하지 말고 2-3일 간격 유지
