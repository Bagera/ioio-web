import TicketModal from "/js/modal/TicketModal.mjs";

function handleTakeTicket(ticketModal) {
  ticketModal.open();
}
function getPageY(ev) {
  return ev.pageY;
}
function handleTicketTouchEnd(ticketEl) {
  ticketEl.classList.remove("TicketRoll-pulling");
  return 0;
}
function endTouch(ticketEl, spacer) {
  spacer.style = "";
  return handleTicketTouchEnd(ticketEl);
}

function setElementHeight(element, size) {
  if (isNaN(size)) {
    element.style.height = `${size}`;
  } else {
    element.style.height = `${size}px`;
  }
}

function TicketRoll(ticketEl, tickets, user, db) {
  const ticketModal = new TicketModal({ user, db });
  const ticketButton = ticketEl.querySelector(".TicketRoll-button");
  const spacer = ticketEl.querySelector(".TicketRoll-spacer");
  let touchStart = 0;

  // Click
  ticketButton.onclick = function() {
    handleTakeTicket(ticketModal);
  };

  // Touch
  ticketEl.onpointerdown = function(ev) {
    if (ev.pointerType === "touch") {
      touchStart = getPageY(ev);
    }
  };
  ticketEl.onpointermove = function(ev) {
    if (touchStart) {
      ticketEl.classList.add("TicketRoll-pulling");
      const currY = getPageY(ev);
      const size = currY - touchStart;

      setElementHeight(spacer, size);
      if (size >= 120) {
        handleTicketTouchEnd(ticketEl);
        handleTakeTicket(ticketModal);
      }
    }
  };
  ticketEl.onpointerup = function() {
    if (touchStart) {
      touchStart = endTouch(ticketEl, spacer);
    }
  };
  // ticketEl.onpointerout = function() {
  //   if (touchStart) {
  //     touchStart = endTouch(ticketEl, spacer);
  //   }
  // };
}

export default TicketRoll;
