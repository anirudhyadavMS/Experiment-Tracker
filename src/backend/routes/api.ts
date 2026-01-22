import { Router } from 'express';
import experimentsController from '../controllers/experimentsController';
import squadController from '../controllers/squadController';
import { exportToPowerPoint } from '../controllers/exportController';

const router = Router();

// Experiment CRUD routes
router.get('/experiments', experimentsController.getExperiments.bind(experimentsController));
router.get('/experiments/statistics', experimentsController.getStatistics.bind(experimentsController));
router.get('/experiments/:id', experimentsController.getExperimentById.bind(experimentsController));
router.post('/experiments', experimentsController.createExperiment.bind(experimentsController));
router.put('/experiments/:id', experimentsController.updateExperiment.bind(experimentsController));
router.delete('/experiments/:id', experimentsController.deleteExperiment.bind(experimentsController));

// Squad CRUD routes
router.get('/squads', squadController.getSquads.bind(squadController));
router.get('/squads/statistics', squadController.getSquadStatistics.bind(squadController));
router.get('/squads/:id', squadController.getSquadById.bind(squadController));
router.post('/squads', squadController.createSquad.bind(squadController));
router.put('/squads/:id', squadController.updateSquad.bind(squadController));
router.delete('/squads/:id', squadController.deleteSquad.bind(squadController));

// Export routes
router.get('/export/powerpoint', exportToPowerPoint);

export default router;
