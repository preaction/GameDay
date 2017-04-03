
<template>
    <div id="app" class="container-fluid">
        <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active">
                <a href="#games" @click="change_section('Games')" aria-controls="games" role="tab" data-toggle="tab">Games</a>
            </li>
            <li role="presentation">
                <a href="#players" @click="change_section('Players')" aria-controls="players" role="tab" data-toggle="tab">Players</a>
            </li>
        </ul>
        <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="games">
                <game-list />
            </div>
            <div role="tabpanel" class="tab-pane" id="players">
                <player-list ref="Players" />
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

export default {
    name: 'app',
    components: { GameList, PlayerList },
    data() {
        return {
            section: "Welcome",
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
    },
    watch: {
        title() {
            document.title = this.title;
        },
    },
    mount() { this.section = "Games" },
}
</script>
