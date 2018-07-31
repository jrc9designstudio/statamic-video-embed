### Installation
- Rename the folder `VideoEmbed` and copy it to your `site/addons` folder
- Add a VideoEmbed field to one of your fieldsets
- Add your [YouTube API](https://developers.google.com/youtube/v3/getting-started) key to the addon settings.

### Settings
- Go go the control panel > Addons > Settings or modify the settings file `site/settings/addons/video_embed.yaml`
```
autoplay: false
loop: false
api: false
showinfo: true
controls: true
key: ''
```
### Data Storage
- Using the Vimeo and YouTube APIs we get and store meta information about the video for you. This is a breaking change from v1 where we only stored the url of the video. While storing this data means we will not get updates made on Vimeo or YouTube until the entry or page is edited again with the Control Panel, it does mean that there is no remote connection needed to get the meta information about videos.
- Unfortunately at this time the YouTube API does not return the duration of the video.
- The data will be stored similar to this example:
```
video:
  url: https://vimeo.com/16881273
  title: School of Lego
  author_name: Charlotte Dolman
  description: ""
  author_url: https://vimeo.com/firstlight
  duration: 462
  height: 256
  width: 480
  thumbnail_large: https://i.vimeocdn.com/video/104050736_640.jpg
  thumbnail_medium: https://i.vimeocdn.com/video/104050736_200x150.jpg
  thumbnail_small: https://i.vimeocdn.com/video/104050736_100x75.jpg
```

### Modifier
- Use the `video_embed` modifier to get the url of the video for embeding. Assuming your Video Embed field was called `video`:
```
  <iframe src="{{ video:url | video_embed }}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
```
or if you use bootstrap:
```
<!-- 16:9 aspect ratio -->
<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="{{ video:url | video_embed }}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</div>
```

### Per Video Settings (tag)
If you want to override settings per video you can use the tag instead. If you skip a parameter it will fallback to the default from the settings file. The src is required.
```
<iframe src="{{ video_embed src='{video:url}' autoplay='true' loop='true' api='true' showinfo='false' controls='false' }}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
```

### Per Entry / Page Video Settings
If you want to change the embed paramaters / settings per entry / page just add some toggle fields to your fieldset like so:
```
fields:
  video:
    type: video_embed
    display: Video
    instructions: Enter the url of a Vimeo or YouTube Video.
  autoplay:
    type: toggle
    display: Auto Play
    width: 25
  loop:
    type: toggle
    display: Loop Video
    width: 25
  showinfo:
    type: toggle
    display: Show Info
    width: 25
  controls:
    type: toggle
    display: Show Video Controls
    instructions: Supported for YouTube Only.
    width: 25
```
and then use them in your template ...
```
<iframe src="{{ video_embed src='{video:url}' autoplay='{autoplay}' loop='{loop}' api='true' showinfo='{showinfo}' controls='{controls}' }}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
```

### Responsive Videos?
In short, this addon takes the philsophy of Statamic; the html, css and javascript is yours, and this addon only calculates the video urls for you. This will be your responsibility to make the videos responsive.

If you are using Bootstrap you can use the example above. For more information see [Bootstrap 3 documentation](http://getbootstrap.com/components/#responsive-embed) or [Bootstrap 4 documentation](https://v4-alpha.getbootstrap.com/utilities/responsive-helpers/). If you are working with your own css, you can implement this yourself. [CSS Tricks has a good guide](https://css-tricks.com/NetMag/FluidWidthVideo/Article-FluidWidthVideo.php) if you need help getting started.

If you really want a simple tag that does it all for you, you can create your own tag using the API, or use [Bootstrap Video Embed addon](https://github.com/jrc9designstudio/statamic-bootstrap-video-embed) in conjunction with this addon.

### Extra Modifiers
- Returns a link to the video on the orginal platform: `{{ video:url | video_embed:link }}`
- Returns the ID of the video: `{{ video:url | video_embed:video_id }}`
- Returns true or false: `{{ video:url | video_embed:is_valid }}`
- Returns true or false: `{{ video:url | video_embed:is_youtube }}`
- Returns true or false: `{{ video:url | video_embed:is_vimeo }}`

### Extra Tags
- Returns a link to the video on the orginal platform: `{{ video_embed:link src='{video:url}' }}`
- Returns the ID of the video: `{{ video_embed:video_id src='{video:url}' }}`
- Returns the aspect ratio of the video: `{{ video_embed:aspect_ratio height='{video:height}' width='{video:width}' }}`
  - `wide` 16:9
  - `standard` 4:3
  - `clasic` 3:2
  - `cinema` 21:9
  - `square` 1:1
  - `portrait_wide` 9:16
  - `portrait_standard` 3:4
  - `portrait_clasic` 2:3
  - `portrait_cinema` 9:21
