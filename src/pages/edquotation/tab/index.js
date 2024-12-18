import React, { useEffect, useState, Suspense, lazy } from "react";
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
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate hook
import classnames from "classnames";

const Request = lazy(() => import("../request"));
const QuoteSubmit = lazy(() => import("../quote-submit"));
const OverallCosting = lazy(() => import("../overall-costing"));
const TaskHistory = lazy(() => import("../task-history"));
const EmailLogs = lazy(() => import("../email-logs"));

export default function Tabs() {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate
  const [activeTab, setActiveTab] = useState("1");
  const { quoteDetail } = location.state || {};

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
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
      <Nav tabs style={{ marginTop: "30px" }}>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => toggle("1")}
          >
            Request
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => toggle("2")}
          >
            Quote Submit
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "3" })}
            onClick={() => toggle("3")}
          >
            Overall Costing
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "4" })}
            onClick={() => toggle("4")}
          >
            Workflow
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "5" })}
            onClick={() => toggle("5")}
          >
            Email Logs
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Suspense fallback={<div>Loading...</div>}>
            {activeTab === "1" && <Request />}
          </Suspense>
        </TabPane>
        <TabPane tabId="2">
          <Suspense fallback={<div>Loading...</div>}>
            {activeTab === "2" && <QuoteSubmit />}
          </Suspense>
        </TabPane>
        <TabPane tabId="3">
          <Suspense fallback={<div>Loading...</div>}>
            {activeTab === "3" && <OverallCosting />}
          </Suspense>
        </TabPane>
        <TabPane tabId="4">
          <Suspense fallback={<div>Loading...</div>}>
            {activeTab === "4" && <TaskHistory />}
          </Suspense>
        </TabPane>
        <TabPane tabId="5">
          <Suspense fallback={<div>Loading...</div>}>
            {activeTab === "5" && <EmailLogs />}
          </Suspense>
        </TabPane>
      </TabContent>
    </>
  );
}