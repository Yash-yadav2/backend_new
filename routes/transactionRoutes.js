const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin, isAdminOrFinance} = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");

const {
  createTransaction,
  getAllTransactions,
  getUserTransactions,
  updateTransactionStatus
} = require("../controllers/transactionController");

// 🔹 **User Transactions**
router.post("/create", createTransaction);
router.get("/user", isAuthenticated, getUserTransactions);


// 🔹 **Admin Routes**
router.get("/all", isAuthenticated, isAdminOrFinance, getAllTransactions);


  router.put("/update/:id", isAuthenticated, isAdminOrFinance, async (req, res) => {  // <-- async keyword added
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
