class ClientIdsManager {
  constructor(private clientIds: string[]) {}

  public pickOne(): string {
    return this.clientIds[Math.floor(Math.random() * this.clientIds.length)];
  }
}

export { ClientIdsManager };
