
<template>
    <edit-field v-model="value" @input="input" @focus="show_error" :editing="!value" @mouseenter="show_error" @mouseleave="hide_error" />
</template>

<script>
import EditField from './edit-field.vue';
export default {
    name: 'dci-field',
    components: { EditField },
    data() {
        let errors = this.check( this.value );
        return {
            _errors: errors,
            hasErrors: !!errors.length,
        };
    },
    props: {
        value: {
            required: true,
        },
        errors: {
            default: () => [],
        },
    },
    methods: {
        show_error() {
            if ( this.$data._errors.length > 0 ) {
                $( this.$el ).popover( 'show' );
            }
        },
        hide_error() {
            $( this.$el ).popover( 'hide' );
        },
        check( value ) {
            let errors = this.errors.slice();
            if ( !value.match(/^\d+$/) ) {
                return [ 'DCI must be a number' ];
            }
            if ( value.length > 10 ) {
                errors.push( 'DCI must be less than 10 digits' );
            }
            return errors;
        },
        input() {
            this.hide_error();
            this.$data._errors = this.check( this.value );
            this.$emit( 'input', this.value );
        },
    },
    mounted() {
        let el = $( this.$el );
        el.popover( {
            placement: "bottom",
            trigger: "manual",
            content: () => {
                return this.$data._errors.join( "\n" );
            },
        } );
    },
};
</script>
