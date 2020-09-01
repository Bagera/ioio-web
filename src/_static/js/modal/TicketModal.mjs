import Modal from "/js/modal/Modal.mjs";

class TicketModal extends Modal {
  constructor(props) {
    super(props);
  }

  render(children, startPos) {
    let style = "";
    if (startPos) {
      style = `<style>.Modal{--startY: ${startPos.y || 0};--startX: ${
        startPos.x || 0
      };}</style>`;
    }
    this.container().innerHTML = `${style}
    <div class="TicketModal Modal-bg">
      <div class="Modal">
        <button class="Modal-button Modal-closeButton">nah</button>
        ${children}
      </div>
    </div>
    `;

    this.bindEvents();
  }
}

export default TicketModal;
