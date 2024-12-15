import React, { useEffect, useState } from "react";
import {
  Nav,
  NavItem,
  TabPane,
  NavLink,
  TabContent,
  Card,
  CardTitle,
  Button,
  CardBody,
  Badge,
} from "reactstrap";
import Request from "../request";
import QuoteSubmitPage from "../../edquotation/quote-submit";
import OverallCostingPage from "../../edquotation/overall-costing";
import EDQuoteWorkflow from "../task-history/index";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import EmailLogs from "../email-logs";
import { useSelector } from "react-redux";
import { getDigitalQuoteDetail } from "../helper";

//new to add two more component for mail and workflow

const initialConfig = {
  1: {
    title: "Request",
    component: <Request />,
  },
  4: {
    title: "Workflow",
    component: <EDQuoteWorkflow />,
  },
  5: {
    title: "Email logs ",
    component: <EmailLogs />,
  },
};

const tabConfig = {
  1: {
    title: "Request",
    component: <Request />,
  },
  2: {
    title: "Quote details",
    component: <QuoteSubmitPage />,
  },
  3: {
    title: "Overall Costing",
    component: <OverallCostingPage />,
  },
  4: {
    title: "Workflow",
    component: <EDQuoteWorkflow />,
  },
  5: {
    title: "Email logs ",
    component: <EmailLogs />,
  },
};

export default function QuoteDetailPage() {
  const { digitalizeQuoteId } = useSelector((state) => state?.globalSlice);
  const navigate = useNavigate(); // Initialize navigate
  const [currentActiveTab, setCurrentActiveTab] = useState("1");
  const [quoteDetail, setQuoteDetail] = useState(null);
  const [navItems, setNavItems] = useState();
  const [tabPane, setTabPane] = useState();

  useEffect(() => {
    getQuoteDetail(digitalizeQuoteId);
  }, [digitalizeQuoteId]);

  const getQuoteDetail = async () => {
    try {
      const quoteDetail = await getDigitalQuoteDetail(digitalizeQuoteId);
      setQuoteDetail(quoteDetail?.quoteCreationResponse);
      constructTabs(quoteDetail?.quoteCreationResponse?.statusCode);
      if (statusCode === 200) {
        toast.success(statusMessage);
      } else {
        toast.info(statusMessage);
      }
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      toggleExcelModal();
      getQuoteDetail();
    }
  };

  const toggle = (tab) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
    constructTabs(quoteDetail?.quoteCreationResponse?.statusCode);
  };

  const constructTabs = (statusCode) => {
    let tempNavItems = [];
    let tempTabPane = [];
    for (const [key, value] of Object.entries(
      statusCode === 1 ? initialConfig : tabConfig
    )) {
      tempNavItems.push(
        <NavItem key={key}>
          <NavLink
            className={Number(key) === Number(currentActiveTab) ? "active" : ""}
            onClick={() => {
              toggle(key);
            }}
          >
            {value.title}
          </NavLink>
        </NavItem>
      );
      tempTabPane.push(<TabPane tabId={key}>{value.component}</TabPane>);
    }
    setNavItems(tempNavItems);
    setTabPane(tempTabPane);
    // return { tempNavItems, tempTabPane };
  };

  return (
    <>
      <Card style={{ border: "none", marginTop: "10px" }}>
        {" "}
        <CardTitle style={{ textAlign: "center", marginTop: "20px" }}>
          {quoteDetail?.quoteNumber || "Loading..."}
          {quoteDetail?.status && (
            <Badge color="primary" style={{ marginLeft: "15px" }}>
              {quoteDetail?.status}
            </Badge>
          )}
        </CardTitle>
        <CardBody style={{ padding: "0" }}>
          <Button
            color="primary"
            onClick={() => navigate(-1)} // Go back to the previous page
            style={{
              position: "absolute", // Positioning the button
              top: "20px",
              right: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              border: "none", // Removed border
              outline: "none",
              boxShadow: "none", // Removed box-shadow
            }}
          >
            Back
          </Button>
        </CardBody>
      </Card>
      <div style={{ marginTop: "1.5em" }}>
        <Nav tabs>{navItems}</Nav>
        <TabContent activeTab={currentActiveTab}>{tabPane}</TabContent>
      </div>
    </>
  );
}
