/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   faqAccordion: function() { return /* binding */ faqAccordion; }
/* harmony export */ });
// よくある質問（FAQ）セクションのアコーディオン
// .js-accordionに.is-activeクラスを追加すると、開いた状態になる
function faqAccordion() {
  document.addEventListener("DOMContentLoaded", function () {
    // FAQ項目のタイトル要素をすべて取得
    const faqTitles = document.querySelectorAll(".js-accordion-btn");

    // アコーディオンの親要素を取得
    const accordions = document.querySelectorAll(".js-accordion");

    // 初期状態のスタイルを適用
    const details = document.querySelectorAll(".js-accordion-contents");

    // 実際のパディング値を取得して保存
    details.forEach((detail) => {
      // 元のスタイルでパディング値を確実に取得するため、一時的に表示
      const originalDisplay = detail.style.display;
      detail.style.display = "block";
      detail.style.height = "auto"; // 自然な高さで測定
      detail.style.visibility = "hidden"; // 表示されないように

      // 計算済みスタイルを取得
      const computedStyle = window.getComputedStyle(detail);
      const paddingTop = computedStyle.getPropertyValue("padding-top");
      const paddingBottom = computedStyle.getPropertyValue("padding-bottom");

      // コンソールで確認
      console.log("Original padding:", paddingTop, paddingBottom);

      // CSSカスタムプロパティで保存（CSS変数）
      detail.style.setProperty("--original-padding-top", paddingTop);
      detail.style.setProperty("--original-padding-bottom", paddingBottom);

      // 元の状態に戻す
      detail.style.display = originalDisplay;
      detail.style.height = "";
      detail.style.visibility = "";

      // 初期状態の設定
      detail.style.display = "none";
      detail.style.opacity = ""; // 明示的にスタイル属性を削除
      detail.classList.remove("is-active");
      detail.dataset.animating = "false";
    });

    // CSSスタイルを追加（閉じるアニメーションを高速化）
    const style = document.createElement("style");
    style.textContent = `
    .js-accordion-contents {
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      transition: max-height 0.4s cubic-bezier(0.4, 0.0, 0.2, 1),
                  opacity 0.25s cubic-bezier(0.4, 0.0, 0.2, 1),
                  padding 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
      will-change: max-height, opacity, padding;
      backface-visibility: hidden;
      transform: translateZ(0);
      padding-top: 0;
      padding-bottom: 0;
    }
    .js-accordion-contents.is-active {
      opacity: 1;
      max-height: 2000px; /* 十分に大きな値 */
      padding-top: var(--original-padding-top, 0);
      padding-bottom: var(--original-padding-bottom, 0);
    }

    /* 閉じる時のトランジションを別途定義（高速化） */
    .js-accordion-contents.closing {
      transition: max-height 0.3s cubic-bezier(0.4, 0.0, 0.2, 1),
                 opacity 0.2s cubic-bezier(0.4, 0.0, 0.2, 1),
                 padding 0.35s cubic-bezier(0.4, 0.0, 0.2, 1);
    }
  `;
    document.head.appendChild(style);

    // 新機能：初期状態でis-activeクラスのあるアコーディオンを開く（修正版）
    accordions.forEach(function (accordion) {
      if (accordion.classList.contains("is-active")) {
        const content = accordion.querySelector(".js-accordion-contents");

        if (content) {
          // クラスのみを追加して、CSSトランジションで開く
          content.style.display = "block";

          // 一時的にトランジションを無効化して即座に開く
          content.style.transition = "none";

          // 強制リフロー
          void content.offsetWidth;

          // アクティブクラスを追加
          content.classList.add("is-active");

          // 少し遅らせてトランジションを元に戻す
          setTimeout(() => {
            content.style.transition = "";
          }, 50);

          // アニメーション状態を更新
          content.dataset.animating = "false";
        }
      }
    });

    faqTitles.forEach(function (title) {
      title.addEventListener("click", function () {
        const detail = this.nextElementSibling;
        // 親要素の.js-accordionを取得
        const accordion = this.closest(".js-accordion");

        // 多重クリック防止
        if (detail.dataset.animating === "true") return;
        detail.dataset.animating = "true";

        // 現在アクティブかどうか
        const isActive = detail.classList.contains("is-active");

        if (isActive) {
          // ==== 閉じる処理（高速化）====

          // 閉じる用のクラスを適用して高速トランジションに
          detail.classList.add("closing");

          // 親要素からis-activeを削除
          if (accordion) {
            accordion.classList.remove("is-active");
          }

          // 素早く不透明度を下げる（視覚的効果）
          requestAnimationFrame(() => {
            detail.style.opacity = "0";

            // クラスを削除してアニメーション開始
            detail.classList.remove("is-active");

            // アニメーション完了を待たずに早めに非表示に
            setTimeout(() => {
              detail.style.display = "none";
              detail.dataset.animating = "false";
              detail.classList.remove("closing"); // クラスをクリーンアップ
            }, 350); // トランジション時間より短く
          });
        } else {
          // ==== 開く処理（修正：opacity を明示的にリセット）====

          // 先に表示状態にする
          detail.style.display = "block";

          // 親要素にis-activeを追加
          if (accordion) {
            accordion.classList.add("is-active");
          }

          // ここで重要：直接設定されたopacityスタイルを削除
          detail.style.removeProperty("opacity");

          // 強制リフロー
          void detail.offsetWidth;

          // アクティブ状態を設定（これでCSSトランジション開始）
          detail.classList.add("is-active");

          // アニメーション完了後にフラグ解除
          setTimeout(() => {
            detail.dataset.animating = "false";
          }, 500); // 開く時はそのままのトランジション時間
        }
      });
    });
  });
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _parts_faqAccordion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
//よくある質問のアコーディオン


(0,_parts_faqAccordion__WEBPACK_IMPORTED_MODULE_0__.faqAccordion)();

}();
/******/ })()
;