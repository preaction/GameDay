
<template>
    <div id="game-list">
        <p>
            <button @click="show_new_game_tab" class="btn btn-success">Create Game</button>
        </p>
        <div class="list-group">
            <div v-for="( game, $index ) in games" class="list-group-item">
                <h4 class="list-group-item-heading">{{ game.date }}</h4>
                <p>{{ game.players ? game.players.length : 0 }} players</p>
                <label class="btn btn-default">Export to WER
                    <input style="display: none" type="file" :nwsaveas="'players-' + game.date + '.xml'" @change="export_game( $event.target, game )" />
                </label>
                <button class="btn btn-danger" @click="show_delete_game_dialog( $index, game )">Delete</button>
            </div>
        </div>
        <confirm-dialog ref="confirm-delete" id="confirm-delete" />
    </div>
</template>

<script>
import Game from "../game.js";
import ConfirmDialog from "./confirm-dialog.vue";
export default {
    name: 'game-list',
    components: { ConfirmDialog },
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

        save_game( game ) {
            // If this was a new game, add it to the list
            if ( this.games.indexOf( game ) < 0 ) {
                this.games.unshift( game );
            }
        },

        show_new_game_tab( ) {
            var game = new Game();
            this.$emit( 'edit', game );
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
            var xml = builder.create('event', {}, {}, { headless: true });
            xml.att( 'teamSize', 1 );
            let teams = xml.ele( 'teams' );
            for ( let player of game.players ) {
                let team = teams.ele( 'team', { name: player.name } );
                team.ele( 'players' ).ele( 'player', { dciNumber: player.dci } );
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

