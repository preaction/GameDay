
<template>
    <span @mouseenter="$emit('mouseenter')" @mouseleave="$emit('mouseleave')">
        <span class="edit-field" v-if="!editing" @dblclick="toggle_edit( true )">{{ value }}</span>
        <input v-model="value" v-if="editing" @focus="$emit('focus')" @blur="input" @keypress.enter="input" />
    </span>
</template>

<style>
    .edit-field {
        position: relative;
        min-width: 2em;
    }
    .edit-field:hover:not( :empty )::after {
        position: absolute;
        left: 100%;
        padding-left: 4px;
    }
    .edit-field:hover::after, .edit-field:empty::after {
        display: inline-block;
        font-family: 'Glyphicons Halflings';
        color: #999;
        content: '\270f';
        font-size: x-small;
        line-height: 20px;
        vertical-align: bottom;
    }
</style>

<script>
export default {
    name: 'edit-field',
    data() {
        return { }
    },
    props: {
        editing: {
            default: false,
        },
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
