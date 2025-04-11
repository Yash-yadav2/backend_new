const express = require("express");
const router = express.Router();
const CompanyAccount = require("../models/CompanyAccount");
const { isAuthenticated, isAdminOrFinance } = require("../middleware/authMiddleware");
const { createCompanyAccount, updateCompanyAccount, deleteCompanyAccount, getAllCompanyAccounts } = require("../controllers/companyAccountController");

router.post("/createaccount", isAuthenticated, isAdminOrFinance, createCompanyAccount);

router.put("/:id", isAuthenticated, isAdminOrFinance, updateCompanyAccount);

router.delete("/:id", isAuthenticated, isAdminOrFinance, deleteCompanyAccount);

router.get("/allcompany",  isAuthenticated, isAdminOrFinance, getAllCompanyAccounts);

module.exports = router;
