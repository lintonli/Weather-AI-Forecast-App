import { Router } from 'express';
import { smsLimiter } from '../middleware/rateLimiter';
import {
  getSmsHealth,
  getSmsStats,
  registerBometFarmer,
  sendSms,
  sendSmsAlert,
} from '../controllers/sms.controller';

const router = Router();

router.use(smsLimiter);

router.post('/send', sendSms);
router.post('/alert', sendSmsAlert);
router.post('/bomet/register', registerBometFarmer);
router.get('/stats', getSmsStats);
router.get('/health', getSmsHealth);

export default router;
