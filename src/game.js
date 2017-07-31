
/**
 * @name Game
 *
 * The game class works with games and loads them from the local
 * storage.
 */
import db from "./db.js";
import Player from "./player.js";
class Game {

    constructor( attrs={} ) {
        this.date = attrs.date || '';
        this.players = attrs.players ? attrs.players.slice() : [];
    }

    save( attrs ) {
        for ( var k in attrs ) {
            if ( k != "id" && this.hasOwnProperty( k ) ) {
                this[k] = attrs[k];
            }
        }
        db.games.put( this );
    }

    delete() {
        db.games.delete( this.id );
    }

    /**
     * Update all the players' "seen" with the date of this
     * game.
     *
     * @return {object} Promise that resolves after the players are updated
     * @link Player/seen
     */
    update_players() {
        return db.transaction( 'rw', db.games, db.players, () => {
            for ( var player of this.players ) {
                Player.find_or_create( player.name, player.dci ).then(
                    ( player ) => {
                        player.update_seen( this.date );
                        player.save();
                    }
                );
            }
        } );
    }

    static read_all() {
        return db.games.reverse().toArray();
    }
};

db.games.mapToClass( Game );

export default Game;
