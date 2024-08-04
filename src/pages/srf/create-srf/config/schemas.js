const createSrfSchema = {
    OpportunityCRMID: { required: true },
    CustomerName: { required: true },
    ExistingCircuitId: '',
    BizVertical: { required: true },
    Requestor: { required: true },
    TypeofService: { required: true },
    NetworkType: '',
    RequestType: '',
    BandType: '',
    BusinessApplication: '',
    ImpactCusBusiness: '',
    IPSLARequirement: ''
}

export const isAnyRequiredFieldEmpty = (model) => {
    return Object.keys(createSrfSchema).some(field => {
        if (createSrfSchema[field]?.required && !model[field]) {
            return true; // Required field is empty
        }
        return false; // Required field is not empty or not required
    });
};