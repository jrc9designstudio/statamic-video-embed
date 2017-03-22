# Video Embed for Statamic 2
*Requirement:* Statamic v2.x  
*Version:* 1.0.2

### What is this?
Add A Video Embed field for YouTube and Vimeo videos to Statamic

### Installation
- Rename the folder `VideoEmbed` and copy it to your `site/addons` folder
- Add a VideoEmbed field to one of your fieldsets

### Modifier
- Use the `video_embed` modifier to get the url of the video for embeding. Assuming your Video Embed field was called `video`:
```
  <iframe src="{{ video | video_embed }}"></iframe>
```
