class Form {
  constructor(props) {
    this.element = document.querySelector(selector);
  }
  handleSubmit(ev) {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    let data = {};
    for (var pair of formData.entries()) {
      data[pair[0]] = pair[1];
    }
    if (this.onsubmit) {
      this.onsubmit(data, ev);
    }
  }
  init() {
    this.element.addEventListener("submit", this.handleSubmit);
  }
}
export default Form;
