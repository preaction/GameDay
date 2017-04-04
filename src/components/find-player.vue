
/**
 * @name find-player
 *
 * This component shows an indicator of whether we've seen this player
 * before or not.
 *
 * In the future, it will open a way to look up records that are close
 * to this player so we can copy them into our row.
 *
 * @prop name The name of the player
 */

<template>
    <span>{{ seen }}</span>
</template>

<script>
import Player from '../player.js';
export default {
    name: 'find-player',
    data() {
        this.update_seen();
        return {
            seen: "",
        };
    },
    props: {
        name: {
            required: true,
        },
        dci: {
            required: true,
        },
    },
    methods: {
        /**
         * Check to see if we've seen this player before. Sets the
         * "seen" field to a string "Yes" or "No".
         */
        update_seen() {
            Player.find(
                this.name,
                this.dci
            )
            .then( ( player ) => {
                this.seen = player ? "Yes" : "No";
            } );
        },
    },
    watch: {
        name() { this.update_seen() },
        dci() { this.update_seen() },
    },
}
</script>
