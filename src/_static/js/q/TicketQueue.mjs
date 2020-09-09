import QueueTicket from "/js/q/QueueTicket.mjs";

function TicketQueue(selector, queue, users, currentUser) {
  selector.classList.toggle("TicketQueue-loaded", queue);
  if (queue) {
    const queueEl = selector.querySelector(".TicketQueue-tickets");

    queueEl.innerHTML = queue
      .map((ticket) => {
        return QueueTicket(ticket, users.get(ticket.uid), currentUser);
      })
      .join("\n");
  }
}

export default TicketQueue;
