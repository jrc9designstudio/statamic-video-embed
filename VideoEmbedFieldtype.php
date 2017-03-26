<?php

namespace Statamic\Addons\VideoEmbed;

use Statamic\Extend\Fieldtype;

class VideoEmbedFieldtype extends Fieldtype
{
    private $videoembed;

    protected function init()
    {
        $this->videoembed = new VideoEmbed;
    }

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
            'description' => '',
            'key' => $data['key'] = $this->getConfig('key', '')
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
        // Pass the YouTube API key to Vue
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
        // Important! Unset the YouTube API key so it is not saved with the content
        unset($data['key']);

        // The YouTube API leaves out some crutal info so we have to get it with oembed
        if ($this->videoembed->isYouTube($data['url'])) {
            $url_string = 'https://www.youtube.com/oembed?url=http%3A//youtube.com/watch%3Fv%3D' . $this->videoembed->getYouTubeVideoId($data['url']) . '&format=json';

            $request    = curl_init($url_string);

            curl_setopt($request, CURLOPT_RETURNTRANSFER, true);

            if ($contents = curl_exec($request)) {
                $contents = json_decode($contents, true);
                $data['author_url'] = $contents['author_url'];
                $data['height'] = $contents['height'];
                $data['width'] = $contents['width'];
            }
        }

        return $data;
    }
}
