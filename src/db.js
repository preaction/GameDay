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
db.version(2).stores({
    players: '++id,&[name+dci],name,dci',
});

export default db;
