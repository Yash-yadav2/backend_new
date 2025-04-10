const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
  },
  amount: { 
    type: Number, 
  },
  status: { 
    type: String, 
    enum: ["pending", "received", "rejected"], 
    default: "pending" 
  },
  paymentType: { 
    type: String, 
    enum: [
      "tum_bankalar",
      "bankpay",
      "othomatik",
      "banka_havalesi",
      "hizla_havalesi",
      "vip_havalesi",
      "fast_havele",
      "papara"
    ],
    required: true,
  },
  paymentMethod: { 
    type: String, 
  }, 
  transactionUserId: { 
    type: String, 
  }, 
  userAccountNumber: { 
    type: String, 
  },
  userAccountHolderName: { 
    type: String, 
  },
  companyAccountNumber: { 
    type: String, 
  },
  companyAccountHolderName: { 
    type: String, 
  },
  ipAddress: { type: String },
  rejectionNote: { type: String },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
