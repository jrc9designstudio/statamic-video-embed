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

    /**
     * The {{ video_embed }} tag
     *
     * @return string|array
     */
    public function index()
    {
        $value = $this->getParam('src');
        $autoplay = $this->getParam('autoplay', $this->getConfig('autoplay', false) ? 'true' : 'false');
        $loop = $this->getParam('loop', $this->getConfig('loop', false) ? 'true' : 'false');
        $api = $this->getParam('api', $this->getConfig('api', false) ? 'true' : 'false');
        $showinfo = $this->getParam('showinfo', $this->getConfig('showinfo', true) ? 'true' : 'false');
        $controls = $this->getParam('controls', $this->getConfig('controls', true) ? 'true' : 'false');
      
        return $this->videoembed->getVideoSrc($value, $autoplay, $loop, $api, $showinfo, $controls);
    }

    /**
     * The {{ video_link }} tag
     *
     * @return string|array
     */
    public function videoLink()
    {
        $value = $this->getParam('src');
        return $this->videoembed->getVideoLink($value);
    }
}
