// Getting Vue
var Vue = require('vue') // Vue1.0.6
Vue.use(require('vue-resource')); // Vue Resources

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
        reciters: ''
    }
})
