const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const Transaction = require("../models/Transaction");

const {
  createTransaction,
  getAllTransactions,
  getUserTransactions,
  updateTransactionStatus
} = require("../controllers/transactionController");

// 🔹 **User Transactions**
router.post("/create", isAuthenticated, createTransaction);
router.get("/user", getUserTransactions);


// 🔹 **Admin Routes**
router.get("/all",isAdmin, async (req, res) => {
    try {
        // Removed .populate("user")
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        res.json(transactions);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch transactions", error: error.message });
      }
  });


  router.put("/update/:id", isAdmin, async (req, res) => {  // <-- async keyword added
    try {
        console.log("Backend aa gya", req.params);
        console.log("req.params.id:", req.params.id);

        // Ensure updateData is received
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No data provided for update" });
        }

        // Update transaction with req.body
        const transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,  // <-- Ensure req.body is passed
            { new: true, runValidators: true } // Ensure validation and return updated doc
        );

        console.log("Transaction updated", transaction);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.json({ message: "Transaction updated", transaction });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Update failed", error: error.message });
    }
});


module.exports = router;
