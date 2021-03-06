import Modal from "/js/modal/Modal.mjs";

class RegistrationModal extends Modal {
  constructor(props) {
    super(props);
    this.user = props.user;
  }
  async onsubmit(formData) {
    const { email, password, first_name, last_name, studies } = formData;
    const newUser = {
      first_name,
      last_name,
      studies,
    };
    await this.user.create(email, password, newUser);
    this.close();
  }
  template() {
    return `
    <form class="Modal-form Modal-registration">
      <div class="Modal-formBody">
        <label>Email
          <input name="email" type="email" required>
        <label>
        <label>Password (min 6 characters)
          <input name="password" type="password" required minlength="6">
        <label>
        <label>First name
          <input name="first_name" type="text" required>
        <label>
        <label>Last name
          <input name="last_name" type="text" required>
        <label>
        <label>Programme
          <input name="studies" type="text" required>
        <label>
      </div>
      <button class="Modal-button">Register</button>
    </form>
  `;
  }
}

export default RegistrationModal;
