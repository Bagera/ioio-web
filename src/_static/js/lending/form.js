const Form = {
  element: null,
  start: function(selector) {
    this.element = document.querySelector(selector);
    this.element.addEventListener("submit", handleBorrow);
  },
  setState: function(enabled = false) {
    this.element.querySelector(".button-action").disabled = !enabled;
  },

  submit: function(event) {
    event.preventDefault();
    const payload = {
      name: event.target.name.value,
      object: event.target.object.value,
      amount: event.target.amount.value,
      loanDate: Date.now(),
      returnDate: "",
      responsible: getInitials(currentUser.displayName)
    };
    db.collection(lendingDocument)
      .add(payload)
      .then(this.element.reset());
  }
};
