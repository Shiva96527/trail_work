import { onSrfApiCall } from "../data/commonApiCall";

export const getVendorGridData = (payload) => {
  return onSrfApiCall({
    method: "POST",
    url: "/DigitalizeQuote/VendorGridDetails",
    data: payload,
  });
};

export const createVendor = (payload) => {
  return onSrfApiCall({
    method: "POST",
    url: "/DigitalizeQuote/VendorCreation",
    data: payload,
  });
};

export const updateVendor = (payload) => {
  return onSrfApiCall({
    method: "PUT",
    url: "/DigitalizeQuote/VendorUpdate",
    data: payload,
  });
};

export const deleteVendor = (payload) => {
  return onSrfApiCall({
    method: "DELETE",
    url: "/DigitalizeQuote/VendorDelete",
    data: payload,
  });
};
