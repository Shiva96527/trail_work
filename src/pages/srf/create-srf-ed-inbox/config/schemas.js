// Create schema based on the provided fields and columns.
const createSrfEdInboxSchema = {
    Assignee: { required: false },
    OpportunityID: { required: true },
    FIXCAS_SO: { required: false },
    FixCDS_SO: { required: false },
    BC: { required: false },
    SRF: { required: false } // SRF can be auto-generated, no need to validate
};

// Validation function to check if any required field is empty.
export const isAnyRequiredFieldEmpty = (model) => {
    return Object.keys(createSrfEdInboxSchema).some(field => {
        if (createSrfEdInboxSchema[field]?.required && !model[field]) {
            return true; // Required field is empty
        }
        return false; // Required field is not empty or not required
    });
};
