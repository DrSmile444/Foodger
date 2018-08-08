class DOMclass {
  constructor() {
    this.state = {
      body: document.body
    };
  }

  get(element) {
    return document.querySelector(element);
  }

  getAll(element) {
    return document.querySelectorAll(element);
  }

  create(element) {
    return document.createElement(element);
  }

  append(element, source = body) {
    return source.appendChild(element);
  }

  setStyle(element, style) {
    let keys = Object.keys(style);

    for (let i = 0, n = keys.length; i < n; i++) {
      element.style[keys[i]] = style[keys[i]];
    }
  }

  import(file) {
    let style = DOM.create("link");
    style.rel = "stylesheet";
    style.href = file + ".css";

    let head = document.head;

    head.appendChild(style);
  }
}
