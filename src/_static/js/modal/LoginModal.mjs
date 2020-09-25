import Modal from "/js/modal/Modal.mjs";
import ResetModal from "/js/modal/ResetModal.mjs";

class LoginModal extends Modal {
  constructor(props) {
    super(props);
    this.user = props.user;
  }
  onopen() {
    document.querySelector(".Modal-resetEmail").onclick = () => {
      const resetModal = new ResetModal({ user: this.user });
      resetModal.open();
    };
  }
  async onsubmit(formData) {
    document.body.classList.add("State-loggingIn");
    await this.user.logIn(formData.email, formData.password);
    document.body.classList.remove("State-loggingIn");
    this.close();
  }
  template() {
    return `
      <form class="Modal-form Modal-login">
        <div class="Modal-formBody">
          <label>Email
            <input name="email" type="email" required>
          </label>
          <label>Password
            <input name="password" type="password" required>
          </label>
          <button type="button" class="Modal-button Modal-resetEmail">Forgot your password?</button>
        </div>
        <button class="Modal-button">Log in</button>
      </form>
    `;
  }
}

export default LoginModal;
