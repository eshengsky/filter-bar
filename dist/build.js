/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	(function (global, factory) {
	    global.FilterBar = factory(global);
	})(typeof window !== 'undefined' ? window : undefined, function (window) {
	    /**
	     * 筛选条插件类
	     * 
	     * @class FilterBar
	     */
	    var FilterBar = function () {
	        /**
	         * 创建实例
	         * 
	         * @param {any} config 
	         * @memberof FilterBar
	         */
	        function FilterBar(config, doneCallback) {
	            _classCallCheck(this, FilterBar);

	            this.log('init!');
	            this.config = config;
	            this.cache = [];
	            this.lastFocusGroup = '';
	            this.emptyHtml = '<p class="filter-nodata">该筛选项无数据，请重新选择筛选条件！</p>';
	            this.init();
	            document.documentElement.classList.remove('filter-shown');
	            document.body.classList.remove('filter-shown');
	            if (typeof doneCallback === 'function') {
	                doneCallback();
	            }
	        }

	        /**
	         * 打印调试日志
	         * 仅debug=true启用
	         * 
	         * @param {any} msg 
	         * @memberof FilterBar
	         */


	        _createClass(FilterBar, [{
	            key: 'log',
	            value: function log() {
	                if (FilterBar.debug) {
	                    var _console;

	                    (_console = console).log.apply(_console, arguments);
	                }
	            }

	            /**
	             * 将NodeList转为数组
	             * 
	             * @param {any} obj 
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'toArray',
	            value: function toArray(obj) {
	                return Array.prototype.slice.call(obj);
	            }

	            /**
	             * 初始化方法
	             * 
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'init',
	            value: function init() {
	                this.renderTabs();
	                this.renderPanels();
	                this.renderMask();
	            }

	            /**
	             * 渲染Tabs元素
	             * 
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'renderTabs',
	            value: function renderTabs() {
	                var _this = this;

	                this.log('渲染Tabs');
	                var wrap = document.createElement('div');
	                wrap.classList.add('filter-wrap');
	                this.config.forEach(function (_ref, index) {
	                    var data = _ref.data,
	                        tabName = _ref.tabName,
	                        selectedData = _ref.selectedData,
	                        customSelected = _ref.customSelected,
	                        callback = _ref.callback;

	                    var tab = document.createElement('div');
	                    tab.id = 'filter-tab-' + index;
	                    tab.classList.add('filter-tab');

	                    // 无展开面板的形式
	                    if (typeof data === 'undefined') {
	                        tab.classList.add('filter-tab-radio');
	                    }
	                    tab.addEventListener('click', function () {
	                        if (typeof data !== 'undefined') {
	                            // 切换显示普通列表
	                            if (tab.classList.contains('on')) {
	                                _this.hidePanel();
	                            } else {
	                                _this.showPanel(index);
	                            }
	                        } else {
	                            // 该tab被认为是单击切换选中
	                            tab.classList.toggle('selected');
	                            _this.hidePanel();
	                            callback({
	                                selected: tab.classList.contains('selected'),
	                                type: FilterBar.cbEnum.confirm,
	                                ext: index
	                            });
	                        }
	                    });
	                    tab.innerHTML = '<div><span>' + tabName + '</span></div>';

	                    var hasSelected = false;

	                    // 判断是否已有选中
	                    if (typeof selectedData === 'boolean') {
	                        hasSelected = selectedData;
	                    } else if (typeof selectedData === 'string') {
	                        if (selectedData) {
	                            hasSelected = true;
	                        }
	                    } else if (Array.isArray(selectedData)) {
	                        if (selectedData.length) {
	                            hasSelected = true;
	                        }
	                    } else if ((typeof selectedData === 'undefined' ? 'undefined' : _typeof(selectedData)) === 'object') {
	                        if (Object.keys(selectedData).length) {
	                            hasSelected = true;
	                        }
	                    }
	                    _this.log('renderTabs - hasSelected=' + hasSelected);

	                    // 普通筛选项有选中，或者自定义面板包含了选中项
	                    if (hasSelected || customSelected) {
	                        tab.classList.add('selected');
	                    }

	                    wrap.appendChild(tab);
	                });

	                if (!document.querySelector('.filter-wrap')) {
	                    this.log('第一次初始化');

	                    // 如果是第一次初始化
	                    document.body.appendChild(wrap);
	                } else {
	                    this.log('wrap已存在，重新初始化');

	                    // 重新初始化
	                    var frag = document.createDocumentFragment();
	                    this.toArray(wrap.querySelectorAll('.filter-tab')).forEach(function (tab) {
	                        return frag.appendChild(tab);
	                    });

	                    // 原有的tab全部移除
	                    this.toArray(document.querySelectorAll('.filter-wrap .filter-tab')).forEach(function (tab) {
	                        return tab.remove();
	                    });

	                    // 添加新的tab
	                    document.querySelector('.filter-wrap').appendChild(frag);

	                    // 原有的面板全部移除
	                    this.toArray(document.querySelectorAll('.filter-panel')).forEach(function (panel) {
	                        return panel.remove();
	                    });
	                }
	            }

	            /**
	             * 渲染下拉面板
	             * 
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'renderPanels',
	            value: function renderPanels() {
	                var _this2 = this;

	                this.log('渲染Panels');
	                this.config.forEach(function (_ref2, index) {
	                    var data = _ref2.data;

	                    if (typeof data !== 'undefined') {
	                        // 弹出列表的形式
	                        if (data[0] && data[0].groupCode) {
	                            // 多列筛选
	                            _this2.renderComplexPanel(index);
	                        } else {
	                            if (_this2.config[index].multi) {
	                                // 单列多选
	                                _this2.renderSinglePanel2(index);
	                            } else {
	                                // 单列单选
	                                _this2.renderSinglePanel1(index);
	                            }
	                        }
	                    }
	                });
	            }

	            /**
	             * 使用新的参数重置筛选
	             * 
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'reset',
	            value: function reset(params) {
	                var _this3 = this;

	                if (params.type === FilterBar.cbEnum.confirm) {
	                    // 如果是通过点击确定进行的重置，则更新全部面板
	                    this.log('reset所有面板');
	                    this.config = params.config;
	                    this.config.forEach(function (conf, index) {
	                        _this3.resetOnePanel(conf, index);

	                        // 设置面板样式
	                        var panel = document.querySelector('#filter-panel-' + index);
	                        _this3.initPanelStyle(panel, index);
	                    });
	                } else {
	                    // 否则仅更新所操作的面板
	                    this.log('\u4EC5reset\u7B2C' + params.ext + '\u4E2A\u9762\u677F');
	                    this.config[params.ext] = params.config[params.ext];
	                    this.resetOnePanel(params.config[params.ext], params.ext);
	                }
	            }

	            /**
	             * 重置指定面板
	             * 
	             * @param {any} conf 
	             * @param {any} index 
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'resetOnePanel',
	            value: function resetOnePanel(conf, index) {
	                this.log('\u5F00\u59CBreset\u9762\u677F' + index);
	                var data = conf.data,
	                    selectedData = conf.selectedData,
	                    customSelected = conf.customSelected;

	                // 重新确定tab是否高亮
	                var hasSelected = false;
	                var tab = document.querySelector('#filter-tab-' + index);

	                // 判断是否已有选中
	                if (typeof selectedData === 'string') {
	                    if (selectedData) {
	                        hasSelected = true;
	                    }
	                } else if (Array.isArray(selectedData)) {
	                    if (selectedData.length) {
	                        hasSelected = true;
	                    }
	                } else if ((typeof selectedData === 'undefined' ? 'undefined' : _typeof(selectedData)) === 'object') {
	                    if (Object.keys(selectedData).length) {
	                        hasSelected = true;
	                    }
	                }

	                // 普通筛选项有选中，或者自定义面板包含了选中项
	                if (hasSelected || customSelected) {
	                    tab.classList.add('selected');
	                } else {
	                    tab.classList.remove('selected');
	                }

	                // 重新构建筛选项
	                if (typeof data === 'undefined') {
	                    // 无列表的形式，例如门票筛选的"今日可订"
	                } else if (Array.isArray(data) && data[0] && data[0].groupCode) {
	                    // 多列筛选
	                    this.resetComplexPanel(index);
	                } else if (this.config[index].multi) {
	                    // 单列多选
	                    this.resetSinglePanel2(index);
	                } else {
	                    // 单列单选
	                    this.resetSinglePanel1(index);
	                }
	            }

	            /**
	             * 计算面板的确定高度
	             * 
	             * @param {any} index 
	             * @returns 
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'calculateHeight',
	            value: function calculateHeight(index) {
	                var height = 0;
	                var panel = document.querySelector('#filter-panel-' + index);

	                // 根据屏幕的高度，设置一个最大高度，以尽可能多的展示内容
	                var maxHeight = window.innerHeight - document.querySelector('.filter-wrap').offsetTop - 45 - 90;
	                if (panel.classList.contains('complex')) {
	                    // 复杂面板，高度定死，使用最大高度
	                    height = maxHeight;
	                } else if (panel.classList.contains('multi')) {
	                    // 多选面板
	                    var lines = this.config[index].data.length;
	                    if (lines) {
	                        height = lines * 45 + 47;
	                    } else {
	                        height = 137;
	                    }
	                    if (height > maxHeight) {
	                        height = maxHeight;
	                    }
	                } else {
	                    // 单列单选面板
	                    var _lines = this.config[index].data.length;
	                    if (_lines) {
	                        height = _lines * 45;
	                    } else {
	                        height = 137;
	                    }
	                    if (height > maxHeight) {
	                        height = maxHeight;
	                    }
	                }
	                this.log('\u8BA1\u7B97\u5F97\u5230\u9762\u677F\u56FA\u5B9A\u9AD8\u5EA6\u4E3A' + height + 'px');
	                return height;
	            }

	            /**
	             * 初始化面板样式
	             * 
	             * @param {any} panel 
	             * @param {any} index 
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'initPanelStyle',
	            value: function initPanelStyle(panel, index) {
	                var data = this.config[index].data;
	                var height = this.calculateHeight(index);
	                panel.style.height = height + 'px';
	                panel.style.transform = 'translate3d(0px, -' + (height + 1) + 'px, 0px)';
	                panel.style.webkitTransform = 'translate3d(0px, -' + (height + 1) + 'px, 0px)';
	                var ul = void 0;
	                if (data[0] && data[0].groupCode) {
	                    // 多列筛选
	                    ul = panel.querySelector('.filter-ul');
	                } else if (this.config[index].multi) {
	                    // 单列多选
	                    ul = panel.querySelector('ul');
	                }

	                if (ul) {
	                    ul.style.height = height - 47 + 'px';
	                }
	            }

	            /**
	             * 渲染蒙层
	             * 
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'renderMask',
	            value: function renderMask() {
	                var _this4 = this;

	                this.log('渲染蒙层');
	                var mask = document.querySelector('.filter-mask');
	                if (!mask) {
	                    var _mask = document.createElement('div');
	                    _mask.classList.add('filter-mask');
	                    _mask.addEventListener('click', function () {
	                        _this4.hidePanel();
	                    });
	                    document.body.appendChild(_mask);
	                }
	            }

	            /**
	             * 显示面板
	             * 
	             * @param {number} index - tab的次序
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'showPanel',
	            value: function showPanel(index) {
	                var _this5 = this;

	                this.log('\u663E\u793A\u9762\u677F' + index);
	                var panel = document.querySelector('#filter-panel-' + index);
	                var opendPanel = document.querySelector('.filter-panel.on');

	                // 如果当前已有打开的面板，则先隐藏
	                if (opendPanel) {
	                    this.hidePanel(false);
	                }

	                panel.classList.add('on');
	                panel.style.display = 'block';
	                setTimeout(function () {
	                    panel.style.transform = 'translate3d(0, 0, 0)';
	                    panel.style.webkitTransform = 'translate3d(0, 0, 0)';
	                }, 0);

	                var tab = document.querySelector('#filter-tab-' + index);
	                tab.classList.add('on');

	                // 禁止屏幕滚动
	                document.documentElement.classList.add('filter-shown');
	                document.body.classList.add('filter-shown');
	                setTimeout(function () {
	                    _this5.log('重新启用面板动画');
	                    panel.style.transitionDuration = '.3s';
	                    panel.style.webkitTransitionDuration = '.3s';
	                }, 0);
	            }

	            /**
	             * 隐藏面板
	             * 
	             * @param {boolean} [animate=true] - 是否显示动画
	             * @param {boolean} [cb=true] - 是否调用回调函数
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'hidePanel',
	            value: function hidePanel() {
	                var _this6 = this;

	                var animate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	                var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	                this.log('隐藏面板');
	                var opendPanel = document.querySelector('.filter-panel.on');
	                if (opendPanel) {
	                    var opendPanelHeight = parseInt(opendPanel.style.height.split("px")[0]);
	                    var opendIndex = opendPanel.dataset.index;
	                    var opendTab = document.querySelector('#filter-tab-' + opendIndex);
	                    if (!animate) {
	                        this.log('停用面板动画');
	                        opendPanel.style.transitionDuration = '0s';
	                        opendPanel.style.webkitTransitionDuration = '0s';
	                    }
	                    opendPanel.style.transform = 'translate3d(0, -' + (opendPanelHeight + 1) + 'px, 0)';
	                    opendPanel.style.webkitTransform = 'translate3d(0, -' + (opendPanelHeight + 1) + 'px, 0)';
	                    opendPanel.classList.remove('on');
	                    opendTab.classList.remove('on');

	                    // 开启屏幕滚动
	                    document.documentElement.classList.remove('filter-shown');
	                    document.body.classList.remove('filter-shown');

	                    // 如果没有数据则直接退出
	                    var data = this.config[opendIndex].data;
	                    if (Array.isArray(data) && data.length === 0) {
	                        return;
	                    }

	                    // 收起之后，隐藏面板，并从缓存中恢复已选项，覆盖暂选项
	                    if (!animate) {
	                        // opendPanel.style.display = 'none';
	                        this.restoreFilter(opendIndex, cb);
	                    } else {
	                        setTimeout(function () {
	                            // opendPanel.style.display = 'none';
	                            _this6.restoreFilter(opendIndex, cb);
	                        }, 300);
	                    }
	                }
	            }

	            /**
	             * 从缓存中恢复已选项
	             * 
	             * @param {number} index 
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'restoreFilter',
	            value: function restoreFilter(index, cb) {
	                var _this7 = this;

	                this.log('\u6E05\u9664\u4E34\u65F6\u9009\u62E9\u7684\u6570\u636E\uFF0C\u6062\u590D\u9762\u677F' + index + '\u7684\u4E0A\u6B21\u5DF2\u786E\u8BA4\u6570\u636E', this.cache[index]);
	                var selected = this.cache[index];
	                var tab = document.querySelector('#filter-tab-' + index);
	                if (Array.isArray(selected)) {
	                    // 单列多选
	                    var lis = document.querySelectorAll('#filter-panel-' + index + ' li');
	                    this.toArray(lis).forEach(function (li) {
	                        var code = li.dataset.code;
	                        if (selected.indexOf(code) >= 0 || selected.length === 0 && !code) {
	                            li.classList.add('selected');
	                        } else {
	                            li.classList.remove('selected');
	                        }
	                    });

	                    // 改变tab样式
	                    if (selected.length) {
	                        tab.classList.add('selected');
	                    } else {
	                        tab.classList.remove('selected');
	                    }

	                    // 回到顶部
	                    var ul = document.querySelector('#filter-panel-' + index + ' ul');
	                    if (ul) {
	                        ul.scrollTop = 0;
	                    }
	                } else if ((typeof selected === 'undefined' ? 'undefined' : _typeof(selected)) === 'object') {
	                    // 多列
	                    var panel = document.querySelectorAll('#filter-panel-' + index + ' .filter-ul>li');
	                    this.toArray(panel).forEach(function (groupLi) {
	                        var filterTxt = [];
	                        var groupCode = groupLi.dataset.code;
	                        _this7.toArray(groupLi.querySelectorAll('.filter-sub-ul li')).forEach(function (subLi) {
	                            if (!selected[groupCode] && (!subLi.dataset.code || subLi.dataset.code === '不限') && !subLi.classList.contains('filter-sec-wrap')) {
	                                subLi.classList.add('selected');
	                            } else if (selected[groupCode] && selected[groupCode].indexOf(subLi.dataset.code) >= 0) {
	                                subLi.classList.add('selected');
	                                if (!subLi.classList.contains('filter-sec-li')) {
	                                    // 普通li
	                                    filterTxt.push(subLi.querySelector('span').textContent);
	                                } else {
	                                    // 子面板的li
	                                    var forcode = subLi.parentElement.parentElement.dataset.forcode;
	                                    groupLi.querySelector('.filter-sub-li[data-code="' + forcode + '"]').classList.add('selected');
	                                    var subTitle = '';
	                                    var itemName = subLi.querySelector('span').textContent;
	                                    if (itemName === '不限') {
	                                        // 第一项默认为不限
	                                        subTitle = forcode;
	                                    } else {
	                                        subTitle = forcode + '-' + itemName;
	                                    }
	                                    filterTxt.push(subTitle);
	                                }
	                            } else {
	                                subLi.classList.remove('selected');
	                            }
	                        });
	                        groupLi.querySelector('.filter-title i').textContent = filterTxt.join('、');
	                    });

	                    // 改变tab样式
	                    if (Object.keys(selected).length) {
	                        tab.classList.add('selected');
	                    } else {
	                        tab.classList.remove('selected');
	                    }

	                    // 收起已展开的筛选
	                    this.toArray(document.querySelectorAll('#filter-panel-' + index + ' .filter-more.opend')).forEach(function (more) {
	                        more.classList.remove('opend');
	                        var subUl = more.parentElement.nextElementSibling;
	                        subUl.style.maxHeight = '40px';
	                    });

	                    // 回到顶部
	                    var _ul = document.querySelector('#filter-panel-' + index + ' .filter-ul');
	                    if (_ul) {
	                        _ul.scrollTop = 0;
	                    }

	                    // 上次点击的组置空
	                    this.lastFocusGroup = '';
	                }

	                // 执行回调
	                if (cb) {
	                    this.config[index].callback({
	                        selected: selected,
	                        type: FilterBar.cbEnum.cancel,
	                        ext: index
	                    });
	                }
	            }

	            /**
	             * 初始化单列单选列表
	             * 
	             * @param {number} index - 筛选tab次序
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'renderSinglePanel1',
	            value: function renderSinglePanel1(index) {
	                var _this8 = this;

	                this.log('\u521D\u59CB\u5316\u5355\u9009\u9762\u677F' + index);
	                var render = function render(panel) {
	                    if (!_this8.config[index].data.length) {
	                        // 如果不存在筛选
	                        panel.innerHTML = _this8.emptyHtml;
	                    } else {
	                        var ul = document.createElement('ul');

	                        // 初始化单列单选列表的项
	                        _this8.initSinglePanel1Items(index, ul);

	                        panel.appendChild(ul);
	                    }
	                };

	                var panel = void 0;
	                if (!document.querySelector('#filter-panel-' + index)) {
	                    // 不存在则创建面板
	                    panel = document.createElement('div');
	                    panel.id = 'filter-panel-' + index;
	                    panel.classList.add('filter-panel');
	                    panel.dataset.index = index;
	                    render(panel);
	                    document.querySelector('.filter-wrap').appendChild(panel);
	                } else {
	                    panel = document.querySelector('#filter-panel-' + index);
	                    panel.innerHTML = '';
	                    render(panel);
	                }

	                // 设置面板样式
	                this.initPanelStyle(panel, index);

	                // 将已选项存入缓存
	                this.cache[index] = this.config[index].selectedData;
	            }

	            /**
	             * 重置单列单选列表
	             * 
	             * @param {number} index - 筛选tab次序
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'resetSinglePanel1',
	            value: function resetSinglePanel1(index) {
	                this.log('\u91CD\u7F6E\u5355\u9009\u9762\u677F' + index);
	                var ul = document.querySelector('#filter-panel-' + index + ' ul');

	                // 如果本次重置的筛选数据为空，或者之前面板无数据，则完全初始化
	                if (!this.config[index].data.length || !ul) {
	                    this.renderSinglePanel1(index);
	                    return;
	                }

	                // 创建新的筛选项元素
	                var frag = document.createDocumentFragment();

	                // 初始化单列单选列表的项
	                this.initSinglePanel1Items(index, frag);

	                // 清空原先的筛选项
	                ul.innerHTML = '';

	                // 添加新的筛选项到ul
	                ul.appendChild(frag);
	            }

	            /**
	             * 初始化单列单选列表的项
	             * 
	             * @param {number} index - 筛选tab次序
	             * @param {any} container - 生成的项放入的容器
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'initSinglePanel1Items',
	            value: function initSinglePanel1Items(index, container) {
	                var _this9 = this;

	                var data = this.config[index].data;
	                var selectedData = this.config[index].selectedData;
	                data.forEach(function (item) {
	                    var li = document.createElement('li');
	                    li.dataset.code = item.itemCode;
	                    li.textContent = item.itemName;

	                    // 处理选中状态
	                    if (item.itemCode === String(selectedData)) {
	                        li.classList.add('selected');

	                        // 替换tab文字
	                        if (_this9.config[index].replace) {
	                            var tab = document.querySelector('#filter-tab-' + index);
	                            if ((!item.itemCode || item.itemCode === '不限') && !_this9.config[index].replaceDefault) {
	                                // 不限的情况，若replaceDefault=false，则不替换
	                                tab.querySelector('span').textContent = _this9.config[index].tabName;
	                            } else {
	                                // 用已选项替换tab文字
	                                tab.querySelector('span').textContent = item.itemName;
	                            }
	                        }
	                    }

	                    // 绑定筛选项的点击事件
	                    li.addEventListener('click', function () {
	                        var tab = document.querySelector('#filter-tab-' + index);
	                        var panel = document.querySelector('#filter-panel-' + index);

	                        // 调整选中状态
	                        var selected = panel.querySelector('li.selected');
	                        if (selected) {
	                            selected.classList.remove('selected');
	                        }
	                        li.classList.add('selected');

	                        // 已选项放入缓存
	                        _this9.cache[index] = item.itemCode;

	                        // 执行回调函数
	                        _this9.config[index].callback({
	                            selected: item.itemCode,
	                            type: FilterBar.cbEnum.confirm,
	                            ext: index
	                        });

	                        // 隐藏面板
	                        _this9.hidePanel(true, false);

	                        // 改变tab样式
	                        if (item.itemCode) {
	                            tab.classList.add('selected');
	                        } else {
	                            tab.classList.remove('selected');
	                        }

	                        // 修改tab文字
	                        if (_this9.config[index].replace) {
	                            if ((!item.itemCode || item.itemCode === '不限') && !_this9.config[index].replaceDefault) {
	                                // 不限的情况，若replaceDefault=false，则不替换
	                                tab.querySelector('span').textContent = _this9.config[index].tabName;
	                            } else {
	                                // 用已选项替换tab文字
	                                tab.querySelector('span').textContent = item.itemName;
	                            }
	                        }
	                    });
	                    container.appendChild(li);
	                });
	            }

	            /**
	             * 获取当前的已选项（单列多选或多列情况）
	             * 
	             * @param {any} panel 
	             * @returns 
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'getSelectedItems',
	            value: function getSelectedItems(panel) {
	                var _this10 = this;

	                if (panel.classList.contains('multi')) {
	                    // 多选面板
	                    var liSelected = panel.querySelectorAll('li.selected');
	                    var selectedItems = [];
	                    this.toArray(liSelected).forEach(function (li) {
	                        var code = li.dataset.code;
	                        if (code) {
	                            selectedItems.push(code);
	                        }
	                    });
	                    return selectedItems;
	                }

	                // 复杂面板
	                var result = {};
	                var ul = panel.querySelectorAll('.filter-ul>li');
	                this.toArray(ul).forEach(function (li) {
	                    var selectedItems = [];
	                    var items = li.querySelectorAll('.filter-sub-ul li');
	                    _this10.toArray(items).forEach(function (item) {
	                        if (!item.classList.contains('filter-li-haspanel') && item.classList.contains('selected') && item.dataset.code && item.dataset.code !== '不限') {
	                            selectedItems.push(item.dataset.code);
	                        }
	                    });
	                    if (selectedItems.length > 0) {
	                        result[li.dataset.code] = selectedItems;
	                    }
	                });
	                return result;
	            }

	            /**
	             * 处理多选项的点击
	             * 
	             * @param {any} li 
	             * @param {any} panel 
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'handleMultiSelect',
	            value: function handleMultiSelect(li, panel) {
	                var isDefaultItem = !li.dataset.code;
	                if (isDefaultItem) {
	                    if (!li.classList.contains('selected')) {
	                        this.toArray(panel.querySelectorAll('li.selected')).forEach(function (li) {
	                            return li.classList.remove('selected');
	                        });
	                        li.classList.add('selected');
	                    }
	                } else {
	                    // 点击的是普通项
	                    li.classList.toggle('selected');

	                    // 还要再处理下"不限"选项
	                    if (panel.querySelectorAll('.selected').length) {
	                        panel.querySelector('li').classList.remove('selected');
	                    } else {
	                        panel.querySelector('li').classList.add('selected');
	                    }
	                }
	            }

	            /**
	             * 渲染单列多选列表
	             * 
	             * @param {number} index - 筛选tab次序
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'renderSinglePanel2',
	            value: function renderSinglePanel2(index) {
	                var _this11 = this;

	                this.log('\u521D\u59CB\u5316\u591A\u9009\u9762\u677F' + index);
	                var render = function render(panel) {
	                    if (!_this11.config[index].data.length) {
	                        // 如果不存在筛选
	                        panel.innerHTML = _this11.emptyHtml;
	                    } else {
	                        var ul = document.createElement('ul');

	                        // 初始化单列多选列表的项
	                        _this11.initSinglePanel2Items(index, ul);

	                        panel.appendChild(ul);

	                        // 操作面板
	                        var action = document.createElement('div');
	                        action.classList.add('filter-action');

	                        // 重置
	                        var reset = document.createElement('div');
	                        reset.innerHTML = '<div class="filter-action-txt">重置</div>';
	                        reset.classList.add('filter-reset');
	                        reset.addEventListener('click', function () {
	                            // 恢复到不限
	                            _this11.toArray(panel.querySelectorAll('li.selected')).forEach(function (li) {
	                                return li.classList.remove('selected');
	                            });
	                            panel.querySelector('li').classList.add('selected');

	                            // 回到顶部
	                            ul.scrollTop = 0;

	                            // 改变tab样式
	                            document.querySelector('#filter-tab-' + index).classList.remove('selected');

	                            // 执行回调
	                            var selected = _this11.getSelectedItems(panel);
	                            _this11.config[index].callback({
	                                selected: selected,
	                                type: FilterBar.cbEnum.clear,
	                                ext: index
	                            });
	                        });

	                        // 确认
	                        var confirm = document.createElement('div');
	                        if (!_this11.config[index].confirmHtml) {
	                            confirm.innerHTML = '<div class="filter-action-txt">确认</div>';
	                        } else {
	                            confirm.innerHTML = _this11.config[index].confirmHtml;
	                        }
	                        confirm.classList.add('filter-confirm');
	                        confirm.addEventListener('click', function () {
	                            var tab = document.querySelector('#filter-tab-' + index);
	                            var selectedItems = _this11.getSelectedItems(panel);

	                            // 将已选项放入缓存
	                            _this11.cache[index] = selectedItems;

	                            // 执行回调
	                            _this11.config[index].callback({
	                                selected: selectedItems,
	                                type: FilterBar.cbEnum.confirm,
	                                ext: index
	                            });

	                            // 隐藏面板
	                            _this11.hidePanel(true, false);

	                            // 改变tab样式
	                            if (selectedItems.length) {
	                                tab.classList.add('selected');
	                            } else {
	                                tab.classList.remove('selected');
	                            }
	                        });

	                        action.appendChild(reset);
	                        action.appendChild(confirm);
	                        panel.appendChild(action);
	                    }
	                };

	                var panel = void 0;
	                if (!document.querySelector('#filter-panel-' + index)) {
	                    // 不存在则创建面板
	                    panel = document.createElement('div');
	                    panel.id = 'filter-panel-' + index;
	                    panel.classList.add('filter-panel');
	                    panel.classList.add('multi');
	                    panel.dataset.index = index;
	                    render(panel);
	                    document.querySelector('.filter-wrap').appendChild(panel);
	                } else {
	                    panel = document.querySelector('#filter-panel-' + index);
	                    panel.innerHTML = '';
	                    render(panel);
	                }

	                // 设置面板样式
	                this.initPanelStyle(panel, index);

	                // 将已选项存入缓存
	                this.cache[index] = this.config[index].selectedData;
	            }
	        }, {
	            key: 'resetSinglePanel2',
	            value: function resetSinglePanel2(index) {
	                this.log('\u91CD\u7F6E\u591A\u9009\u9762\u677F' + index);
	                var ul = document.querySelector('#filter-panel-' + index + ' ul');

	                // 如果本次重置的筛选数据为空，或者之前面板无数据，则完全初始化
	                if (!this.config[index].data.length || !ul) {
	                    this.renderSinglePanel2(index);
	                    return;
	                }

	                // 创建新的筛选项元素
	                var frag = document.createDocumentFragment();

	                // 初始化单列多选列表的项
	                this.initSinglePanel2Items(index, frag);

	                // 清空原先的筛选项
	                ul.innerHTML = '';

	                // 添加新的筛选项到ul
	                ul.appendChild(frag);

	                // 更新确认按钮的文字
	                var confirm = document.querySelector('#filter-panel-' + index + ' .filter-confirm');
	                if (!this.config[index].confirmHtml) {
	                    confirm.innerHTML = '<div class="filter-action-txt">确认</div>';
	                } else {
	                    confirm.innerHTML = this.config[index].confirmHtml;
	                }
	            }

	            /**
	             * 初始化单列多选列表的项
	             * 
	             * @param {number} index - 筛选tab次序
	             * @param {any} container - 生成的项放入的容器
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'initSinglePanel2Items',
	            value: function initSinglePanel2Items(index, container) {
	                var _this12 = this;

	                var data = this.config[index].data;
	                var selectedData = this.config[index].selectedData;
	                data.forEach(function (item) {
	                    var li = document.createElement('li');
	                    li.dataset.code = item.itemCode;
	                    li.textContent = item.itemName;

	                    // 处理选中状态
	                    if (selectedData.length === 0 && !item.itemCode) {
	                        li.classList.add('selected');
	                    } else if (selectedData.indexOf(item.itemCode) >= 0) {
	                        li.classList.add('selected');
	                    }

	                    // 绑定筛选项的点击事件
	                    li.addEventListener('click', function () {
	                        var tab = document.querySelector('#filter-tab-' + index);
	                        var panel = document.querySelector('#filter-panel-' + index);

	                        // 调整选中状态
	                        _this12.handleMultiSelect(li, panel);

	                        // 当前的暂选项
	                        var selected = _this12.getSelectedItems(panel);

	                        // 改变tab样式
	                        if (selected.length) {
	                            tab.classList.add('selected');
	                        } else {
	                            tab.classList.remove('selected');
	                        }

	                        // 执行回调
	                        _this12.config[index].callback({
	                            selected: selected,
	                            type: FilterBar.cbEnum.item,
	                            ext: index
	                        });
	                    });
	                    container.appendChild(li);
	                });
	            }

	            /**
	             * 渲染复杂列表
	             * 
	             * @param {any} index 
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'renderComplexPanel',
	            value: function renderComplexPanel(index) {
	                var _this13 = this;

	                this.log('\u521D\u59CB\u5316\u590D\u6742\u9762\u677F' + index);
	                var render = function render(panel) {
	                    if (!_this13.config[index].data.length) {
	                        // 如果不存在筛选
	                        panel.innerHTML = _this13.emptyHtml;
	                    } else {
	                        var ul = document.createElement('ul');
	                        ul.classList.add('filter-ul');

	                        // 初始化复杂列表的项
	                        _this13.initComplexPanelItems(index, ul, []);

	                        panel.appendChild(ul);

	                        // 操作面板
	                        var action = document.createElement('div');
	                        action.classList.add('filter-action');

	                        // 重置
	                        var reset = document.createElement('div');
	                        reset.innerHTML = '<div class="filter-action-txt">重置</div>';
	                        reset.classList.add('filter-reset');
	                        reset.addEventListener('click', function () {
	                            // 恢复到不限
	                            _this13.toArray(panel.querySelectorAll('.filter-sub-ul li')).forEach(function (li) {
	                                li.classList.remove('selected');
	                                if (li.classList.contains('filter-sub-li') && (!li.dataset.code || li.dataset.code === '不限')) {
	                                    li.classList.add('selected');
	                                }
	                            });

	                            // 清空已选的提示
	                            _this13.toArray(panel.querySelectorAll('.filter-title i')).forEach(function (i) {
	                                i.textContent = '';
	                            });

	                            // 收起已展开的子面板
	                            _this13.toArray(panel.querySelectorAll('.filter-sec-wrap.opend')).forEach(function (wrap) {
	                                wrap.classList.remove('opend');
	                                wrap.style.height = '0';
	                                wrap.style.display = 'none';
	                            });

	                            // 收起已展开的筛选
	                            _this13.toArray(panel.querySelectorAll('.filter-more')).forEach(function (more) {
	                                more.classList.remove('opend');
	                                var subUl = more.parentElement.nextElementSibling;
	                                subUl.style.maxHeight = '40px';
	                            });

	                            // 回到顶部
	                            ul.scrollTop = 0;

	                            // 改变tab样式
	                            document.querySelector('#filter-tab-' + index).classList.remove('selected');

	                            // 上次点击的组置空
	                            _this13.lastFocusGroup = '';

	                            // 执行回调
	                            var selected = _this13.getSelectedItems(panel);
	                            _this13.config[index].callback({
	                                selected: selected,
	                                type: FilterBar.cbEnum.clear,
	                                ext: index
	                            });
	                        });

	                        // 确认
	                        var confirm = document.createElement('div');
	                        if (!_this13.config[index].confirmHtml) {
	                            confirm.innerHTML = '<div class="filter-action-txt">确认</div>';
	                        } else {
	                            confirm.innerHTML = _this13.config[index].confirmHtml;
	                        }
	                        confirm.classList.add('filter-confirm');
	                        confirm.addEventListener('click', function () {
	                            var tab = document.querySelector('#filter-tab-' + index);
	                            var selectedItems = _this13.getSelectedItems(panel);

	                            // 将已选项放入缓存
	                            _this13.cache[index] = selectedItems;

	                            // 执行回调
	                            _this13.config[index].callback({
	                                selected: selectedItems,
	                                type: FilterBar.cbEnum.confirm,
	                                ext: index
	                            });

	                            // 隐藏面板
	                            _this13.hidePanel(true, false);

	                            // 改变tab样式
	                            if (Object.keys(selectedItems).length) {
	                                tab.classList.add('selected');
	                            } else {
	                                tab.classList.remove('selected');
	                            }
	                        });

	                        action.appendChild(reset);
	                        action.appendChild(confirm);
	                        panel.appendChild(action);
	                    }
	                };

	                var panel = void 0;
	                if (!document.querySelector('#filter-panel-' + index)) {
	                    // 不存在则创建面板
	                    panel = document.createElement('div');
	                    panel.id = 'filter-panel-' + index;
	                    panel.classList.add('filter-panel');
	                    panel.classList.add('complex');
	                    if (this.config[index].mutex) {
	                        panel.classList.add('mutex');
	                    }
	                    panel.dataset.index = index;
	                    render(panel);
	                    document.querySelector('.filter-wrap').appendChild(panel);
	                } else {
	                    panel = document.querySelector('#filter-panel-' + index);
	                    panel.innerHTML = '';
	                    render(panel);
	                }

	                // 设置面板样式
	                this.initPanelStyle(panel, index);

	                // 将已选项存入缓存
	                this.cache[index] = this.config[index].selectedData;
	            }

	            /**
	             * 重置复杂列表
	             * 
	             * @param {any} index 
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'resetComplexPanel',
	            value: function resetComplexPanel(index) {
	                var _this14 = this;

	                this.log('\u91CD\u7F6E\u590D\u6742\u9762\u677F' + index);
	                var panel = document.querySelector('#filter-panel-' + index);
	                var ul = panel.querySelector('.filter-ul');

	                // 如果本次重置的筛选数据为空，或者之前面板无数据，则完全初始化
	                if (!this.config[index].data.length || !ul) {
	                    this.renderComplexPanel(index);
	                    return;
	                }

	                // 找出原来面板哪些是展开状态
	                var opendFilters = [];
	                this.toArray(ul.querySelectorAll('.filter-more.opend')).forEach(function (more) {
	                    _this14.log(more.parentElement.parentElement);
	                    opendFilters.push(more.parentElement.parentElement.dataset.code);
	                });

	                // 创建新的筛选项元素
	                var frag = document.createDocumentFragment();

	                // 初始化复杂列表的项
	                this.initComplexPanelItems(index, frag, opendFilters);

	                // 清空原先的筛选项
	                ul.innerHTML = '';

	                // 添加新的筛选项到ul
	                ul.appendChild(frag);

	                // 如果当前面板已展开，滚动上次点击的项到可视区域
	                if (panel.classList.contains('on') && this.lastFocusGroup) {
	                    var lastClick = panel.querySelector('.filter-ul>li[data-code="' + this.lastFocusGroup + '"]');
	                    lastClick.scrollIntoView();
	                }

	                // 更新确认按钮的文字
	                var confirm = document.querySelector('#filter-panel-' + index + ' .filter-confirm');
	                if (!this.config[index].confirmHtml) {
	                    confirm.innerHTML = '<div class="filter-action-txt">确认</div>';
	                } else {
	                    confirm.innerHTML = this.config[index].confirmHtml;
	                }
	            }

	            /**
	             * 初始化复杂列表的项
	             * 
	             * @param {number} index - 筛选tab次序 
	             * @param {any} container - 生成的项放入的容器
	             * @param {array} opendFilters - 之前已展开的组
	             * @memberof FilterBar
	             */

	        }, {
	            key: 'initComplexPanelItems',
	            value: function initComplexPanelItems(index, container, opendFilters) {
	                var _this15 = this;

	                var data = this.config[index].data;
	                var selectedData = this.config[index].selectedData;
	                data.forEach(function (groupItem) {
	                    // 如果items是一个数组，说明是标准筛选列表，否则就是自定义面板
	                    if (Array.isArray(groupItem.items)) {
	                        var groupLi = document.createElement('li');
	                        groupLi.dataset.code = groupItem.groupCode;

	                        // 将"不限"过滤掉
	                        // const groupItemsRemoveEmpty = groupItem.items.filter(item => item.itemCode);

	                        // 每个分组的标题
	                        var h3 = document.createElement('h3');
	                        h3.classList.add('filter-title');

	                        var title = document.createElement('span');
	                        title.textContent = groupItem.groupName;
	                        h3.appendChild(title);

	                        // 每个分组的筛选块
	                        var subUl = document.createElement('ul');
	                        subUl.classList.add('filter-sub-ul');

	                        // 右上角显示的已选项
	                        var filterTxt = [];

	                        // 临时存放二级菜单节点的数组
	                        var secNodeList = [];

	                        groupItem.items.forEach(function (subItem, i) {
	                            if (!subItem.secItems) {
	                                // 一级列表
	                                var subLi = document.createElement('li');
	                                subLi.classList.add('filter-sub-li');
	                                subLi.dataset.code = subItem.itemCode || '';
	                                var subDiv = document.createElement('div');
	                                var subSpan = document.createElement('span');
	                                subSpan.textContent = subItem.itemName;
	                                subDiv.appendChild(subSpan);
	                                subLi.appendChild(subDiv);

	                                // 判断选中
	                                if (!selectedData[groupItem.groupCode] && !subItem.itemCode) {
	                                    subLi.classList.add('selected');
	                                } else if (selectedData[groupItem.groupCode] && selectedData[groupItem.groupCode].indexOf(subItem.itemCode) >= 0) {
	                                    subLi.classList.add('selected');
	                                    filterTxt.push(subItem.itemName);
	                                }

	                                // 绑定筛选项的点击事件
	                                subLi.addEventListener('click', function () {
	                                    var panel = document.querySelector('#filter-panel-' + index);
	                                    var tab = document.querySelector('#filter-tab-' + index);

	                                    if (!groupItem.multiFlag) {
	                                        // 单选情况
	                                        if (_this15.config[index].mutex) {
	                                            // 互斥处理，恢复面板中全部筛选到不限
	                                            _this15.toArray(document.querySelectorAll('#filter-panel-' + index + ' .filter-sub-ul .filter-sub-li')).forEach(function (li) {
	                                                if (!li.dataset.code) {
	                                                    li.classList.add('selected');
	                                                } else {
	                                                    li.classList.remove('selected');
	                                                }
	                                                li.parentElement.previousElementSibling.querySelector('i').textContent = '';
	                                            });

	                                            // 清除子面板的已选项
	                                            _this15.toArray(document.querySelectorAll('#filter-panel-' + index + ' .filter-sec-li.selected')).forEach(function (li) {
	                                                return li.classList.remove('selected');
	                                            });
	                                        }
	                                        _this15.toArray(subUl.querySelectorAll('li.selected')).forEach(function (li) {
	                                            return li.classList.remove('selected');
	                                        });
	                                        subLi.classList.add('selected');

	                                        // 右上角已选项显示
	                                        var _subTitle = '';
	                                        if (subItem.itemCode) {
	                                            _subTitle = subItem.itemName;
	                                        }
	                                        groupLi.querySelector('h3 i').textContent = _subTitle;
	                                    } else {
	                                        // 点击样式处理
	                                        _this15.handleMultiSelect(subLi, subUl);

	                                        // 右上角已选项显示
	                                        var _subTitle2 = [];
	                                        _this15.toArray(subUl.querySelectorAll('li.selected')).forEach(function (li) {
	                                            if (li.dataset.code) {
	                                                _subTitle2.push(li.querySelector('span').textContent);
	                                            }
	                                        });
	                                        groupLi.querySelector('h3 i').textContent = _subTitle2.join('、');
	                                    }

	                                    // 当前的暂选项
	                                    var selected = _this15.getSelectedItems(panel);

	                                    // 改变tab样式
	                                    if (Object.keys(selected).length || _this15.config[index].customSelected) {
	                                        tab.classList.add('selected');
	                                    } else {
	                                        tab.classList.remove('selected');
	                                    }

	                                    // 将当前点击项所在的组存入缓存，以便reset之后自动滚动到可见区域中
	                                    _this15.lastFocusGroup = groupItem.groupCode;

	                                    // 执行回调
	                                    _this15.config[index].callback({
	                                        selected: selected,
	                                        type: FilterBar.cbEnum.item,
	                                        ext: index
	                                    });
	                                });

	                                subUl.appendChild(subLi);
	                            } else {
	                                // 两级列表
	                                var _subLi = document.createElement('li');
	                                _subLi.classList.add('filter-sub-li');
	                                _subLi.dataset.code = subItem.itemCode || '';
	                                if (subItem.itemCode && subItem.itemCode !== '不限') {
	                                    // 对于有子面板的li，添加特殊类以区分
	                                    _subLi.classList.add('filter-li-haspanel');
	                                }
	                                var _subDiv = document.createElement('div');
	                                var _subSpan = document.createElement('span');
	                                _subSpan.textContent = subItem.itemName;
	                                _subDiv.appendChild(_subSpan);
	                                _subLi.appendChild(_subDiv);

	                                // 判断选中
	                                if (!selectedData[groupItem.groupCode] && (!subItem.itemCode || subItem.itemCode === '不限')) {
	                                    _subLi.classList.add('selected');
	                                }

	                                _subLi.addEventListener('click', function () {
	                                    var panel = document.querySelector('#filter-panel-' + index);
	                                    var tab = document.querySelector('#filter-tab-' + index);
	                                    var code = _subLi.dataset.code;

	                                    // 清除其余项的选中
	                                    _this15.toArray(subUl.querySelectorAll('.filter-sub-li.selected')).forEach(function (li) {
	                                        return li.classList.remove('selected');
	                                    });
	                                    // 将点击项设为已选
	                                    _subLi.classList.add('selected');

	                                    if (!code || code === '不限') {

	                                        // 收起打开的子面板
	                                        var opendPanel = subUl.querySelector('.filter-sec-wrap.opend');
	                                        if (opendPanel) {
	                                            opendPanel.classList.remove('opend');
	                                            opendPanel.style.height = '0';
	                                            setTimeout(function () {
	                                                opendPanel.style.display = 'none';
	                                            }, 200);
	                                        }

	                                        var opendUl = subUl.previousElementSibling.querySelector('.filter-more.opend');
	                                        if (!opendUl) {
	                                            // 如果组未展开
	                                            subUl.style.maxHeight = '40px';
	                                        } else {
	                                            // 组面板已展开
	                                            // 计算当前组的高度
	                                            var subLines = 1;
	                                            var liCount = subUl.querySelectorAll('.filter-sub-li').length;
	                                            if (liCount % 4 > 0) {
	                                                subLines = parseInt(liCount / 4) + 1;
	                                            } else {
	                                                subLines = liCount / 4;
	                                            }
	                                            var ulHeight = 36 * subLines + (subLines - 1) * 8;

	                                            subUl.style.maxHeight = ulHeight + 'px';
	                                        }

	                                        // 清除所有子面板的选中
	                                        _this15.toArray(subUl.querySelectorAll('.filter-sec-li.selected')).forEach(function (li) {
	                                            return li.classList.remove('selected');
	                                        });

	                                        // 清除已选提示文字
	                                        _subLi.parentElement.previousElementSibling.querySelector('i').textContent = '';

	                                        // 当前的暂选项
	                                        var selected = _this15.getSelectedItems(panel);

	                                        // 改变tab样式
	                                        if (Object.keys(selected).length || _this15.config[index].customSelected) {
	                                            tab.classList.add('selected');
	                                        } else {
	                                            tab.classList.remove('selected');
	                                        }

	                                        // 将当前点击项所在的组存入缓存，以便reset之后自动滚动到可见区域中
	                                        _this15.lastFocusGroup = groupItem.groupCode;

	                                        // 执行回调
	                                        _this15.config[index].callback({
	                                            selected: selected,
	                                            type: FilterBar.cbEnum.item,
	                                            ext: index
	                                        });
	                                    } else {
	                                        // 点击的是普通项
	                                        var secPanel = subUl.querySelector('.filter-sec-wrap[data-forcode="' + code + '"]');
	                                        if (secPanel) {
	                                            // 默认选中 不限
	                                            var secPanelBXSelected = secPanel.querySelector(".filter-sec-li.selected") ? false : true;
	                                            var secPanelBXCode = secPanel.querySelector('.filter-sec-li[data-code=""]');
	                                            if (secPanel && secPanelBXSelected && secPanelBXCode) {
	                                                secPanelBXCode.classList.add("selected");
	                                            }
	                                            if (secPanel.classList.contains('opend')) {
	                                                // 子面板在打开的情况下，组被人为收起，这里仅修改组高度
	                                                if (subUl.style.maxHeight === '40px') {
	                                                    var secLines = secPanel.dataset.lines;
	                                                    var secPanelHeight = secLines * 44 + 8;
	                                                    subUl.style.maxHeight = 52 + secPanelHeight + 'px';
	                                                    return;
	                                                }

	                                                // 隐藏
	                                                secPanel.classList.remove('opend');
	                                                secPanel.style.height = '0';

	                                                var _opendUl = subUl.previousElementSibling.querySelector('.filter-more.opend');
	                                                if (!_opendUl) {
	                                                    // 如果组未展开
	                                                    subUl.style.maxHeight = '40px';
	                                                } else {
	                                                    // 组面板已展开
	                                                    // 计算当前组的高度
	                                                    var _subLines = 1;
	                                                    var _liCount = subUl.querySelectorAll('.filter-sub-li').length;
	                                                    if (_liCount % 4 > 0) {
	                                                        _subLines = parseInt(_liCount / 4) + 1;
	                                                    } else {
	                                                        _subLines = _liCount / 4;
	                                                    }
	                                                    var _ulHeight = 36 * _subLines + (_subLines - 1) * 8;

	                                                    subUl.style.maxHeight = _ulHeight + 'px';
	                                                }
	                                                setTimeout(function () {
	                                                    // 隐藏子面板
	                                                    secPanel.style.display = 'none';
	                                                }, 200);
	                                            } else {
	                                                // 先隐藏所有子面板
	                                                _this15.toArray(subUl.querySelectorAll('.filter-sec-wrap.opend')).forEach(function (wrap) {
	                                                    wrap.classList.remove('opend');
	                                                    wrap.style.height = '0';
	                                                    wrap.style.display = 'none';
	                                                });

	                                                // 再显示对应的子面板
	                                                secPanel.classList.add('opend');
	                                                secPanel.style.display = 'block';
	                                                var _secLines = secPanel.dataset.lines;
	                                                var _secPanelHeight = _secLines * 44 + 8;
	                                                setTimeout(function () {
	                                                    // 设置子面板高度
	                                                    secPanel.style.height = _secPanelHeight + 'px';

	                                                    var opendUl = subUl.previousElementSibling.querySelector('.filter-more.opend');
	                                                    if (!opendUl) {
	                                                        // 如果组未展开
	                                                        subUl.style.maxHeight = 52 + _secPanelHeight + 'px';
	                                                    } else {
	                                                        // 组面板已展开
	                                                        // 计算当前组的高度
	                                                        var _subLines2 = 1;
	                                                        var _liCount2 = subUl.querySelectorAll('.filter-sub-li').length;
	                                                        if (_liCount2 % 4 > 0) {
	                                                            _subLines2 = parseInt(_liCount2 / 4) + 1;
	                                                        } else {
	                                                            _subLines2 = _liCount2 / 4;
	                                                        }
	                                                        var _ulHeight2 = 36 * _subLines2 + (_subLines2 - 1) * 8;

	                                                        subUl.style.maxHeight = _ulHeight2 + _secPanelHeight + 12 + 'px';
	                                                    }
	                                                }, 0);
	                                            }
	                                        }
	                                    }
	                                });

	                                subUl.appendChild(_subLi);

	                                // 生成子面板筛选
	                                var secItems = subItem.secItems;
	                                if (secItems.length) {
	                                    var wrapLi = document.createElement('li');
	                                    wrapLi.classList.add('filter-sec-wrap');
	                                    var lines = secItems.length % 4 === 0 ? secItems.length / 4 : parseInt(secItems.length / 4) + 1;
	                                    wrapLi.dataset.lines = lines;
	                                    wrapLi.dataset.forcode = subItem.itemCode || '';
	                                    var triangle = document.createElement('i');
	                                    triangle.classList.add('filter-triangle');

	                                    // 计算三角箭头的left值
	                                    var idx = i % 4;
	                                    var liWidth = (window.innerWidth - 10) / 4;
	                                    var left = liWidth * idx + (liWidth - 10) / 2 - 8;
	                                    triangle.style.left = left + 'px';
	                                    wrapLi.appendChild(triangle);
	                                    var secUl = document.createElement('ul');
	                                    secUl.classList.add('filter-sec-ul');

	                                    // 子面板列表
	                                    secItems.forEach(function (secItem, i) {
	                                        var secLi = document.createElement('li');
	                                        secLi.classList.add('filter-sec-li');
	                                        secLi.dataset.code = secItem.itemCode || '';
	                                        var secDiv = document.createElement('div');
	                                        var secSpan = document.createElement('span');
	                                        secSpan.textContent = secItem.itemName;
	                                        secDiv.appendChild(secSpan);
	                                        secLi.appendChild(secDiv);

	                                        // 判断选中
	                                        if (selectedData[groupItem.groupCode] && selectedData[groupItem.groupCode].indexOf(secItem.itemCode) >= 0) {
	                                            secLi.classList.add('selected');
	                                            var code = subItem.itemCode;
	                                            subUl.querySelector('.filter-sub-li[data-code="' + code + '"]').classList.add('selected');

	                                            // 右上角已选项显示
	                                            var _subTitle3 = '';
	                                            var itemName = secItem.itemName;
	                                            if (i === 0) {
	                                                // 第一项默认为不限
	                                                _subTitle3 = code;
	                                            } else {
	                                                _subTitle3 = code + '-' + itemName;
	                                            }
	                                            filterTxt.push(_subTitle3);
	                                        }

	                                        secLi.addEventListener('click', function () {
	                                            if (_this15.config[index].mutex) {
	                                                // 互斥处理，恢复面板中全部筛选到不限
	                                                _this15.toArray(document.querySelectorAll('#filter-panel-' + index + ' .filter-sub-ul .filter-sub-li')).forEach(function (li) {
	                                                    if (!li.dataset.code) {
	                                                        li.classList.add('selected');
	                                                    } else {
	                                                        li.classList.remove('selected');
	                                                    }
	                                                    li.parentElement.previousElementSibling.querySelector('i').textContent = '';
	                                                });
	                                            }

	                                            // 子面板中的选中调整
	                                            _this15.toArray(subUl.querySelectorAll('.filter-sec-li.selected')).forEach(function (li) {
	                                                return li.classList.remove('selected');
	                                            });
	                                            secLi.classList.add('selected');

	                                            // 父面板的选中调整
	                                            _this15.toArray(subUl.querySelectorAll('.filter-sub-li.selected')).forEach(function (li) {
	                                                return li.classList.remove('selected');
	                                            });
	                                            var forcode = wrapLi.dataset.forcode;
	                                            var parentLi = subUl.querySelector('.filter-sub-li[data-code="' + forcode + '"]');
	                                            if (parentLi) {
	                                                parentLi.classList.add('selected');
	                                            }

	                                            // 右上角已选项显示
	                                            var subTitle = '';
	                                            var itemName = secItem.itemName;
	                                            if (i === 0) {
	                                                // 第一项默认为不限
	                                                subTitle = forcode;
	                                            } else {
	                                                subTitle = forcode + '-' + itemName;
	                                            }
	                                            groupLi.querySelector('h3 i').textContent = subTitle;

	                                            var panel = document.querySelector('#filter-panel-' + index);
	                                            var tab = document.querySelector('#filter-tab-' + index);

	                                            // 当前的暂选项
	                                            var selected = _this15.getSelectedItems(panel);

	                                            // 改变tab样式
	                                            if (Object.keys(selected).length || _this15.config[index].customSelected) {
	                                                tab.classList.add('selected');
	                                            } else {
	                                                tab.classList.remove('selected');
	                                            }

	                                            // 将当前点击项所在的组存入缓存，以便reset之后自动滚动到可见区域中
	                                            _this15.lastFocusGroup = groupItem.groupCode;

	                                            // 执行回调
	                                            _this15.config[index].callback({
	                                                selected: selected,
	                                                type: FilterBar.cbEnum.item,
	                                                ext: index
	                                            });
	                                        });
	                                        secUl.appendChild(secLi);
	                                    });
	                                    wrapLi.appendChild(secUl);
	                                    secNodeList.push(wrapLi);
	                                }

	                                // 一行展示4个项，每隔4个元素就将临时存放二级菜单节点的数组中剩下的内容插入
	                                if ((i + 1) % 4 === 0) {
	                                    while (secNodeList.length) {
	                                        subUl.appendChild(secNodeList.shift());
	                                    }
	                                }
	                            }
	                        });

	                        // 如果secNodeList中依然有元素，说明是两级筛选，并且最后一行的的子面板还没有加入到subUl中
	                        if (secNodeList.length) {
	                            while (secNodeList.length) {
	                                subUl.appendChild(secNodeList.shift());
	                            }
	                        }

	                        var subTitle = document.createElement('i');
	                        subTitle.textContent = filterTxt.join('、');
	                        h3.appendChild(subTitle);

	                        groupLi.appendChild(h3);
	                        groupLi.appendChild(subUl);

	                        // 多于4个筛选项，则显示展开更多的箭头
	                        if (groupItem.items.length > 4) {
	                            var more = document.createElement('div');
	                            more.classList.add('filter-more');
	                            more.addEventListener('click', function () {
	                                if (!more.classList.contains('opend')) {
	                                    more.classList.add('opend');
	                                    var currentUl = groupLi.querySelector('.filter-sub-ul');
	                                    var scrollHeight = currentUl.scrollHeight;
	                                    currentUl.style.maxHeight = scrollHeight + 'px';
	                                } else {
	                                    more.classList.remove('opend');
	                                    var _currentUl = groupLi.querySelector('.filter-sub-ul');
	                                    _currentUl.style.maxHeight = '40px';
	                                }
	                            });

	                            // 如果之前该筛选为展开，则自动展开
	                            if (opendFilters.indexOf(groupItem.groupCode) >= 0) {
	                                more.classList.add('opend');
	                                var lines = 1;
	                                if (groupItem.items.length % 4 > 0) {
	                                    lines = parseInt(groupItem.items.length / 4) + 1;
	                                } else {
	                                    lines = groupItem.items.length / 4;
	                                }
	                                var scrollHeight = 36 * lines + (lines - 1) * 8;
	                                var currentUl = groupLi.querySelector('.filter-sub-ul');
	                                currentUl.style.maxHeight = scrollHeight + 'px';
	                            }

	                            h3.classList.add('more');
	                            h3.appendChild(more);
	                        }

	                        container.appendChild(groupLi);
	                    } else {
	                        container.appendChild(groupItem.items);
	                    }
	                });
	            }
	        }]);

	        return FilterBar;
	    }();

	    /**
	     * 回调类型
	     */


	    FilterBar.cbEnum = {
	        /**
	         * 确认
	         */
	        confirm: 'confirm',

	        /**
	         * 重置
	         */
	        clear: 'clear',

	        /**
	         * 项
	         */
	        item: 'item',

	        /**
	         * 取消
	         */
	        cancel: 'cancel'
	    };

	    /**
	     * 开启调试日志
	     */
	    FilterBar.debug = false;

	    return FilterBar;
	});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!./code.css", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!./code.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ".filter-wrap{color:#666;font-size:14px;margin:0;padding-left:0;padding-right:0;position:fixed;left:0;top:0;display:-webkit-box;display:flex;width:100%;height:45px;background-color:#fff;-webkit-box-orient:horizontal;-webkit-box-direction:normal;flex-direction:row;flex-wrap:nowrap;z-index:300}.filter-wrap,.filter-wrap *{box-sizing:border-box}.filter-wrap ul{margin:0;padding:0}.filter-wrap li,.filter-wrap ul{list-style:none}.filter-tab{-webkit-box-flex:1;flex-grow:1;flex-shrink:1;flex-basis:0%;background-color:#fff;color:#666;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;flex-wrap:nowrap;text-align:center;border-image:url(data:image/gif;base64,R0lGODlhBQAFAPABANra2v///yH5BAUHAAEALAAAAAAFAAUAAAIHhB9pGatnCgA7) 2 stretch;-webkit-border-image:url(data:image/gif;base64,R0lGODlhBQAFAPABANra2v///yH5BAUHAAEALAAAAAAFAAUAAAIHhB9pGatnCgA7) 2 stretch;border-width:0 0 1px;border-style:solid;z-index:301;position:relative}.filter-tab div{width:100%;text-align:center;display:flex;overflow:hidden}.filter-tab div,.filter-tab span{-webkit-box-pack:center;justify-content:center}.filter-tab span{display:-webkit-box;text-overflow:ellipsis;-webkit-line-clamp:1;position:relative;margin:0 15px 0 4px;line-height:45px;-webkit-box-orient:vertical}.filter-tab.selected span{color:#d30775}.filter-tab span:after{border:5px solid transparent;border-top:5px solid #666;width:0;height:0;top:21px;right:-14px;position:absolute;content:\" \";transition:all .3s}.filter-tab.filter-tab-radio span:after{border:0}.filter-tab.selected span:after{border-top-color:#d30775}.filter-tab.on span:after{-webkit-transform:translateY(-50%) rotate(180deg);transform:translateY(-50%) rotate(180deg)}.filter-mask{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,.5);z-index:1}body.filter-shown,html.filter-shown{overflow-y:hidden;height:100%}body.filter-shown .filter-mask{display:block}.filter-panel{display:none;margin:0;padding-left:0;padding-right:0;position:absolute;top:45px;left:0;width:100%;background-color:#fff;min-width:320px;overflow-x:hidden;overflow-y:auto;transition:-webkit-transform .3s ease-out;transition:transform .3s ease-out;transition:transform .3s ease-out,-webkit-transform .3s ease-out}.filter-panel ul{padding-left:10px;width:100%;overflow:auto;-webkit-overflow-scrolling:touch;overflow-scrolling:touch}.filter-panel ul li{width:100%;height:45px;line-height:45px;font-size:14px;border-image:url(data:image/gif;base64,R0lGODlhBQAFAPABANra2v///yH5BAUHAAEALAAAAAAFAAUAAAIHhB9pGatnCgA7) 2 stretch;-webkit-border-image:url(data:image/gif;base64,R0lGODlhBQAFAPABANra2v///yH5BAUHAAEALAAAAAAFAAUAAAIHhB9pGatnCgA7) 2 stretch;border-width:0 0 1px;border-style:solid;position:relative;padding-right:32px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.filter-panel ul li.selected{color:#d30775}.filter-panel ul li.selected:after{content:\"\";width:7px;height:12px;border-bottom:1px solid #d30775;border-right:1px solid #d30775;position:absolute;right:10px;top:17px;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.filter-panel.multi ul li:before{content:\"\";width:16px;height:16px;border:1px solid #aaa;border-radius:2px;position:absolute;right:8px;top:14px}.filter-panel.multi ul li.selected:before{border-color:#d30775}.filter-panel.multi ul li.selected:after{right:14px;top:16px;width:5px;height:10px}.filter-panel.complex li{padding-right:0;height:auto}.filter-panel.complex li:last-child{border-bottom:0}.filter-panel.complex li .filter-title{color:#333;font-size:14px;margin:0;font-weight:400;padding-right:10px}.filter-panel.complex li .filter-title.more{padding-right:40px}.filter-panel.complex li .filter-title span{color:#666}.filter-panel.complex li .filter-title i{color:#d30775;font-size:12px;float:right;display:block;width:150px;overflow:hidden;text-overflow:ellipsis;text-align:right;height:45px;line-height:45px;font-style:normal}.filter-panel .filter-sub-ul{overflow:hidden;padding-left:0;max-height:40px;margin-bottom:16px;transition:max-height .3s ease-out}.filter-panel .filter-sub-ul li{width:25%;float:left;font-size:12px;border:0;padding-right:0;background:#fff;z-index:2}.filter-panel .filter-sub-ul li:first-of-type div,.filter-panel .filter-sub-ul li:nth-of-type(2) div,.filter-panel .filter-sub-ul li:nth-of-type(3) div,.filter-panel .filter-sub-ul li:nth-of-type(4) div{margin-top:0}.filter-panel .filter-sub-ul li div{height:36px;margin:8px 10px 0 0;border:1px solid #f4f4f4;border-radius:3px;background:#f4f4f4}.filter-panel .filter-sub-ul li div span{display:-webkit-box;max-height:36px;line-height:18px;text-align:center;overflow:hidden;text-overflow:ellipsis;-webkit-line-clamp:2;-webkit-box-orient:vertical;white-space:normal;position:relative;top:50%;transform:translateY(-50%);-webkit-transform:translateY(-50%)}.filter-panel .filter-sub-ul li.selected div{border-color:#d30775;background:#fff}.filter-panel .filter-sub-ul li.selected:after{border:0}.filter-action{position:absolute;width:100%;bottom:0}.filter-action>div{height:48px;width:50%;float:left;text-align:center;letter-spacing:2px}.filter-action-txt{line-height:47px}.filter-reset{background:#fff;-webkit-border-image:url(data:image/gif;base64,R0lGODlhBQAFAPABANra2v///yH5BAUHAAEALAAAAAAFAAUAAAIHhB9pGatnCgA7) 2 stretch;border-width:1px 0;border-style:solid}.filter-confirm{background:#d30775;color:#fff}.filter-more{position:absolute;right:0;top:0;bottom:10px;width:40px;height:45px;background:#fff}.filter-more:after{content:\"\";border-top:1px solid #777;border-right:1px solid #777;-webkit-transform:translateY(50%) rotate(135deg);transform:translateY(50%) rotate(135deg);position:absolute;top:10px;right:15px;width:9px;height:9px;transition:all .3s}.filter-more.opend:after{-webkit-transform:translateY(50%) rotate(-45deg);transform:translateY(50%) rotate(-45deg);top:15px}.filter-nodata{text-align:center;position:relative;top:50%;transform:translateY(-50%);-webkit-transform:translateY(-50%);margin-top:-10px}.filter-panel .filter-sub-ul .filter-sec-wrap{width:100%;margin-bottom:2px;padding-right:10px;margin-top:10px;overflow:initial;z-index:1;height:0;display:none;transition:height .2s ease-out}.filter-panel .filter-sub-ul .filter-sec-wrap .filter-triangle{border-style:solid;border-width:0 8px 7px;border-color:transparent transparent #f4f4f4;position:absolute;top:-7px;left:38px}.filter-panel .filter-sub-ul .filter-sec-wrap .filter-sec-ul{width:100%;background:#f4f4f4;padding-top:8px;padding-right:5px;padding-bottom:8px}.filter-panel .filter-sub-ul .filter-sec-wrap .filter-sec-li{background:transparent}.filter-panel .filter-sub-ul .filter-sec-wrap li div{background:#fff;margin-right:5px}", ""]);

	// exports


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ })
/******/ ]);
