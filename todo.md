# YouTube Comment Exporter

## 완료
- [x] WXT + React + Tailwind v4 + shadcn/ui 초기 세팅
- [x] 다크모드 토글
- [x] content script에서 videoId 추출
- [x] Zustand store 세팅 (videoId, apiKey)
- [x] popup에 API Key 입력 필드 + Video ID 입력 필드
- [x] API 키 발급 가이드 블로그 글 작성 (blog.md)

## 다음 할 것
- [ ] YouTube Data API v3로 댓글 fetch
- [ ] 가져온 댓글 popup UI에 리스트로 표시
- [ ] 페이지네이션 (nextPageToken)
- [ ] 대댓글(replies) 가져오기
- [ ] 댓글 데이터 Export (CSV/JSON)
- [ ] 필터/정렬 (좋아요순, 날짜순, 키워드)
