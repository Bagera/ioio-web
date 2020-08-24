class UserMenu extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["loggedin", "name", "avatar"];
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (newValue !== oldValue) {
      this[attrName] = newValue;
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

  get avatar() {
    console.log(this.getAttribute("avatar"));
    return this.getAttribute("avatar");
  }
  set avatar(url) {
    if (url) {
      this.setAttribute("avatar", url);
    } else {
      this.removeAttribute("avatar");
    }
  }

  get name() {
    console.log(this.getAttribute("name"));
    return this.getAttribute("name");
  }
  set name(string) {
    if (string) {
      this.setAttribute("name", string);
    } else {
      this.removeAttribute("name");
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
    const name = this.getAttribute("name");
    const avatar = this.getAttribute("avatar");
    if (loggedin) {
      this.innerHTML = `
      <h2 class="user-menu-title">Logged in as:</h2>
      <section class="user-menu-user">
      <p class="user-menu-name">${name}</p>
      <img width="50" height="50" class="user-menu-avatar" alt="user avatar image" src="${avatar}"/>
      </section>
      <button class="user-menu-logout">log out</button>
      `;
    } else {
      this.innerHTML = `
        <h2 class="user-menu-title">Not logged in</h2>
        <button class="user-menu-login">log in</button>
        <button class="user-menu-register">register</button>
      `;
    }
  }
}
window.customElements.define("user-menu", UserMenu);
