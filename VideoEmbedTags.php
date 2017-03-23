<?php

namespace Statamic\Addons\VideoEmbed;

use Statamic\Extend\Tags;

class VideoEmbedTags extends Tags
{
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
      
        if (strpos($value, 'youtube') !== false || strpos($value, 'youtu.be') !== false)
        {
            $src = 'https://www.youtube.com/embed/';
            if (strpos($value, '?v=') !== false)
            {
              $src .= substr($value, strrpos($value, '=') + 1);
            }
            else
            {
              $src .= substr($value, strrpos($value, '/') + 1);
            }
            $src .= '?autoplay=' . $autoplay . '&loop=' . $loop . '&enablejsapi=' . $api . '&showinfo=' . $showinfo . '&controls=' . $controls;
        }
        elseif (strpos($value, 'vimeo') !== false)
        {
            $src = 'https://player.vimeo.com/video/' . substr($value, strrpos($value, '/') + 1) . '?autoplay=' . $autoplay . '&loop=' . $loop . '&api=' . $api . '&title=' . $showinfo . '&portrait=' . $showinfo . '&byline=' . $showinfo;
        }
        else
        {
          $src = '';
        }
        return $src;
    }
}
