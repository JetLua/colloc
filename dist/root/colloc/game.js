(GameGlobal["webpackChunkzero"] = GameGlobal["webpackChunkzero"] || []).push([["colloc"],{

/***/ "./src/colloc/app.ts":
/*!***************************!*\
  !*** ./src/colloc/app.ts ***!
  \***************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_corejs3_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/esm/toConsumableArray */ "./node_modules/@babel/runtime-corejs3/helpers/esm/toConsumableArray.js");
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./module */ "./src/colloc/module/index.ts");
/* harmony import */ var _scene__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scene */ "./src/colloc/scene/index.ts");



await (0,_scene__WEBPACK_IMPORTED_MODULE_2__.preload)();
var stack = [];
_module__WEBPACK_IMPORTED_MODULE_1__.monitor.on('scene:go', function (name) {
  var _stack;

  var cursor = {
    game: _scene__WEBPACK_IMPORTED_MODULE_2__.game,
    entry: _scene__WEBPACK_IMPORTED_MODULE_2__.entry,
    selector: _scene__WEBPACK_IMPORTED_MODULE_2__.selector
  }[name];
  (_stack = stack[stack.length - 1]) === null || _stack === void 0 ? void 0 : _stack.cursor.hide();

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  cursor.show.apply(cursor, args);
  stack.push({
    cursor: cursor,
    args: args
  });
}).on('scene:back', function () {
  if (stack.length < 2) return _module__WEBPACK_IMPORTED_MODULE_1__.monitor.emit('scene:go', 'entry');
  stack.pop().cursor.hide();
  var _stack2 = stack[stack.length - 1],
      cursor = _stack2.cursor,
      args = _stack2.args;
  cursor.show.apply(cursor, (0,_babel_runtime_corejs3_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__.default)(args));
});
_module__WEBPACK_IMPORTED_MODULE_1__.monitor.emit('scene:go', 'entry');
__webpack_handle_async_dependencies__();
}, 1);

/***/ }),

/***/ "./src/colloc/module/enum.ts":
/*!***********************************!*\
  !*** ./src/colloc/module/enum.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Design": () => (/* binding */ Design),
/* harmony export */   "Color": () => (/* binding */ Color)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ~/core */ "./src/core/index.ts");

/** 设计尺寸 */

var Design;

(function (Design) {
  Design[Design["Width"] = 750] = "Width";
  Design[Design["Height"] = 1334] = "Height";
  Design[Design["Scale"] = Math.min(_core__WEBPACK_IMPORTED_MODULE_0__.screen.width / 750, _core__WEBPACK_IMPORTED_MODULE_0__.screen.height / 1334)] = "Scale";
})(Design || (Design = {}));

var Color;

(function (Color) {
  Color[Color["Blue"] = 4303093] = "Blue";
  Color[Color["Pink"] = 16210071] = "Pink";
  Color[Color["Yellow"] = 16438152] = "Yellow";
})(Color || (Color = {}));

/***/ }),

/***/ "./src/colloc/module/index.ts":
/*!************************************!*\
  !*** ./src/colloc/module/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Color": () => (/* reexport safe */ _enum__WEBPACK_IMPORTED_MODULE_0__.Color),
/* harmony export */   "Design": () => (/* reexport safe */ _enum__WEBPACK_IMPORTED_MODULE_0__.Design),
/* harmony export */   "menu": () => (/* reexport module object */ _menu__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   "monitor": () => (/* binding */ monitor)
/* harmony export */ });
/* harmony import */ var _enum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enum */ "./src/colloc/module/enum.ts");
/* harmony import */ var _menu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./menu */ "./src/colloc/module/menu.ts");
/* provided dependency */ var PIXI = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/dist/esm/pixi.js");



var monitor = new PIXI.utils.EventEmitter();

/***/ }),

/***/ "./src/colloc/module/menu.ts":
/*!***********************************!*\
  !*** ./src/colloc/module/menu.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "show": () => (/* binding */ show),
/* harmony export */   "update": () => (/* binding */ update),
/* harmony export */   "setPosition": () => (/* binding */ setPosition),
/* harmony export */   "on": () => (/* binding */ on)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ~/util */ "./src/util/index.ts");
/* harmony import */ var _enum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./enum */ "./src/colloc/module/enum.ts");
/* provided dependency */ var PIXI = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/dist/esm/pixi.js");


var width = 150;
var height = 690;
var colors = ['blue', 'pink', 'yellow', 'setting'];
var items = [];
var menu;

function init() {
  menu = new PIXI.Graphics().beginFill(0xffcc33, 0).drawRect(0, 0, width, height).endFill();
  menu.interactive = true;
  menu.pivot.set(width / 2, height / 2);
  menu.scale.set(_enum__WEBPACK_IMPORTED_MODULE_1__.Design.Scale);
  colors.forEach(function (id, i) {
    var item = PIXI.Sprite.from("ui.circle.".concat(id, ".png"));
    item.x = 75;
    item.name = id;
    item.y = i * 180 + 75;
    item.interactive = true;
    items.push(item);
    menu.addChild(item);
  });
}

function show(opts) {
  !menu && init();
  if (!opts) return menu.visible = true;
  update();
  if (menu.parent) return;
  opts.parent.addChild(menu);
}
function update() {
  var level = _util__WEBPACK_IMPORTED_MODULE_0__.store.colloc.level;
  var j = level % 25;
  items.forEach(function (item, i) {
    if (i > 2) return;
    var active = i <= j;
    item.interactive = active;
    item.texture = PIXI.Texture.from("ui.circle.".concat(active ? colors[i] : 'lock', ".png"));
  });
}
function setPosition(x, y) {
  menu.position.set(x, y);
}
function on(name, cb) {
  menu.on(name, cb);
}

/***/ }),

/***/ "./src/colloc/scene/entry.ts":
/*!***********************************!*\
  !*** ./src/colloc/scene/entry.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "show": () => (/* binding */ show),
/* harmony export */   "hide": () => (/* binding */ hide)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ~/core */ "./src/core/index.ts");
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../module */ "./src/colloc/module/index.ts");
/* provided dependency */ var PIXI = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/dist/esm/pixi.js");


var scene;

function init() {
  scene = new PIXI.Container();
  _core__WEBPACK_IMPORTED_MODULE_0__.stage.addChild(scene);
  _module__WEBPACK_IMPORTED_MODULE_1__.menu.show({
    parent: scene
  });
  _module__WEBPACK_IMPORTED_MODULE_1__.menu.setPosition(_core__WEBPACK_IMPORTED_MODULE_0__.screen.width / 2, _core__WEBPACK_IMPORTED_MODULE_0__.screen.height / 2);
  _module__WEBPACK_IMPORTED_MODULE_1__.menu.on('pointerdown', function (_ref) {
    var target = _ref.target;

    switch (target.name) {
      case 'blue':
        {
          _module__WEBPACK_IMPORTED_MODULE_1__.monitor.emit('scene:go', 'selector');
          break;
        }
    }
  });
}

function show() {
  if (scene) return scene.visible = true;
  init();
}
function hide() {
  scene.visible = false;
}

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
  var s = PIXI.Sprite.from('ui.circle.blue.png');
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
/* harmony export */   "entry": () => (/* reexport module object */ _entry__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   "selector": () => (/* reexport module object */ _selector__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   "preload": () => (/* reexport safe */ _preload__WEBPACK_IMPORTED_MODULE_3__.default)
/* harmony export */ });
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/colloc/scene/game.ts");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entry */ "./src/colloc/scene/entry.ts");
/* harmony import */ var _selector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selector */ "./src/colloc/scene/selector.ts");
/* harmony import */ var _preload__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./preload */ "./src/colloc/scene/preload.ts");








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
/* harmony import */ var _babel_runtime_corejs3_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime-corejs3/helpers/esm/slicedToArray.js");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ~/core */ "./src/core/index.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ~/util */ "./src/util/index.ts");



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  var _createPromise = (0,_util__WEBPACK_IMPORTED_MODULE_2__.createPromise)(),
      _createPromise2 = (0,_babel_runtime_corejs3_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__.default)(_createPromise, 2),
      promise = _createPromise2[0],
      resolve = _createPromise2[1];

  _core__WEBPACK_IMPORTED_MODULE_1__.loader.reset().add('colloc/static/texture/ui.json').add('colloc/static/texture/item.json').load(resolve);
  return promise;
}

/***/ }),

/***/ "./src/colloc/scene/selector.ts":
/*!**************************************!*\
  !*** ./src/colloc/scene/selector.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "show": () => (/* binding */ show),
/* harmony export */   "hide": () => (/* binding */ hide)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ~/core */ "./src/core/index.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ~/util */ "./src/util/index.ts");
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../module */ "./src/colloc/module/index.ts");
/* provided dependency */ var PIXI = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/dist/esm/pixi.js");



var width = 500;
var height = 500;
var r = 100;
var scene;
var grid = new PIXI.Graphics().beginFill(0xffffff, 0).drawRect(0, 0, width, height).endFill();

for (var i = 0; i < 25; i++) {
  var x = i % 5;
  var y = i / 5 | 0;
  var txt = new PIXI.Text("".concat(i + 1), {
    fontFamily: window.font,
    fontSize: 42,
    fill: _module__WEBPACK_IMPORTED_MODULE_2__.Color.Blue
  });
  var dot = PIXI.Sprite.from(PIXI.Texture.WHITE);
  dot.anchor.set(.5);
  txt.addChild(dot);
  txt.anchor.set(.5);
  txt.position.set((.5 + x) * r, (.5 + y) * r);
  grid.addChild(txt);
}

function init(grade) {
  scene = new PIXI.Container();
  _core__WEBPACK_IMPORTED_MODULE_0__.stage.addChild(scene);
  grid.pivot.set(width / 2, height / 2);
  grid.position.set(_core__WEBPACK_IMPORTED_MODULE_0__.screen.width / 2, _core__WEBPACK_IMPORTED_MODULE_0__.screen.height / 2);
  update(grade);
  scene.addChild(grid);
}

function update() {
  var grade = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

  for (var _i = 0; _i < 25; _i++) {
    var j = _i * grade;
    var _txt = grid.children[_i];
    var ok = j <= _util__WEBPACK_IMPORTED_MODULE_1__.store.colloc.level;
    _txt.text = ok ? "".concat(j + 1) : '';

    if (ok) {
      _txt.text = "".concat(j + 1);
      _txt.children[0].visible = false;
    } else {
      _txt.text = '';
      var _dot = _txt.children[0];
      _dot.visible = true;
      _dot.texture = PIXI.Texture.from("ui.dot.".concat(['blue', 'pink', 'yellow'][grade - 1], ".png"));
    }
  }
}

function show() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  if (!scene) return init(opts.grade);
  update(opts.grade);
}
function hide() {}

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