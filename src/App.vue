
<template>
    <div id="app" class="container-fluid">
        <ul id="main-tabs" class="nav nav-tabs" role="tablist">
            <li role="presentation">
                <a href="#players" @click="change_section('Players')" aria-controls="players" role="tab" data-toggle="tab">Players</a>
            </li>
            <li role="presentation" class="active">
                <a href="#games" @click="change_section('Games')" aria-controls="games" role="tab" data-toggle="tab">Games</a>
            </li>
            <li v-for="( game, $i ) in edit_games">
                <a :href="'#game-' + $i" @click="change_section('Edit ' + (game.date||'New Game') )" role="tab" data-toggle="tab">
                    {{ game.date || "New Game" }}
                </a>
            </li>
        </ul>
        <div class="tab-content">
            <div role="tabpanel" class="tab-pane" id="players">
                <player-list ref="Players" />
            </div>
            <div role="tabpanel" class="tab-pane active" id="games">
                <game-list @edit="show_edit_game_tab" ref="game-list" />
            </div>
            <div v-for="( game, $i ) in edit_games" role="tabpanel" class="tab-pane" :id="'game-' + $i">
                <edit-game :game="game" @close="close_edit_game_tab( $i )" @save="save_game" />
            </div>

        </div>
    </div>
</template>

<style>
    #app > .nav-tabs {
        /* Give some space on the top and sides of the window */
        padding: 5px 15px 0;
        background: white;
        position: fixed;
        top: 0; left: 0; right: 0;
        z-index: 1000;
    }
    .tab-content {
        /* Move out from under the nav tabs */
        margin-top: 65px;
    }
</style>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";
import "bootstrap";
import GameList from "./components/game-list.vue";
import PlayerList from "./components/player-list.vue";
import EditGame from "./components/edit-game.vue";

export default {
    name: 'app',
    components: { GameList, PlayerList, EditGame },
    data() {
        return {
            section: "Welcome",
            edit_games: [],
        };
    },
    computed: {
        title() { return this.section + " - GameDay"; },
    },
    methods: {
        change_section( section ) {
            this.section = section;
            if ( this.$refs[section] && this.$refs[section].refresh ) {
                this.$refs[section].refresh();
            }
        },
        show_edit_game_tab( game ) {
            this.edit_games.push( game );
            this.$nextTick( () => {
                let tab_id = this.edit_games.length + 1; // Tabs are 0-based and there are 2 extra tabs
                $( '#main-tabs li:eq(' + tab_id + ') a' ).tab( 'show' );
            } );
        },
        close_edit_game_tab( i ) {
            this.edit_games.splice( i, 1 );
            this.$nextTick( () => {
                // Show game list tab
                $( '#main-tabs li:eq(1) a' ).tab( 'show' );
                this.change_section( "Games" );
            } );
        },
        save_game( game ) {
            this.$refs["game-list"].save_game( game );
        },
    },
    watch: {
        title() {
            document.title = this.title;
        },
    },
    mount() { this.section = "Games" },
}
</script>
