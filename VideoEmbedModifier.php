<?php

namespace Statamic\Addons\VideoEmbed;

use Statamic\Extend\Modifier;

class VideoEmbedModifier extends Modifier
{
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
        }
        elseif (strpos($value, 'vimeo') !== false)
        {
            $src = 'https://player.vimeo.com/video/' . substr($value, strrpos($value, '/') + 1);
        }
        else
        {
          $src = '';
        }
        return $src;
    }
}
