
<template>
    <span>
        <span v-if="!editing" @dblclick="toggle_edit( true )">{{ value }}</span>
        <input v-model="value" v-if="editing" @blur="input" @keypress.enter="input" />
    </span>
</template>

<script>
export default {
    name: 'edit-field',
    data() {
        return {
            editing: false
        }
    },
    props: {
        value: {
            required: true,
        },
    },
    methods: {
        toggle_edit( value ) {
            this.editing = value;
            if ( this.editing == true ) {
                this.$nextTick( () => {
                    let input = this.$el.querySelector( 'input' );
                    input.focus();
                    input.select();
                } );
            }
        },
        input() {
            this.$emit( 'input', this.value );
            this.toggle_edit( false );
        },
    }
}
</script>
