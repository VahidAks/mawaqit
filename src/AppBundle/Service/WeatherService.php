<?php

namespace AppBundle\Service;

use AppBundle\Service\Api\WeatherApi;
use AppBundle\Entity\Mosque;

class WeatherService extends WeatherApi
{

    /**
     * get temperature of the mosque city, in celsius
     * @param Mosque $mosque
     * @return array
     */
    function getWeather(Mosque $mosque)
    {
        $position = $mosque->getGpsCoordinates();
        $position = "lat=" . $position["lat"] . "&lon=" . $position["lon"];
        $res = $this->call("GET", $position);

        if ($res instanceof \stdClass && isset($res->main->temp)) {
            return [
                'temperature' => number_format(round($res->main->temp - 273.15), 0),
                'icon' => $this->getIcon($res),
            ];
        } else {
            $this->logger->error("Weather API Error", [$res]);
        }

        return [];
    }

    private function getIcon($res)
    {
        $iconMapping = [
            200 => 'storm-showers',
            201 => 'storm-showers',
            202 => 'storm-showers',
            210 => 'storm-showers',
            211 => 'thunderstorm',
            212 => 'thunderstorm',
            221 => 'thunderstorm',
            230 => 'storm-showers',
            231 => 'storm-showers',
            232 => 'storm-showers',
            300 => 'sprinkle',
            301 => 'sprinkle',
            302 => 'sprinkle',
            310 => 'sprinkle',
            311 => 'sprinkle',
            312 => 'sprinkle',
            313 => 'sprinkle',
            314 => 'sprinkle',
            321 => 'sprinkle',
            500 => 'rain',
            501 => 'rain',
            502 => 'rain',
            503 => 'rain',
            504 => 'rain',
            511 => 'rain-mix',
            520 => 'showers',
            521 => 'showers',
            522 => 'showers',
            531 => 'showers',
            600 => 'snow',
            601 => 'snow',
            602 => 'snow',
            611 => 'sleet',
            612 => 'sleet',
            615 => 'rain-mix',
            616 => 'rain-mix',
            620 => 'rain-mix',
            621 => 'rain-mix',
            622 => 'rain-mix',
            701 => 'sprinkle',
            711 => 'smoke',
            721 => 'day-haze',
            731 => 'cloudy-gusts',
            741 => 'fog',
            751 => 'cloudy-gusts',
            762 => 'smog',
            771 => 'day-windy',
            781 => 'tornado',
            800 => 'sunny',
            801 => 'cloudy',
            802 => 'cloudy',
            803 => 'cloudy',
            804 => 'cloudy',
            900 => 'tornado',
            901 => 'hurricane',
            902 => 'hurricane',
            904 => 'hot',
            905 => 'windy',
            906 => 'hail',
            951 => 'sunny',
            952 => 'cloudy-gusts',
            953 => 'cloudy-gusts',
            954 => 'cloudy-gusts',
            955 => 'cloudy-gusts',
            956 => 'cloudy-gusts',
            957 => 'cloudy-gusts',
            958 => 'cloudy-gusts',
            959 => 'cloudy-gusts',
            960 => 'thunderstorm',
            961 => 'thunderstorm',
            962 => 'cloudy-gusts'
        ];

        $id = $res->weather[0]->id;
        $icon = $iconMapping[$id];
        if (!($id > 699 && $id < 800) && !($id > 899 && $id < 1000)) {
            $icon = 'day-' . $icon;
        }

        return $icon;
    }

}
