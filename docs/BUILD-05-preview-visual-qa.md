# BUILD 05｜Preview・15語視覺核驗

## 目的

在不改變既有首頁資訊架構、15 語介面、12 大分類與母語優先資源排序的前提下，建立可重複執行的「實際瀏覽器渲染」核驗。

## 核驗範圍

- 15 種介面語言：
  - zh-TW
  - en
  - vi
  - id
  - th
  - fil
  - ja
  - ko
  - my
  - km
  - ms
  - hi
  - fr
  - es
  - de
- Desktop：1440 × 900
- Mobile：390 × 844
- 每個語言 × 2 個視窗尺寸都會實際啟動 Vite、以 Chromium 渲染並截圖。

## 自動核驗項目

1. `document.documentElement.lang` 與語言選擇一致。
2. 15 個語言選項完整存在且順序固定。
3. Hero、學習目標、學習路徑、資源、分類、功能、缺口、全部資源、關於等主要標題均正確套用當前語言。
4. 8 個學習目標、8 個學習路徑、12 個資源分類、5 個核心特色均有文字。
5. 品牌 Logo 實際載入。
6. Desktop 導覽列正常、手機選單按鈕正常。
7. Mobile 無水平溢出。
8. Mobile 主要互動元件觸控高度至少 40px。
9. Mobile 資源分類維持雙欄。
10. 每個語言都保存 Desktop／Mobile 首屏 PNG 與 JSON 核驗報告。

## 執行

```bash
npm run verify:visual
```

CI 會在每次 `main`、`codex/**` push、Pull Request 與手動執行時進行核驗，並保存 14 天的視覺證據 Artifact。

## 判定

**PASS**：15 語 × Desktop/Mobile 全部通過。

**FAIL**：任一語言、任一尺寸出現文字缺失、語言狀態錯誤、Logo 載入失敗、水平溢出、手機選單失效或主要觸控元件過小，即視為失敗。

> 本 BUILD 05 是「視覺與互動契約核驗」，不是重新設計首頁。若未來人工 Preview 發現真正的視覺問題，先修正 UI，再重新執行本核驗。
