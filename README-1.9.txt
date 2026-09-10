감성편지 1.9 - 긴 편지용 암호화 임시 보관 버전

[핵심]
- 편지 원문을 Google Sheet에 저장하지 않습니다.
- 스마트폰/PC 브라우저에서 편지 전체를 AES-GCM 방식으로 암호화합니다.
- Google Sheet에는 편지ID + 암호문 + 생성/열람/삭제예정 시각만 저장합니다.
- 암호를 푸는 키는 공유 URL의 #k=... 뒤에만 들어가며 Google Apps Script로 전송하지 않습니다.
- 미열람 편지: 생성 후 30일이 지나면 자동 삭제
- 최초 열람 편지: 최초 열람 시점부터 7일 뒤 자동 삭제
- 1.8.1 이하의 기존 #letter= 링크도 계속 열 수 있습니다.

[중요 - 계정]
이 구조에서는 Google Sheet와 Apps Script가 임시 보관 서버 역할을 하므로 해당 Google 계정을 계속 유지해야 합니다.
Google 계정, Sheet 또는 Apps Script 배포를 삭제하면 아직 보관 중인 편지는 더 이상 열 수 없습니다.
장기 운영이라면 개인 주계정보다 '감성편지 운영 전용 Google 계정'을 따로 만드는 것을 권장합니다.

[설치 순서]
1. Google Drive에서 새 Google Sheet를 만듭니다. 이름 예: 감성편지_암호화_임시보관
2. 시트에서 확장 프로그램 > Apps Script를 엽니다.
3. 기본 Code.gs 내용을 모두 지우고 이 폴더의 Code.gs 내용을 붙여넣습니다.
4. setupGamseongLetter19() 함수를 한 번 실행하고 권한을 승인합니다.
5. Apps Script 우측 상단 배포 > 새 배포 > 유형: 웹 앱
   - 다음 사용자로 실행: 나
   - 액세스 권한: 모든 사용자(Anyone)
6. 배포 후 생성된 /exec 주소를 복사합니다.
7. index.html에서 다음 줄을 찾습니다.
   const LETTER_API_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
   따옴표 안을 실제 /exec 주소로 교체합니다.
8. 수정한 index.html을 GitHub gamseong-letter 저장소에 업로드합니다.

[GitHub에서 그대로 유지할 파일]
- og-preview.png
- app-share-preview.png
- bg-night.jpg / bg-sunset.jpg / bg-sea.jpg / bg-forest.jpg / bg-flower.jpg / bg-winter.jpg
- bgm-night.mp3 / bgm-sunset.mp3 / bgm-sea.mp3 / bgm-calm.mp3

[시트에 보이는 열]
편지ID | 암호문 | 생성일 | 최초열람일 | 삭제예정일 | 상태
※ 받는 사람, 제목, 편지 원문, 복호화 키는 별도 열로 저장하지 않습니다.
