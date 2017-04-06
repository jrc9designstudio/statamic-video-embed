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
            'description' => '',
            'author_name' => '',
            'author_url' => '',
            'duration' => '',
            'height' => 1080,
            'width' => 1920,
            'thumbnail_large' => '',
            'thumbnail_medium' => '',
            'thumbnail_small' => '',
            'fail' => '',
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
        $data['fail'] = '';
        $data['url'] = isset($data['url']) ? $data['url'] : '';
        $data['title'] = isset($data['title']) ? $data['title'] : '';
        $data['description'] = isset($data['description']) ? $data['description'] : '';
        $data['author_name'] = isset($data['author_name']) ? $data['author_name'] : '';
        $data['author_url'] = isset($data['author_url']) ? $data['author_url'] : '';
        $data['duration'] = isset($data['duration']) ? $data['duration'] : '';
        $data['height'] = isset($data['height']) ? $data['height'] : '';
        $data['width'] = isset($data['width']) ? $data['width'] : '';
        $data['thumbnail_large'] = isset($data['thumbnail_large']) ? $data['thumbnail_large'] : '';
        $data['thumbnail_medium'] = isset($data['thumbnail_medium']) ? $data['thumbnail_medium'] : '';
        $data['thumbnail_small'] = isset($data['thumbnail_small']) ? $data['thumbnail_small'] : '';
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
        
        // Do not save error messages
        unset($data['fail']);

        // The YouTube API leaves out some crutal info so we have to get it with oembed
        if ($this->videoembed->isYouTube($data['url'])) {
            $url_string = 'https://www.youtube.com/oembed?url=http%3A//youtube.com/watch%3Fv%3D' . $this->videoembed->getYouTubeVideoId($data['url']) . '&format=json';

            $request    = curl_init($url_string);

            curl_setopt($request, CURLOPT_RETURNTRANSFER, true);

            if ($contents = curl_exec($request)) {
                $contents = json_decode($contents, true);
                $data['author_url'] = $contents['author_url'];
                $data['height'] = $contents['height'] ? $contents['height'] : 1080;
                $data['width'] = $contents['width'] ? $contents['width'] : 1920;
            }
        }

        return $data;
    }
}
