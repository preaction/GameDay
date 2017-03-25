
<template>
    <div id="app" class="container-fluid">
        <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active">
                <a href="#events" @click="section = 'Events'" aria-controls="events" role="tab" data-toggle="tab">Events</a>
            </li>
            <li role="presentation">
                <a href="#players" @click="section = 'Players'" aria-controls="players" role="tab" data-toggle="tab">Players</a>
            </li>
        </ul>
        <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="events">
                <event-list />
            </div>
            <div role="tabpanel" class="tab-pane active" id="players">
                <!--<player-list />-->
            </div>
        </div>
    </div>
</template>

<style>
    #app {
        /* Give some space from the top of the window */
        margin-top: 5px;
    }
    #app > .nav-tabs {
        /* Make the tab border take up the full width of the screen */
        margin: 0 -15px;
        padding: 0 15px;
    }
    .tab-content {
        /* Add some space after the tab border */
        margin-top: 5px;
    }
</style>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";
import "bootstrap";
import EventList from "./components/event-list.vue";

export default {
    name: 'app',
    components: { EventList },
    data() {
        return {
            section: "Welcome",
        };
    },
    computed: {
        title() { return this.section + " - GameDay"; },
    },
    watch: {
        title() {
            document.title = this.title;
        },
    },
    mount() { this.section = "Events" },
}
</script>
