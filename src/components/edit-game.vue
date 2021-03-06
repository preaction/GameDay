/**
 * @name edit-game
 *
 * This component is a panel for editing/creating games
 */

/**
 * Fired when a game is saved
 *
 * @event edit-game#save
 * @type {Game}
 */

<template>
    <form @submit.prevent="save">
        <div class="buttons">
            <button type="button" @click="close" :class="'btn ' + ( hasChanges ? 'btn-danger' : 'btn-default' )">Close</button>
            <button type="submit" class="btn btn-primary">Save and Close</button>
        </div>
        <h2>Edit Game</h2>
        <div class="form-group">
            <label for="create-game-date">Date</label>
            <input v-model="$data._game.date" @change="hasChanges = true" type="text" class="form-control" id="create-game-date" placeholder="YYYY-MM-DD" />
        </div>
        <div class="form-group">
            <label :for="'import-players-file' + _uid" class="btn btn-default">Upload Players CSV</label>
            <input :id="'import-players-file' + _uid" type="file" style="display: none" aria-hidden="true" @change="read_players_file" />

            <table class="table table-striped table-condensed">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>DCI</th>
                        <th>Seen</th>
                        <th></th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <td colspan="4">
                            <button class="btn btn-default" type="button" @click="add_player">
                                Add Player
                            </button>
                        </td>
                    </tr>
                </tfoot>
                <tbody>
                    <template v-for="( player, $index ) in $data._game.players">
                        <tr :class="player_row_class( player )">
                            <td>
                                <edit-field v-model="player.name" :editing="!player.name"/>
                            </td>
                            <td>
                                <dci-field v-model="player.dci" />
                            </td>
                            <td>
                                <find-player :dci="player.dci" />
                            </td>
                            <td><i class="glyphicon glyphicon-remove clickable" @click="delete_player( $index )"></i></td>
                        </tr>
                    </template>
                </tbody>
            </table>

        </div>
        <import-players-dialog ref="import-players-dialog" @save="import_players" />
        <confirm-dialog ref="confirm-close" />
    </form>
</template>

<style>
    .clickable { cursor: pointer }
    .buttons { float: right }
</style>

<script>
import EditField from './edit-field.vue';
import ConfirmDialog from './confirm-dialog.vue';
import DciField from './dci-field.vue';
import FindPlayer from './find-player.vue';
import ImportPlayersDialog from './import-players-dialog.vue';
import Game from '../game.js';
export default {
    name: 'edit-game',
    components: { EditField, ConfirmDialog, DciField, FindPlayer, ImportPlayersDialog },
    data() {
        return {
            hasChanges: false,
            _game: new Game( this.game ), // copy to stage changes
        };
    },
    props: {
        game: {
            required: true,
        },
    },
    methods: {

        /**
         * Read the players CSV file and open the import dialog.
         *
         * @param {Event} The DOM event for the file input "change"
         */
        read_players_file( ev ) {
            var path = ev.target.value;
            if ( !path ) {
                return;
            }
            var fs = nw.require( 'fs' );
            fs.readFile( path, ( err, data ) => {
                if ( err ) {
                    console.log( 'Read file error: ' + err );
                    return;
                }
                this.show_import_players_dialog( data );
                ev.target.value = '';
            } );
        },

        /**
         * Show the import players dialog
         */
        show_import_players_dialog( data ) {
            let dialog = this.$refs['import-players-dialog'];
            dialog.parse_csv( data );
            $( dialog.$el ).modal( 'show' );
        },

        /**
         * Save the new players from the import dialog
         */
        import_players( players ) {
            this.hasChanges = true;
            this.$data._game.players.push( ...players );
        },

        /**
         * Returns a Bootstrap class to indicate if the row is valid or
         * invalid. Rows are valid if the name field is filled in and if
         * the DCI field is a number less than 10 digits.
         *
         * @returns {string} Bootstrap class name ('success' or 'danger')
         */
        player_row_class( player ) {
            if ( player.name && player.dci.match(/^\d+$/) && player.dci.length <= 10 ) {
                return 'success';
            }
            return 'danger';
        },

        /**
         * Add a new, blank player row
         */
        add_player() {
            this.hasChanges = true;
            this.$data._game.players.push( {} );
        },

        /**
         * Delete the given player
         * @param {integer} The index of the player to delete
         */
        delete_player( index ) {
            this.hasChanges = true;
            this.$data._game.players.splice( index, 1 );
        },

        /**
         * Create the new Game object, notify the opener, and close the
         * dialog. The opener of the dialog must subscribe to the "save"
         * event to get the new Game object.
         *
         * @emits create-game-dialog#save
         */
        save() {
            console.log( `Saving game ${this.game.id} ${this.game.date}` );
            this.game.save( this.$data._game );
            console.log( `Updating player info from game ${this.game.id} ${this.game.date}` );
            this.game.update_players();
            this.hasChanges = false;
            this.$emit( 'save', this.game );
            this.$emit( 'close' );
        },

        /**
         * Tell our opener to close us
         */
        close() {
            if ( this.hasChanges ) {
                let dialog = this.$refs['confirm-close'];
                dialog.$once( 'confirm',
                    ( confirmed ) => {
                        if ( confirmed ) {
                            this.$emit( 'close' );
                        }
                    }
                );
                $( dialog.$el ).modal('show');
            }
            else {
                this.$emit( 'close' );
            }
        }
    }
}
</script>
