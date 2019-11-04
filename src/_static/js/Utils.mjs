export function sortBy(array, property, reverse) {
  const returnArray = [...array];
  const sortOrder = reverse ? -1 : 1;

  return returnArray.sort(function(a, b) {
    return (a[property] - b[property]) * sortOrder;
  });
}

export function arrayFrom(arrayLike) {
  return Array.prototype.slice.call(arrayLike);
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
      tickets.forEach(t => {
        checkAndInsert(uid, t.id, t.data());
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
