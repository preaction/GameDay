
<template>
    <div id="player-list">
        <table class="table table-striped table-hover table-sortable">
            <thead>
                <tr>
                    <th is="th-sort" field="name">Name</th>
                    <th is="th-sort" field="dci">DCI</th>
                    <th is="th-sort" field="seen">Last Seen</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <template v-for="{ data: player, index } in sorted( players )">
                    <tr>
                        <td>
                            <edit-field v-model="player.name" @input="player.save()" />
                        </td>
                        <td>
                            <edit-field v-model="player.dci" @input="player.save()" />
                        </td>
                        <td><time>{{ player.seen }}</time></td>
                        <td class="text-center">
                            <i class="clickable glyphicon glyphicon-remove" @click="show_delete_player_dialog( player, index )"></i>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
        <confirm-dialog ref="confirm-delete-player" id="confirm-delete-player" />
    </div>
</template>

<style>
    .clickable { cursor: pointer }
</style>

<script>
import Player from "../player.js";
import EditField from "./edit-field.vue";
import ConfirmDialog from "./confirm-dialog.vue";
import sortable_table from "./mixins/sortable-table.js";
export default {
    name: 'player-list',
    components: { EditField, ConfirmDialog },
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
        },

        show_delete_player_dialog( player, index ) {
            this.$refs['confirm-delete-player'].$once( 'confirm',
                ( confirmed ) => {
                    if ( confirmed ) {
                        this.delete_player( player, index );
                    }
                }
            );
            $('#confirm-delete-player').modal('show');
        },

        delete_player( player, index ) {
            player.delete();
            this.players.splice( index, 1 );
        },

    }
};
</script>
