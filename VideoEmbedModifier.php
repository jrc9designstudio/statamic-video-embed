<?php

namespace Statamic\Addons\VideoEmbed;

use Statamic\Extend\Modifier;

class VideoEmbedModifier extends Modifier
{
    private $videoembed;

    protected function init()
    {
        $this->videoembed = new VideoEmbed;
    }

    /**
     * Modify a value
     *
     * @param mixed  $value    The value to be modified
     * @param array  $params   Any parameters used in the modifier
     * @param array  $context  Contextual values
     * @return mixed
     */
    public function index($value, $params, $context)
    {
        $autoplay = $this->getConfig('autoplay', false) ? 'true' : 'false';
        $loop = $this->getConfig('loop', false) ? 'true' : 'false';
        $api = $this->getConfig('api', false) ? 'true' : 'false';
        $showinfo = $this->getConfig('showinfo', true) ? 'true' : 'false';
        $controls = $this->getConfig('controls', true) ? 'true' : 'false';
      
        return $this->videoembed->getVideoSrc($value, $autoplay, $loop, $api, $showinfo, $controls);
    }

    /**
     * Modify a value
     *
     * @param mixed  $value    The value to be modified
     * @param array  $params   Any parameters used in the modifier
     * @param array  $context  Contextual values
     * @return mixed
     */
    public function video_link($value, $params, $context)
    {
        return $this->videoembed->getVideoLink($value);
    }
}
