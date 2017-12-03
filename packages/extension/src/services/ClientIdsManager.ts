export default class ClientIdsManager {
  constructor(private clientIds: Array<string>) {
  }

  public pickOne(): string {
    return this.clientIds[this.clientIds.length - 1];
  }
}
