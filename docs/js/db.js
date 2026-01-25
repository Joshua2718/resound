// db.js
import { toSlug } from './utils.js'; // 실제로는 저장함수가 아래 정의되므로 내부 호출

export const STORAGE_KEY = "resound_db_v1";

// 1. 초기 데이터 (In-memory DB)
export const db = {
  songs: [],
  tags: {}
};

// 2. 앱 상태 (State)
export const state = {
  currentTab: "table",
  currentTitleLang: "jp",
  currentSongPage: 1,
  pageSize: 10,
  selectedSongId: null,
  currentTagType: "artist",
  currentSearchQuery: "",
  sortKey: null,
  sortDir: "asc",
};

// 3. 데이터 조작 함수
export function saveDbToStorage() {
  try {
    const data = {
      songs: db.songs,
      tags: db.tags,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn("Failed to save DB to localStorage:", err);
  }
}

export function loadDbFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data && typeof data === "object") {
      if (Array.isArray(data.songs)) {
        db.songs = data.songs;
      }
      if (data.tags && typeof data.tags === "object") {
        db.tags = data.tags;
      }
    }
  } catch (err) {
    console.warn("Failed to load DB from localStorage:", err);
  }
}

export function addTag(name, type) {
  if (!name) return null;
  const trimmed = name.trim();
  for (const [id, tag] of Object.entries(db.tags)) {
    if (tag.type === type && tag.name === trimmed) return id;
  }
  const slug = toSlug(trimmed);
  let baseId = `${type}_${slug || "tag"}`;
  let newId = baseId;
  let i = 1;
  while (db.tags[newId]) { newId = `${baseId}_${i++}`; }
  db.tags[newId] = { type, name: trimmed };
  saveDbToStorage();
  return newId;
}

export function generateNextSongId() {
  let maxNum = 0;
  for (const song of db.songs) {
    const m = /^song_(\d+)$/.exec(song.id || "");
    if (!m) continue;
    const n = parseInt(m[1], 10);
    if (!Number.isNaN(n) && n > maxNum) maxNum = n;
  }
  return `song_${String(maxNum + 1).padStart(6, "0")}`;
}