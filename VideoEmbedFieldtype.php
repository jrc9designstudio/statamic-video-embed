<?php

namespace Statamic\Addons\VideoEmbed;

use Statamic\Extend\Fieldtype;

class VideoEmbedFieldtype extends Fieldtype
{
    /**
     * The blank/default value
     *
     * @return array
     */
    public function blank()
    {
        return [
            'url' => '',
            'title' => '',
            'author_name' => '',
            'description' => ''
        ];
    }

    /**
     * Pre-process the data before it gets sent to the publish page
     *
     * @param mixed $data
     * @return array|mixed
     */
    public function preProcess($data)
    {
        $data['key'] = $this->getConfig('key', '');
        return $data;
    }

    /**
     * Process the data before it gets saved
     *
     * @param mixed $data
     * @return array|mixed
     */
    public function process($data)
    {
        unset($data['key']);
        return $data;
    }
}
