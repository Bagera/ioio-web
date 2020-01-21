class UserMenu extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["loggedin"];
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (newValue !== oldValue) {
      this[attrName] = this.hasAttribute(attrName);
      this.render();
    }
  }

  get loggedin() {
    return this.hasAttribute("loggedin");
  }
  set loggedin(isOpen) {
    if (isOpen) {
      this.setAttribute("loggedin", true);
    } else {
      this.removeAttribute("loggedin");
    }
  }

  handleClick(ev) {
    const { target } = ev;
    if (target.nodeName.toLowerCase() === "button") {
      let event;
      if (target.className.includes("logout")) {
        event = new Event("logout");
      } else if (target.className.includes("login")) {
        event = new Event("login");
      } else if (target.className.includes("register")) {
        event = new Event("register");
      }
      this.dispatchEvent(event);
    }
  }

  connectedCallback() {
    this.render();
    this.onclick = this.handleClick;
  }

  render() {
    const loggedin = this.hasAttribute("loggedin");
    if (loggedin) {
      this.innerHTML = `<button class="user-menu-logout">log out</button>`;
    } else {
      this.innerHTML = `
        <button class="user-menu-login">log in</button>
        <button class="user-menu-register">register</button>
      `;
    }
  }
}
window.customElements.define("user-menu", UserMenu);
