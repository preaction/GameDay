<template>
    <div class="modal fade" tabindex="-1" role="dialog">
        <form @submit.prevent="save">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" @click="close" aria-label="Close"><span aria-hidden="true">x</span></button>
                        <h4 class="modal-title">Edit Player</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="player-name">Name</label>
                            <input v-model="player.name" type="text" class="form-control" id="player-name" />
                        </div>
                        <div class="form-group">
                            <label for="player-dci">Name</label>
                            <input v-model="player.dci" type="text" class="form-control" id="player-dci" />
                        </div>
                        <div class="form-group">
                            <label for="player-flagged">Flagged</label>
                            <toggle-yes-no v-model="player.flagged" id="player-flagged" />
                        </div>
                        <div class="form-group">
                            <label for="player-comments">Comments</label>
                            <textarea v-model="player.comments" class="form-control" id="player-comments"></textarea>
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
import EditField from './edit-field.vue';
import ToggleYesNo from './toggle-yes-no.vue';
import Player from '../player.js';
export default {
    name: 'edit-player-dialog',
    components: { EditField, ToggleYesNo },
    props: {
        value: {
            required: true
        },
    },
    data() {
        return {
            player: {},
        };
    },
    methods: {

        save() {
            this.player.save();
            this.$emit( 'input', this.player );
            this.close();
        },

        close() {
            $(this.$el).modal('hide');
        }
    },
    watch: {
        value() {
            console.log( `Updating value ${this.value.name} (${this.value.dci})` );
            this.player = Object.assign( new Player({}), this.value );
        },
    },
}
</script>
