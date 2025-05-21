/**
 * 子节点观察器，对于需要频繁遍历子节点的DOM对象的实时变化进行缓存。
 */
export class ChildNodesWatcher {
	constructor(dom) {
		this.dom = dom;
		this.childNodes = [];
		this.observer = new MutationObserver(mutationsList => {
			for (let mutation of mutationsList) {
				if (mutation.type === "childList") {
					this.onChildNodesChanged(mutation.addedNodes, mutation.removedNodes);
				}
			}
		});
		const config = { childList: true };
		this.observer.observe(dom, config);
	}

	onChildNodesChanged(addedNodes, removedNodes) {
		this.childNodes.addArray(Array.from(addedNodes).filter(node => node.parentNode == this.dom));
		this.childNodes.removeArray(Array.from(removedNodes));
	}
}
