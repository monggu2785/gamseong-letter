감성편지 2.0 — 설치형 PWA 버전

[핵심 변화]
- 갤럭시/Android/PC에서 감성편지를 홈 화면 또는 앱처럼 설치 가능
- 주소를 기억하지 않아도 설치된 감성편지 아이콘으로 바로 실행
- PWA manifest + service worker + 전용 앱 아이콘 포함
- 앱 화면과 배경 이미지는 캐시되어 기본 화면은 오프라인에서도 열 수 있음
- 카카오톡 공유와 긴 편지 임시보관은 인터넷 연결 필요
- 새 버전이 배포되면 백그라운드에서 확인하고 업데이트 안내 표시
- 1.9의 암호화 임시보관(미열람 30일, 최초 열람 후 7일) 구조 유지
- Apps Script 보관소를 아직 연결하지 않았을 때는 짧은 편지에 한해 기존 압축 URL 방식으로 동작

[GitHub에 반드시 같이 올릴 파일]
index.html
manifest.webmanifest
sw.js
icon-192.png
icon-512.png
icon-maskable-512.png
og-preview.png
app-share-preview.png
bg-night.jpg
bg-sunset.jpg
bg-sea.jpg
bg-forest.jpg
bg-flower.jpg
bg-winter.jpg

Suno 음악을 사용하는 경우 기존 파일도 유지:
bgm-night.mp3
bgm-sunset.mp3
bgm-sea.mp3
bgm-calm.mp3

[긴 편지 보관 기능]
Google Apps Script를 배포한 뒤 index.html 안의 다음 줄에 /exec 주소를 넣으세요.
const LETTER_API_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';

Code.gs도 이 ZIP에 포함되어 있습니다.

[설치]
- 갤럭시 Chrome: 첫 화면의 “감성편지 설치하기” → 설치 확인
- 삼성 인터넷: 설치 프롬프트가 바로 뜨지 않으면 버튼이 설치 안내를 보여줌
- PC Chrome/Edge: “감성편지 설치하기” 또는 주소창의 설치 아이콘 사용
- iPhone/iPad: Safari 공유 버튼 → 홈 화면에 추가

[중요]
GitHub Pages에서 PWA 파일들은 index.html과 같은 루트 폴더에 두세요.
