/**
 * @name Player
 *
 * The player class works with players and loads them from the local
 * storage.
 */
import db from "./db.js";
import moment from 'moment';
class Player {

    constructor( attrs={} ) {
        this.name = attrs.name;
        this.dci = attrs.dci;
        this.flagged = attrs.flagged || false;
        this.comments = attrs.comments || '';
    }

    static find_or_create( name, dci ) {
        return Player.find( name, dci ).then(
            ( player ) => {
                if ( player ) {
                    return player;
                }
                player = new Player( { name: name, dci: dci } );
                return player;
            }
        );
    }

    static find( name, dci ) {
        return db.players.where( '[name+dci]' ).equals( [ name, dci ] ).first();
    }

    save() {
        db.players.put( this );
    }

    delete() {
        db.players.delete( this.id );
    }

    update_seen( date ) {
        if ( !this.seen || moment( date ).isAfter( this.seen ) ) {
            this.seen = date;
        }
    }

    static read_all() {
        return db.players.toArray();
    }
};

db.players.mapToClass( Player );

export default Player;
