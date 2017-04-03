/**
 * @name Player
 *
 * The player class works with players and loads them from the local
 * storage.
 */
import db from "./db.js";
class Player {

    constructor( attrs ) {
        this.name = attrs.name;
        this.dci = attrs.dci;
    }

    static find_or_create( name, dci ) {
        db.players.get( { name: name, dci: dci } ).then(
            ( player ) => {
                if ( player ) {
                    return player;
                }
                player = new Player( name, dci );
                player.save();
                return player;
            }
        );
    }

    save() {
        db.players.put( this );
    }

    delete() {
        db.players.delete( this.id );
    }

    update_seen( date ) {
        this.seen = date;
        this.save();
    }

    static read_all() {
        return db.players.toArray();
    }
};

db.players.mapToClass( Player );

export default Player;
