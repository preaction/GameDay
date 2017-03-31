
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
                            <label for="create-game-players-file">Upload Players</label>
                            <input id="create-game-players-file" type="file" @change="read_players_file" />
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

<script>
export default {
    name: 'create-game-dialog',
    data() {
        return {
            date: '',
            players: [ ],
        }
    },
    methods: {

        read_players_file( ev ) {
            var path = ev.target.value;
            var fs = nw.require( 'fs' );

            var parse = nw.require( 'csv-parse/lib/sync' );
            fs.readFile( path, ( err, data ) => {
                if ( err ) {
                    console.log( 'Read file error: ' + err );
                    return;
                }
                this.players = parse(data, {columns: true});
            } );
        },

        save() {
            this.$emit( 'save', this );
            this.close();
        },

        close() {
            $(this.$el).modal('hide');
        }
    }
}
</script>
