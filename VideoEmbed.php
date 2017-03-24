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

    public function getYouTubeVideoId($value)
    {
        if (strpos($value, '?v=') !== false)
        {
            return substr($value, strrpos($value, '=') + 1);
        }
        
        return substr($value, strrpos($value, '/') + 1);
    }

    public function getVimeoId($value)
    {
    	return substr($value, strrpos($value, '/') + 1);
    }

    public function getVideoSrc($value, $autoplay, $loop, $api, $showinfo, $controls)
    {
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

}
