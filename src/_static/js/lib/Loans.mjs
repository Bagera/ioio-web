import { sortBy } from "/js/Utils.mjs";
import LentItem from "/js/lib/LentItem.mjs";

function sortLoansStore(loans) {
  let approvedLoans = [];
  let requestedLoans = [];

  if (loans) {
    loans.forEach((loan, id) => {
      loan.id = id;
      if (loan.lender) {
        approvedLoans.push(loan);
      } else {
        approvedLoans.push(loan);
        requestedLoans.push(loan);
      }
    });
    if (approvedLoans.length > 0) {
      approvedLoans = sortBy(approvedLoans, "timestamp");
    }
    if (requestedLoans.length > 0) {
      requestedLoans = sortBy(requestedLoans, "timestamp");
    }
  }

  return [approvedLoans, requestedLoans];
}

function Loans(selector, loans, users, currentUser) {
  if (!loans || !users) {
    selector.innerHTML = `
      <div class="Loans-loader">
        Loading queue...
      </div>
    `;
  } else {
    const [approvedLoans, requestedLoans] = sortLoansStore(loans); // Prepared for requesting loans
    let elements = [];

    elements.push(`
      <ol class="Loans-list">
      ${approvedLoans
        .map(loan => {
          return LentItem(loan, users.get(loan.lendee), currentUser);
        })
        .join("\n")}
      </ol>
    `);

    selector.innerHTML = elements.join("\n");
  }
}

export default Loans;
