<?php

namespace Statamic\Addons\VideoEmbed;

use Statamic\Extend\API;

class VideoEmbedAPI extends API
{
    private $videoembed;

    protected function init()
    {
        $this->videoembed = new VideoEmbed;
    }

    public function isYouTube($value)
    {
        return $this->videoembed->isYouTube($value);
    }

    public function isVimeo($value)
    {
        return $this->videoembed->isVimeo($value);
    }

    public function isValid($value)
    {
        return $this->videoembed->isValid($value);
    }

    public function getVideoId($value)
    {
        return $this->videoembed->getVideoId($value);
    }

    public function getVideoSrc($value, $autoplay, $loop, $api, $showinfo, $controls)
    {
        return $this->videoembed->getVideoSrc($value, $autoplay, $loop, $api, $showinfo, $controls);
    }

    public function getVideoLink($value)
    {
        return $this->videoembed->getVideoLink($value);
    }

    public function getAspectRatio($height, $width)
    {
        return $this->videoembed->getAspectRatio($height, $width);
    }
}
