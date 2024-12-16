import { onSrfApiCall } from "../data/commonApiCall";

export const getDigitalEDQuoteGrid = (payload) => {
  return onSrfApiCall({
    method: "POST",
    url: "/DigitalizeQuote/DigitalizeQuoteGrid",
    data: payload,
  });
};

export const createDigitalEDQuote = (payload) => {
  return onSrfApiCall({
    method: "POST",
    url: "/DigitalizeQuote/DigitalizeQuoteCreation",
    data: payload,
  });
};

export const updateDigitalEDQuote = (payload) => {
  return onSrfApiCall({
    method: "PUT",
    url: "/DigitalizeQuote/DigitalizeQuoteUpdate",
    data: payload,
  });
};

export const searchDigitalEDQuote = (payload) => {
  return onSrfApiCall({
    method: "POST",
    url: "/DigitalizeQuote/DigitalizeQuoteSearch",
    data: payload,
  });
};

export const bulkUploadDigitalEDQuote = (payload) => {
  return onSrfApiCall({
    method: "POST",
    url: "/DigitalizeQuote/DigitalizeQuoteBulkCreation",
    data: payload,
  });
};

export const bulkUploadDigitalMM = (payload) => {
  return onSrfApiCall({
    method: "POST",
    url: "/DigitalizeQuote/DigitalizeQuoteQuotationDetailsUpload",
    data: payload,
  });
};

export const getDigitalQuoteById = (payload) => {
  return onSrfApiCall({
    method: "POST",
    url: "/DigitalizeQuote/DigitalizeQuoteByID",
    data: payload,
  });
};

export const postDigitalizeQuoteSubmitForApprovalorReject = (payload) => {
  return onSrfApiCall({
    method: "POST",
    url: "/DigitalizeQuote/DigitalizeQuoteSubmitForApprovalorReject",
    data: payload,
  });
};

export const postDigitalizeQuoteOverallCostingApprovalorReject = (payload) => {
  return onSrfApiCall({
    method: "POST",
    url: "/DigitalizeQuote/DigitalizeQuoteOverallCostingApprovalorReject",
    data: payload,
  });
};
