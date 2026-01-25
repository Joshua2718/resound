// main.js
import { loadDbFromStorage } from './db.js';
import { pruneUnusedTags } from './utils.js';
import { initEvents } from './events.js';
import * as renderer from './render.js';

/** 애플리케이션 초기화 */
function initApp() {
  console.log("App Initializing...");
  
  // 1. 저장된 데이터 로드
  loadDbFromStorage();
  pruneUnusedTags();

  // 2. 이벤트 리스너 등록
  initEvents();

  // 3. 초기 화면 렌더링
  // 테이블이 처음에 보여야 하므로 테이블 렌더링부터 시작
  renderer.renderSongTable(); 
  renderer.renderDetailArea();
  renderer.renderTagsTable();

  console.log("App Ready!");
}

// DOM이 준비되면 실행
document.addEventListener('DOMContentLoaded', initApp);