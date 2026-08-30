import { Router } from 'express';
import { getUsage, getWeather, getWeatherByIp } from '../controllers/weather.controller';
import { getGeocodeSuggestions } from '../controllers/geocode.controller';

const router = Router();

router.get('/weather', getWeather);
router.get('/weather-geo', getWeatherByIp);
router.get('/usage', getUsage);
router.get('/geocode', getGeocodeSuggestions);

export default router;
