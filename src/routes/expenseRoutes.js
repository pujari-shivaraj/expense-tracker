import express from 'express';
import { addExpense, getUserExpenses, getOverallExpenses, downloadBalanceSheet } from '../controllers/expenseController.js';

const router = express.Router();

router.post('/', addExpense);
router.get('/user/:userId', getUserExpenses);
router.get('/overall', getOverallExpenses);
router.get('/download/balance-sheet', downloadBalanceSheet);

export default router;