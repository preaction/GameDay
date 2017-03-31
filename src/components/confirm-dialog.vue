
/**
 *
 */

<template>
    <div class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Confirm</h4>
                </div>
                <div class="modal-body">
                    Are you sure?
                </div>
                <div class="modal-footer">
                    <button type="button" @click="no" class="btn btn-default">No</button>
                    <button type="button" @click="yes" class="btn btn-danger">Yes</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'confirm-dialog',
    methods: {

        no() {
            this.$emit( 'confirm', false );
            this.close();
        },

        yes() {
            this.$emit( 'confirm', true );
            this.close();
        },

        close() {
            $(this.$el).modal('hide');
        }
    }
}
</script>
