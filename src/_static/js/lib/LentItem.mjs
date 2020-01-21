function LentItem(loan, user, currentUser) {
  let lendee = user ? `${user.first_name} ${user.last_name}` : loan.lendee;

  let loanClass = "LentItem";
  if (currentUser && currentUser.uid === loan.lendee) {
    loanClass += " LentItem-own";
  }

  let ticketActions = "";
  if (currentUser && currentUser.admin) {
    ticketActions = `<button class="Button LentItem-resolve">handled</button>`;
  }

  let loanDesc = `${loan.items[0].amount > 1 ? loan.items[0].amount : ""} ${
    loan.items[0].item
  }`;
  if (loan.items.length > 1) {
    loanDesc = `${loan.items.length} different items`;
  }

  let date = loan.timestamp.toDate();
  let loanDate = `${date.getFullYear()} ${date.getMonth() +
    1} ${date.getDate()}`;

  return `
    <li class="${loanClass}" data-loan="${loan.id}">
      <span class="LentItem-lendee">${lendee}</span>
      <span class="LentItem-item">${loanDesc}</span>
      <span class="LentItem-timestamp">${loanDate}</span>
      <button class="LentItem-edit">edit</button>
    </li>
  `;
}

export default LentItem;
