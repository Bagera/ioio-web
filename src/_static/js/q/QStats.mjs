class QStats extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["active", "tickets", "users"];
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (newValue !== oldValue) {
      this[attrName] = newValue;
      this.update();
    }
  }

  get tickets() {
    return JSON.parse(this.getAttribute("tickets"));
  }
  set tickets(ticketsStr) {
    if (ticketsStr) {
      this.setAttribute("tickets", ticketsStr);
    } else {
      this.removeAttribute("tickets");
    }
  }

  get active() {
    return this.getAttribute("active");
  }
  set active(isActive) {
    if (isActive) {
      this.setAttribute("active", isActive);
    } else {
      this.removeAttribute("active");
    }
  }

  connectedCallback() {
    this.innerHTML = `
    <span class="QStats-status">
      Loading
    </span>
    <span class="QStats-tickets">
      Unknown
    </span>
    `;
    this.update();
  }

  update() {
    const statusEl = this.querySelector(".QStats-status");

    const ticketsEl = this.querySelector(".QStats-tickets");
    const tickets = this.tickets;

    if (tickets) {
      ticketsEl.innerHTML = tickets.length;
    }
    statusEl.innerHTML = this.active ? "On" : "Off";
  }
}
window.customElements.define("q-stats", QStats);
