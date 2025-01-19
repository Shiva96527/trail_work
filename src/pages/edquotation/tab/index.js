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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

const Request = lazy(() => import("../request"));
const QuoteSubmit = lazy(() => import("../quote-submit"));
const OverallCosting = lazy(() => import("../overall-costing"));
const TaskHistory = lazy(() => import("../task-history"));
const EmailLogs = lazy(() => import("../email-logs"));

const initialConfig = {
  1: {
    title: "Request",
    component: <Request />,
  },
  4: {
    title: "Workflow",
    component: <TaskHistory />,
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
    component: <QuoteSubmit />,
  },
  3: {
    title: "Overall Costing",
    component: <OverallCosting />,
  },
  4: {
    title: "Workflow",
    component: <TaskHistory />,
  },
  5: {
    title: "Email logs ",
    component: <EmailLogs />,
  },
};

export default function Tabs() {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate
  const [activeTab, setActiveTab] = useState(
    sessionStorage.getItem("activeTab") || "1"
  );
  const { quoteDetail } = location.state || {};
  const [navItems, setNavItems] = useState();
  const [tabPane, setTabPane] = useState();

  useEffect(() => {
    // sessionStorage.setItem("activeTab", "1");
  }, []);

  useEffect(() => {
    constructTabs(quoteDetail?.quoteCreationResponse?.statusCode);
    // setStatusCode(quoteDetail?.quoteCreationResponse?.statusCode);
  }, [quoteDetail]);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
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
            className={classnames({ active: activeTab === key })}
            onClick={() => toggle(key)}
          >
            {value.title}
          </NavLink>
        </NavItem>
      );
      tempTabPane.push(
        <TabPane tabId={key}>
          <Suspense fallback={<div>Loading...</div>}>
            {activeTab === key && value.component}
          </Suspense>
        </TabPane>
      );
    }
    setNavItems(tempNavItems);
    setTabPane(tempTabPane);
  };

  return (
    <>
      {/* <Card style={{ border: "none", marginTop: "10px" }}>
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
          <Button
               color="primary"
               onClick={() => window.location.reload()}
               style={{
                 fontSize: "16px",
               }}
             >
               <FontAwesomeIcon icon={faRefresh} />
             </Button>
        </CardBody>
      </Card> */}

      <Card style={{ border: "none", marginTop: "10px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
          }}
        >
          {/* Quote Number Section */}
          <CardTitle style={{ margin: 0, textAlign: "center", flex: 1 }}>
            {quoteDetail?.quoteNumber || "Loading..."}
            {quoteDetail?.status && (
              <Badge color="primary" style={{ marginLeft: "15px" }}>
                {quoteDetail?.status}
              </Badge>
            )}
          </CardTitle>

          {/* Button Section */}
          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <Button
              color="primary"
              onClick={() => {
                navigate(-1);
              }}
              style={{
                fontSize: "16px",
              }}
            >
              Back
            </Button>
            <Button
              color="primary"
              onClick={() => window.location.reload()}
              style={{
                fontSize: "16px",
              }}
            >
              <FontAwesomeIcon icon={faRefresh} />
            </Button>
          </div>
        </div>
      </Card>

      <Nav tabs style={{ marginTop: "30px" }}>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => {
              sessionStorage.setItem("activeTab", "1");
              toggle("1");
            }}
          >
            Request
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => {
              toggle("2");
              sessionStorage.setItem("activeTab", "2");
            }}
          >
            Quote Submit
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "3" })}
            onClick={() => {
              toggle("3");
              sessionStorage.setItem("activeTab", "3");
            }}
          >
            Overall Costing
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "4" })}
            onClick={() => {
              toggle("4");
              sessionStorage.setItem("activeTab", "4");
            }}
          >
            Workflow
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "5" })}
            onClick={() => {
              toggle("5");
              sessionStorage.setItem("activeTab", "5");
            }}
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
