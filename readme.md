# Video Embed for Statamic 2
*Requirement:* Statamic v2.x  
*Version:* 1.2.1

### What is this?
Add A Video Embed field for YouTube and Vimeo videos to Statamic

### Installation
- Rename the folder `VideoEmbed` and copy it to your `site/addons` folder
- Add a VideoEmbed field to one of your fieldsets

### Modifier
- Use the `video_embed` modifier to get the url of the video for embeding. Assuming your Video Embed field was called `video`:
```
  <iframe src="{{ video | video_embed }}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
```
or if you use bootstrap:
```
<!-- 16:9 aspect ratio -->
<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="{{ video | video_embed }}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</div>
```

### Settings
- Go go the control panel > Addons > Settings or modify the settings file `site/settings/addons/video_embed.yaml`
```
autoplay: false
loop: false
api: false
showinfo: true
controls: true
```

### Per Video Settings
If you want to override settings per video you can use the tag instead. If you skip a parameter it will fallback to the default from the settings file.
```
<iframe src="{{ video_embed src="{video}" autoplay="true" loop="true" api="true" showinfo="false" controls="false" }}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
```

### Give the Editor Control over the Embed
If you want to give the editor control over the embed just add some toggle fields to your fieldset like so:
```
fields:
  video:
    type: video_embed
    display: Video
    instructions: Enter the url of a Vimeo or YouTube Video.
  autoplay:
    type: toggle
    width: 25
  loop:
    type: toggle
    width: 25
  showinfo:
    type: toggle
    width: 25
  controls:
    type: toggle
    width: 25
```
and then use them in your template ...
```
<iframe src="{{ video_embed src="{video}" autoplay="{autoplay}" loop="{loop}" api="true" showinfo="{showinfo}" controls="{controls}" }}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
```

### Responsive Videos?
In short, this is your responsablity as this addon takes the philsophy of Statamic, the html, css and javascript is yours and this addon only caculates the video urls for you.

If you are using Bootstrap you can use the example above. For more information see the [Bootstrap 3 documentation](http://getbootstrap.com/components/#responsive-embed) or [Bootstrap 4 documentation](https://v4-alpha.getbootstrap.com/utilities/responsive-helpers/). If you are working with your own css you can implement this yourself. [CSS Tricks has a good guide](https://css-tricks.com/NetMag/FluidWidthVideo/Article-FluidWidthVideo.php) if you need help getting started.

### Version Log
- 1.2.0 Added Settings
- 1.1.0 Added Video Preview
- 1.0.0 Initial Release
