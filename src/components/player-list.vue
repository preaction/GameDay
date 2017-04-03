
<template>
    <div id="player-list">
        <div class="list-group">
            <div v-for="( player, $index ) in players" class="list-group-item">
                <h4 class="list-group-item-heading">{{ player.name }}</h4>
                <p>DCI: {{ player.dci }}</p>
                <p>Last seen: <time>{{ player.seen }}</time></p>
            </div>
        </div>
    </div>
</template>

<script>
import Player from "../player.js";
export default {
    name: 'player-list',
    data() {
        var data = {
            players: [ ],
        };
        return data;
    },
    methods: {
        refresh() {
            Player.read_all().then(
                (players) => this.players = players
            );
        }
    }
};
</script>
