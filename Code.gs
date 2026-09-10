/**
 * 감성편지 1.9 - 암호화 편지 임시 보관소
 * Google Sheet에 바인딩된 Apps Script에서 사용합니다.
 * 평문 편지/받는 사람/제목/암호키는 저장하지 않습니다.
 */

const LETTER_SHEET_NAME = '편지_임시보관';
const UNREAD_DAYS = 30;
const AFTER_OPEN_DAYS = 7;
const MAX_CIPHER_LENGTH = 120000; // 5000자 편지보다 넉넉한 안전 상한

function setupGamseongLetter19() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(LETTER_SHEET_NAME);
  if (!sh) sh = ss.insertSheet(LETTER_SHEET_NAME);

  sh.clear();
  sh.getRange(1, 1, 1, 6).setValues([[
    '편지ID', '암호문', '생성일', '최초열람일', '삭제예정일', '상태'
  ]]);
  sh.setFrozenRows(1);
  sh.getRange('C:E').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  sh.hideColumns(2); // 실수로 긴 암호문을 직접 보지 않도록 기본 숨김

  // 기존 정리 트리거 제거 후 하루 1회 생성
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'cleanupExpiredLetters') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('cleanupExpiredLetters').timeBased().everyDays(1).atHour(3).create();

  return '감성편지 1.9 임시 보관소 설정 완료';
}

function doPost(e) {
  try {
    const action = String((e.parameter && e.parameter.action) || '');
    if (action !== 'save') return text_('INVALID_ACTION');

    const id = normalizeId_(e.parameter.id);
    const cipher = String(e.parameter.cipher || '');
    if (!id || !/^1\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(cipher)) return text_('INVALID_DATA');
    if (cipher.length > MAX_CIPHER_LENGTH) return text_('TOO_LARGE');

    const sh = getSheet_();
    const lock = LockService.getScriptLock();
    lock.waitLock(8000);
    try {
      const row = findRow_(sh, id);
      if (row) return text_('DUPLICATE');
      const now = new Date();
      const unreadExpiry = new Date(now.getTime() + UNREAD_DAYS * 86400000);
      sh.appendRow([id, cipher, now, '', unreadExpiry, '미열람']);
    } finally {
      lock.releaseLock();
    }
    return text_('OK');
  } catch (err) {
    console.error(err);
    return text_('ERROR');
  }
}

function doGet(e) {
  const callback = validCallback_((e.parameter && e.parameter.callback) || 'callback');
  try {
    const action = String((e.parameter && e.parameter.action) || '');
    const id = normalizeId_((e.parameter && e.parameter.id) || '');
    if (!id) return jsonp_(callback, {status:'invalid'});

    const sh = getSheet_();
    const row = findRow_(sh, id);
    if (!row) return jsonp_(callback, {status:'not_found'});

    const values = sh.getRange(row, 1, 1, 6).getValues()[0];
    const now = new Date();
    const expiry = values[4] instanceof Date ? values[4] : new Date(values[4]);
    if (!expiry || isNaN(expiry.getTime()) || now >= expiry) {
      sh.deleteRow(row);
      return jsonp_(callback, {status:'expired'});
    }

    if (action === 'exists') {
      return jsonp_(callback, {status:'ok'});
    }

    if (action === 'get') {
      // 최초 열람 때만 삭제예정일을 '열람 후 7일'로 전환
      const firstOpened = values[3];
      if (!(firstOpened instanceof Date) || isNaN(firstOpened.getTime())) {
        const openedAt = now;
        const openedExpiry = new Date(openedAt.getTime() + AFTER_OPEN_DAYS * 86400000);
        sh.getRange(row, 4, 1, 3).setValues([[openedAt, openedExpiry, '열람됨']]);
      }
      return jsonp_(callback, {status:'ok', cipher:String(values[1] || '')});
    }

    return jsonp_(callback, {status:'invalid_action'});
  } catch (err) {
    console.error(err);
    return jsonp_(callback, {status:'error'});
  }
}

function cleanupExpiredLetters() {
  const sh = getSheet_();
  const last = sh.getLastRow();
  if (last < 2) return;
  const now = Date.now();
  const expiries = sh.getRange(2, 5, last - 1, 1).getValues();
  const toDelete = [];
  expiries.forEach((r, i) => {
    const d = r[0] instanceof Date ? r[0] : new Date(r[0]);
    if (d && !isNaN(d.getTime()) && now >= d.getTime()) toDelete.push(i + 2);
  });
  for (let i = toDelete.length - 1; i >= 0; i--) sh.deleteRow(toDelete[i]);
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(LETTER_SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(LETTER_SHEET_NAME);
    sh.getRange(1, 1, 1, 6).setValues([['편지ID','암호문','생성일','최초열람일','삭제예정일','상태']]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function findRow_(sh, id) {
  const last = sh.getLastRow();
  if (last < 2) return 0;
  const found = sh.getRange(2, 1, last - 1, 1).createTextFinder(id).matchEntireCell(true).findNext();
  return found ? found.getRow() : 0;
}

function normalizeId_(id) {
  id = String(id || '').trim().toUpperCase();
  return /^[A-Z2-9]{10,24}$/.test(id) ? id : '';
}

function validCallback_(name) {
  name = String(name || 'callback');
  return /^[A-Za-z_$][0-9A-Za-z_$\.]{0,120}$/.test(name) ? name : 'callback';
}

function jsonp_(callback, obj) {
  return ContentService
    .createTextOutput(callback + '(' + JSON.stringify(obj) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function text_(s) {
  return ContentService.createTextOutput(String(s)).setMimeType(ContentService.MimeType.TEXT);
}
