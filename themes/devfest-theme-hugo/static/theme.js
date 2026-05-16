// NodeList.forEach
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (let i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered:', registration);
    }).catch(error => {
      console.log('SW registration failed:', error);
    });
  });
}

// Shuffle
document.querySelectorAll('ul.shuffle').forEach(listElt => {
  if (listElt.children.length) {
    for (let i = listElt.children.length; i >= 0; i--) {
      listElt.appendChild(listElt.children[Math.random() * i | 0]);
    }
  }
});
//# sourceMappingURL=theme.js.map
