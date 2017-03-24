<?php

namespace Statamic\Addons\VideoEmbed;

use Statamic\Extend\Tags;

class VideoEmbedTags extends Tags
{
    private $videoembed;

    protected function init()
    {
        $this->videoembed = new VideoEmbed;
    }

    public function index()
    {
        $value = $this->getParam('src');
        $autoplay = $this->getParam('autoplay', null);
        $loop = $this->getParam('loop', null);
        $api = $this->getParam('api', null);
        $showinfo = $this->getParam('showinfo', null);
        $controls = $this->getParam('controls', null);
      
        return $this->videoembed->getVideoSrc($value, $autoplay, $loop, $api, $showinfo, $controls);
    }

    public function link()
    {
        $value = $this->getParam('src');
        return $this->videoembed->getVideoLink($value);
    }
    
    public function videoId()
    {
        $value = $this->getParam('src');
        return $this->videoembed->getVideoId($value);
    }
    
    public function thumbnail()
    {
        $value = $this->getParam('src');
        $thumb_size = $this->getParam('size', null);
        return $this->videoembed->getVideoThumbnail($value, $thumb_size);
    }
}
