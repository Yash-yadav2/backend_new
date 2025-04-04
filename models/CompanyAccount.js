const mongoose = require("mongoose");

const CompanyAccountSchema = new mongoose.Schema({
  bankName: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String 
  },
  QRcode: { 
    type: String 
  },
  min: { 
    type: Number 
  },
  max: { 
    type: Number 
  },
  paymentType: { 
    type: String, 
    enum: ["crypto", "bank", "vip", "super"], 
    required: true 
  },
  accountHolderName: { 
    type: String 
  },
  accountNumber: { 
    type: String 
  },
  paymentMethod: { 
    type: String, 
  }, 
  WalletAddress: { 
    type: String 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("CompanyAccount", CompanyAccountSchema);
