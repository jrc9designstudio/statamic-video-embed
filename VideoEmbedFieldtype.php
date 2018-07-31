<?php

namespace Statamic\Addons\VideoEmbed;

use Statamic\Extend\Fieldtype;

class VideoEmbedFieldtype extends Fieldtype
{
    private $videoembed;
    public $category = ['media'];

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
        // This is what a new / blank video field should look like.
        return [
            'url' => '',
            'title' => '',
            'description' => '',
            'author_name' => '',
            'author_url' => '',
            'duration' => null,
            'height' => 1080,
            'width' => 1920,
            'thumbnail_large' => '',
            'thumbnail_medium' => '',
            'thumbnail_small' => '',
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
        // Pass the YouTube API key to Vue & set defaults if data is not set
        // - For example if info url was added via editing the yaml file
        $data['key'] = $this->getConfig('key', '');
        $data['url'] = isset($data['url']) ? $data['url'] : '';
        $data['title'] = isset($data['title']) ? $data['title'] : '';
        $data['description'] = isset($data['description']) ? $data['description'] : '';
        $data['author_name'] = isset($data['author_name']) ? $data['author_name'] : '';
        $data['author_url'] = isset($data['author_url']) ? $data['author_url'] : '';
        $data['duration'] = isset($data['duration']) ? $data['duration'] : null;
        $data['height'] = isset($data['height']) ? $data['height'] : 1080;
        $data['width'] = isset($data['width']) ? $data['width'] : 1920;
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
        // If there is no data do a curl for it. This could happen because:
        // - Vue failed to lookup data
        // - Video url was added outside CP, by Workshop for example.
        if ($this->videoembed->isValid($data['url']) &&
            (empty($data['title']) ||
             empty($data['author_name']) ||
             empty($data['author_url']) ||
             empty($data['thumbnail_large']) ||
             empty($data['thumbnail_medium']) ||
             empty($data['thumbnail_small'])))
        {
            // @todo do lookups with PHP when data empty
        }

        // The YouTube API leaves out some crutal info so we have to get it with oembed
        if ($this->videoembed->isYouTube($data['url'])) {
            $url_string = 'https://www.youtube.com/oembed?url=http%3A//youtube.com/watch%3Fv%3D';
            $url_string .= $this->videoembed->getYouTubeVideoId($data['url']);
            $url_string .= '&format=json';

            $request    = curl_init($url_string);

            curl_setopt($request, CURLOPT_RETURNTRANSFER, true);

            if ($contents = curl_exec($request)) {
                $contents = json_decode($contents, true);
                $data['author_url'] = $contents['author_url'];
                $data['height'] = $contents['height'] ? $contents['height'] : 1080;
                $data['width'] = $contents['width'] ? $contents['width'] : 1920;
            }
        }

        // Important! Unset the YouTube API key so it is not saved with the content
        unset($data['key']);

        // If there is no description unset it (so a blank string is not saved in YAML)
        // This way templates can easily just check if the description exists
        if (empty($data['description']))
        {
            unset($data['description']);
        }

        return $data;
    }
}
