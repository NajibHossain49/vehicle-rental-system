import { Request, Response } from 'express';
import { catchAsync } from '../../utils/errorHandler';
import * as vehicleService from './vehicle.service';

export const createVehicleHandler = catchAsync(async (req: Request, res: Response) => {
  const vehicle = await vehicleService.createVehicle(req.body);
  res.status(201).json({
    success: true,
    message: 'Vehicle created successfully',
    data: vehicle,
  });
});

export const getAllVehiclesHandler = catchAsync(async (req: Request, res: Response) => {
  const vehicles = await vehicleService.getAllVehicles();
  const message = vehicles.length > 0 ? 'Vehicles retrieved successfully' : 'No vehicles found';
  res.status(200).json({
    success: true,
    message,
    data: vehicles,
  });
});

export const getVehicleByIdHandler = catchAsync(async (req: Request, res: Response) => {
  const vehicle = await vehicleService.getVehicleById(Number(req.params.vehicleId));
  res.status(200).json({
    success: true,
    message: 'Vehicle retrieved successfully',
    data: vehicle,
  });
});

export const updateVehicleHandler = catchAsync(async (req: Request, res: Response) => {
  const vehicle = await vehicleService.updateVehicle(Number(req.params.vehicleId), req.body);
  res.status(200).json({
    success: true,
    message: 'Vehicle updated successfully',
    data: vehicle,
  });
});

export const deleteVehicleHandler = catchAsync(async (req: Request, res: Response) => {
  await vehicleService.deleteVehicle(Number(req.params.vehicleId));
  res.status(200).json({
    success: true,
    message: 'Vehicle deleted successfully',
  });
});