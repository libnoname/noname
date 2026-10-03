class ChildNodesWatcher {
  constructor(dom) {
    this.dom = dom;
    this.childNodes = [];
    this.observer = new MutationObserver((mutationsList) => {
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
    this.childNodes.addArray(Array.from(addedNodes).filter((node) => node.parentNode == this.dom));
    this.childNodes.removeArray(Array.from(removedNodes));
  }
  toJSON() {
    return null;
  }
}
export {
  ChildNodesWatcher
};
