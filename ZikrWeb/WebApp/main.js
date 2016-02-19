// Getting Vue
var Vue = require('vue') // Vue1.0.6
// Vue Plugins
Vue.use(require('vue-resource')); // Vue Resources
// Open Debug Mode (Hust For Developing)
Vue.config.debug = true;
// DOM Updated
Vue.nextTick(function () {
  alert('DOM Successfully Renderd');
})
// Root Constructor Object
new Vue({
    el: 'body',
    beforeCompile: function() {

        // GET request
        this.$http({
            url: './assets/json/settings.json',
            method: 'GET'
        }).then(function(response) {
            this.reciters = response.data.readers;
        }, function(response) {

        });

    },
    data: {
        reciters: 0
    },
    components: {
        scrollbars: require('./components/scrollbars.vue'),
        search: require('./components/search.vue')
    }
})
