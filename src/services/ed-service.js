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
    url: "/DigitalizeQuote/search",
    data: payload,
  });
};

export const bulkUploadDigitalEDQuote = (payload) => {
  return onSrfApiCall({
    method: "POST",
    url: "/DigitalizeQuote/uploadfile",
    data: payload,
  });
};
