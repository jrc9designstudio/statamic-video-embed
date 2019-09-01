<?php

namespace Statamic\Addons\VideoEmbed;

use Statamic\Extend\ServiceProvider;
use Statamic\Extend\Meta;

class VideoEmbedServiceProvider extends ServiceProvider
{

    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot() {
        //
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register() {
        $this->app->bind('VideoEmbed.resolve-resource-path', function () {
            /**
             * @param  string  $path   The filename relative to the `resources/assets` directory.
             *                         eg. `js/foo.js`
             * @param  Addon   $addon  An instance of Statamic\Extend\Addon for your addon.
             * @return string          The filename relative to `resources/assets`
             *                         eg. `js/foo.js?id=1234` or `js/foo.somehash.js`
             */
            return function ($path, $addon) {
                $meta = new Meta($addon);
                $version = '';

                if ($meta->exists()) {
                    $meta->load();
                    $version = $meta->get('version');
                }

                return $path . '?v=' . $version;
            };
        });
    }
}
