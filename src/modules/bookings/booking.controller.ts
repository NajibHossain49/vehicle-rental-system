import { Request, Response } from 'express';
import { catchAsync } from '../../utils/errorHandler';
import * as bookingService from './booking.service';

export const createBookingHandler = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.createBooking(req.body, req.user!.id);
  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: booking,
  });
});

export const getBookingsHandler = catchAsync(async (req: Request, res: Response) => {
  const bookings = await bookingService.getBookings(req.user!);
  const message = req.user!.role === 'admin'
    ? 'Bookings retrieved successfully'
    : 'Your bookings retrieved successfully';
  res.status(200).json({
    success: true,
    message,
    data: bookings,
  });
});

export const updateBookingHandler = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingService.updateBookingStatus(
    Number(req.params.bookingId),
    req.body,
    req.user!
  );
  res.status(200).json({
    success: true,
    message: result.message,
    data: result.booking,
  });
});