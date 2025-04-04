const express = require("express");
const router = express.Router();
const CompanyAccount = require("../models/CompanyAccount");

const { createCompanyAccount, updateCompanyAccount, deleteCompanyAccount,getAllCompanyAccounts } = require("../controllers/companyAccountController");

router.post("/createaccount", createCompanyAccount);

router.put("/:id", updateCompanyAccount);

router.delete("/:id", deleteCompanyAccount);

router.get("/allcompany", async (req, res) => {
    try {
      const accounts = await CompanyAccount.find().sort({ updatedAt: -1 });
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company accounts", error: error.message });
    }
  });

module.exports = router;
