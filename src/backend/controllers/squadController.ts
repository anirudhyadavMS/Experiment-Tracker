import { Request, Response } from 'express';
import Squad from '../models/squad';
import Experiment from '../models/experiment';

class SquadController {
  // GET all squads sorted by squadNumber
  async getSquads(req: Request, res: Response) {
    try {
      const squads = await Squad.find().sort({ squadNumber: 1 });

      res.status(200).json({
        success: true,
        data: squads,
        count: squads.length,
        message: 'Squads retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving squads',
        error
      });
    }
  }

  // GET single squad by ID
  async getSquadById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const squad = await Squad.findById(id);

      if (!squad) {
        return res.status(404).json({
          success: false,
          message: 'Squad not found'
        });
      }

      res.status(200).json({
        success: true,
        data: squad,
        message: 'Squad retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving squad',
        error
      });
    }
  }

  // POST create new squad
  async createSquad(req: Request, res: Response) {
    try {
      const squadData = req.body;
      const squad = new Squad(squadData);
      await squad.save();

      res.status(201).json({
        success: true,
        data: squad,
        message: 'Squad created successfully'
      });
    } catch (error: any) {
      // Handle duplicate key errors
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({
          success: false,
          message: `Squad with this ${field} already exists`,
          error
        });
      }

      res.status(400).json({
        success: false,
        message: 'Error creating squad',
        error
      });
    }
  }

  // PUT update squad
  async updateSquad(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const squad = await Squad.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!squad) {
        return res.status(404).json({
          success: false,
          message: 'Squad not found'
        });
      }

      res.status(200).json({
        success: true,
        data: squad,
        message: 'Squad updated successfully'
      });
    } catch (error: any) {
      // Handle duplicate key errors
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({
          success: false,
          message: `Squad with this ${field} already exists`,
          error
        });
      }

      res.status(400).json({
        success: false,
        message: 'Error updating squad',
        error
      });
    }
  }

  // DELETE squad
  async deleteSquad(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Check if squad has any experiments
      const experimentCount = await Experiment.countDocuments({ squadId: id });

      if (experimentCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete squad. It has ${experimentCount} experiment(s) assigned to it. Please reassign or delete the experiments first.`
        });
      }

      const squad = await Squad.findByIdAndDelete(id);

      if (!squad) {
        return res.status(404).json({
          success: false,
          message: 'Squad not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Squad deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting squad',
        error
      });
    }
  }

  // GET squad statistics with experiment counts
  async getSquadStatistics(req: Request, res: Response) {
    try {
      const squads = await Squad.find().sort({ squadNumber: 1 });

      const statistics = await Promise.all(
        squads.map(async (squad) => {
          const squadId = squad._id.toString();

          // Get experiment counts by status for this squad
          const statusCounts = await Experiment.aggregate([
            { $match: { squadId: squad._id } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ]);

          // Convert aggregation result to a more usable format
          const counts = {
            total: 0,
            running: 0,
            completed: 0,
            paused: 0
          };

          statusCounts.forEach((item) => {
            counts.total += item.count;
            if (item._id === 'running') counts.running = item.count;
            if (item._id === 'completed') counts.completed = item.count;
            if (item._id === 'paused') counts.paused = item.count;
          });

          return {
            squadId,
            squadName: squad.name,
            squadNumber: squad.squadNumber,
            totalExperiments: counts.total,
            runningExperiments: counts.running,
            completedExperiments: counts.completed,
            pausedExperiments: counts.paused
          };
        })
      );

      res.status(200).json({
        success: true,
        data: statistics,
        message: 'Squad statistics retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving squad statistics',
        error
      });
    }
  }
}

export default new SquadController();
