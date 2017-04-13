/**
 * @name player-flag
 *
 * This component shows an indicator of whether the player is flagged,
 * and shows the player comments on clicking.
 *
 * @prop player The player
 */

<template>
    <i v-show="player.flagged" class="clickable glyphicon glyphicon-flag" data-toggle="popover" tabindex="0"></i>
</template>

<script>
export default {
    name: 'player-flag',
    props: {
        player: {
            required: true
        },
    },
    mounted() {
        let el = $( this.$el );
        el.popover( {
            placement: "left",
            trigger: "focus",
            content: () => {
                /* Use a function so that the popover gets updated after
                 * editing
                 */
                return this.player.comments;
            },
        } );
    }
}
</script>
