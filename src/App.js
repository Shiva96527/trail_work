import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import { useRoutes } from "react-router-dom";
import { approutes } from "./navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMenuItems,
  setSrfDropdownOptions,
  setUserInfo,
  toggleNonStandard,
} from "./redux/slices/globalSlice";
import { getDropdownByTypeHTTP } from "./services/global-service";

function App() {
  const dispatch = useDispatch();
  const { userInfo = null } = useSelector((state) => state?.globalSlice);
  const router = useRoutes(
    approutes(sessionStorage.getItem("userInfo") || userInfo?.user?.User_ID)
  );

  useEffect(() => {
    if (sessionStorage.getItem("userDetails")) {
      refreshUser(JSON.parse(sessionStorage.getItem("userDetails")));
    }
    getDropdownValues();
    //eslint-disable-next-line
  }, []);

  const refreshUser = async (payload) => {
    const Myosstoken = sessionStorage.getItem("token");
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    dispatch(setUserInfo({ token: Myosstoken, user: { ...userInfo } }));
    dispatch(setMenuItems(JSON.parse(sessionStorage.getItem("menuItems"))));
  };

  const getDropdownValues = async () => {
    try {
      const {
        data: { data: resultData, statusCode },
      } = await getDropdownByTypeHTTP({
        DropDownType: "SRF DropDown Values",
        LoginUIID: sessionStorage.getItem("uiid"),
      });
      if (statusCode === 200) {
        const dropdowns = resultData?.reduce((acc, data) => {
          acc[data?.DropDownType] = {
            DDId: data?.DDId,
            dropdownType: data?.DropDownType,
            dropdownValue: data?.DropDownValue?.split(","),
          };
          return acc;
        }, {});
        dispatch(setSrfDropdownOptions({ SRFDROPDOWNVALUES: dropdowns }));
      } else {
        toast.error("");
      }
    } catch (e) {
      toast.error("System error.");
    }
  };

  return (
    <div className="App">
      <div id="loading">
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
      {router}
    </div>
  );
}

export default App;
