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
} from "reactstrap";
import Request from "../request";
import QuoteSubmitPage from "../../edquotation/quote-submit";
import QuoteReviewPage from "../../edquotation/quote-review";
import EDQuoteWorkflow from "../workflow/index";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate hook
import { toast } from "react-toastify";
import EmailLogs from "../email-logs";

//new to add two more component for mail and workflow
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
    component: <QuoteReviewPage />,
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
  const { state } = useLocation();
  const navigate = useNavigate(); // Initialize navigate
  const [currentActiveTab, setCurrentActiveTab] = useState(1);

  useEffect(() => {
    constructTabs();
  }, []);

  useEffect(() => {
    console.log("state", state);
    if (!state) toast.error("No ED data found!");
  }, [state]);

  const toggle = (tab) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  };

  const constructTabs = () => {
    let tempNavItems = [];
    let tempTabPane = [];
    for (const [key, value] of Object.entries(tabConfig)) {
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
    return { tempNavItems, tempTabPane };
  };

  return (
    <>
      <Card style={{ border: "none", marginTop: "10px" }}>
        {" "}
        <CardTitle style={{ textAlign: "center", marginTop: "20px" }}>
          {state?.quoteNumber || "Loading..."}
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
        <Nav tabs>{constructTabs().tempNavItems}</Nav>
        <TabContent activeTab={currentActiveTab}>
          {constructTabs().tempTabPane}
        </TabContent>
      </div>
    </>
  );
}
