const DATABASE = 'kuangxun-demo';
const COLLECTION = 'data';
const KEY = 'demo-state';

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(COLLECTION);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('浏览器存储正由另一个窗口使用。'));
  });
}

export async function openStore(seed) {
  const database = await openDatabase();

  function change(update) {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(COLLECTION, 'readwrite');
      const records = transaction.objectStore(COLLECTION);
      const read = records.get(KEY);
      let state;
      let validationError;

      read.onsuccess = () => {
        try {
          state = read.result ?? seed();
          update?.(state);
          if (update || !read.result) records.put(state, KEY);
        } catch (error) {
          validationError = error;
          transaction.abort();
        }
      };

      transaction.oncomplete = () => resolve(state);
      transaction.onabort = () => {
        if (validationError) reject(validationError);
        else reject(new Error('浏览器未能保存数据，请检查可用空间后重试。', { cause: transaction.error }));
      };
    });
  }

  return { change };
}
