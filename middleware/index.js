const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 0, checkperiod: 0 })

var insertConnectedVolunteer = function (user) {
  let onlineVolunteers = cache.get('onlineVolunteers')
  if (onlineVolunteers === undefined) {
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
  for (let user of onlineVolunteers) {
    if (user.socketId === id) {
      onlineVolunteers.splice(onlineVolunteers.indexOf(user), 1)
    }
  }
  cache.set('onlineVolunteers', onlineVolunteers)
}

var insertConnectedClient = function (user) {
  let onlineClients = cache.get('onlineClients')
  if (onlineClients === undefined) {
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
  for (let user of onlineClients) {
    if (user.socketId === id) {
      onlineClients.splice(onlineClients.indexOf(user), 1)
    }
  }
  cache.set('onlineClients', onlineClients)
}

module.exports = {
  cache: cache,
  insertConnectedVolunteer: insertConnectedVolunteer,
  removeDisconnectedVolunteer: removeDisconnectedVolunteer,
  insertConnectedClient: insertConnectedClient,
  removeDisconnectedClient: removeDisconnectedClient
}
