(GameGlobal["webpackChunkzero"] = GameGlobal["webpackChunkzero"] || []).push([["colloc"],{

/***/ "./src/colloc/app.ts":
/*!***************************!*\
  !*** ./src/colloc/app.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/dist/esm/pixi.js");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ~/core */ "./src/core/index.ts");


var square = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Graphics().beginFill(0xffcc33).drawRect(0, 0, 100, 100).endFill();
square.position.set(100);
_core__WEBPACK_IMPORTED_MODULE_1__.stage.addChild(square);
square.interactive = true;
square.on('tap', function () {
  wx.showToast({
    title: 'ok'
  });
});

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ "use strict";
/******/ 
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/colloc/app.ts"));
/******/ }
]);
//# sourceMappingURL=game.js.map