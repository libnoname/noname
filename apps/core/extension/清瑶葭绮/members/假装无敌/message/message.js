class qyMessage {
    // 最多显示多少个队列的消息。
    #maxNumberOfMessages;
    // 消息队列
    #queueMessage = [];
    // 当前已经展示的队列的消息
    #queueShowMessage = [];
    containerEl = null;

    constructor({maxNumMessages = 6} = {}) {
        this.#maxNumberOfMessages = maxNumMessages;
        this.initContainer();
    }

    initContainer() {
        const containerId = 'qy-message-container';
        this.containerEl = document.getElementById(containerId);

        if (!this.containerEl) {
            this.containerEl = document.createElement('div');
            this.containerEl.id = containerId;
            document.body.appendChild(this.containerEl);
        }
    }

    queueMessage(options) {
        if (this.#queueShowMessage.length >= this.#maxNumberOfMessages) {
            this.#queueMessage.push(options);
        } else {
            this.#queueShowMessage.push(this.show(options));
        }
    }

    queueMessageSuccess(text) {
        this.queueMessage({
            type: 'success',
            text,
        });
    }

    queueMessageInfo(text) {
        this.queueMessage({
            type: 'info',
            text,
        });
    }

    queueMessageError(text) {
        this.queueMessage({
            type: 'error',
            text,
        });
    }

    queueMessageWarn(text) {
        this.queueMessage({
            type: 'warning',
            text,
        });
    }

    queueMessageLoading(text) {
        this.queueMessage({
            type: 'loading',
            text,
        });
    }


    show({type = 'info', text = '', duration = 3000, closeable = false}) {
        const messageEl = this.createMessageElement(type, text, closeable);

        this.containerEl.appendChild(messageEl);

        if (duration > 0) {
            setTimeout(() => {
                this.close(messageEl);
            }, duration);
        }
        return messageEl;
    }

    createMessageElement(type, text, closeable) {
        let messageEl = document.createElement('div');
        messageEl.className = 'qy-message qy-move-in';
        messageEl.innerHTML = `
            <span class="qy-iconfont qy-icon-${type}"></span>
            <div class="text">${text}</div>
        `;

        if (closeable) {
            const closeEl = this.createCloseElement();
            messageEl.appendChild(closeEl);
            closeEl.addEventListener('click', () => {
                this.close(messageEl);
            });
        }

        return messageEl;
    }

    createCloseElement() {
        let closeEl = document.createElement('div');
        closeEl.className = 'close qy-iconfont qy-icon-close';
        return closeEl;
    }

    close(messageEl) {
        this.animateMessageOut(messageEl);

        messageEl.addEventListener('animationend', () => {
            messageEl.setAttribute('style', 'height: 0; margin: 0');
        });

        messageEl.addEventListener('transitionend', () => {
            messageEl.remove();
            if (messageEl.removed) return;
            messageEl.removed = true;
            // 是否包含这个元素
            if (!this.#queueShowMessage.includes(messageEl) || !this.#queueShowMessage.length) return;
            // 查找到这个元素
            const findIndex = this.#queueShowMessage.findIndex(x => x === messageEl);
            // 移除这个元素
            this.#queueShowMessage.splice(findIndex, 1);
            // 显示下一个消息
            if (this.#queueMessage.length > 0 && this.#queueShowMessage.length < this.#maxNumberOfMessages) {
                this.queueMessage(this.#queueMessage.shift());
            }
        });
    }

    animateMessageOut(messageEl) {
        messageEl.className = messageEl.className.replace('qy-move-in', '');
        messageEl.className += ' qy-move-out';
    }
}
