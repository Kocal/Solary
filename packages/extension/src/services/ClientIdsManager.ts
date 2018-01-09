class ClientIdsManager {
  constructor(private clientIds: Array<string>) {
    this.clientIds = clientIds;

    if (!Array.isArray(clientIds) || this.clientIds.length === 0) {
      throw new Error('« clientIds » should be a non-empty array.');
    }
  }

  public pickOne(): string {
    return this.clientIds[Math.floor(Math.random() * this.clientIds.length)];
  }
}

export {
  ClientIdsManager,
};
