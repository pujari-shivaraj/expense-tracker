# Daily Expenses Sharing Application



## Overview

This is a backend service for a daily expenses sharing application. It allows users to manage expenses, split them using various methods (equal splits, exact amounts, and percentages), and generate/download balance sheets.

## Features

- **User Management**: Create and retrieve user details.
- **Expense Management**: Add expenses, split them by different methods, and retrieve expenses.
- **Balance Sheet**: Generate and download balance sheets.

## Prerequisites

- Node.js (v14 or later)
- MongoDB (v4.0 or later)

## Installation

1. **Clone the Repository**

  
   git clone https://github.com/yourusername/expense-sharing-app.git
   cd expense-sharing-app
   npm run dev

   Create a .env file in the root directory and add the following environment variables:


   MONGO_URI=mongodb://localhost:5000/expense-tracker
   PORT=8000
