import React, { useEffect, useState, Suspense, lazy, useCallback } from "react";
import {
  Nav,
  NavItem,
  TabPane,
  NavLink,
  TabContent,
  Card,
  CardTitle,
  Button,
  Badge,
} from "reactstrap";
import { useNavigate, useLocation } from "react-router-dom";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { setActiveTab } from "../../../redux/slices/globalSlice.js";
import { useSelector, useDispatch } from "react-redux";
//console.log(setActiveTab);
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quoteDetail } = location.state || {};
  // eslint-disable-next-line
  const [navItems, setNavItems] = useState();
  // eslint-disable-next-line
  const [tabPane, setTabPane] = useState();
  //const [statusCode, setStatusCode] = useState();
  const activeTab = useSelector((state) => state.globalSlice.activeTab);

  //When a component updates, React sometimes rewrites things (like functions) even if nothing has changed.
  //useCallback is a way to tell React: "Don’t rewrite this function unless you really have to!"
  //React, don’t create a new version of toggle unless activeTab or dispatch changes

  const toggle = useCallback(
    (tab) => {
      if (activeTab !== tab) {
        dispatch(setActiveTab(tab));
      }
    },
    [activeTab, dispatch]
  );

  const constructTabs = useCallback(
    (statusCode) => {
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
    },
    [activeTab, toggle]
  );

  useEffect(() => {
    // Retrieve the saved tab ID from localStorage or default to "1"
    const savedTab = localStorage.getItem("activeTab") || "1";
    dispatch(setActiveTab(savedTab));
  }, [dispatch]);

  useEffect(() => {
    constructTabs(quoteDetail?.quoteCreationResponse?.statusCode);
  }, [quoteDetail, activeTab, constructTabs]);

  useEffect(() => {
    // Save the current activeTab to localStorage
    if (activeTab) {
      localStorage.setItem("activeTab", activeTab);
    }
  }, [activeTab]);

  return (
    <>
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
                dispatch(setActiveTab("1")); // Reset to default tab
                localStorage.setItem("activeTab", "1");
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
