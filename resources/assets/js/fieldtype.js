Vue.component('video_embed-fieldtype', {
    props: ['data', 'config', 'name'],

    data: function() {
        return {
            loading: true,
            fail: false,
            previous_url: ''
        }
    },

    computed: {
        isVimeo: function() {
            // Is it possible this is a Vimeo url
            return this.data.url.search('vimeo') !== -1;
        },
        isYouTube: function() {
            // Is it possible this is a YouTube url
            return (this.data.url.search('youtube') || this.data.url.search('youtu.be')) !== -1;
        },
        isYouTubeParam: function () {
            // Is the id a param (only YouTube does this)
            return this.data.url.search('v=') !== -1;
        },
        isValid: function() {
            // Is it possible this is a Vimeo or YouTube url
            return this.isVimeo || this.isYouTube;
        },
        isntBlank: function() {
            // Make sure the field is not blank
            return this.data.url.length > 0;
        },
        urlChanged: function() {
            // Check if the url has changed
            return this.data.url !== this.previous_url;
        },
        src: function() {
            // Construct the video embed src for the preview
            if (this.isVimeo) {
                // Vimeo is pretty simple, it should be the last segment for the id
                return 'https://player.vimeo.com/video/' + this.data.url.split('/').pop();
            } else if (this.isYouTube) {
                if(this.isYouTubeParam) {
                    // YouTube, get the param, also there could be more params such as `playlist` so ditch those.
                    return 'https://www.youtube.com/embed/' + this.data.url.split('v=').pop().split('&')[0];
                } else {
                    // Otherwise just get the last segment, that should be the id.
                    return 'https://www.youtube.com/embed/' + this.data.url.split('/').pop();
                }
            }
            
            return false;
        },
        title: function() {
            // Return the current title for vue preview.
            return this.data.title;
        },
        author_name: function() {
            // Return the current author for vue preview.
            return this.data.author_name;
        },
        author_url: function() {
            // Return the current author url for vue preview.
            return this.data.author_url;
        },
        description: function() {
            // Return the current description (striping html) for vue preview.
            return this.data.description.replace(/<\/?[^>]+(>|$)/g, "");
        }
    },

    methods: {
        getData: function () {
            var that = this;

            // We are now loading ...
            this.loading = this.urlChanged ? true : false;

            $.ajaxSetup({
              cache: false,
              crossDomain: true,
              global: false,
              timeout: 10000
            });
            
            if (this.isVimeo && this.urlChanged) {
                $.ajax({
                    url: 'http://vimeo.com/api/v2/video/' + this.data.url.split('/').pop() + '.json'
                }).done(function(data) {
                    that.fail = false;
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
                    that.fail = 'Vimeo data lookup failed. Please make Sure this video exists!';
                    that.resetData();
                }).always(function() {
                    that.loading = false;
                    that.previous_url = that.data.url;
                });
            } else if (this.isYouTube && this.urlChanged) {
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
                        that.fail = 'YouTube data lookup returned no data on this video! Please make sure this video exists.';
                    } else {
                        that.fail = false;
                    }
                    that.data.title = data.items[0] ? data.items[0].snippet.title : '';
                    that.data.description = data.items[0] ? data.items[0].snippet.description : '';
                    that.data.author_name = data.items[0] ? data.items[0].snippet.channelTitle : '';
                    that.data.thumbnail_large = data.items[0] ? data.items[0].snippet.thumbnails.high.url : '';
                    that.data.thumbnail_medium = data.items[0] ? data.items[0].snippet.thumbnails.medium.url : '';
                    that.data.thumbnail_small = data.items[0] ? data.items[0].snippet.thumbnails.default.url : '';
                }).fail(function() {
                    that.fail = 'YouTube data lookup failed. Make Sure this video exists and that you supplied an API key in settings!';
                    that.resetData();
                }).always(function() {
                    that.loading = false;
                    that.previous_url = that.data.url;
                });
            } else {
                that.fail = false;
                that.loading = false;
                that.resetData();
            }
        },
        resetData: function() {
            this.data.title = '';
            this.data.description = '';
            this.data.author_name = '';
            this.data.author_url = '';
            this.data.duration = null;
            this.data.height = 1080;
            this.data.width = 1920;
            this.data.thumbnail_large = '';
            this.data.thumbnail_medium = '';
            this.data.thumbnail_small = '';
        }
    },

    ready: function() {
        this.data = this.data ? this.data : {};
        this.data.url = this.data.url ? this.data.url : '';
        this.data.title = this.data.title ? this.data.title : '';
        this.data.description = this.data.description ? this.data.description : '';
        this.data.author_name = this.data.author_name ? this.data.author_name : '';
        this.data.author_url = this.data.author_url ? this.data.author_url : '';
        this.data.duration = this.data.duration ? this.data.duration : '';
        this.data.height = this.data.height ? this.data.height : 1080;
        this.data.width = this.data.width ? this.data.width : 1920;
        this.data.thumbnail_large = this.data.thumbnail_large ? this.data.thumbnail_large : '';
        this.data.thumbnail_medium = this.data.thumbnail_medium ? this.data.thumbnail_medium : '';
        this.data.thumbnail_small = this.data.thumbnail_small ? this.data.thumbnail_small : '';
        
        this.getData();
    },
    
    template: '' +
      '<style>' +
        'body.sneak-peeking .video-embed-preview-wrapper { display: none; }' +
      '</style>' +
      '<div v-if="isntBlank" class="video-embed-preview-wrapper form-group">' +
            '<div v-if="loading" class="loading">' +
                '<span class="icon icon-circular-graph animation-spin"></span> Loading' +
            '</div>' +
            '<div class="video-embed-preview" v-else>' +
                '<div v-if="isValid" class="row">' +
                    '<div class="col-xs-12 col-sm-4 col-md-5 col-lg-6">' +
                        '<div class="embed-responsive embed-responsive-16by9">' +
                            '<iframe class="embed-responsive-item" :src="src" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-xs-12 col-sm-8 col-md-7 col-lg-6">' +
                        '<h2 class="media-heading">{{ title }}</h2>' +
                        '<h3 v-if="author_url"><a href="{{ author_url }}" target="_blank">{{ author_name }}</a></h3>' +
                        '<h3 v-else>{{ author_name }}</h3>' +
                        '<p>{{ description }}</p>' +
                        '<p v-if="fail" class="alert alert-warning" role="alert">{{ fail }}</p>' +
                    '</div>' +
                '</div>' +
                '<div v-else>' +
                    '<p class="alert alert-warning" role="alert">Video URL is not recognized.</p>' +
                '</div>' +
            '</div>' +
      '</div>' +
      '<input type="text" class="form-control" v-model="data.url" v-on:blur="getData" v-on:keyup="getData" v-on:input="getData" />' +
    ''
});
