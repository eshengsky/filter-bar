(function (global, factory) {
    global.FilterBar = factory(global);
}(typeof window !== 'undefined' ? window : this, window => {
    /**
     * 筛选条插件类
     * 
     * @class FilterBar
     */
    class FilterBar {
        /**
         * 创建实例
         * 
         * @param {any} config 
         * @memberof FilterBar
         */
        constructor(config, doneCallback) {
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
        log(...msg) {
            if (FilterBar.debug) {
                console.log(...msg);
            }
        }

        /**
         * 将NodeList转为数组
         * 
         * @param {any} obj 
         * @memberof FilterBar
         */
        toArray(obj) {
            return Array.prototype.slice.call(obj);
        }

        /**
         * 初始化方法
         * 
         * @memberof FilterBar
         */
        init() {
            this.renderTabs();
            this.renderPanels();
            this.renderMask();
        }

        /**
         * 渲染Tabs元素
         * 
         * @memberof FilterBar
         */
        renderTabs() {
            this.log('渲染Tabs');
            const wrap = document.createElement('div');
            wrap.classList.add('filter-wrap');
            this.config.forEach(({ data, tabName, selectedData, customSelected, callback }, index) => {
                const tab = document.createElement('div');
                tab.id = `filter-tab-${index}`;
                tab.classList.add('filter-tab');

                // 无展开面板的形式
                if (typeof data === 'undefined') {
                    tab.classList.add('filter-tab-radio');
                }
                tab.addEventListener('click', () => {
                    if (typeof data !== 'undefined') {
                        // 切换显示普通列表
                        if (tab.classList.contains('on')) {
                            this.hidePanel();
                        } else {
                            this.showPanel(index);
                        }
                    } else {
                        // 该tab被认为是单击切换选中
                        tab.classList.toggle('selected');
                        this.hidePanel();
                        callback({
                            selected: tab.classList.contains('selected'),
                            type: FilterBar.cbEnum.confirm,
                            ext: index
                        });
                    }
                });
                tab.innerHTML = `<div><span>${tabName}</span></div>`;

                let hasSelected = false;

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
                } else if (typeof selectedData === 'object') {
                    if (Object.keys(selectedData).length) {
                        hasSelected = true;
                    }
                }
                this.log(`renderTabs - hasSelected=${hasSelected}`);

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
                const frag = document.createDocumentFragment();
                this.toArray(wrap.querySelectorAll('.filter-tab')).forEach(tab => frag.appendChild(tab));

                // 原有的tab全部移除
                this.toArray(document.querySelectorAll('.filter-wrap .filter-tab')).forEach(tab => tab.remove());

                // 添加新的tab
                document.querySelector('.filter-wrap').appendChild(frag);

                // 原有的面板全部移除
                this.toArray(document.querySelectorAll('.filter-panel')).forEach(panel => panel.remove());
            }
        }

        /**
         * 渲染下拉面板
         * 
         * @memberof FilterBar
         */
        renderPanels() {
            this.log('渲染Panels');
            this.config.forEach(({ data }, index) => {
                if (typeof data !== 'undefined') {
                    // 弹出列表的形式
                    if (data[0] && data[0].groupCode) {
                        // 多列筛选
                        this.renderComplexPanel(index);
                    } else {
                        if (this.config[index].multi) {
                            // 单列多选
                            this.renderSinglePanel2(index);
                        } else {
                            // 单列单选
                            this.renderSinglePanel1(index);
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
        reset(params) {
            if (params.type === FilterBar.cbEnum.confirm) {
                // 如果是通过点击确定进行的重置，则更新全部面板
                this.log('reset所有面板');
                this.config = params.config;
                this.config.forEach((conf, index) => {
                    this.resetOnePanel(conf, index);

                    // 设置面板样式
                    const panel = document.querySelector(`#filter-panel-${index}`);
                    this.initPanelStyle(panel, index);
                });
            } else {
                // 否则仅更新所操作的面板
                this.log(`仅reset第${params.ext}个面板`);
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
        resetOnePanel(conf, index) {
            this.log(`开始reset面板${index}`);
            const data = conf.data,
                selectedData = conf.selectedData,
                customSelected = conf.customSelected;

            // 重新确定tab是否高亮
            let hasSelected = false;
            const tab = document.querySelector(`#filter-tab-${index}`);

            // 判断是否已有选中
            if (typeof selectedData === 'string') {
                if (selectedData) {
                    hasSelected = true;
                }
            } else if (Array.isArray(selectedData)) {
                if (selectedData.length) {
                    hasSelected = true;
                }
            } else if (typeof selectedData === 'object') {
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
        calculateHeight(index) {
            let height = 0;
            const panel = document.querySelector(`#filter-panel-${index}`);

            // 根据屏幕的高度，设置一个最大高度，以尽可能多的展示内容
            const maxHeight = window.innerHeight - document.querySelector('.filter-wrap').offsetTop - 45 - 90;
            if (panel.classList.contains('complex')) {
                // 复杂面板，高度定死，使用最大高度
                height = maxHeight;
            } else if (panel.classList.contains('multi')) {
                // 多选面板
                const lines = this.config[index].data.length;
                if (lines) {
                    height = (lines * 45) + 47;
                } else {
                    height = 137;
                }
                if (height > maxHeight) {
                    height = maxHeight;
                }
            } else {
                // 单列单选面板
                const lines = this.config[index].data.length;
                if (lines) {
                    height = lines * 45;
                } else {
                    height = 137;
                }
                if (height > maxHeight) {
                    height = maxHeight;
                }
            }
            this.log(`计算得到面板固定高度为${height}px`);
            return height;
        }

        /**
         * 初始化面板样式
         * 
         * @param {any} panel 
         * @param {any} index 
         * @memberof FilterBar
         */
        initPanelStyle(panel, index) {
            const data = this.config[index].data;
            const height = this.calculateHeight(index);
            panel.style.height = `${height}px`;
            panel.style.transform = `translate3d(0px, -${height + 1}px, 0px)`;
            panel.style.webkitTransform = `translate3d(0px, -${height + 1}px, 0px)`;
            let ul;
            if (data[0] && data[0].groupCode) {
                // 多列筛选
                ul = panel.querySelector('.filter-ul');
            } else if (this.config[index].multi) {
                // 单列多选
                ul = panel.querySelector('ul');
            }

            if (ul) {
                ul.style.height = `${height - 47}px`;
            }
        }

        /**
         * 渲染蒙层
         * 
         * @memberof FilterBar
         */
        renderMask() {
            this.log('渲染蒙层');
            const mask = document.querySelector('.filter-mask');
            if (!mask) {
                const mask = document.createElement('div');
                mask.classList.add('filter-mask');
                mask.addEventListener('click', () => {
                    this.hidePanel();
                });
                document.body.appendChild(mask);
            }
        }

        /**
         * 显示面板
         * 
         * @param {number} index - tab的次序
         * @memberof FilterBar
         */
        showPanel(index) {
            this.log(`显示面板${index}`);
            const panel = document.querySelector(`#filter-panel-${index}`);
            const opendPanel = document.querySelector('.filter-panel.on');

            // 如果当前已有打开的面板，则先隐藏
            if (opendPanel) {
                this.hidePanel(false);
            }

            panel.classList.add('on');
            panel.style.display = 'block';
            setTimeout(() => {
                panel.style.transform = 'translate3d(0, 0, 0)';
                panel.style.webkitTransform = 'translate3d(0, 0, 0)';
            }, 0);

            const tab = document.querySelector(`#filter-tab-${index}`);
            tab.classList.add('on');

            // 禁止屏幕滚动
            document.documentElement.classList.add('filter-shown');
            document.body.classList.add('filter-shown');
            setTimeout(() => {
                this.log('重新启用面板动画');
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
        hidePanel(animate = true, cb = true) {
            this.log('隐藏面板');
            const opendPanel = document.querySelector('.filter-panel.on');
            if (opendPanel) {
                const opendPanelHeight = parseInt(opendPanel.style.height.split("px")[0]);
                const opendIndex = opendPanel.dataset.index;
                const opendTab = document.querySelector(`#filter-tab-${opendIndex}`);
                if (!animate) {
                    this.log('停用面板动画');
                    opendPanel.style.transitionDuration = '0s';
                    opendPanel.style.webkitTransitionDuration = '0s';
                }
                opendPanel.style.transform = `translate3d(0, -${opendPanelHeight + 1}px, 0)`;
                opendPanel.style.webkitTransform = `translate3d(0, -${opendPanelHeight + 1}px, 0)`;
                opendPanel.classList.remove('on');
                opendTab.classList.remove('on');

                // 开启屏幕滚动
                document.documentElement.classList.remove('filter-shown');
                document.body.classList.remove('filter-shown');

                // 如果没有数据则直接退出
                const data = this.config[opendIndex].data;
                if (Array.isArray(data) && data.length === 0) {
                    return;
                }

                // 收起之后，隐藏面板，并从缓存中恢复已选项，覆盖暂选项
                if (!animate) {
                    // opendPanel.style.display = 'none';
                    this.restoreFilter(opendIndex, cb);
                } else {
                    setTimeout(() => {
                        // opendPanel.style.display = 'none';
                        this.restoreFilter(opendIndex, cb);
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
        restoreFilter(index, cb) {
            this.log(`清除临时选择的数据，恢复面板${index}的上次已确认数据`, this.cache[index]);
            const selected = this.cache[index];
            const tab = document.querySelector(`#filter-tab-${index}`);
            if (Array.isArray(selected)) {
                // 单列多选
                const lis = document.querySelectorAll(`#filter-panel-${index} li`);
                this.toArray(lis).forEach(li => {
                    const code = li.dataset.code;
                    if (selected.indexOf(code) >= 0 || (selected.length === 0 && !code)) {
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
                const ul = document.querySelector(`#filter-panel-${index} ul`);
                if (ul) {
                    ul.scrollTop = 0;
                }
            } else if (typeof selected === 'object') {
                // 多列
                const panel = document.querySelectorAll(`#filter-panel-${index} .filter-ul>li`);
                this.toArray(panel).forEach(groupLi => {
                    const filterTxt = [];
                    const groupCode = groupLi.dataset.code;
                    this.toArray(groupLi.querySelectorAll('.filter-sub-ul li')).forEach(subLi => {
                        if (!selected[groupCode] && (!subLi.dataset.code || subLi.dataset.code === '不限') && !subLi.classList.contains('filter-sec-wrap')) {
                            subLi.classList.add('selected');
                        } else if (selected[groupCode] && selected[groupCode].indexOf(subLi.dataset.code) >= 0) {
                            subLi.classList.add('selected');
                            if (!subLi.classList.contains('filter-sec-li')) {
                                // 普通li
                                filterTxt.push(subLi.querySelector('span').textContent);
                            } else {
                                // 子面板的li
                                const forcode = subLi.parentElement.parentElement.dataset.forcode;
                                groupLi.querySelector(`.filter-sub-li[data-code="${forcode}"]`).classList.add('selected');
                                let subTitle = '';
                                const itemName = subLi.querySelector('span').textContent;
                                if (itemName === '不限') {
                                    // 第一项默认为不限
                                    subTitle = forcode;
                                } else {
                                    subTitle = `${forcode}-${itemName}`;
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
                this.toArray(document.querySelectorAll(`#filter-panel-${index} .filter-more.opend`)).forEach(more => {
                    more.classList.remove('opend');
                    const subUl = more.parentElement.nextElementSibling;
                    subUl.style.maxHeight = '40px';
                });

                // 回到顶部
                const ul = document.querySelector(`#filter-panel-${index} .filter-ul`);
                if (ul) {
                    ul.scrollTop = 0;
                }

                // 上次点击的组置空
                this.lastFocusGroup = '';
            }

            // 执行回调
            if (cb) {
                this.config[index].callback({
                    selected,
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
        renderSinglePanel1(index) {
            this.log(`初始化单选面板${index}`);
            const render = panel => {
                if (!this.config[index].data.length) {
                    // 如果不存在筛选
                    panel.innerHTML = this.emptyHtml;
                } else {
                    const ul = document.createElement('ul');

                    // 初始化单列单选列表的项
                    this.initSinglePanel1Items(index, ul);

                    panel.appendChild(ul);
                }
            };

            let panel;
            if (!document.querySelector(`#filter-panel-${index}`)) {
                // 不存在则创建面板
                panel = document.createElement('div');
                panel.id = `filter-panel-${index}`;
                panel.classList.add('filter-panel');
                panel.dataset.index = index;
                render(panel);
                document.querySelector('.filter-wrap').appendChild(panel);
            } else {
                panel = document.querySelector(`#filter-panel-${index}`);
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
        resetSinglePanel1(index) {
            this.log(`重置单选面板${index}`);
            const ul = document.querySelector(`#filter-panel-${index} ul`);

            // 如果本次重置的筛选数据为空，或者之前面板无数据，则完全初始化
            if (!this.config[index].data.length || !ul) {
                this.renderSinglePanel1(index);
                return;
            }

            // 创建新的筛选项元素
            const frag = document.createDocumentFragment();

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
        initSinglePanel1Items(index, container) {
            const data = this.config[index].data;
            const selectedData = this.config[index].selectedData;
            data.forEach(item => {
                const li = document.createElement('li');
                li.dataset.code = item.itemCode;
                li.textContent = item.itemName;

                // 处理选中状态
                if (item.itemCode === String(selectedData)) {
                    li.classList.add('selected');

                    // 替换tab文字
                    if (this.config[index].replace) {
                        const tab = document.querySelector(`#filter-tab-${index}`);
                        if ((!item.itemCode || item.itemCode === '不限') && !this.config[index].replaceDefault) {
                            // 不限的情况，若replaceDefault=false，则不替换
                            tab.querySelector('span').textContent = this.config[index].tabName;
                        } else {
                            // 用已选项替换tab文字
                            tab.querySelector('span').textContent = item.itemName;
                        }
                    }
                }

                // 绑定筛选项的点击事件
                li.addEventListener('click', () => {
                    const tab = document.querySelector(`#filter-tab-${index}`);
                    const panel = document.querySelector(`#filter-panel-${index}`);

                    // 调整选中状态
                    const selected = panel.querySelector('li.selected');
                    if (selected) {
                        selected.classList.remove('selected');
                    }
                    li.classList.add('selected');

                    // 已选项放入缓存
                    this.cache[index] = item.itemCode;

                    // 执行回调函数
                    this.config[index].callback({
                        selected: item.itemCode,
                        type: FilterBar.cbEnum.confirm,
                        ext: index
                    });

                    // 隐藏面板
                    this.hidePanel(true, false);

                    // 改变tab样式
                    if (item.itemCode) {
                        tab.classList.add('selected');
                    } else {
                        tab.classList.remove('selected');
                    }

                    // 修改tab文字
                    if (this.config[index].replace) {
                        if ((!item.itemCode || item.itemCode === '不限') && !this.config[index].replaceDefault) {
                            // 不限的情况，若replaceDefault=false，则不替换
                            tab.querySelector('span').textContent = this.config[index].tabName;
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
        getSelectedItems(panel) {
            if (panel.classList.contains('multi')) {
                // 多选面板
                const liSelected = panel.querySelectorAll('li.selected');
                const selectedItems = [];
                this.toArray(liSelected).forEach(li => {
                    const code = li.dataset.code;
                    if (code) {
                        selectedItems.push(code);
                    }
                });
                return selectedItems;
            }

            // 复杂面板
            const result = {};
            const ul = panel.querySelectorAll('.filter-ul>li');
            this.toArray(ul).forEach(li => {
                const selectedItems = [];
                const items = li.querySelectorAll('.filter-sub-ul li');
                this.toArray(items).forEach(item => {
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
        handleMultiSelect(li, panel) {
            const isDefaultItem = !li.dataset.code;
            if (isDefaultItem) {
                if (!li.classList.contains('selected')) {
                    this.toArray(panel.querySelectorAll('li.selected')).forEach(li => li.classList.remove('selected'));
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
        renderSinglePanel2(index) {
            this.log(`初始化多选面板${index}`);
            const render = panel => {
                if (!this.config[index].data.length) {
                    // 如果不存在筛选
                    panel.innerHTML = this.emptyHtml;
                } else {
                    const ul = document.createElement('ul');

                    // 初始化单列多选列表的项
                    this.initSinglePanel2Items(index, ul);

                    panel.appendChild(ul);

                    // 操作面板
                    const action = document.createElement('div');
                    action.classList.add('filter-action');

                    // 重置
                    const reset = document.createElement('div');
                    reset.innerHTML = '<div class="filter-action-txt">重置</div>';
                    reset.classList.add('filter-reset');
                    reset.addEventListener('click', () => {
                        // 恢复到不限
                        this.toArray(panel.querySelectorAll('li.selected')).forEach(li => li.classList.remove('selected'));
                        panel.querySelector('li').classList.add('selected');

                        // 回到顶部
                        ul.scrollTop = 0;

                        // 改变tab样式
                        document.querySelector(`#filter-tab-${index}`).classList.remove('selected');

                        // 执行回调
                        const selected = this.getSelectedItems(panel);
                        this.config[index].callback({
                            selected,
                            type: FilterBar.cbEnum.clear,
                            ext: index
                        });
                    });

                    // 确认
                    const confirm = document.createElement('div');
                    if (!this.config[index].confirmHtml) {
                        confirm.innerHTML = '<div class="filter-action-txt">确认</div>';
                    } else {
                        confirm.innerHTML = this.config[index].confirmHtml;
                    }
                    confirm.classList.add('filter-confirm');
                    confirm.addEventListener('click', () => {
                        const tab = document.querySelector(`#filter-tab-${index}`);
                        const selectedItems = this.getSelectedItems(panel);

                        // 将已选项放入缓存
                        this.cache[index] = selectedItems;

                        // 执行回调
                        this.config[index].callback({
                            selected: selectedItems,
                            type: FilterBar.cbEnum.confirm,
                            ext: index
                        });

                        // 隐藏面板
                        this.hidePanel(true, false);

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

            let panel;
            if (!document.querySelector(`#filter-panel-${index}`)) {
                // 不存在则创建面板
                panel = document.createElement('div');
                panel.id = `filter-panel-${index}`;
                panel.classList.add('filter-panel');
                panel.classList.add('multi');
                panel.dataset.index = index;
                render(panel);
                document.querySelector('.filter-wrap').appendChild(panel);
            } else {
                panel = document.querySelector(`#filter-panel-${index}`);
                panel.innerHTML = '';
                render(panel);
            }

            // 设置面板样式
            this.initPanelStyle(panel, index);

            // 将已选项存入缓存
            this.cache[index] = this.config[index].selectedData;
        }

        resetSinglePanel2(index) {
            this.log(`重置多选面板${index}`);
            const ul = document.querySelector(`#filter-panel-${index} ul`);

            // 如果本次重置的筛选数据为空，或者之前面板无数据，则完全初始化
            if (!this.config[index].data.length || !ul) {
                this.renderSinglePanel2(index);
                return;
            }

            // 创建新的筛选项元素
            const frag = document.createDocumentFragment();

            // 初始化单列多选列表的项
            this.initSinglePanel2Items(index, frag);

            // 清空原先的筛选项
            ul.innerHTML = '';

            // 添加新的筛选项到ul
            ul.appendChild(frag);

            // 更新确认按钮的文字
            const confirm = document.querySelector(`#filter-panel-${index} .filter-confirm`);
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
        initSinglePanel2Items(index, container) {
            const data = this.config[index].data;
            const selectedData = this.config[index].selectedData;
            data.forEach(item => {
                const li = document.createElement('li');
                li.dataset.code = item.itemCode;
                li.textContent = item.itemName;

                // 处理选中状态
                if (selectedData.length === 0 && !item.itemCode) {
                    li.classList.add('selected');
                } else if (selectedData.indexOf(item.itemCode) >= 0) {
                    li.classList.add('selected');
                }

                // 绑定筛选项的点击事件
                li.addEventListener('click', () => {
                    const tab = document.querySelector(`#filter-tab-${index}`);
                    const panel = document.querySelector(`#filter-panel-${index}`);

                    // 调整选中状态
                    this.handleMultiSelect(li, panel);

                    // 当前的暂选项
                    const selected = this.getSelectedItems(panel);

                    // 改变tab样式
                    if (selected.length) {
                        tab.classList.add('selected');
                    } else {
                        tab.classList.remove('selected');
                    }

                    // 执行回调
                    this.config[index].callback({
                        selected,
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
        renderComplexPanel(index) {
            this.log(`初始化复杂面板${index}`);
            const render = panel => {
                if (!this.config[index].data.length) {
                    // 如果不存在筛选
                    panel.innerHTML = this.emptyHtml;
                } else {
                    const ul = document.createElement('ul');
                    ul.classList.add('filter-ul');

                    // 初始化复杂列表的项
                    this.initComplexPanelItems(index, ul, []);

                    panel.appendChild(ul);

                    // 操作面板
                    const action = document.createElement('div');
                    action.classList.add('filter-action');

                    // 重置
                    const reset = document.createElement('div');
                    reset.innerHTML = '<div class="filter-action-txt">重置</div>';
                    reset.classList.add('filter-reset');
                    reset.addEventListener('click', () => {
                        // 恢复到不限
                        this.toArray(panel.querySelectorAll('.filter-sub-ul li')).forEach(li => {
                            li.classList.remove('selected');
                            if (li.classList.contains('filter-sub-li') && (!li.dataset.code || li.dataset.code === '不限')) {
                                li.classList.add('selected');
                            }
                        });

                        // 清空已选的提示
                        this.toArray(panel.querySelectorAll('.filter-title i')).forEach(i => {
                            i.textContent = '';
                        });

                        // 收起已展开的子面板
                        this.toArray(panel.querySelectorAll('.filter-sec-wrap.opend')).forEach(wrap => {
                            wrap.classList.remove('opend');
                            wrap.style.height = '0';
                            wrap.style.display = 'none';
                        });

                        // 收起已展开的筛选
                        this.toArray(panel.querySelectorAll('.filter-more')).forEach(more => {
                            more.classList.remove('opend');
                            const subUl = more.parentElement.nextElementSibling;
                            subUl.style.maxHeight = '40px';
                        });

                        // 回到顶部
                        ul.scrollTop = 0;

                        // 改变tab样式
                        document.querySelector(`#filter-tab-${index}`).classList.remove('selected');

                        // 上次点击的组置空
                        this.lastFocusGroup = '';

                        // 执行回调
                        const selected = this.getSelectedItems(panel);
                        this.config[index].callback({
                            selected,
                            type: FilterBar.cbEnum.clear,
                            ext: index
                        });
                    });

                    // 确认
                    const confirm = document.createElement('div');
                    if (!this.config[index].confirmHtml) {
                        confirm.innerHTML = '<div class="filter-action-txt">确认</div>';
                    } else {
                        confirm.innerHTML = this.config[index].confirmHtml;
                    }
                    confirm.classList.add('filter-confirm');
                    confirm.addEventListener('click', () => {
                        const tab = document.querySelector(`#filter-tab-${index}`);
                        const selectedItems = this.getSelectedItems(panel);

                        // 将已选项放入缓存
                        this.cache[index] = selectedItems;

                        // 执行回调
                        this.config[index].callback({
                            selected: selectedItems,
                            type: FilterBar.cbEnum.confirm,
                            ext: index
                        });

                        // 隐藏面板
                        this.hidePanel(true, false);

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

            let panel;
            if (!document.querySelector(`#filter-panel-${index}`)) {
                // 不存在则创建面板
                panel = document.createElement('div');
                panel.id = `filter-panel-${index}`;
                panel.classList.add('filter-panel');
                panel.classList.add('complex');
                if (this.config[index].mutex) {
                    panel.classList.add('mutex');
                }
                panel.dataset.index = index;
                render(panel);
                document.querySelector('.filter-wrap').appendChild(panel);
            } else {
                panel = document.querySelector(`#filter-panel-${index}`);
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
        resetComplexPanel(index) {
            this.log(`重置复杂面板${index}`);
            const panel = document.querySelector(`#filter-panel-${index}`);
            const ul = panel.querySelector('.filter-ul');

            // 如果本次重置的筛选数据为空，或者之前面板无数据，则完全初始化
            if (!this.config[index].data.length || !ul) {
                this.renderComplexPanel(index);
                return;
            }

            // 找出原来面板哪些是展开状态
            const opendFilters = [];
            this.toArray(ul.querySelectorAll('.filter-more.opend')).forEach(more => {
                this.log(more.parentElement.parentElement);
                opendFilters.push(more.parentElement.parentElement.dataset.code);
            });

            // 创建新的筛选项元素
            const frag = document.createDocumentFragment();

            // 初始化复杂列表的项
            this.initComplexPanelItems(index, frag, opendFilters);

            // 清空原先的筛选项
            ul.innerHTML = '';

            // 添加新的筛选项到ul
            ul.appendChild(frag);

            // 如果当前面板已展开，滚动上次点击的项到可视区域
            if (panel.classList.contains('on') && this.lastFocusGroup) {
                const lastClick = panel.querySelector(`.filter-ul>li[data-code="${this.lastFocusGroup}"]`);
                lastClick.scrollIntoView();
            }

            // 更新确认按钮的文字
            const confirm = document.querySelector(`#filter-panel-${index} .filter-confirm`);
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
        initComplexPanelItems(index, container, opendFilters) {
            const data = this.config[index].data;
            const selectedData = this.config[index].selectedData;
            data.forEach(groupItem => {
                // 如果items是一个数组，说明是标准筛选列表，否则就是自定义面板
                if (Array.isArray(groupItem.items)) {
                    const groupLi = document.createElement('li');
                    groupLi.dataset.code = groupItem.groupCode;

                    // 将"不限"过滤掉
                    // const groupItemsRemoveEmpty = groupItem.items.filter(item => item.itemCode);

                    // 每个分组的标题
                    const h3 = document.createElement('h3');
                    h3.classList.add('filter-title');

                    const title = document.createElement('span');
                    title.textContent = groupItem.groupName;
                    h3.appendChild(title);

                    // 每个分组的筛选块
                    const subUl = document.createElement('ul');
                    subUl.classList.add('filter-sub-ul');

                    // 右上角显示的已选项
                    const filterTxt = [];

                    // 临时存放二级菜单节点的数组
                    const secNodeList = [];

                    groupItem.items.forEach((subItem, i) => {
                        if (!subItem.secItems) {
                            // 一级列表
                            const subLi = document.createElement('li');
                            subLi.classList.add('filter-sub-li');
                            subLi.dataset.code = subItem.itemCode || '';
                            const subDiv = document.createElement('div');
                            const subSpan = document.createElement('span');
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
                            subLi.addEventListener('click', () => {
                                const panel = document.querySelector(`#filter-panel-${index}`);
                                const tab = document.querySelector(`#filter-tab-${index}`);

                                if (!groupItem.multiFlag) {
                                    // 单选情况
                                    if (this.config[index].mutex) {
                                        // 互斥处理，恢复面板中全部筛选到不限
                                        this.toArray(document.querySelectorAll(`#filter-panel-${index} .filter-sub-ul .filter-sub-li`)).forEach(li => {
                                            if (!li.dataset.code) {
                                                li.classList.add('selected');
                                            } else {
                                                li.classList.remove('selected');
                                            }
                                            li.parentElement.previousElementSibling.querySelector('i').textContent = '';
                                        });

                                        // 清除子面板的已选项
                                        this.toArray(document.querySelectorAll(`#filter-panel-${index} .filter-sec-li.selected`)).forEach(li => li.classList.remove('selected'));
                                    }
                                    this.toArray(subUl.querySelectorAll('li.selected')).forEach(li => li.classList.remove('selected'));
                                    subLi.classList.add('selected');

                                    // 右上角已选项显示
                                    let subTitle = '';
                                    if (subItem.itemCode) {
                                        subTitle = subItem.itemName;
                                    }
                                    groupLi.querySelector('h3 i').textContent = subTitle;
                                } else {
                                    // 点击样式处理
                                    this.handleMultiSelect(subLi, subUl);

                                    // 右上角已选项显示
                                    const subTitle = [];
                                    this.toArray(subUl.querySelectorAll('li.selected')).forEach(li => {
                                        if (li.dataset.code) {
                                            subTitle.push(li.querySelector('span').textContent);
                                        }
                                    });
                                    groupLi.querySelector('h3 i').textContent = subTitle.join('、');
                                }

                                // 当前的暂选项
                                const selected = this.getSelectedItems(panel);

                                // 改变tab样式
                                if (Object.keys(selected).length || this.config[index].customSelected) {
                                    tab.classList.add('selected');
                                } else {
                                    tab.classList.remove('selected');
                                }

                                // 将当前点击项所在的组存入缓存，以便reset之后自动滚动到可见区域中
                                this.lastFocusGroup = groupItem.groupCode;

                                // 执行回调
                                this.config[index].callback({
                                    selected,
                                    type: FilterBar.cbEnum.item,
                                    ext: index
                                });
                            });

                            subUl.appendChild(subLi);
                        } else {
                            // 两级列表
                            const subLi = document.createElement('li');
                            subLi.classList.add('filter-sub-li');
                            subLi.dataset.code = subItem.itemCode || '';
                            if (subItem.itemCode && subItem.itemCode !== '不限') {
                                // 对于有子面板的li，添加特殊类以区分
                                subLi.classList.add('filter-li-haspanel');
                            }
                            const subDiv = document.createElement('div');
                            const subSpan = document.createElement('span');
                            subSpan.textContent = subItem.itemName;
                            subDiv.appendChild(subSpan);
                            subLi.appendChild(subDiv);

                            // 判断选中
                            if (!selectedData[groupItem.groupCode] && (!subItem.itemCode || subItem.itemCode === '不限')) {
                                subLi.classList.add('selected');
                            }

                            subLi.addEventListener('click', () => {
                                const panel = document.querySelector(`#filter-panel-${index}`);
                                const tab = document.querySelector(`#filter-tab-${index}`);
                                const code = subLi.dataset.code;

                                // 清除其余项的选中
                                this.toArray(subUl.querySelectorAll('.filter-sub-li.selected')).forEach(li => li.classList.remove('selected'));
                                // 将点击项设为已选
                                subLi.classList.add('selected');
                                
                                if (!code || code === '不限') {

                                    // 收起打开的子面板
                                    const opendPanel = subUl.querySelector('.filter-sec-wrap.opend');
                                    if (opendPanel) {
                                        opendPanel.classList.remove('opend');
                                        opendPanel.style.height = '0';
                                        setTimeout(() => {
                                            opendPanel.style.display = 'none';
                                        }, 200);
                                    }

                                    const opendUl = subUl.previousElementSibling.querySelector('.filter-more.opend');
                                    if (!opendUl) {
                                        // 如果组未展开
                                        subUl.style.maxHeight = '40px';
                                    } else {
                                        // 组面板已展开
                                        // 计算当前组的高度
                                        let subLines = 1;
                                        const liCount = subUl.querySelectorAll('.filter-sub-li').length;
                                        if (liCount % 4 > 0) {
                                            subLines = parseInt(liCount / 4) + 1;
                                        } else {
                                            subLines = liCount / 4;
                                        }
                                        const ulHeight = (36 * subLines) + ((subLines - 1) * 8);

                                        subUl.style.maxHeight = `${ulHeight}px`;
                                    }

                                    // 清除所有子面板的选中
                                    this.toArray(subUl.querySelectorAll('.filter-sec-li.selected')).forEach(li => li.classList.remove('selected'));

                                    // 清除已选提示文字
                                    subLi.parentElement.previousElementSibling.querySelector('i').textContent = '';

                                    // 当前的暂选项
                                    const selected = this.getSelectedItems(panel);

                                    // 改变tab样式
                                    if (Object.keys(selected).length || this.config[index].customSelected) {
                                        tab.classList.add('selected');
                                    } else {
                                        tab.classList.remove('selected');
                                    }

                                    // 将当前点击项所在的组存入缓存，以便reset之后自动滚动到可见区域中
                                    this.lastFocusGroup = groupItem.groupCode;

                                    // 执行回调
                                    this.config[index].callback({
                                        selected,
                                        type: FilterBar.cbEnum.item,
                                        ext: index
                                    });
                                } else {
                                    // 点击的是普通项
                                    const secPanel = subUl.querySelector(`.filter-sec-wrap[data-forcode="${code}"]`);
                                    if (secPanel) {
                                        // 默认选中 不限
                                        const secPanelBXSelected = secPanel.querySelector(".filter-sec-li.selected")?false:true;
                                        const secPanelBXCode = secPanel.querySelector(`.filter-sec-li[data-code=""]`);
                                        if(secPanel && secPanelBXSelected && secPanelBXCode){
                                            secPanelBXCode.classList.add("selected");
                                        }
                                        if (secPanel.classList.contains('opend')) {
                                            // 子面板在打开的情况下，组被人为收起，这里仅修改组高度
                                            if (subUl.style.maxHeight === '40px') {
                                                const secLines = secPanel.dataset.lines;
                                                const secPanelHeight = (secLines * 44) + 8;
                                                subUl.style.maxHeight = `${52 + secPanelHeight}px`;
                                                return;
                                            }

                                            // 隐藏
                                            secPanel.classList.remove('opend');
                                            secPanel.style.height = '0';

                                            const opendUl = subUl.previousElementSibling.querySelector('.filter-more.opend');
                                            if (!opendUl) {
                                                // 如果组未展开
                                                subUl.style.maxHeight = '40px';
                                            } else {
                                                // 组面板已展开
                                                // 计算当前组的高度
                                                let subLines = 1;
                                                const liCount = subUl.querySelectorAll('.filter-sub-li').length;
                                                if (liCount % 4 > 0) {
                                                    subLines = parseInt(liCount / 4) + 1;
                                                } else {
                                                    subLines = liCount / 4;
                                                }
                                                const ulHeight = (36 * subLines) + ((subLines - 1) * 8);

                                                subUl.style.maxHeight = `${ulHeight}px`;
                                            }
                                            setTimeout(() => {
                                                // 隐藏子面板
                                                secPanel.style.display = 'none';
                                            }, 200);
                                        } else {
                                            // 先隐藏所有子面板
                                            this.toArray(subUl.querySelectorAll('.filter-sec-wrap.opend')).forEach(wrap => {
                                                wrap.classList.remove('opend');
                                                wrap.style.height = '0';
                                                wrap.style.display = 'none';
                                            });

                                            // 再显示对应的子面板
                                            secPanel.classList.add('opend');
                                            secPanel.style.display = 'block';
                                            const secLines = secPanel.dataset.lines;
                                            const secPanelHeight = (secLines * 44) + 8;
                                            setTimeout(() => {
                                                // 设置子面板高度
                                                secPanel.style.height = `${secPanelHeight}px`;

                                                const opendUl = subUl.previousElementSibling.querySelector('.filter-more.opend');
                                                if (!opendUl) {
                                                    // 如果组未展开
                                                    subUl.style.maxHeight = `${52 + secPanelHeight}px`;
                                                } else {
                                                    // 组面板已展开
                                                    // 计算当前组的高度
                                                    let subLines = 1;
                                                    const liCount = subUl.querySelectorAll('.filter-sub-li').length;
                                                    if (liCount % 4 > 0) {
                                                        subLines = parseInt(liCount / 4) + 1;
                                                    } else {
                                                        subLines = liCount / 4;
                                                    }
                                                    const ulHeight = (36 * subLines) + ((subLines - 1) * 8);

                                                    subUl.style.maxHeight = `${ulHeight + secPanelHeight + 12}px`;
                                                }
                                            }, 0);
                                        }
                                    }
                                }
                            });

                            subUl.appendChild(subLi);

                            // 生成子面板筛选
                            const secItems = subItem.secItems;
                            if (secItems.length) {
                                const wrapLi = document.createElement('li');
                                wrapLi.classList.add('filter-sec-wrap');
                                const lines = secItems.length % 4 === 0 ? secItems.length / 4 : parseInt(secItems.length / 4) + 1;
                                wrapLi.dataset.lines = lines;
                                wrapLi.dataset.forcode = subItem.itemCode || '';
                                const triangle = document.createElement('i');
                                triangle.classList.add('filter-triangle');

                                // 计算三角箭头的left值
                                const idx = i % 4;
                                const liWidth = (window.innerWidth - 10) / 4;
                                const left = (liWidth * idx) + ((liWidth - 10) / 2) - 8;
                                triangle.style.left = `${left}px`;
                                wrapLi.appendChild(triangle);
                                const secUl = document.createElement('ul');
                                secUl.classList.add('filter-sec-ul');

                                // 子面板列表
                                secItems.forEach((secItem, i) => {
                                    const secLi = document.createElement('li');
                                    secLi.classList.add('filter-sec-li');
                                    secLi.dataset.code = secItem.itemCode || '';
                                    const secDiv = document.createElement('div');
                                    const secSpan = document.createElement('span');
                                    secSpan.textContent = secItem.itemName;
                                    secDiv.appendChild(secSpan);
                                    secLi.appendChild(secDiv);

                                    // 判断选中
                                    if (selectedData[groupItem.groupCode] && selectedData[groupItem.groupCode].indexOf(secItem.itemCode) >= 0) {
                                        secLi.classList.add('selected');
                                        const code = subItem.itemCode;
                                        subUl.querySelector(`.filter-sub-li[data-code="${code}"]`).classList.add('selected');

                                        // 右上角已选项显示
                                        let subTitle = '';
                                        const itemName = secItem.itemName;
                                        if (i === 0) {
                                            // 第一项默认为不限
                                            subTitle = code;
                                        } else {
                                            subTitle = `${code}-${itemName}`;
                                        }
                                        filterTxt.push(subTitle);
                                    }

                                    secLi.addEventListener('click', () => {
                                        if (this.config[index].mutex) {
                                            // 互斥处理，恢复面板中全部筛选到不限
                                            this.toArray(document.querySelectorAll(`#filter-panel-${index} .filter-sub-ul .filter-sub-li`)).forEach(li => {
                                                if (!li.dataset.code) {
                                                    li.classList.add('selected');
                                                } else {
                                                    li.classList.remove('selected');
                                                }
                                                li.parentElement.previousElementSibling.querySelector('i').textContent = '';
                                            });
                                        }

                                        // 子面板中的选中调整
                                        this.toArray(subUl.querySelectorAll('.filter-sec-li.selected')).forEach(li => li.classList.remove('selected'));
                                        secLi.classList.add('selected');

                                        // 父面板的选中调整
                                        this.toArray(subUl.querySelectorAll('.filter-sub-li.selected')).forEach(li => li.classList.remove('selected'));
                                        const forcode = wrapLi.dataset.forcode;
                                        const parentLi = subUl.querySelector(`.filter-sub-li[data-code="${forcode}"]`);
                                        if (parentLi) {
                                            parentLi.classList.add('selected');
                                        }

                                        // 右上角已选项显示
                                        let subTitle = '';
                                        const itemName = secItem.itemName;
                                        if (i === 0) {
                                            // 第一项默认为不限
                                            subTitle = forcode;
                                        } else {
                                            subTitle = `${forcode}-${itemName}`;
                                        }
                                        groupLi.querySelector('h3 i').textContent = subTitle;

                                        const panel = document.querySelector(`#filter-panel-${index}`);
                                        const tab = document.querySelector(`#filter-tab-${index}`);

                                        // 当前的暂选项
                                        const selected = this.getSelectedItems(panel);

                                        // 改变tab样式
                                        if (Object.keys(selected).length || this.config[index].customSelected) {
                                            tab.classList.add('selected');
                                        } else {
                                            tab.classList.remove('selected');
                                        }

                                        // 将当前点击项所在的组存入缓存，以便reset之后自动滚动到可见区域中
                                        this.lastFocusGroup = groupItem.groupCode;

                                        // 执行回调
                                        this.config[index].callback({
                                            selected,
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

                    const subTitle = document.createElement('i');
                    subTitle.textContent = filterTxt.join('、');
                    h3.appendChild(subTitle);

                    groupLi.appendChild(h3);
                    groupLi.appendChild(subUl);

                    // 多于4个筛选项，则显示展开更多的箭头
                    if (groupItem.items.length > 4) {
                        const more = document.createElement('div');
                        more.classList.add('filter-more');
                        more.addEventListener('click', () => {
                            if (!more.classList.contains('opend')) {
                                more.classList.add('opend');
                                const currentUl = groupLi.querySelector('.filter-sub-ul');
                                const scrollHeight = currentUl.scrollHeight;
                                currentUl.style.maxHeight = `${scrollHeight}px`;
                            } else {
                                more.classList.remove('opend');
                                const currentUl = groupLi.querySelector('.filter-sub-ul');
                                currentUl.style.maxHeight = '40px';
                            }
                        });

                        // 如果之前该筛选为展开，则自动展开
                        if (opendFilters.indexOf(groupItem.groupCode) >= 0) {
                            more.classList.add('opend');
                            let lines = 1;
                            if (groupItem.items.length % 4 > 0) {
                                lines = parseInt(groupItem.items.length / 4) + 1;
                            } else {
                                lines = groupItem.items.length / 4;
                            }
                            const scrollHeight = (36 * lines) + ((lines - 1) * 8);
                            const currentUl = groupLi.querySelector('.filter-sub-ul');
                            currentUl.style.maxHeight = `${scrollHeight}px`;
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
    }

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
}));
