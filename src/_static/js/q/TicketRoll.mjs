import GetTicketModal from "/js/modal/GetTicketModal.mjs";

function handleTakeTicket(getTicketModal, startPos) {
  getTicketModal.open(startPos);
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

function getEstimationString(minutes = 0) {
  const h = Math.floor(minutes / 60);
  const min = minutes % 60;
  let est = "";

  //? Do you have a space between number and unit?
  if (h) {
    est += `${h}h `;
  }
  est += `${min}min`;
  return est;
}

function getWithPadding(number = 1) {
  const str = number + "";
  let pad = "";
  while (str.length + pad.length < 3) {
    pad = "0" + pad;
  }
  if (pad) {
    return `<span class="TicketRoll-numberPadding">${pad}</span>${number}`;
  } else {
    return number;
  }
}

function TicketRoll(ticketEl, tickets = new Map(), user, db) {
  const getTicketModal = new GetTicketModal({ user, db });
  const ticketNumber = ticketEl.querySelector(".TicketRoll-number");
  const ticketEstimation = ticketEl.querySelector(".TicketRoll-estimation");
  const ticketButton = ticketEl.querySelector(".TicketRoll-button");
  const spacer = ticketEl.querySelector(".TicketRoll-spacer");
  let estimatedWait = 0;
  let touchStart = 0;
  let touchTimer;

  tickets.forEach(ticket => {
    estimatedWait += ticket.est;
  });

  ticketNumber.innerHTML = getWithPadding(tickets.size + 1);
  ticketEstimation.innerHTML = getEstimationString(estimatedWait);

  ticketButton.onclick = function() {
    handleTakeTicket(getTicketModal, { x: "0", y: "-40vh" });
  };

  // Touch
  ticketEl.onpointerdown = function(ev) {
    if (ev.pointerType === "touch") {
      touchStart = ev.pageY;
    }
  };
  ticketEl.onpointermove = function(ev) {
    if (touchStart) {
      clearTimeout(touchTimer);
      touchTimer = null;
      ticketEl.classList.add("TicketRoll-pulling");
      const currY = ev.pageY;
      const size = currY - touchStart;

      setElementHeight(spacer, size);
      if (size >= 120) {
        handleTicketTouchEnd(ticketEl);
        handleTakeTicket(getTicketModal, { x: "0", y: "-" + size + "px" });
        touchStart = endTouch(ticketEl, spacer);
      }
    }
  };
  ticketEl.onpointerup = function() {
    if (touchStart) {
      touchStart = endTouch(ticketEl, spacer);
    }
  };
  ticketEl.onpointerout = function(ev) {
    if (touchStart) {
      if (!ev.target.parentNode.classList.contains("TicketRoll-ticket")) {
        setTimeout(() => {
          touchStart = endTouch(ticketEl, spacer);
        }, 200);
      }
    }
  };
}

export default TicketRoll;
