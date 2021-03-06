class Queue {
  constructor(props) {
    this.queueElement = document.querySelector(props.listSelector + " ol");
    this.ticketElement = document.querySelector(props.ticketSelector);
    this.handleClick = props.onclick;
    this.queueElement.onclick = ev => {
      this.handleResolve(ev);
    };
  }
  handleResolve(ev) {
    let target = ev.target;
    if (target && target.classList.contains("TicketQueue-resolve")) {
      const ticketId = target.parentNode.dataset.ticket;
      if (this.handleClick) {
        this.handleClick(ticketId);
      }
    }
  }
  listen(document, callback) {
    firebase
      .database()
      .ref(document)
      .on("value", function(snapshot) {
        callback(snapshot);
      });
  }
  sortTicketStore(snapshot) {
    function sortBy(property, reverse) {
      const sortOrder = reverse ? -1 : 1;

      return function(a, b) {
        return (a[property] - b[property]) * sortOrder;
      };
    }

    const filteredTickets = [];
    for (const tId in snapshot) {
      if (snapshot.hasOwnProperty(tId)) {
        const t = snapshot[tId];

        if (t.active) {
          let ticket = t;
          ticket.id = tId;
          filteredTickets.push(ticket);
        }
      }
    }

    if (filteredTickets.length > 0) {
      filteredTickets.sort(sortBy("timestamp"));
    }

    return filteredTickets;
  }
  renderQueueTicket(ticket, user, currentUser) {
    if (!user) {
      user = {
        first_name: "Anon",
        last_name: "User"
      };
    }
    let ticketClass = "TicketQueue-ticket";
    if (currentUser && currentUser.uid === ticket.uid) {
      ticketClass += " TicketQueue-ownedTicket";
    }
    return `<li class=${ticketClass} data-ticket="${ticket.id}" >
        <span class="TicketQueue-user">${user.first_name} ${user.last_name}</span>
        <span class="TicketQueue-location">${ticket.location}</span>
        <button class="Button TicketQueue-resolve">handled</button>
      </li>`;
  }

  render(tickets = [], users, currentUser) {
    function getPadding(string) {
      let str = string + "";
      let pad = "";
      while (str.length + pad.length < 3) {
        pad = "0" + pad;
      }
      if (pad) {
        return `<span class="TicketRoll-numberPadding">${pad}</span>`;
      } else {
        return "";
      }
    }

    const sortedTickets = this.sortTicketStore(tickets);

    const queue = sortedTickets.map(ticket => {
      let user = users[ticket.uid];
      return this.renderQueueTicket(ticket, user, currentUser);
    });
    this.queueElement.innerHTML = queue.join("\n");

    this.ticketElement.innerHTML = `${getPadding(
      queue.length + 1
    )}${queue.length + 1}`;
  }
}

export default Queue;
