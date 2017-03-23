# Video Embed for Statamic 2
*Requirement:* Statamic v2.x  
*Version:* 1.2.0

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
<iframe class="responsive-video" src="{{ video_embed src="{video}" autoplay="true" loop="true" api="true" showinfo="false" controls="false" }}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
```

### Version Log
- 1.2.0 Added Settings
- 1.1.0 Added Video Preview
- 1.0.0 Initial Release
