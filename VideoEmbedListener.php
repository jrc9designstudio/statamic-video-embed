<?php

namespace Statamic\Addons\VideoEmbed;

use Statamic\Extend\Listener;

class VideoEmbedListener extends Listener
{
    /**
     * The events to be listened for, and the methods to call.
     *
     * @var array
     */
    public $events = [
        'cp.add_to_head' => 'addToHead'
    ];

    public function addToHead()
    {
        return $this->css->tag('videoembed.css');
    }
}
