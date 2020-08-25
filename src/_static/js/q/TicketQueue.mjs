import { sortBy } from "/js/Utils.mjs";
import QueueTicket from "/js/q/QueueTicket.mjs";

function sortTicketStore(tickets) {
  let filteredTickets = [];

  if (tickets) {
    tickets.forEach((ticket, id) => {
      ticket.id = id;
      filteredTickets.push(ticket);
    });
    if (filteredTickets.length > 0) {
      filteredTickets = sortBy(filteredTickets, "timestamp");
    }
  }

  return filteredTickets;
}

function getUserTicket(user, tickets) {
  let inFront = 0;
  let estimatedWait = 0;
  let ticket;
  tickets.forEach((t) => {
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
    0: "Yay! You are first in line! Help is on the way.",
    1: "Get ready! Just one person in front of you.",
  };
  return userTicket && msg[userTicket.inFront]
    ? msg[userTicket.inFront]
    : `There are ${userTicket.inFront} people in front of you.</p><p>Estimated waiting time is about ${userTicket.estimatedWait} minutes.`;
}

function TicketQueue(selector, tickets, users, currentUser) {
  selector.classList.toggle("TicketQueue-loaded", tickets);
  if (tickets) {
    const currentTicketEl = selector.querySelector(
      ".TicketQueue-currentTicket"
    );
    const queueEl = selector.querySelector(".TicketQueue-tickets");
    const queue = sortTicketStore(tickets);
    let elements = [];

    if (queue && currentUser && currentUser.hasTicket) {
      const userTicket = getUserTicket(currentUser, queue);
      if (userTicket) {
        currentTicketEl.innerHTML = `<p>${getEstimationMsg(userTicket)}</p>`;
      }
    }
    queueEl.innerHTML = queue
      .map((ticket) => {
        return QueueTicket(ticket, users.get(ticket.uid), currentUser);
      })
      .join("\n");
  }
}

export default TicketQueue;
