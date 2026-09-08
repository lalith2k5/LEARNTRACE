process.env.NODE_ENV = 'test';

import { initializeDatabaseSeed, store } from '../server/store.js';

export async function resetTestStore() {
  await initializeDatabaseSeed(true);
  store.attempts = [];
  store.masteries.clear();
  store.recommendations = [];
}
