import React, { useState } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import Request from "../request";
import QuoteSubmitPage from "../../edquotation/quote-submit";
import OverallCostingPage from "../../edquotation/overall-costing";
import EDQuoteWorkflow from "../workflow/index";
import EmailLogs from "../email-logs";

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
    title: "Email logs",
    component: <EmailLogs />,
  },
};

export default function QuoteDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quoteNumber } = location.state || {};

  const [currentActiveTab, setCurrentActiveTab] = useState("1");
  const [renderedTabs, setRenderedTabs] = useState(["1"]); // Track rendered tabs

  const toggle = (tab) => {
    if (currentActiveTab !== tab) {
      setCurrentActiveTab(tab);
      if (!renderedTabs.includes(tab)) {
        setRenderedTabs([...renderedTabs, tab]); // Add the tab to the rendered list
      }
    }
  };

  const constructTabs = () => {
    let tempNavItems = [];
    let tempTabPane = [];
    for (const [key, value] of Object.entries(tabConfig)) {
      tempNavItems.push(
        <NavItem key={key}>
          <NavLink
            className={Number(key) === Number(currentActiveTab) ? "active" : ""}
            onClick={() => toggle(key)}
          >
            {value.title}
          </NavLink>
        </NavItem>
      );
      tempTabPane.push(
        <TabPane tabId={key} key={key}>
          {renderedTabs.includes(key) && value.component}{" "}
          {/* Render only visited tabs */}
        </TabPane>
      );
    }
    return { tempNavItems, tempTabPane };
  };

  return (
    <>
      <Card style={{ border: "none", marginTop: "10px" }}>
        <CardTitle style={{ textAlign: "center", marginTop: "20px" }}>
          {quoteNumber || "No Quote Number Provided"}
        </CardTitle>
        <CardBody style={{ padding: "0" }}>
          <Button
            color="primary"
            onClick={() => navigate(-1)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              border: "none",
              outline: "none",
              boxShadow: "none",
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
