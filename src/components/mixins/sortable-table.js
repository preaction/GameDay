/**
 * Sortable Table Mixin
 *
 * This Vue mixin allows a sortable table for your data. Clicking on
 * a column header in your table will sort by that column. Clicking the
 * same column again will reverse the sort ordering.
 *
 * To use this mixin:
 *
 * 1) Add the mixin to your Vue using the `mixins` property
 *
 *      import sortable_table from 'mixins/sortable-table';
 *      export default {
 *          name: 'my-component',
 *          mixins: [ sortable_table ],
 *      }
 *
 * 2) Create sortable columns by adding the `th-sort` component to your
 *    <th> elements and set the `field` property to the object field to
 *    sort on, like this:
 *
 *        <th is="th-sort" field="myfield">My Field</th>
 *
 *    You cannot use `<th-sort>` due to HTML parsing issues.
 *
 * 3) Sort the data when building your rows using the `orderBy` filter
 *    with the `sort.field` and `sort.dir` items added to your Vue by the
 *    mixin:
 *
 *        <tbody>
 *          <template v-for="row in data | orderBy sort.field sort.dir">
 *            ...
 *          </template>
 *        </tbody>
 *
 * To set the sort yourself, you can call the `sort_by` method added to
 * your component.
 */

import "./sortable-table.css";
import Vue from 'vue';
const th_sort = Vue.component( 'th-sort', {
    name: 'th-sort',
    template: '<th :class="classes" @click="click"><slot></slot></th>',
    props: {
        field: {
            required: 1
        },
    },
    computed: {
        classes() {
            var sort = this.$parent.sort;
            var classes = ['sortable'];
            if ( sort.field == this.field ) {
                classes.push('sort-' + ( sort.dir === 'desc' ? 'asc' : 'desc' ));
            }
            return classes;
        },
    },
    methods: {
        click() {
            return this.$parent.sort_by( this.field );
        },
    },
} );

export default {
    components: { th_sort },
    methods: {
        sorted( data ) {
            var new_data = data.map( ( o, i ) => { return { data: o, index: i } } );
            new_data.sort( ( a, b ) => {
                var field = this.sort.field;
                if ( this.sort.dir == "asc" ) {
                    return a.data[field] > b.data[field] ? 1
                            : a.data[field] < b.data[field] ? -1
                            : 0;
                }
                else {
                    return b.data[field] > a.data[field] ? 1
                            : b.data[field] < a.data[field] ? -1
                            : 0;
                }
            } );
            return new_data;
        },
        sort_by( field ) {
            if ( this.sort.field == field ) {
                this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc';
            }
            else {
                this.sort.field = field;
                this.sort.dir = 'asc';
            }
        },
    },
    data() {
        return {
            sort: {
                field: 'id',
                dir: 'asc'
            }
        };
    }
};

