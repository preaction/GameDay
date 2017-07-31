
<template>
    <edit-field :class="entered && hasError ? 'error' : ''" v-model="value" @input="input" @focus="show_error" :editing="!value" @mouseenter="show_error" @mouseleave="hide_error" />
</template>

<style>
    .error .edit-field:hover:not( :empty )::after {
        padding-left: 1.8em;
    }
    .error::after {
        display: inline-block;
        font-family: 'Glyphicons Halflings';
        color: #999;
        content: '\e209';
        font-size: x-small;
        line-height: 20px;
        vertical-align: bottom;
    }
</style>

<script>
import EditField from './edit-field.vue';
export default {
    name: 'dci-field',
    components: { EditField },
    data() {
        let errors = this.check( this.value );
        return {
            entered: false,
            _errors: errors,
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
    computed: {
        hasError: function () {
            return !!this.$data._errors.length;
        },
    },
    methods: {
        show_error() {
            this.entered = true;
            if ( this.$data._errors.length > 0 ) {
                $( this.$el ).popover( 'show' );
            }
        },
        hide_error() {
            $( this.$el ).popover( 'hide' );
        },
        check( value ) {
            let errors = this.errors.slice();
            if ( !value || !value.match(/^\d+$/) ) {
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
