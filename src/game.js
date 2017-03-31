
/**
 * @name Game
 *
 * The game class works with games and loads them from the local
 * storage.
 */
import db from "./db.js";
class Game {

    constructor( attrs ) {
        this.date = attrs.date;
        this.players = attrs.players;
    }

    save() {
        db.games.put( this );
    }

    static read_all() {
        return db.games.reverse().toArray();
    }
};

db.games.mapToClass( Game );

export default Game;
