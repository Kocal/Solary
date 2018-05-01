class StorageManager {
  get(key: any): Promise<{ [k: string]: any }> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(key, items => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(items);
        }
      });
    });
  }

  set(items: { [k: string]: any }): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set(items, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }
}

export { StorageManager };
