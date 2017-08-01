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
        if ( attrs.name ) {
            this.seenNames = [ attrs.name.toLowerCase() ];
        }
        this.seenNames = attrs.seenNames || [];
        let firstName, lastName;
        if ( this.seenNames.length > 0 ) {
            let words = this.seenNames[0].split( /\s+/ );
            firstName = words.slice( 0, -2 ).join( " " );
            lastName = words[ words.length - 1 ];
        }
        this.firstName = attrs.firstName || firstName || '';
        this.lastName = attrs.lastName || lastName || '';
        this.dci = attrs.dci;
        this.flagged = attrs.flagged || false;
        this.comments = attrs.comments || '';
    }

    static find_or_create( dci ) {
        return Player.find( dci ).then(
            ( player ) => {
                console.log( `Found player ${player} (${dci})` );
                return player || new Player( { dci: dci } );
            }
        );
    }

    static find( dci ) {
        return db.players.where( 'dci' ).equals( dci ).first();
    }

    save() {
        if ( !this.dci ) {
            throw "DCI is required before saving";
        }
        db.players.put( this );
    }

    delete() {
        db.players.delete( this.id );
    }

    update_seen( name, date ) {
        console.log( `Updating registration: ${this.dci} ${this.firstName} ${this.lastName}. Registered as: ${name}, ${date}` );
        let lcname = name.toLowerCase();
        if ( this.seenNames.indexOf( lcname ) < 0 ) {
            this.seenNames.push( lcname );
            if ( !this.firstName || !this.lastName ) {
                let words = name.split( /\s+/ );
                this.firstName = this.firstName || words.slice( 0, words.length - 1 ).join( " " );
                this.lastName = this.lastName || words[ words.length - 1 ];
            }
        }
        if ( !this.seenDate || moment( date ).isAfter( this.seenDate ) ) {
            this.seenDate = date;
        }
    }

    static read_all() {
        return db.players.toArray();
    }
};

db.players.mapToClass( Player );

export default Player;
