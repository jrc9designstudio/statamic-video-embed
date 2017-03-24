<?php

namespace Statamic\Addons\VideoEmbed;

use Statamic\Extend\Addon;

class VideoEmbed extends Addon
{
    public function isYouTube($value)
    {
        return strpos($value, 'youtube') !== false || strpos($value, 'youtu.be') !== false;
    }

    public function isVimeo($value)
    {
        return strpos($value, 'vimeo') !== false;
    }

    public function isValid($value)
    {
      return ($this->isYouTube($value) || $this->isVimeo($value)) != false;
    }

    protected function getYouTubeVideoId($value)
    {
        if (strpos($value, '?v=') !== false)
        {
            return substr($value, strrpos($value, '=') + 1);
        }
        
        return substr($value, strrpos($value, '/') + 1);
    }

    protected function getVimeoId($value)
    {
        return substr($value, strrpos($value, '/') + 1);
    }

    public function getVideoId($value)
    {
        if ($this->isYouTube($value))
        {
            return $this->getYouTubeVideoId($value);
        }
        elseif ($this->isVimeo($value))
        {
            return $this->getVimeoId($value);
        }

        return '';
    }

    public function getVideoSrc($value, $autoplay, $loop, $api, $showinfo, $controls)
    {
        if (is_null($autoplay)) $autoplay = $this->getConfig('autoplay', false) ? 'true' : 'false';
        if (is_null($loop)) $loop = $this->getConfig('loop', false) ? 'true' : 'false';
        if (is_null($api)) $api = $this->getConfig('api', false) ? 'true' : 'false';
        if (is_null($showinfo)) $showinfo = $this->getConfig('showinfo', true) ? 'true' : 'false';
        if (is_null($controls)) $controls = $this->getConfig('controls', true) ? 'true' : 'false';
        
        if ($this->isYouTube($value))
        {
            return 'https://www.youtube.com/embed/' . $this->getYouTubeVideoId($value) . '?autoplay=' . $autoplay . '&loop=' . $loop . '&enablejsapi=' . $api . '&showinfo=' . $showinfo . '&controls=' . $controls;
        }
        elseif ($this->isVimeo($value))
        {
            return 'https://player.vimeo.com/video/' . $this->getVimeoId($value) . '?autoplay=' . $autoplay . '&loop=' . $loop . '&api=' . $api . '&title=' . $showinfo . '&portrait=' . $showinfo . '&byline=' . $showinfo;
        }
        
        return '';
    }

    public function getVideoLink($value)
    {
        if ($this->isYouTube($value))
        {
            return 'https://www.youtube.com/watch?v=' . $this->getYouTubeVideoId($value);
        }
        elseif ($this->isVimeo($value))
        {
            return 'https://vimeo.com/' . $this->getVimeoId($value);
        }

        return '';
    }
}
