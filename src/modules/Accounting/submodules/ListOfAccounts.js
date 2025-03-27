// Array of Accounts
const accounts = [
    "Assets",
    "Non-Current Assets",
    "Current Liabilities",
    "Non-Current Liabilities",
    "Equity",
    "Revenue",
    "Cost of Goods Sold",
    "Administrative Expenses",
    "Selling and Distribution Expenses",
    "Other Income",
    "Other Expenses"
  ]

const sortingChoices = [
  "Ascending",
  "Descending",
]

// Objects for subAccounts
const subAccounts = {
  assets: [
    "Cash on Hand",
    "Cash in Bank",
    "Accounts Receivable",
    "Allowance for Doubtful Accounts (Contra-Asset)",
    "Raw Materials Inventory",
    "Work-in-Process (WIP) Inventory",
    "Finished Goods Inventory",
    "Prepaid Expenses (Rent, Insurance, etc.)",
    "Supplier Advances"
  ],
  nonCurrentAssets: [
    "Land & Buildings",
    "Machinery & Equipment",
    "Vehicles",
    "Office Furniture & Fixtures",
    "Computers & IT Equipment",
    "Intangible Assets (Patents, Trademarks, Software)",
    "Accumulated Depreciation (Contra-Asset)"
  ],
  currentLiabilities: [
    "Accounts Payable (Supplier Balances)",
    "Accrued Expenses (Unpaid Wages, Utilities, etc.)",
    "Taxes Payable (VAT, Income Tax, Payroll Tax)",
    "Short-Term Loans Payable",
    "Customer Deposits (Advance Payments)"
  ],
  nonCurrentLiabilities: [
    "Long-Term Loans Payable",
    "Bonds Payable",
    "Lease Liabilities"
  ],
  equity: [
    "Owner’s Capital / Shareholder’s Equity",
    "Retained Earnings",
    "Dividends Payable"
  ],
  revenue: [
    "Sales Revenue (Main Product Sales)",
    "Service Revenue (If Offering Custom Services)",
    "Discounts Allowed (Contra-Revenue)"
  ],
  costOfGoodsSold: [
    "Raw Materials Used",
    "Direct Labor (Factory Workers)",
    "Factory Overhead (Utilities, Rent, Depreciation)",
    "Work-in-Process Adjustments",
    "Cost of Finished Goods Sold"
  ],
  administrativeExpenses: [
    "Salaries & Wages (Office & Admin Staff)",
    "Office Supplies & Equipment",
    "Rent & Utilities (Office)",
    "Depreciation (Office Equipment, Computers)",
    "Software & IT Expenses",
    "Legal & Professional Fees"
  ],
  sellingAndDistributionExpenses: [
    "Marketing & Advertising",
    "Sales Commissions",
    "Shipping & Freight Costs",
    "Packaging Costs"
  ],
  otherIncome: [
    "Interest Income",
    "Gain on Sale of Assets",
    "Investment Income"
  ],
  otherExpenses: [
    "Interest Expense",
    "Loss on Sale of Assets",
    "Investment Losses"
  ]
}

const sortByDate = [
  "Today",
  "Last 7 days",
  "Last 30 days", 
  "This week", 
  "Last week",
  "This month",
  "Last month"
]

export { accounts, subAccounts, sortByDate, sortingChoices };