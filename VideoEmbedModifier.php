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
            case 'link':
              return $this->videoembed->getVideoLink($value);
              break;
            case 'video_id':
              return $this->videoembed->getVideoId($value);
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
      
        return $this->videoembed->getVideoSrc($value, null, null, null, null, null); 
    }
}
