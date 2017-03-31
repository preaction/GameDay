
<template>
    <div id="game-list">
        <p>
            <button @click="show_create_game_dialog" class="btn btn-success">Create Game</button>
        </p>
        <div class="list-group">
            <div v-for="( game, $index ) in games" class="list-group-item">
                <h4 class="list-group-item-heading">{{ game.date }}</h4>
                <p>{{ game.players ? game.players.length : 0 }} players</p>
                <label class="btn btn-default" for="export">Export to WER</label>
                <input style="display: none" id="export" type="file" :nwsaveas="'players-' + game.date + '.xml'" @change="export_game( $event.target, game )" />
                <button class="btn btn-danger" @click="show_delete_game_dialog( $index, game )">Delete</button>
            </div>
        </div>
        <create-game-dialog id="create-game" @save="create_game" />
        <confirm-dialog ref="confirm-delete" id="confirm-delete" />
    </div>
</template>

<script>
import Game from "../game.js";
import CreateGameDialog from "./create-game-dialog.vue";
import ConfirmDialog from "./confirm-dialog.vue";
export default {
    name: 'game-list',
    components: { CreateGameDialog, ConfirmDialog },
    data() {
        var data = {
            games: [ ],
        };
        Game.read_all().then(
            (games) => data.games = games
        );
        return data;
    },
    methods: {

        show_create_game_dialog() {
            $('#create-game').modal('show');
        },

        create_game( newGame ) {
            var game = new Game( newGame );
            game.save();
            this.games.unshift( game );
        },

        show_delete_game_dialog( i, game ) {
            this.$refs['confirm-delete'].$once( 'confirm',
                ( confirmed ) => {
                    if ( confirmed ) {
                        this.delete_game( i, game );
                    }
                }
            );
            $('#confirm-delete').modal('show');
        },

        delete_game( i, game ) {
            game.delete();
            this.games.splice( i, 1 );
        },

        export_game( el, game ) {
            console.log( "Exporting " + game.date + " to " + el.value );
            var builder = nw.require('xmlbuilder');
            var xml = builder.create('game');
            for ( let player of game.players ) {
                let team = xml.ele( 'team' );
                team.ele( 'name', player.name );
                team.ele( 'dci', player.dci );
            }

            var fs = nw.require( 'fs' );
            fs.writeFile( el.value, xml.end({pretty:true}), ( e ) => {
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

