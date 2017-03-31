
<template>
    <div id="game-list">
        <p>
            <button @click="show_create_game_dialog" class="btn btn-success">Create Game</button>
        </p>
        <div class="list-group">
            <div v-for="game in games" class="list-group-item">
                <h4 class="list-group-item-heading">{{ game.date }}</h4>
                <p>{{ game.players.length }} players</p>
                <label class="btn btn-default" for="export">Export</label>
                <input style="display: none" id="export" type="file" :nwsaveas="'players-' + game.date + '.xml'" @change="export_game( $event.target, game )" />
                <button class="btn btn-danger" @click="delete_game( game )">Delete</button>
            </div>
        </div>
        <create-game-dialog id="create-game" @save="create_game" />
    </div>
</template>

<script>
import CreateGameDialog from "./create-game-dialog.vue";
export default {
    name: 'game-list',
    components: { CreateGameDialog },
    data() {
        return {
            // XXX Read games from local storage
            games: [
                {
                    date: '2016-01-01T00:00:00Z',
                    players: [
                        {
                            name: "Doug Bell",
                            dci: '1234567890',
                        },
                        {
                            name: "Henry Bangsberg",
                            dci: '1234567890',
                        },
                        {
                            name: "David Perkins",
                            dci: '1234567890',
                        },
                    ],
                },
                {
                    date: '2017-01-01T00:00:00Z',
                    players: [
                        {
                            name: "Doug Bell",
                            dci: '1234567890',
                        },
                    ],
                }
            ],
        };
    },
    methods: {

        show_create_game_dialog() {
            $('#create-game').modal('show');
        },

        create_game( newGame ) {
            this.games.unshift( newGame );
        },

        delete_game() {
            // XXX Delete a game from the local storage
        },

        export_game( el, game ) {
            console.log( "Exporting " + game.date + " to " + el.value );
            // XXX Create XML here
            var xml = '';

            var fs = nw.require( 'fs' );
            fs.writeFile( el.value, "Hello", ( e ) => {
                if ( e ) {
                    // XXX Show an error dialog instead
                    alert( e );
                }
                // XXX Show a success dialog instead
                console.log("The file is saved!");
            });
        },
    }
}
</script>

