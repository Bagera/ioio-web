import TicketModal from "/js/modal/TicketModal.mjs";

class GetTicketModal extends TicketModal {
  constructor(props) {
    super(props);
    this.user = props.user;
    this.db = props.db;
  }
  async onopen() {
    let select = document.querySelector(".Modal-ticket select");
    const settings = await this.db.get("settings", "q");
    const options = settings
      .data()
      .locations.map(room => `<option>${room}</option>`);
    select.innerHTML = options.join("\n");
  }
  async onsubmit(formData) {
    formData.timestamp = firebase.firestore.Timestamp.now().toMillis();
    formData.uid = this.user.get().uid;
    formData.active = true;

    if (formData.uid) {
      await this.db.add("tickets", formData);
      this.close();
    }
  }
  template() {
    return `
    <form class="Modal-form Modal-ticket" type="post">
      <div class="Modal-formBody">
        <label>
          Room
          <select name="location" class="Modal-ticketInput">
            <option value="">Pick your location in the workshop</option>
          </select>
        </label>
        <fieldset>
          <legend>How long is your issue</legend>
          <label>
            5 min
            <input type="radio" name="est" value="5" checked="true" />
          </label>
          <label>
            10 min
            <input type="radio" name="est" value="10" />
          </label>
        </fieldset>
      </div>
      <button class="Modal-button Modal-ticketSubmit">Add ticket</button>
    </form>
    `;
  }
}

export default GetTicketModal;
