
<template>
    <div id="player-list">
        <table class="table table-striped table-hover table-sortable">
            <thead>
                <tr>
                    <th is="th-sort" field="firstName">First Name</th>
                    <th is="th-sort" field="lastName">Last Name</th>
                    <th is="th-sort" field="dci">DCI</th>
                    <th is="th-sort" field="seen">Last Seen</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <template v-for="{ data: player, index } in sorted( players )">
                    <tr>
                        <td>
                            <edit-field v-model="player.firstName" @input="player.save()" />
                        </td>
                        <td>
                            <edit-field v-model="player.lastName" @input="player.save()" />
                        </td>
                        <td>
                            <dci-field v-model="player.dci" @input="player.save()" />
                        </td>
                        <td><time>{{ player.seenDate }}</time></td>
                        <td class="text-center">
                            <player-flag :player="player" />
                            <i class="clickable glyphicon glyphicon-pencil" @click="show_edit_player_dialog( player, index )"></i>
                            <i class="clickable glyphicon glyphicon-remove" @click="show_delete_player_dialog( player, index )"></i>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
        <confirm-dialog ref="confirm-delete-player" id="confirm-delete-player" />
        <edit-player-dialog v-model="editing_player" ref="edit-player-dialog" id="edit-player-dialog" />
    </div>
</template>

<style>
    .clickable { cursor: pointer }
</style>

<script>
import Player from "../player.js";
import EditField from "./edit-field.vue";
import DciField from "./dci-field.vue";
import ConfirmDialog from "./confirm-dialog.vue";
import EditPlayerDialog from "./edit-player.vue";
import PlayerFlag from "./player-flag.vue";
import sortable_table from "./mixins/sortable-table.js";
export default {
    name: 'player-list',
    components: { EditField, DciField, ConfirmDialog, EditPlayerDialog, PlayerFlag },
    mixins: [ sortable_table ],
    data() {
        var data = {
            players: [ ],
            editing_player: { },
        };
        return data;
    },
    methods: {
        refresh() {
            Player.read_all().then(
                (players) => this.players = players
            );
        },

        show_edit_player_dialog( player, index ) {
            this.editing_player = player;
            this.$refs['edit-player-dialog'].$once( 'input',
                ( new_player ) => {
                    this.players.splice( index, 1, new_player );
                },
            );
            $('#edit-player-dialog').modal('show');
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
