<?php

namespace Statamic\Addons\VideoEmbed;

use Statamic\Extend\Extensible;

class VideoEmbed
{
    use Extensible;

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

    public function getYouTubeVideoId($value)
    {
        if (strpos($value, '?v=') !== false)
        {
            parse_str(parse_url($value)['query'], $idstr);
            return $idstr['v'];
        }

        return substr($value, strrpos($value, '/') + 1);
    }

    public function getVimeoId($value)
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

    public function getAspectRatio($height, $width)
    {
        $height = (int)$height;
        $width = (int)$width;
        $fraction = $width / $height;

        if ($fraction >= 2.333)
        {
            $aspect_ratio = 'cinema';
        }
        elseif ($fraction >= 1.777)
        {
            $aspect_ratio = 'wide';
        }
        elseif ($fraction >= 1.5)
        {
            $aspect_ratio = 'clasic';
        }
        elseif ($fraction >= 1.333) {
            $aspect_ratio = 'standard';
        }
        elseif ($fraction > 0.75) {
            $aspect_ratio = 'square';
        }
        elseif ($fraction <= 0.428571429) {
            $aspect_ratio = 'portrait_cinema';
        }
        elseif ($fraction <= 0.5625) {
            $aspect_ratio = 'portrait_wide';
        }
        elseif ($fraction <= 0.665) {
            $aspect_ratio = 'portrait_clasic';
        } elseif ($fraction <= 0.75) {
            $aspect_ratio = 'portrait_standard';
        } else {
            $aspect_ratio = 'wide';
        }

        return $aspect_ratio;
    }
}
