import { Request, Response } from 'express';
import Experiment from '../models/experiment';

class ExperimentsController {
  // GET all experiments with optional filters, search, and sort
  async getExperiments(req: Request, res: Response) {
    try {
      const {
        status,
        owner,
        startDateFrom,
        startDateTo,
        endDateFrom,
        endDateTo,
        decision,
        confidenceLevel,
        search,
        sortField = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 20
      } = req.query;

      // Build filter query
      const filter: any = {};

      if (status) filter.status = status;
      if (owner) filter.owner = owner;
      if (decision) filter.decision = decision;
      if (confidenceLevel) filter.confidenceLevel = confidenceLevel;

      // Date range filters
      if (startDateFrom || startDateTo) {
        filter.startDate = {};
        if (startDateFrom) filter.startDate.$gte = new Date(startDateFrom as string);
        if (startDateTo) filter.startDate.$lte = new Date(startDateTo as string);
      }

      if (endDateFrom || endDateTo) {
        filter.endDate = {};
        if (endDateFrom) filter.endDate.$gte = new Date(endDateFrom as string);
        if (endDateTo) filter.endDate.$lte = new Date(endDateTo as string);
      }

      // Text search
      if (search) {
        filter.$text = { $search: search as string };
      }

      // Build sort
      const sort: any = {};
      sort[sortField as string] = sortOrder === 'asc' ? 1 : -1;

      // Pagination
      const skip = (Number(page) - 1) * Number(limit);

      const experiments = await Experiment
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));

      const total = await Experiment.countDocuments(filter);

      res.status(200).json({
        success: true,
        data: experiments,
        count: experiments.length,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        message: 'Experiments retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving experiments',
        error
      });
    }
  }

  // GET single experiment by ID
  async getExperimentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const experiment = await Experiment.findById(id);

      if (!experiment) {
        return res.status(404).json({
          success: false,
          message: 'Experiment not found'
        });
      }

      res.status(200).json({
        success: true,
        data: experiment,
        message: 'Experiment retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving experiment',
        error
      });
    }
  }

  // POST create new experiment
  async createExperiment(req: Request, res: Response) {
    try {
      const experimentData = req.body;
      const experiment = new Experiment(experimentData);
      await experiment.save();

      res.status(201).json({
        success: true,
        data: experiment,
        message: 'Experiment created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error creating experiment',
        error
      });
    }
  }

  // PUT update experiment
  async updateExperiment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const experiment = await Experiment.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!experiment) {
        return res.status(404).json({
          success: false,
          message: 'Experiment not found'
        });
      }

      res.status(200).json({
        success: true,
        data: experiment,
        message: 'Experiment updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error updating experiment',
        error
      });
    }
  }

  // DELETE experiment
  async deleteExperiment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const experiment = await Experiment.findByIdAndDelete(id);

      if (!experiment) {
        return res.status(404).json({
          success: false,
          message: 'Experiment not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Experiment deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting experiment',
        error
      });
    }
  }

  // GET statistics/aggregations
  async getStatistics(req: Request, res: Response) {
    try {
      const statusCounts = await Experiment.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      const decisionCounts = await Experiment.aggregate([
        { $group: { _id: '$decision', count: { $sum: 1 } } }
      ]);

      res.status(200).json({
        success: true,
        data: {
          byStatus: statusCounts,
          byDecision: decisionCounts
        },
        message: 'Statistics retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving statistics',
        error
      });
    }
  }
}

export default new ExperimentsController();
