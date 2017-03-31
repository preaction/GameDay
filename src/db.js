/**
 * @name db
 *
 * A shared instance of an IndexedDB for our application
 */

import Dexie from "dexie";

const db = new Dexie('GameDay');
db.version(1).stores({
    games: '++id,date',
});

export default db;
