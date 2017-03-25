require('file-loader?name=[name].[ext]!./package.json');
require('file-loader?name=[name].[ext]!./index.html');
import Vue from 'vue'
import App from './App.vue'

new Vue({
    el: '#main',
    render: h => h(App)
});

console.log( 'hello world' );
