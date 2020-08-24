function QueueTicket(ticket, user, currentUser) {
  if (!user) {
    user = {
      first_name: "Anon",
      last_name: "User",
    };
  }
  let ticketClass = "QueueTicket";
  if (currentUser && currentUser.uid === ticket.uid) {
    ticketClass += " QueueTicket-own";
  }
  let ticketActions = "";
  if (currentUser && currentUser.admin) {
    ticketActions = `<button class="Button QueueTicket-resolve">handled</button>`;
  }
  return `
    <li class="${ticketClass}" data-ticket="${ticket.id}" >
      <img width="50" height="50" class="QueueTicket-avatar" alt="user avatar image" src="https://api.adorable.io/avatars/50/${user.avatarSeed}.png"/>
      <span class="QueueTicket-user">${user.first_name} ${user.last_name}</span>
      <span class="QueueTicket-location">${ticket.location}</span>
      ${ticketActions}
    </li>
  `;
}

export default QueueTicket;
