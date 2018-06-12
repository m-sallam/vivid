const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 0, checkperiod: 0 })

var insertConnectedVolunteer = function (user) {
  let onlineVolunteers = cache.get('onlineVolunteers')
  if (onlineVolunteers === undefined || onlineVolunteers === null) {
    onlineVolunteers = []
    onlineVolunteers.push(user)
    cache.set('onlineVolunteers', onlineVolunteers)
  } else {
    onlineVolunteers.push(user)
    cache.set('onlineVolunteers', onlineVolunteers)
  }
}

var removeDisconnectedVolunteer = function (id) {
  let onlineVolunteers = cache.get('onlineVolunteers')
  if (onlineVolunteers !== undefined && onlineVolunteers !== null) {
    for (let user of onlineVolunteers) {
      if (user.socketId === id) {
        onlineVolunteers.splice(onlineVolunteers.indexOf(user), 1)
      }
    }
  }
  cache.set('onlineVolunteers', onlineVolunteers)
}

var insertConnectedClient = function (user) {
  let onlineClients = cache.get('onlineClients')
  if (onlineClients === undefined || onlineClients === null) {
    onlineClients = []
    onlineClients.push(user)
    cache.set('onlineClients', onlineClients)
  } else {
    onlineClients.push(user)
    cache.set('onlineClients', onlineClients)
  }
}

var removeDisconnectedClient = function (id) {
  let onlineClients = cache.get('onlineClients')
  if (onlineClients !== undefined && onlineClients !== null) {
    for (let user of onlineClients) {
      if (user.socketId === id) {
        onlineClients.splice(onlineClients.indexOf(user), 1)
      }
    }
  }
  cache.set('onlineClients', onlineClients)
}

var insertRequest = function (user) {
  let requests = cache.get('requests')
  if (requests === undefined || requests === null) {
    requests = []
    requests.push(user)
    cache.set('requests', requests)
  } else {
    for (let request of requests) {
      if (request.socketId === user.socketId) {
        return
      }
    }
    requests.push(user)
    cache.set('requests', requests)
  }
}

var removeRequest = function (id) {
  let requests = cache.get('requests')
  if (requests !== undefined && requests !== null) {
    for (let user of requests) {
      if (user.socketId === id) {
        requests.splice(requests.indexOf(user), 1)
      }
    }
  }
  cache.set('requests', requests)
}

var getRequests = function () {
  let requests = cache.get('requests')
  if (requests === undefined) {
    requests = []
  }
  return requests
}

module.exports = {
  cache: cache,
  insertConnectedVolunteer: insertConnectedVolunteer,
  removeDisconnectedVolunteer: removeDisconnectedVolunteer,
  insertConnectedClient: insertConnectedClient,
  removeDisconnectedClient: removeDisconnectedClient,
  insertRequest: insertRequest,
  removeRequest: removeRequest,
  getRequests: getRequests
}
