function getUserTicket(user, queue) {
  let inFront = 0;
  let estimatedWait = 0;
  let ticket;
  queue.forEach((t) => {
    if (t.uid != user.uid) {
      if (!ticket) {
        inFront++;
        estimatedWait += t.est;
      }
    } else {
      ticket = t;
    }
  });
  if (ticket) {
    return { inFront, estimatedWait, ticket };
  }
}

function getEstimationMsg(userTicket) {
  const msg = {
    0: "<p>Yay! You are first in line! Help is on the way.</p>",
    1: "<p>Get ready! Just one person in front of you.</p>",
  };
  return userTicket && msg[userTicket.inFront]
    ? msg[userTicket.inFront]
    : `<p>There are ${userTicket.inFront} people in front of you. Estimated waiting time is about ${userTicket.estimatedWait} minutes.</p><button class="Button CurrentTicket-cancel">drop my ticket</button>`;
}

function CurrentTicket(element, user, queue) {
  element.classList.toggle("CurrentTicket-loaded", queue);

  if (user && user.hasTicket && queue) {
    const userTicket = getUserTicket(user, queue);
    const ticketEl = element.querySelector(".CurrentTicket-placeInLine");
    if (userTicket && ticketEl) {
      ticketEl.innerHTML = getEstimationMsg(userTicket);
    }
  }
}

export default CurrentTicket;
