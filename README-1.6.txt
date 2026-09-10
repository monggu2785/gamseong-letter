감성편지 1.6 설치 안내

[핵심 변경]
1. TinyURL 완전 제거
   - 상대방이 단축 사이트를 거치지 않고 GitHub Pages의 감성편지로 바로 이동합니다.
   - 외부 URL 단축 서비스에 편지 링크를 보내지 않습니다.

2. 미리보기 후 편지 데이터 유지
   - 미리보기 전 작성 내용을 현재 브라우저 탭의 sessionStorage에 임시 저장합니다.
   - 편집으로 돌아오면 받는 사람/제목/본문/보내는 사람/배경/음악/속도를 복원합니다.
   - 서버나 데이터베이스에는 저장하지 않습니다.
   - '편지 내용 초기화'를 누르면 임시 데이터도 즉시 삭제합니다.

3. '짧은 링크 만들기' 단계를 없애고 '편지 바로 보내기'로 통합
   - 휴대폰: 기기의 기본 공유창을 엽니다.
   - 카카오톡, 이메일, 메시지 등 설치된 공유 대상이 표시됩니다.
   - 기기/OS에 따라 최근 연락처가 표시될 수 있습니다.
   - 공유창을 지원하지 않는 브라우저를 위해 이메일 보내기와 링크 복사 기능을 제공합니다.

[중요]
- 웹페이지가 사용자의 이메일 주소록이나 카카오톡 친구 목록을 임의로 읽을 수는 없습니다.
- 카카오톡 친구/채팅방 선택 화면을 앱에서 직접 띄우려면 Kakao Developers 앱 등록, JavaScript 키, 도메인 등록 등의 별도 설정이 필요합니다.

[GitHub 업로드 파일]
index.html
og-preview.png
bg-night.jpg
bg-sunset.jpg
bg-sea.jpg
bg-forest.jpg
bg-flower.jpg
bg-winter.jpg
bgm-night.mp3
bgm-sunset.mp3
bgm-sea.mp3
bgm-calm.mp3

[GitHub Pages 예시]
https://monggu2785.github.io/gamseong-letter/
