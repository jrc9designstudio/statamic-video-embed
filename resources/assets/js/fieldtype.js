Vue.component('video_embed-fieldtype', {

    template: '<div>VideoEmbed</div>',

    props: ['data', 'config', 'name'],

    data: function() {
        return {
            show: true
        };
    },

    computed: {
        inputType: function() {
          return 'text';
        }
    },

    methods: {
        //
    },

    ready: function() {
        //
    },
    
    template: '' +
      '<input :type="inputType" :id="name" class="form-control" v-model="data" />' +
    ''

});
