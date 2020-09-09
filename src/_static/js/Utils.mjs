export function sortBy(array, property, reverse) {
  const returnArray = [...array];
  const sortOrder = reverse ? -1 : 1;

  return returnArray.sort(function (a, b) {
    return (a[property] - b[property]) * sortOrder;
  });
}

export function sortTicketStore(tickets) {
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

export function arrayFrom(arrayLike) {
  return Array.prototype.slice.call(arrayLike);
}

export function mapToArray(map) {
  const keys = [...map.keys()];
  const values = [...map.values()];
  return keys.map((key, i) => Object.assign({}, { key }, values[i]));
}

export function isFunction(func) {
  return typeof func === "function";
}

export function isEmpty(object) {
  if (!object) {
    return true;
  }

  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      return false;
    }
  }

  return true;
}

export function getUserTickets(uid, tickets) {
  let userTicketsArray = [];

  function checkAndInsert(uid, key, ticket) {
    if (ticket.uid === uid) {
      const returnTicket = Object.assign({ id: key }, ticket);
      userTicketsArray.push(returnTicket);
    }
  }

  if (tickets) {
    if (tickets.forEach) {
      tickets.forEach((t, key) => {
        if (key) {
          checkAndInsert(uid, key, t);
        } else {
          checkAndInsert(uid, t.id, t.data());
        }
      });
    } else {
      for (const key in tickets) {
        if (tickets.hasOwnProperty(key)) {
          checkAndInsert(uid, key, tickets[key]);
        }
      }
    }
  }
  return userTicketsArray;
}

export function makeSubId(arr, filter = []) {
  let id = arr.reduce((str, val) => {
    if (val) {
      if (str) {
        str += "-";
      }
      str += val;
    }
    return str;
  }, "");
  if (filter.length) {
    id += "-filter-";
    id += filter.reduce((str, val) => {
      if (val) {
        str += val;
      }
      return str;
    }, "");
  }
  return id;
}
