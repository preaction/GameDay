
<template>
    <div id="player-list">
        <table class="table table-striped table-hover table-sortable">
            <thead>
                <tr>
                    <th is="th-sort" field="name">Name</th>
                    <th is="th-sort" field="dci">DCI</th>
                    <th is="th-sort" field="seen">Last Seen</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="player in sorted( players )">
                    <tr>
                        <td>{{ player.name }}</td>
                        <td>{{ player.dci }}</td>
                        <td><time>{{ player.seen }}</time></td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>
import Player from "../player.js";
import sortable_table from "./mixins/sortable-table.js";
export default {
    name: 'player-list',
    mixins: [ sortable_table ],
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
