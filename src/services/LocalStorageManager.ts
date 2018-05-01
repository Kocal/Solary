const timestamp = () => Math.floor(+new Date() / 1000);

interface Payload {
  data: any;
  timestamp: number;
}

export class LocalStorageManager {
  write(key: string, data: any, ttl: number = 60 * 60): void {
    const payload: Payload = {
      data,
      timestamp: timestamp() + ttl,
    };

    return localStorage.setItem(key, JSON.stringify(payload));
  }

  read(key: string): any | null {
    const data = <Payload>JSON.parse(localStorage.getItem(key) || 'null');

    return data === null || data.timestamp < timestamp() ? null : data.data;
  }
}
