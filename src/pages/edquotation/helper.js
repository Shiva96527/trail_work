import { getDigitalQuoteById } from "../../services/ed-service";

export const getDigitalQuoteDetail = async (digitalizeQuoteId) => {
  const payload = {
    loginUIID: sessionStorage.getItem("uiid"),
    digitalizeQuoteId,
  };
  try {
    const {
      data: { data: resultData, statusCode },
    } = await getDigitalQuoteById(payload);
    if (statusCode === 200) {
      return resultData;
    }
  } catch (e) {
    console.error(
      `error while fetching digitalizequote detail :${digitalizeQuoteId}`,
      e
    );
    return null;
  }
};

export const isComponentVisible = (showPanelStatusCodes, value) => {
  console.log(
    "first",
    showPanelStatusCodes,
    value,
    showPanelStatusCodes?.split(",")?.includes(value)
  );
  return showPanelStatusCodes?.split(",")?.includes(value) || false;
};
