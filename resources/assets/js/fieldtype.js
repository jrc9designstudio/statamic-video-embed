/* global Vue, $, Fieldtype, translate */

Vue.component('video_embed-fieldtype', {
    mixins: [Fieldtype],

    data: function() {
        return {
            loading: true,
            fail: false,
            previous_url: '',
            youTubeKeySet: this.data.key.length > 0,
            ajax: undefined,
            autoBindChangeWatcher: false // Disable the automagic binding
        }
    },

    computed: {
        isVimeo: function() {
            // Is it possible this is a Vimeo url
            return (this.data.url.search('vimeo') !== -1) && this.getVimeoID.length > 0;
        },
        isYouTube: function() {
            // Is it possible this is a YouTube url
            return (this.data.url.search('youtube') !== -1 || this.data.url.search('youtu.be') !== -1) && this.getYouTubeID.length > 0;
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
        getVimeoID: function() {
            // get the id of a Vimeo video
            // Vimeo is pretty simple, it should be the last segment for the id
            return this.data.url.split('/').pop();
        },
        getYouTubeID: function() {
            // Get the id of a YouTube video
            if(this.isYouTubeParam) {
                // YouTube, get the param, also there could be more params such as `playlist` so ditch those.
                return this.data.url.split('v=').pop().split('&')[0];
            }
            // Otherwise just get the last segment, that should be the id.
            return this.data.url.split('/').pop();
        },
        src: function() {
            // Construct the video embed src for the preview
            if (this.isVimeo) {
                return 'https://player.vimeo.com/video/' + this.getVimeoID;
            }
            return 'https://www.youtube.com/embed/' + this.getYouTubeID;
        },
        video_link: function() {
            // Construct the video link
            if (this.isVimeo) {
                return 'https://vimeo.com/' + this.getVimeoID;
            }
            return 'https://www.youtube.com/watch?v=' + this.getYouTubeID;
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
        duration: function () {
          // Return the duration for the vue preview.
          if (this.data.duration && this.data.duration > 60) {
            var sec_num = parseInt(this.data.duration, 10);
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours < 10) {
              hours   = '0' + hours;
            }
            if (minutes < 10) {
              minutes = '0' + minutes;
            }
            if (seconds < 10) {
              seconds = '0' + seconds;
            }

            return hours + ':' + minutes + ':' + seconds;
          }

          return this.data.duration + ' seconds';
        },
        description: function() {
            // Return the current description (striping html) for vue preview.
            return this.data.description.replace(/<\/?[^>]+(>|$)/g, "");
        },
        previewImage: function() {
            return this.data.thumbnail_small ? '<img src="' + this.data.thumbnail_small + '" width="auto" height="20" title="' + this.title + '" />' : '';
        },
    },

    methods: {
        getReplicatorPreviewText: function() {
            return this.previewImage + ' ' + this.title;
        },
        focus: function() {
           this.$els.videoUrlField.focus();
        },
        getData: function () {
            // We are now loading ...
            this.loading = this.urlChanged ? true : false;

            if (this.urlChanged) {
                this.bindChangeWatcher(); // Bind the change watcher
            }

            $.ajaxSetup({
              cache: false,
              contentType: 'application/json; charset=utf-8',
              crossDomain: true,
              dataType : 'json',
              global: false,
              timeout: 10000,
              type: 'GET'
            });

            if (this.isVimeo && this.urlChanged) {
                var that = this;

                if (this.ajax) {
                  this.ajax.abort();
                }

                this.ajax = $.ajax({
                    url: 'https://vimeo.com/api/v2/video/' + this.getVimeoID + '.json'
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
                    that.fail = translate('addons.VideoEmbed::settings.vimeo_lookup_fail');
                    that.resetData();
                }).always(function() {
                    that.loading = false;
                    that.previous_url = that.data.url;
                });
            } else if (this.isYouTube && this.urlChanged && this.youTubeKeySet) {
                var that = this;

                if (this.ajax) {
                  this.ajax.abort();
                }

                this.ajax = $.ajax({
                    url: 'https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet,contentDetails&id=' + this.getYouTubeID + '&key=' + this.data.key
                }).done(function(data) {
                    if (! data.items[0]) {
                        that.fail = translate('addons.VideoEmbed::settings.youtube_lookup_no_data');
                    } else {
                        that.fail = false;
                    }
                    that.data.title = data.items[0] ? data.items[0].snippet.title : '';
                    that.data.description = data.items[0] ? data.items[0].snippet.description : '';
                    that.data.author_name = data.items[0] ? data.items[0].snippet.channelTitle : '';
                    that.data.duration = data.items[0] ? that.convertISOTimeToSeconds(data.items[0].contentDetails.duration) : '';
                    that.data.thumbnail_large = data.items[0] ? data.items[0].snippet.thumbnails.high.url : '';
                    that.data.thumbnail_medium = data.items[0] ? data.items[0].snippet.thumbnails.medium.url : '';
                    that.data.thumbnail_small = data.items[0] ? data.items[0].snippet.thumbnails.default.url : '';
                }).fail(function() {
                    that.fail = translate('addons.VideoEmbed::settings.youtube_lookup_fail');
                    that.resetData();
                }).always(function() {
                    that.loading = false;
                    that.previous_url = that.data.url;
                });
            } else if (this.isYouTube && !this.youTubeKeySet) {
                this.fail = translate('addons.VideoEmbed::settings.youtube_key_not_set');
                this.loading = false;
                this.previous_url = this.data.url;
                this.resetData();
            } else if (this.urlChanged) {
                this.fail = translate('addons.VideoEmbed::settings.unknowen_error');
                this.loading = false;
                this.previous_url = this.data.url;
                this.resetData();
            } else {
                this.loading = false;
                this.previous_url = this.data.url;
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
        },
        convertISOTimeToSeconds: function(duration) {
            // Convert ISO 8601 duration time to seconds for consistency.
            var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)

            var hours = (parseInt(match[1]) || 0);
            var minutes = (parseInt(match[2]) || 0);
            var seconds = (parseInt(match[3]) || 0);

            return (hours * 3600) + ( minutes* 60) + seconds;
        },
    },

    ready: function() {
        // Update the data as soon as Vue is ready.
        this.getData();
    },

    template: '' +
      '<div v-if="isntBlank" class="video-embed-preview-wrapper form-group">' +
            '<div v-if="loading" class="loading">' +
                '<span class="icon icon-circular-graph animation-spin"></span> {{ translate("cp.loading") }}' +
            '</div>' +
            '<div class="video-embed-preview" v-else>' +
                '<div v-if="isValid" class="row">' +
                    '<div class="col-xs-12 col-sm-4 col-md-5 col-lg-6">' +
                        '<div class="embed-responsive embed-responsive-16by9">' +
                            '<iframe class="embed-responsive-item" :src="src" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-xs-12 col-sm-8 col-md-7 col-lg-6">' +
                        '<h2 class="media-heading"><a href="{{ video_link }}" target="_blank">{{ title }}</a></h2>' +
                        '<h3 v-if="author_url"><a href="{{ author_url }}" target="_blank">{{ author_name }}</a></h3>' +
                        '<h3 v-else>{{ author_name }}</h3>' +
                        '<p><strong>Play Time:</strong> {{ duration }}</p>' +
                        '<p>{{ description }}</p>' +
                        '<p v-if="fail" class="alert alert-warning" role="alert">{{ fail }}</p>' +
                    '</div>' +
                '</div>' +
                '<div v-else>' +
                    '<p class="alert alert-warning" role="alert">{{ translate("addons.VideoEmbed::settings.video_url_unrecognized") }}</p>' +
                '</div>' +
            '</div>' +
      '</div>' +
      '<input type="text" class="form-control" v-model="data.url" v-on:blur="getData" v-on:keyup="getData" v-on:input="getData" v-el:video-url-field />' +
    ''
});
