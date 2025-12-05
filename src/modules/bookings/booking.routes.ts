import { Router } from 'express';
import * as controller from './booking.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.post('/', controller.createBookingHandler);
router.get('/', controller.getBookingsHandler);
router.put('/:bookingId', controller.updateBookingHandler);

export default router;