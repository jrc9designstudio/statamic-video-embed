Vue.component('video_embed-fieldtype', {

    template: '<div>VideoEmbed</div>',

    props: ['data', 'config', 'name'],

    data: function() {
      //
    },

    computed: {
        isVimeo: function() {
          return this.data.search('vimeo') !== -1
        },
        isYouTube: function () {
          return (this.data.search('youtube') || this.data.search('youtu.be')) !== -1
        },
        isYouTubeParam: function () {
          return this.data.search('v=') !== -1
        },
        isValid: function () {
          return this.src != false
        },
        src: function() {
          if (this.isVimeo) {
            return 'https://player.vimeo.com/video/' + this.data.split('/').pop();
          } else if (this.isYouTube) {
            if(this.isYouTubeParam) {
              return 'https://www.youtube.com/embed/' + this.data.split('v=').pop();
            } else {
              return 'https://www.youtube.com/embed/' + this.data.split('/').pop();
            }
          }
          return false;
        }
    },

    methods: {
        //
    },

    ready: function() {
        //
    },
    
    template: '' +
      '<div v-if="isValid" class="embed-responsive embed-responsive-16by9">' +
        '<iframe class="embed-responsive-item" :src="src" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' +
      '</div>' +
      '<input type="text" :id="name" class="form-control" v-model="data" />' +
    ''

});
