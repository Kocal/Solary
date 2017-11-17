class ClientIdsManager {
  constructor(clientIds) {
    this.clientIds = clientIds;
  }

  pickOne() {
    return this.clientIds[this.clientIds.length - 1];
  }
}

export default ClientIdsManager;
