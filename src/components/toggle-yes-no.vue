
<template>
  <div class="btn-group" data-toggle="buttons">
    <label class="btn btn-xs" :class="value ? 'btn-success active' : 'btn-default'" @click="change(true)">
      <input type="radio" :name="_uid" id="protected-yes" v-model="value" :value="true"> Yes
    </label>
    <label class="btn btn-xs" :class="value ? 'btn-default' : 'btn-danger active'" @click="change(false)">
      <input type="radio" :name="_uid" id="protected-no" v-model="value" :value="false"> No
    </label>
  </div>
</template>

<script>
export default {
    name: 'toggle-yes-no',
    props: {
        value: {
            required: true
        }
    },
    methods: {
        change( new_value ) {
            this.$emit( 'input', new_value );
        }
    }
};
</script>
