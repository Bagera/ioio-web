import Modal from "/js/modal/Modal.mjs";

class ResetModal extends Modal {
  constructor(props) {
    super(props);
    this.user = props.user;
  }
  async onsubmit(formData) {
    await this.user.sendReset(formData.email);
    this.close();
  }
  renderForm() {
    return `
    <form class="Modal-form Modal-reset">
      <div class="Modal-formBody">
        <label>Email
          <input name="email" type="email" required>
        <label>
      </div>
      <button class="Modal-button">Send reset link</button>
    </form>
  `;
  }
}

export default ResetModal;
