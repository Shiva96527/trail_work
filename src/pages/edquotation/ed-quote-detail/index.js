import React, { useEffect, useState } from "react";
import {
  Nav,
  NavItem,
  TabPane,
  Col,
  Row,
  NavLink,
  TabContent,
} from "reactstrap";
import UpdateSrfEdInbox from "../../edquotation/update-ed";
import QuoteSubmitPage from "../../srf/quote-submit";
import QuoteReviewPage from "../../srf/quote-review";

const tabConfig = {
  1: {
    title: "Quotation Details",
    component: <UpdateSrfEdInbox />,
  },
  2: {
    title: "Survey Costing details",
    component: <QuoteSubmitPage />,
  },
  3: {
    title: "Overall Costing details",
    component: <QuoteReviewPage />,
  },
};

export default function QuoteDetailPage() {
  const [currentActiveTab, setCurrentActiveTab] = useState(1);

  useEffect(() => {
    constructTabs();
    console.log("called");
  }, []);

  const toggle = (tab) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  };

  const constructTabs = () => {
    let tempNavItems = [];
    let tempTabPane = [];
    for (const [key, value] of Object.entries(tabConfig)) {
      console.log("key,currentActiveTab", key, currentActiveTab);
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
    <div>
      <Nav tabs>{constructTabs().tempNavItems}</Nav>
      <TabContent activeTab={currentActiveTab}>{constructTabs().tempTabPane}</TabContent>
    </div>
  );
}
