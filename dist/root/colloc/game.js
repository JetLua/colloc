(GameGlobal["webpackChunkzero"] = GameGlobal["webpackChunkzero"] || []).push([["colloc"],{

/***/ "./src/colloc/app.ts":
/*!***************************!*\
  !*** ./src/colloc/app.ts ***!
  \***************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scene__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scene */ "./src/colloc/scene/index.ts");

await (0,_scene__WEBPACK_IMPORTED_MODULE_0__.preload)();
_scene__WEBPACK_IMPORTED_MODULE_0__.game.show();
__webpack_handle_async_dependencies__();
}, 1);

/***/ }),

/***/ "./src/colloc/scene/game.ts":
/*!**********************************!*\
  !*** ./src/colloc/scene/game.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "show": () => (/* binding */ show),
/* harmony export */   "hide": () => (/* binding */ hide)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ~/core */ "./src/core/index.ts");
/* provided dependency */ var PIXI = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/dist/esm/pixi.js");

function show() {
  var s = PIXI.Sprite.from('circle.blue.png');
  _core__WEBPACK_IMPORTED_MODULE_0__.stage.addChild(s);
}
function hide() {}

/***/ }),

/***/ "./src/colloc/scene/index.ts":
/*!***********************************!*\
  !*** ./src/colloc/scene/index.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "game": () => (/* reexport module object */ _game__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   "preload": () => (/* reexport safe */ _preload__WEBPACK_IMPORTED_MODULE_1__.default)
/* harmony export */ });
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/colloc/scene/game.ts");
/* harmony import */ var _preload__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./preload */ "./src/colloc/scene/preload.ts");




/***/ }),

/***/ "./src/colloc/scene/preload.ts":
/*!*************************************!*\
  !*** ./src/colloc/scene/preload.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/slicedToArray */ "./node_modules/@babel/runtime-corejs3/helpers/esm/slicedToArray.js");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ~/core */ "./src/core/index.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ~/util */ "./src/util/index.ts");



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  var _createPromise = (0,_util__WEBPACK_IMPORTED_MODULE_2__.createPromise)(),
      _createPromise2 = (0,_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__.default)(_createPromise, 2),
      promise = _createPromise2[0],
      resolve = _createPromise2[1];

  _core__WEBPACK_IMPORTED_MODULE_1__.loader.reset().add('colloc/static/texture/ui.json').add('colloc/static/texture/item.json').load(resolve);
  return promise;
}

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