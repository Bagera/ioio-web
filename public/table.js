const Table = {
  element: null,
  start: function(selector) {
    this.element = document.querySelector(selector);
    this.render([]);
  },
  row: function(data) {
    const rowTemplate = document.getElementById("loan");
    const row = document.importNode(rowTemplate.content, true);

    for (const key in data) {
      if (key === "docId") {
        row.querySelector(".loan").dataset.docId = data.docId;
      } else {
        let value = data[key];
        if (key.includes("Date")) {
          value = getFormattedDate(new Date(value));
        }
        row.querySelector(".loan_" + key).innerHTML = value;
      }
    }

    if (!data.returnDate) {
      if (currentUser) {
        let button = document.createElement("button");
        button.innerHTML = "Return";
        button.classList.add("button-action");
        button.addEventListener("click", ev => {
          handleReturn(data.docId, ev);
        });
        row.querySelector(".loan_returnDate").innerHTML = "";
        row.querySelector(".loan_returnDate").appendChild(button);
      } else {
        row.querySelector(".loan_returnDate").innerHTML = "not returned";
      }
    }

    return row;
  },
  render: function(snapshot = []) {
    const tableBody = this.element.querySelector("tbody");
    tableBody.innerHTML = "";

    snapshot.forEach(function(doc) {
      const docData = doc.data();
      let data = { ...docData };
      data.docId = doc.id;

      tableBody.appendChild(Table.row(data));
    });
  }
};
