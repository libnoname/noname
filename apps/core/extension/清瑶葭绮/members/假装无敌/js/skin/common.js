/**
 * 给元素添加点击或触摸事件监听器
 * @param {Element} node - 需要添加事件监听器的元素
 * @param {Function} func - 事件处理函数
 * @param {boolean} bubbles - 是否冒泡事件
 * @returns {Element} - 返回元素本身
 */
function listen(node, func, bubbles = false) {
    if (!lib.qyUtils.isMobile) {
        on(node, 'click', func, bubbles);
        return node;
    }

    on(node, 'touchend', function (e) {
        if (!_status.dragged) {
            func.call(node, e);
        }
    }, bubbles)

    const fallback = function (e) {
        if (!_status.touchconfirmed) {
            func.call(node, e);
        } else {
            off(node, 'click', fallback, bubbles);
        }
    };

    on(node, 'click', fallback, bubbles);
    return node;
}

/**
 * 给元素添事件监听器
 * @param {Element} node - 需要添加事件监听器的元素
 * @param {String[]|String} type 事件类型
 * @param {Function} func - 事件处理函数
 * @param bubbles
 * @returns {Element} - 返回元素本身
 */
function on(node, type, func, bubbles = false) {
    type = [].concat(type);
    type.forEach(t => node.addEventListener(t, func, bubbles));
    return node;
}

/**
 * 给元素移除件监听器
 * @param {Element} node - 需要添加事件监听器的元素
 * @param {string[] | string} type - 事件类型
 * @param {Function} func - 事件处理函数
 * @param {boolean} bubbles - 是否冒泡事件
 * @returns {Element} - 返回元素本身
 */
function off(node, type, func, bubbles = false) {
    type = [].concat(type);
    type.forEach(t => node.removeEventListener(t, func, bubbles));
    return node;
}

/**
 * 设置元素的样式和 innerHTML
 * @param node - 元素
 * @param {Object} style - 元素的样式和 innerHTML
 * @param {string} [style.innerHTML] - 元素的 innerHTML
 * @param {string} [style.width] - 元素的宽度
 * @param {string} [style.height] - 元素的高度
 * @param {string} [style.backgroundColor] - 元素的背景颜色
 * @param {string} [style.color] - 元素的字体颜色
 * @param {string} [style.fontSize] - 元素的字体大小
 * @param {string} [style.fontWeight] - 元素的字体粗细
 * @param {string} [style.border] - 元素的边框
 * @param {string} [style.borderRadius] - 元素的圆角
 * @param {string} [style.boxShadow] - 元素的阴影
 * @param {string} [style.textAlign] - 元素的文本对齐方式
 * @param {string} [style.display] - 元素的显示方式
 * @param {string} [style.position] - 元素的定位方式
 * @param {string} [style.top] - 元素的上边距
 * @param {string} [style.right] - 元素的右边距
 * @param {string} [style.bottom] - 元素的下边距
 * @param {string} [style.left] - 元素的左边距
 * @param {string} [style.zIndex] - 元素的层级
 */
function css(node, style) {
    const {innerHTML, ...rest} = style;
    Object.assign(node.style, rest);
    for (let [key, value] of Object.entries(rest)) {
        if (!Array.isArray(value)) {
            value = [value, '']
        }
        node.style.setProperty(key, value[0], value[1])
    }
    if (innerHTML) node.innerHTML = innerHTML;
}

/**
 * 创建一个 DOM 元素
 * @param {Object} options - 创建元素的选项
 * @param {string} [options.tag] - 元素的节点类型
 * @param {string} [options.class] - 元素的 class
 * @param {string} [options.id] - 元素的ID
 * @param {function} [options.click] - 元素的事件监听器
 * @param {Object} [options.event] - 元素的事件监听器
 * @param {Element} [options.parent] - 元素的插入位置
 * @param {number} [options.positionIndex] - 元素插入位置的索引
 * @param {Object} [options.style] - 元素的样式
 * @param {string} [options.innerHTML] - 元素的 innerHTML
 * @param {Object} [options.attributes] - 元素attributes
 * @param {Object} [options.props] - 元素属性
 * @param {Object} [options.dataset] - dataset属性
 * @param {HTMLElement} [options.children] - 元素的子元素
 * @param {string} [options.text] - 元素的文本内容
 * @returns {Element} - 创建的 DOM 元素
 */
function createElement({
                           tag = 'div',
                           class: className = '',
                           id = '',
                           click,
                           event = {},
                           parent,
                           positionIndex,
                           style,
                           innerHTML = '',
                           attributes = {},
                           props = {},
                           dataset = {},
                           children = [],
                           text = null,
                       }) {
    const node = document.createElement(tag);
    const classNames = className.split('.').filter(Boolean);

    if (classNames.length) {
        node.className = classNames.join(' ');
    }
    if (id) {
        node.id = id;
        if (parent) {
            parent[id] = node;
        }
    }

    if (parent) {
        if (typeof positionIndex === 'number' && parent.childNodes.length > positionIndex) {
            parent.insertBefore(node, parent.childNodes[positionIndex]);
        } else {
            parent.appendChild(node);
        }
    }
    if (style) css(node, style);
    if (text) node.textContent = text;
    if (innerHTML) node.innerHTML = innerHTML;
    if (click) listen(node, click);
    if (attributes) {
        for (let attributesKey in attributes) {
            node.setAttribute(attributesKey, attributes[attributesKey])
        }
    }
    if (props) {
        for (let attributesKey in props) {
            node[attributesKey] = props[attributesKey]
        }
    }
    if (dataset) {
        Object.assign(node.dataset, dataset)
    }
    // 添加事件
    Object.entries(event)
        .forEach(([type, func]) => {
            if (typeof func === 'function') {
                on(node, type, func);
            } else if (func?.constructor === globalThis.Object && typeof func.value === 'function') {
                on(node, type, func.value, func.capture);
            }
        });
    // 添加子元素
    children
        .forEach(element => {
            if (element instanceof globalThis.HTMLElement) {
                node.appendChild(element);
            } else if (typeof element === 'string') {
                node.insertAdjacentHTML('beforeend', element);
            } else if (element?.constructor === globalThis.Object) {
                createElement({
                    ...element,
                    parent: node,
                });
            }
        })

    return node;
}

Object.assign(lib.qyUtils, {
    listen,
    on,
    off,
    css,
    createElement
})