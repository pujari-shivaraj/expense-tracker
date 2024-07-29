import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    splitMethod: { type: String, enum: ['equal', 'exact', 'percentage'], required: true },
    splitDetails: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, amount: Number, percentage: Number }]
  });



 const Expense = mongoose.model('Expense', expenseSchema);

 export default Expense