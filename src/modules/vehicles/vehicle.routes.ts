import { Router } from "express";
import { protect, restrictTo } from "../../middleware/auth.middleware";
import * as controller from "./vehicle.controller";

const router = Router();

// Public routes
router.get("/", controller.getAllVehiclesHandler);
router.get("/:vehicleId", controller.getVehicleByIdHandler);

// Admin only routes
router.use(protect);
router.use(restrictTo("admin"));

router.post("/", controller.createVehicleHandler);
router.put("/:vehicleId", controller.updateVehicleHandler);
router.delete("/:vehicleId", controller.deleteVehicleHandler);

export default router;
