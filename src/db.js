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

db.version(3).upgrade( async ( txn ) => {
    // Delete the old indexes manually because Dexie can't
    let store = txn.idbtrans.objectStore( 'players' );
    store.deleteIndex( '[name+dci]' );
    store.deleteIndex( 'name' );
    store.deleteIndex( 'dci' );

    let playerDci = {};
    await new Promise(
        ( resolve, reject ) => {
            store.openCursor().onsuccess = ( e ) => {
                let csr = e.target.result;
                if ( csr ) {
                    let player = csr.value;
                    if ( !playerDci[ player.dci ] ) {
                        playerDci[ player.dci ] = player;
                        player.seenNames = [ player.name.toLowerCase() ];
                        let words = player.name.split( /\s+/ );
                        console.log( words );
                        player.firstName = words.slice( 0, words.length - 1 ).join( " " );
                        player.lastName = words[ words.length - 1 ];
                        console.log( player );
                        player.seenDate = player.seen;
                        delete player.name;
                        delete player.seen;
                        csr.update( player );
                    }
                    else {
                        csr.delete();
                    }

                    csr.continue();
                }
                else {
                    resolve();
                }
            };
        }
    );

    store.createIndex( 'seenNames', 'seenNames', { multiEntry: true } );
    store.createIndex( 'dci', 'dci', { unique: true } );
});


export default db;
