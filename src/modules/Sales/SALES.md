# Sales module frontend.

The Sales module is responsible for managing the sales process.

## Files

- `Sales.js` serves as a dashboard for the sales module.
- `submodules folder` are the different submodules of the sales module.
- `components folder` contains the different components used in the sales module.

## Data Handling

During development `temp_data folder` was used to store psuedo data to simulate the data that would be returned from the backend.

## ID Generations

IDs for sales operation are generated in `GenerateID.jsx` at `Components folder` and are called in their respective submodule files.
IDs are at the format of <first letter of operation>-<random 6 character base 16 integer>

### ID Examples:

1. Customer ID = C-12F4A6
2. Quotation ID = Q-1A2B3C
   - Generated at `Quotation.jsx` in the `submodules` folder.
3. Invoice ID = I-4D5E6F
4. Order ID = O-7G8H9I

## Copy To | Copy From Functionality

The copy to and copy from functionality serves as a way to copy data from one sales operation to another.
This is done by selecting the operation to copy from and the operation to copy to.

### Copy From Process

1. Use the copy from dropdown to select the operation to copy from.
2. Confirm from the modal that pops up.
3. The data from the selected operation is copied to the operation selected in the copy to dropdown.

### Copy To Process

1. Use the copy to dropdown to select the operation to copy to.
2. The data will temporarily be stored in the `local storage` of the browser.
3. User will be transferred to the operation selected in the copy to dropdown.
4. Previous data stored in the `local storage` will be copied to the operation selected in the copy to dropdown.
5. The data will be removed from the `local storage` after the copy operation is complete.

## Modals

Modals are used to confirm actions such as deleting an operation or copying data from one operation to another. They are also used as a floating window to display more information about an operation.

1. `Lists folder` - Components that are used to display lists of informations or operations.
   1. `CustomerList.jsx` - Displays a list of customers. Uses the `customer_data.jsx` file in the `temp_data` folder.
   2. `ProductList.jsx` - Displays a list of products. Uses the `product_data.jsx` file in the `temp_data` folder.
2. `Modals folder` - Components that are used to display modals for an action in the module.
   1. `NewCustomerModal.jsx` - Modal for adding a new customer. Uses the `new_customer_data.jsx` file in the `temp_data` folder for countries and respective cities and customer types.

## Implementation Notes

1. To create Blanket Agreements checkout `BlanketAgreementDates.jsx` in the `components/Modals` folder.

## TODO

1. Implement invalid alerts for Sales table when editing values.
2. Implement a proper alert system for the module.
3. Implement a form validation system for the module.
4. Switch unit price to markup price in the product list.
5. Implement a proper search system for the module.
