const Transaction = require("../models/Transaction");

// 🟢 **Create a Transaction**
const createTransaction = async (req, res) => {
  try {
    console.log("🔹 Incoming Transaction Data:", req.body);

    // Ensure user is authenticated
    if (!req.user) {
      console.log("❌ Unauthorized Request - No User Found backend");
      return res.status(401).json({ message: "Unauthorized. Please log in from bankend." });
    }

    // Extract transaction details from request body
    const {
      amount,
      paymentType,
      paymentMethod,
      companyAccountNumber,
      companyAccountHolderName,
    } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!amount) missingFields.push("amount");
    if (!paymentType) missingFields.push("paymentType");
    if (!paymentMethod) missingFields.push("paymentMethod");
    if (!companyAccountNumber) missingFields.push("companyAccountNumber");
    if (!companyAccountHolderName) missingFields.push("companyAccountHolderName");

    if (missingFields.length > 0) {
      console.log("❌ Missing Fields:", missingFields);
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Get user's IP address
    const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log("🔹 User IP Address:", ipAddress);

    // Create new transaction
    const newTransaction = new Transaction({
      user: req.user,
      amount,
      paymentType,
      paymentMethod,
      companyAccountNumber,
      companyAccountHolderName,
      ipAddress,
    });

    // Save transaction in the database
    await newTransaction.save();
    console.log("✅ Transaction Created Successfully:", newTransaction);

    res.status(201).json({
      message: "Transaction created successfully",
      transaction: newTransaction,
    });

  } catch (error) {
    console.error("❌ Transaction Failed:", error);
    res.status(500).json({
      message: "Transaction failed due to server error",
      error: error.message,
    });
  }
};


// 🔵 **Get User Transactions**
const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions", error: error.message });
  }
};

// 🔴 **Get All Transactions (Admin/Finance)**
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("user").sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions", error: error.message });
  }
};

// 🟠 **Update Transaction Status (Finance Admin)**
const updateTransactionStatus = async (req, res) => {
  try {

    const { status } = req.body;
    if (!["pending", "received", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const transaction = await Transaction.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction updated", transaction });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

module.exports = { createTransaction, getUserTransactions, getAllTransactions, updateTransactionStatus };
