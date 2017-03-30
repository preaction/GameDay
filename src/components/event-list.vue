
<template>
    <div id="event-list">
        <p>
            <button @click="show_create_event_dialog" class="btn btn-success">Create Event</button>
        </p>
        <div class="list-group">
            <div v-for="event in events" class="list-group-item">
                <h4 class="list-group-item-heading">{{ event.date }}</h4>
                <p>{{ event.players.length }} players</p>
                <label class="btn btn-default" for="export">Export</label>
                <input style="display: none" id="export" type="file" :nwsaveas="'players-' + event.date + '.xml'" @change="export_event( $event.target, event )" />
                <button class="btn btn-danger" @click="delete_event( event )">Delete</button>
            </div>
        </div>
        <create-event-dialog id="create-event" @save="create_event" />
    </div>
</template>

<script>
import CreateEventDialog from "./create-event-dialog.vue";
export default {
    name: 'event-list',
    components: { CreateEventDialog },
    data() {
        return {
            // XXX Read events from local storage
            events: [
                {
                    date: '2016-01-01T00:00:00Z',
                    players: [
                        {
                            name: "Doug Bell",
                            dci: '1234567890',
                        },
                        {
                            name: "Henry Bangsberg",
                            dci: '1234567890',
                        },
                        {
                            name: "David Perkins",
                            dci: '1234567890',
                        },
                    ],
                },
                {
                    date: '2017-01-01T00:00:00Z',
                    players: [
                        {
                            name: "Doug Bell",
                            dci: '1234567890',
                        },
                    ],
                }
            ],
        };
    },
    methods: {

        show_create_event_dialog() {
            $('#create-event').modal('show');
        },

        create_event( newEvent ) {
            this.events.unshift( newEvent );
        },

        delete_event() {
            // XXX Delete an event from the local storage
        },

        export_event( el, event ) {
            console.log( "Exporting " + event.date + " to " + el.value );
            // XXX Create XML here
            var xml = '';

            var fs = nw.require( 'fs' );
            fs.writeFile( el.value, "Hello", ( e ) => {
                if ( e ) {
                    // XXX Show an error dialog instead
                    alert( e );
                }
                // XXX Show a success dialog instead
                console.log("The file is saved!");
            });
        },
    }
}
</script>

