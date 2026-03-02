import { Request, Response, NextFunction } from 'express';
import { AreaService } from '../services/AreaService.js';
import { asyncHandler } from '../utils/errors.js';

const areaService = new AreaService();

export const getAllAreas = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const areas = await areaService.getAllAreas();

  res.status(200).json({
    success: true,
    message: 'Areas retrieved successfully',
    data: areas,
  });
});

export const getAreaBySlug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const area = await areaService.getAreaBySlug(slug as string);

    res.status(200).json({
      success: true,
      message: 'Area retrieved successfully',
      data: area,
    });
  }
);

export const getAreaById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const area = await areaService.getAreaById(id as string);

  res.status(200).json({
    success: true,
    message: 'Area retrieved successfully',
    data: area,
  });
});

export const createArea = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, image } = req.body;

  // Validate required field
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Area name is required');
  }

  // Process uploaded image
  let imageUrl = image;
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get('host')}/uploads/areas/${req.file.filename}`;
  }

  const area = await areaService.createArea({
    name: name.trim(),
    description: description?.trim() || undefined,
    image: imageUrl?.trim() || undefined,
  });

  res.status(201).json({
    success: true,
    message: 'Area created successfully',
    data: area,
  });
});

export const updateArea = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, description, image } = req.body;

  // Process uploaded image
  let imageUrl = image;
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get('host')}/uploads/areas/${req.file.filename}`;
  }

  const area = await areaService.updateArea(id as string, {
    name: name?.trim(),
    description: description?.trim(),
    image: imageUrl?.trim(),
  });

  res.status(200).json({
    success: true,
    message: 'Area updated successfully',
    data: area,
  });
});
