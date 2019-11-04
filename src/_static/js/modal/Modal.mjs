function parseValue(value) {
  if (isNaN(value)) {
    return value;
  }
  return Number(value);
}

class Modal {
  constructor() {
    this.container = document.querySelector(".Modal-container");
  }
  open() {
    this.render(this.template || this.renderForm());
    document.body.classList.add("State-modalOpen");
    if (this.onopen) {
      this.onopen();
    }
  }
  close() {
    if (this.onclose) {
      this.onclose();
    }
    this.container.innerHTML = "";
    document.body.classList.remove("State-modalOpen");
  }
  handleSubmit(ev) {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    let data = {};
    for (var pair of formData.entries()) {
      const value = parseValue(pair[1]);
      data[pair[0]] = value;
    }
    if (this.onsubmit) {
      this.onsubmit(data, ev);
    }
  }
  render(children) {
    this.container.innerHTML = `
    <div class="Modal-bg">
      <div class="Modal">
        <button class="Modal-button Modal-closeButton">close</button>
        ${children}
      </div>
    </div>
    `;
    document.querySelector(".Modal-closeButton").onclick = ev => {
      this.close();
      ev.preventDefault();
    };
    const modalBg = document.querySelector(".Modal-bg");
    modalBg.onclick = ev => {
      if (!ev.target.closest(".Modal")) {
        this.close();
      }
    };
    modalBg.onkeydown = ev => {
      if (ev.key === "Escape") {
        this.close();
      }
    };

    const form = document.querySelector(".Modal form");
    if (form) {
      document.querySelector(".Modal input").focus();
      form.onsubmit = ev => {
        this.handleSubmit(ev);
      };
    }
  }
}

export default Modal;
