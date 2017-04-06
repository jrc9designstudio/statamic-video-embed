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
                    return 'https://www.youtube.com/embed/' + this.data.url.split('v=').pop().split('&')[0];
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
        },
        fail: function() {
            return this.data.fail;
        }
    },

    methods: {
        getData: function () {
            var that = this;
            
            $.ajaxSetup({
              cache: false,
              crossDomain: true,
              global: false,
              timeout: 10000
            });
            
            if (this.isVimeo) {
                $.ajax({
                    url: 'http://vimeo.com/api/v2/video/' + this.data.url.split('/').pop() + '.json'
                }).done(function(data) {
                    that.data.fail = '';
                    that.data.title = data[0].title;
                    that.data.description = data[0].description;
                    that.data.author_name = data[0].user_name;
                    that.data.author_url = data[0].user_url;
                    that.data.duration = data[0].duration;
                    that.data.height = data[0].height;
                    that.data.width = data[0].width;
                    that.data.thumbnail_large = data[0].thumbnail_large;
                    that.data.thumbnail_medium = data[0].thumbnail_medium;
                    that.data.thumbnail_small = data[0].thumbnail_small;
                }).fail(function() {
                    that.data.fail = 'Vimeo data lookup failed. Make Sure this video exists!';
                    that.data.title = '';
                    that.data.description = '';
                    that.data.author_name = '';
                    that.data.author_url = '';
                    that.data.duration = '';
                    that.data.height = 1080;
                    that.data.width = 1920;
                    that.data.thumbnail_large = '';
                    that.data.thumbnail_medium = '';
                    that.data.thumbnail_small = '';
                });
            } else if (this.isYouTube) {
                var video_id = '';
                
                if(this.isYouTubeParam) {
                    video_id = this.data.url.split('v=').pop().split('&')[0];
                } else {
                    video_id = this.data.url.split('/').pop();
                }
                
                $.ajax({
                    url: 'https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=' + video_id + '&key=' + this.data.key
                }).done(function(data) {
                    if (! data.items[0]) {
                        that.data.fail = 'YouTube data lookup returned no data on this video!';
                    } else {
                        that.data.fail = '';
                    }
                    that.data.title = data.items[0] ? data.items[0].snippet.title : '';
                    that.data.description = data.items[0] ? data.items[0].snippet.description : '';
                    that.data.author_name = data.items[0] ? data.items[0].snippet.channelTitle : '';
                    that.data.author_url = null;
                    that.data.duration = null;
                    that.data.height = null;
                    that.data.width = null;
                    that.data.thumbnail_large = data.items[0] ? data.items[0].snippet.thumbnails.high.url : '';
                    that.data.thumbnail_medium = data.items[0] ? data.items[0].snippet.thumbnails.medium.url : '';
                    that.data.thumbnail_small = data.items[0] ? data.items[0].snippet.thumbnails.default.url : '';
                }).fail(function() {
                    that.data.fail = 'YouTube data lookup failed. Make Sure this video exists and that you supplied an API key in settings!';
                    that.data.title = '';
                    that.data.description = '';
                    that.data.author_name = '';
                    that.data.author_url = null;
                    that.data.duration = null;
                    that.data.height = null;
                    that.data.width = null;
                    that.data.thumbnail_large = '';
                    that.data.thumbnail_medium = '';
                    that.data.thumbnail_small = '';
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
                    '<p v-if="fail" class="alert alert-warning" role="alert">{{ fail }}</p>' +
                '</div>' +
            '</div>' +
            '<div v-else>' +
                '<p class="alert alert-warning" role="alert">Video URL is not recognized.</p>' +
            '</div>' +
      '</div>' +
      '<input type="text" class="form-control" v-model="data.url" v-on:change="getData" v-on:keyup="getData" />' +
    ''
});
