import Expense from '../models/expenseModel.js';
import mongoose from 'mongoose';
import User from '../models/userModel.js';
import { Parser } from 'json2csv';

export const addExpense = async (req, res) => {
  try {
    const { description, amount, paidBy, splitMethod, splitDetails } = req.body;

    let validatedSplitDetails = [];

    switch (splitMethod) {
      case 'equal':
        const numParticipants = splitDetails.length;
        const equalAmount = amount / numParticipants;
        validatedSplitDetails = splitDetails.map((detail) => ({
          user: detail.user,
          amount: equalAmount
        }));
        break;

      case 'exact':
        const totalExactAmount = splitDetails.reduce((acc, detail) => acc + detail.amount, 0);
        if (totalExactAmount !== amount) {
          return res.status(400).json({ error: 'Total exact amounts must equal the expense amount' });
        }
        validatedSplitDetails = splitDetails.map((detail) => ({
          user: detail.user,
          amount: detail.amount
        }));
        break;

      case 'percentage':
        const totalPercentage = splitDetails.reduce((acc, detail) => acc + detail.percentage, 0);
        if (totalPercentage !== 100) {
          return res.status(400).json({ error: 'Percentages must add up to 100%' });
        }
        validatedSplitDetails = splitDetails.map((detail) => ({
          user: detail.user,
          amount: (detail.percentage / 100) * amount,
          percentage: detail.percentage
        }));
        break;

      default:
        return res.status(400).json({ error: 'Invalid split method' });
    }

    const expense = new Expense({ description, amount, paidBy, splitMethod, splitDetails: validatedSplitDetails });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



export const getUserExpenses = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Find expenses where the user is either the payer or part of the split details
    const expenses = await Expense.find({
      $or: [
        { paidBy: new mongoose.Types.ObjectId(userId) },
        { 'splitDetails.user': new mongoose.Types.ObjectId(userId) }
      ]
    })
    .populate('paidBy', 'name email')
    .populate('splitDetails.user', 'name email');

    if (expenses.length === 0) {
      return res.status(404).json({ message: 'No expenses found for this user' });
    }

    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error retrieving user expenses:', error);
    res.status(500).json({ error: 'Failed to retrieve user expenses', details: error.message });
  }
};


export const getOverallExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('paidBy splitDetails.user');
    res.json(expenses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



export const downloadBalanceSheet = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('paidBy splitDetails.user');

    const flattenedExpenses = expenses.flatMap(expense => 
      expense.splitDetails.map(detail => ({
        description: expense.description,
        amount: expense.amount,
        paidBy: expense.paidBy.name,
        splitMethod: expense.splitMethod,
        userName: detail.user.name,
        amountSplit: detail.amount || '',
        percentageSplit: detail.percentage || ''
      }))
    );

    const fields = ['description', 'amount', 'paidBy', 'splitMethod', 'userName', 'amountSplit', 'percentageSplit'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(flattenedExpenses);

    res.header('Content-Type', 'text/csv');
    res.attachment('balance_sheet.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
