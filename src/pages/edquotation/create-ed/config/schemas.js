// Create schema based on the provided fields and columns.
const createEdSchema = {
  assignee: { required: true },
  opportunityID: { required: true },
  fixCasNumber: { required: false },
  fixCdsNumber: { required: false },
  businessCaseNumber: { required: false },
  srfNumber: { required: false }, // SRF can be auto-generated, no need to validate
};

// Validation function to check if any required field is empty.
export const isAnyRequiredFieldEmpty = (model) => {
  return Object.keys(createEdSchema).some((field) => {
    if (createEdSchema[field]?.required && !model[field]) {
      return true; // Required field is empty
    }
    return false; // Required field is not empty or not required
  });
};
