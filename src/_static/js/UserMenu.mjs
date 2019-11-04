import User from "/js/User.mjs";
import { arrayFrom } from "/js/Utils.mjs";

import LoginModal from "/js/modal/LoginModal.mjs";
import RegistrationModal from "/js/modal/RegistrationModal.mjs";

class UserMenu {
  constructor() {
    this.user = new User(firebase, {
      onupdate: this.onupdate.bind(this)
    });
  }
  onupdate(user) {
    this.render();
  }
  render() {
    const menuEl = document.querySelector(".UserMenu");
    const user = this.user;
    const loginModal = new LoginModal({ user });
    const registrationModal = new RegistrationModal({ user });
    let items = "";
    if (!user.get()) {
      items = `
      <li>
        <button class="UserMenu-button UserMenu-registration">register</button>
      </li>
      <li>
        <button class="UserMenu-button UserMenu-login">log in</button>
      </li>
      `;
    } else {
      items = `
      <li>
        <button class="UserMenu-button UserMenu-logout">log out</button>
      </li>
      `;
    }
    menuEl.innerHTML = items;

    const buttons = arrayFrom(menuEl.querySelectorAll("button"));
    buttons.forEach(button => {
      if (button.classList.contains("UserMenu-login")) {
        button.onclick = ev => {
          loginModal.open();
        };
      }
      if (button.classList.contains("UserMenu-logout")) {
        button.onclick = ev => {
          user.logOut();
        };
      }
      if (button.classList.contains("UserMenu-registration")) {
        button.onclick = ev => {
          registrationModal.open();
        };
      }
    });
  }
}

export default UserMenu;
