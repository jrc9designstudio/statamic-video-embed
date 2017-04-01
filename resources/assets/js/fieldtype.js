Vue.component('video_embed-fieldtype', {
    props: ['data', 'config', 'name'],

    data: function() {
        //
    },

    computed: {
        isVimeo: function() {
            return this.data.url.search('vimeo') !== -1
        },
        isYouTube: function() {
            return (this.data.url.search('youtube') || this.data.url.search('youtu.be')) !== -1
        },
        isYouTubeParam: function () {
            return this.data.url.search('v=') !== -1
        },
        isValid: function() {
            return this.src != false
        },
        src: function() {
            if (this.isVimeo) {
                return 'https://player.vimeo.com/video/' + this.data.url.split('/').pop();
            } else if (this.isYouTube) {
                if(this.isYouTubeParam) {
                    return 'https://www.youtube.com/embed/' + this.data.url.split('v=').pop();
                } else {
                    return 'https://www.youtube.com/embed/' + this.data.url.split('/').pop();
                }
            }

            return false;
        },
        title: function() {
            return this.data.title;
        },
        author_name: function() {
            return this.data.author_name;
        },
        description: function() {
            return this.data.description.replace(/<\/?[^>]+(>|$)/g, "");
        }
    },

    methods: {
        getData: function () {
            var that = this;

            if (this.isVimeo) {
                $.ajax({
                  type: 'GET',
                  url: 'https://api.vimeo.com/videos/' + this.data.url.split('/').pop(),
                  crossDomain: true,
                  headers: {
                    'Authorization': 'Bearer ' + this.data.token
                  }
                }).done(function(data) {
                    that.data.title = data.name;
                    that.data.description = data.description;
                    that.data.author_name = data.user.name;
                    that.data.author_url = data.user.link;
                    that.data.duration = data.duration;
                    that.data.height = data.height;
                    that.data.width = data.width;
                    that.data.thumbnail_large = data.pictures.sizes[5].link;
                    that.data.thumbnail_medium = data.pictures.sizes[4].link;
                    that.data.thumbnail_small = data.pictures.sizes[3].link;
                });
            } else if (this.isYouTube) {
                var video_id = '';
                
                if(this.isYouTubeParam) {
                    video_id = this.data.url.split('v=').pop();
                } else {
                    video_id = this.data.url.split('/').pop();
                }
                
                $.ajax({
                    url: 'https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=' + video_id + '&key=' + this.data.key,
                    crossDomain: true
                }).done(function(data) {
                    that.data.title = data.items[0].snippet.title;
                    that.data.description = data.items[0].snippet.description;
                    that.data.author_name = data.items[0].snippet.channelTitle;
                    that.data.author_url = null;
                    that.data.duration = null;
                    that.data.height = null;
                    that.data.width = null;
                    that.data.thumbnail_large = data.items[0].snippet.thumbnails.high.url;
                    that.data.thumbnail_medium = data.items[0].snippet.thumbnails.medium.url;
                    that.data.thumbnail_small = data.items[0].snippet.thumbnails.default.url;
                });
            }
        }
    },

    ready: function() {
        this.data.url = this.data.url ? this.data.url : '';
        this.data.title = this.data ? this.data.title : '';
        this.data.description = this.data ? this.data.description : '';
        this.data.author_name = this.data ? this.data.author_name : '';
        this.data.author_url = this.data ? this.data.author_url : '';
        this.data.duration = this.data ? this.data.duration : '';
        this.data.height = this.data ? this.data.height : '';
        this.data.width = this.data ? this.data.width : '';
        this.data.thumbnail_large = this.data ? this.data.thumbnail_large : '';
        this.data.thumbnail_medium = this.data ? this.data.thumbnail_medium : '';
        this.data.thumbnail_small = this.data ? this.data.thumbnail_small : '';
    },
    
    template: '' +
      '<style>' +
        'body.sneak-peeking .video-preview { display: none; }' +
      '</style>' +
      '<div class="video-preview form-group">' +
            '<div v-if="isValid" class="row">' +
                '<div class="col-xs-12 col-sm-4 col-md-5 col-lg-6">' +
                    '<div class="embed-responsive embed-responsive-16by9">' +
                        '<iframe class="embed-responsive-item" :src="src" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' +
                    '</div>' +
                '</div>' +
                '<div class="col-xs-12 col-sm-8 col-md-7 col-lg-6">' +
                    '<h2 class="media-heading">{{ title }}</h2>' +
                    '<h3>{{ author_name }}</h3>' +
                    '<p>{{ description }}</p>' +
                '</div>' +
            '</div>' +
            '<div v-else>' +
                '<p class="alert alert-warning" role="alert">Video URL is not recognized.</p>' +
            '</div>' +
      '</div>' +
      '<input type="text" class="form-control" v-model="data.url" @keyup="getData" />' +
    ''
});
