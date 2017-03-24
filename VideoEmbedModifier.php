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

    public function index($value, $params, $context)
    {
        if (count($params) > 0)
        {
          switch ($params[0])
          {
            case 'video_link':
              return $this->videoembed->getVideoLink($value);
              break;
            case 'is_valid':
              return $this->videoembed->isValid($value);
              break;
            case 'is_youtube':
              return $this->videoembed->isYouTube($value);
              break;
            case 'is_vimeo':
              return $this->videoembed->isVimeo($value);
              break;  
          }
        }
        
        $autoplay = $this->getConfig('autoplay', false) ? 'true' : 'false';
        $loop = $this->getConfig('loop', false) ? 'true' : 'false';
        $api = $this->getConfig('api', false) ? 'true' : 'false';
        $showinfo = $this->getConfig('showinfo', true) ? 'true' : 'false';
        $controls = $this->getConfig('controls', true) ? 'true' : 'false';
      
        return $this->videoembed->getVideoSrc($value, $autoplay, $loop, $api, $showinfo, $controls); 
    }
}
