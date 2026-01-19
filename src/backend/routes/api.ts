import { Router } from 'express';
import experimentsController from '../controllers/experimentsController';
import { exportToPowerPoint } from '../controllers/exportController';

const router = Router();

// Experiment CRUD routes
router.get('/experiments', experimentsController.getExperiments.bind(experimentsController));
router.get('/experiments/statistics', experimentsController.getStatistics.bind(experimentsController));
router.get('/experiments/:id', experimentsController.getExperimentById.bind(experimentsController));
router.post('/experiments', experimentsController.createExperiment.bind(experimentsController));
router.put('/experiments/:id', experimentsController.updateExperiment.bind(experimentsController));
router.delete('/experiments/:id', experimentsController.deleteExperiment.bind(experimentsController));

// Export routes
router.get('/export/powerpoint', exportToPowerPoint);

export default router;
