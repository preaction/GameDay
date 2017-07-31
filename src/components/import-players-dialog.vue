/**
 * @name import-players-dialog
 *
 * This component is a dialog box for importing players into a game.
 * The dialog is created after the file is uploaded, and will show the
 * contents of the file so the user can select which fields are the
 * player's name and DCI number.
 */

/**
 * Fired when the dialog is finished and the players are ready
 *
 * @event import-players-dialog#save
 * @type {Array[Player]}
 */

<template>
    <div class="modal fade" tabindex="-1" role="dialog">
        <form @submit.prevent="save">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" @click="close" aria-label="Close"><span aria-hidden="true">x</span></button>
                        <h4 class="modal-title">Import Players</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="csv-name-field">Name field: </label>
                            <select v-model="name_field" id="csv-name-field" class="form-control">
                                <option v-for="( field, i ) in csv_fields" :value="i">{{ field }}</option>
                            </select>
                            <label for="csv-dci-field">DCI field: </label>
                            <select v-model="dci_field" id="csv-dci-field" class="form-control">
                                <option v-for="( field, i ) in csv_fields" :value="i">{{ field }}</option>
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
                                <tbody>
                                    <template v-for="( row, $index ) in csv_rows">
                                        <tr :class="csv_row_class( row )">
                                            <td>
                                                <edit-field v-model="row[name_field]" :editing="!row[name_field]"/>
                                            </td>
                                            <td>
                                                <dci-field v-model="row[dci_field]" />
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
                    <div class="modal-footer">
                        <button type="button" @click="close" class="btn btn-danger">Cancel</button>
                        <button type="submit" class="btn btn-primary">Import</button>
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
import DciField from './dci-field.vue';
import FindPlayer from './find-player.vue';
export default {
    name: 'import-players-dialog',
    components: { EditField, DciField, FindPlayer },
    data() {
        return {
            date: '',
            csv_rows: [ ],
            csv_fields: [ ],
            name_field: 0,
            dci_field: 0,
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
         * @param {String} The contents of the CSV file
         */
        parse_csv( data ) {
            var parse = nw.require( 'csv-parse/lib/sync' );
            try {
                this.csv_rows = parse(data);
                this.csv_fields = this.csv_rows.shift();
                // Name and DCI are the first two questions in the form
                this.name_field = this.csv_fields.length >= 1 ? 1 : 0;
                this.dci_field = this.csv_fields.length >= 2 ? 2 : 0;
            }
            catch (err) {
                alert( "Error parsing CSV: " + err );
            }
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
         * Delete the given row from the CSV rows
         * @param {integer} The row to delete
         */
        delete_csv_row( index ) {
            this.csv_rows.splice( index, 1 );
        },

        /**
         * Create the new Player objects, notify the opener, and close the
         * dialog. The opener of the dialog must subscribe to the "save"
         * event to get the new Player objects.
         *
         * @emits import-players-dialog#save
         */
        save() {
            let players = [];
            for ( var row of this.csv_rows ) {
                players.push(
                    {
                        name: row[ this.name_field ],
                        dci: row[ this.dci_field ],
                    }
                );
            }
            this.$emit( 'save', players );
            this.close();
        },

        /**
         * Closes the Bootstrap modal (this component)
         */
        close() {
            this.csv_rows = [];
            this.csv_fields = [];
            $(this.$el).modal('hide');
        }
    }
}
</script>
