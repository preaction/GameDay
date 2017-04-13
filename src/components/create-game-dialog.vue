/**
 * @name create-game-dialog
 *
 * This component is a dialog box for creating a new game.
 */

/**
 * Fired when a new game is created by the dialog
 *
 * @event create-game-dialog#save
 * @type {Game}
 */

<template>
    <div class="modal fade" tabindex="-1" role="dialog">
        <form @submit.prevent="save">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" @click="close" aria-label="Close"><span aria-hidden="true">x</span></button>
                        <h4 class="modal-title">Create Game</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="create-game-date">Date</label>
                            <input v-model="date" type="text" class="form-control" id="create-game-date" placeholder="YYYY-MM-DD" />
                        </div>
                        <div class="form-group">
                            <label for="create-game-players-file" class="btn btn-default">Upload Players CSV</label>
                            <input id="create-game-players-file" type="file" style="display: none" aria-hidden="true" @change="read_players_file" />

                            <div v-if="csv_rows.length">
                                <label for="csv-name-field">Name field: </label>
                                <select v-model="name_field" id="csv-name-field" class="form-control">
                                    <option v-for="field in csv_fields">{{ field }}</option>
                                </select>
                                <label for="csv-dci-field">DCI field: </label>
                                <select v-model="dci_field" id="csv-dci-field" class="form-control">
                                    <option v-for="field in csv_fields">{{ field }}</option>
                                </select>

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
                                                <button class="btn btn-default" type="button" @click="add_csv_row">
                                                    Add Player
                                                </button>
                                            </td>
                                        </tr>
                                    </tfoot>
                                    <tbody>
                                        <template v-for="( row, $index ) in csv_rows">
                                            <tr :class="csv_row_class( row )">
                                                <td>
                                                    <edit-field v-model="row[name_field]" :editing="!row[name_field]"/>
                                                </td>
                                                <td>
                                                    <edit-field v-model="row[dci_field]" :editing="!row[dci_field]" />
                                                </td>
                                                <td>
                                                    <find-player :name="row[name_field]" :dci="row[dci_field]" />
                                                </td>
                                                <td><i class="glyphicon glyphicon-remove clickable" @click="delete_csv_row( $index )"></i></td>
                                            </tr>
                                        </template>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" @click="close" class="btn btn-default">Close</button>
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<style>
    .clickable { cursor: pointer }
</style>

<script>
import EditField from './edit-field.vue';
import FindPlayer from './find-player.vue';
export default {
    name: 'create-game-dialog',
    components: { EditField, FindPlayer },
    data() {
        return {
            date: '',
            csv_rows: [ ],
            csv_fields: [ ],
            name_field: '',
            dci_field: '',
        }
    },
    methods: {

        /**
         * Read the players CSV file. This reads the CSV headers to
         * allow the user to pick which fields should be mapped to the
         * player's name and DCI number. And reads the CSV rows as an
         * array of objects of CSV header mapped to value. Finally, it
         * pre-selects the name field and DCI field with a guess.
         *
         * @param {Event} The DOM event for the file input "change"
         */
        read_players_file( ev ) {
            var path = ev.target.value;
            var fs = nw.require( 'fs' );

            var parse = nw.require( 'csv-parse/lib/sync' );
            fs.readFile( path, ( err, data ) => {
                if ( err ) {
                    console.log( 'Read file error: ' + err );
                    return;
                }
                this.csv_rows = parse(data, {columns: true});
                this.csv_fields = Object.keys( this.csv_rows[0] );
                // Name and DCI are the first two questions in the form
                this.name_field = this.csv_fields[1];
                this.dci_field = this.csv_fields[2];
            } );
        },

        /**
         * Returns a Bootstrap class to indicate if the row is valid or
         * invalid. Rows are valid if the name field is filled in and if
         * the DCI field is a number less than 10 digits.
         *
         * @returns {string} Bootstrap class name ('success' or 'danger')
         */
        csv_row_class( row ) {
            if ( row[this.name_field] && row[this.dci_field].match(/^\d+$/) && row[this.dci_field].length <= 10 ) {
                return 'success';
            }
            return 'danger';
        },

        /**
         * Add a new, blank row to the CSV rows
         */
        add_csv_row() {
            let row = {};
            for ( let key of this.csv_fields ) {
                row[key] = '';
            }
            this.csv_rows.push( row );
        },

        /**
         * Delete the given row from the CSV rows
         * @param {integer} The row to delete
         */
        delete_csv_row( index ) {
            this.csv_rows.splice( index, 1 );
        },

        /**
         * Create the new Game object, notify the opener, and close the
         * dialog. The opener of the dialog must subscribe to the "save"
         * event to get the new Game object.
         *
         * @emits create-game-dialog#save
         */
        save() {
            var game = {
                date: this.date,
                players: [],
            };
            for ( var row of this.csv_rows ) {
                game.players.push(
                    {
                        name: row[ this.name_field ],
                        dci: row[ this.dci_field ],
                    }
                );
            }
            this.$emit( 'save', game );
            this.close();
        },

        /**
         * Closes the Bootstrap modal (this component)
         */
        close() {
            this.csv_rows = [];
            this.csv_fields = [];
            this.date = '';
            $(this.$el).modal('hide');
        }
    }
}
</script>
