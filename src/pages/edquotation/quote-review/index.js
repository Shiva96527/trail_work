import React, { useState } from "react";
import { Button, Table } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const QuoteReviewPage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const navigate = useNavigate();
  return (
    <div>
      {/* First Table (2 Columns) */}
      <div style={{ marginTop: "25px" }}>
        <Table
          striped
          bordered
          style={{
            borderColor: "white",
            marginLeft: "15px",
            maxWidth: "calc(100% - 30px)",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  width: "30%",
                  backgroundColor: "#293897",
                  color: "white",
                  padding: "12px",
                }}
              >
                &nbsp;
              </th>
              <th
                style={{
                  width: "70%",
                  backgroundColor: "#293897",
                  color: "white",
                  padding: "12px",
                }}
              >
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ backgroundColor: "#E6F0FF", padding: "12px" }}>
                Total Quotation (RM)
              </td>
              <td style={{ backgroundColor: "#E6F0FF", padding: "12px" }}>
                1,489.36
              </td>
            </tr>
            <tr>
              <td style={{ backgroundColor: "#E6F0FF", padding: "12px" }}>
                Total SRF Cost (RM)
              </td>
              <td
                style={{
                  backgroundColor: "#E6F0FF",
                  padding: "12px",
                  color: "#A9A9A9",
                }}
              >
                *not visible for vendor view*
              </td>
            </tr>
            <tr>
              <td style={{ backgroundColor: "#E6F0FF", padding: "12px" }}>
                Balance in SRF (RM)
              </td>
              <td
                style={{
                  backgroundColor: "#E6F0FF",
                  padding: "12px",
                  color: "#A9A9A9",
                }}
              >
                *not visible for vendor view*
              </td>
            </tr>
          </tbody>
        </Table>
      </div>

      {/* Second Table (6 Columns and 4 Rows) */}
      <div style={{ marginTop: "20px" }}>
        <Table
          striped
          bordered
          style={{
            borderColor: "white",
            marginLeft: "15px",
            maxWidth: "calc(100% - 30px)",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  width: "16.67%",
                  backgroundColor: "#293897",
                  color: "white",
                  padding: "12px",
                }}
              >
                Breakdown
              </th>
              <th
                style={{
                  width: "16.67%",
                  backgroundColor: "#293897",
                  color: "white",
                  padding: "12px",
                }}
              >
                Price book Value (RM){" "}
              </th>
              <th
                style={{
                  width: "16.67%",
                  backgroundColor: "#293897",
                  color: "white",
                  padding: "12px",
                }}
              >
                Quotation (RM)
              </th>
              <th
                style={{
                  width: "16.67%",
                  backgroundColor: "#293897",
                  color: "white",
                  padding: "12px",
                }}
              >
                Variance (RM)
              </th>
              <th
                style={{
                  width: "16.67%",
                  backgroundColor: "#293897",
                  color: "white",
                  padding: "12px",
                }}
              >
                Approve/Reject
              </th>
              <th
                style={{
                  width: "16.67%",
                  backgroundColor: "#293897",
                  color: "white",
                  padding: "12px",
                }}
              >
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ backgroundColor: "#E6F0FF", padding: "12px" }}>
                Survey
              </td>
              <td
                style={{
                  backgroundColor: "#E6F0FF",
                  padding: "12px",
                  color: "#A9A9A9",
                }}
              >
                *not visible for vendor view*
              </td>
              <td style={{ backgroundColor: "#E6F0FF", padding: "12px" }}>
                1,489.36
              </td>
              <td
                style={{
                  backgroundColor: "#E6F0FF",
                  padding: "12px",
                  color: "#A9A9A9",
                }}
              >
                *not visible for vendor view*
              </td>
              <td style={{ backgroundColor: "#E6F0FF", padding: "12px" }}>
                <Button color="success">Approve</Button>
                <Button color="danger" style={{ marginLeft: "5px" }}>
                  Reject
                </Button>
              </td>
              <td style={{ backgroundColor: "#E6F0FF", padding: "12px" }}>
                <input
                  type="text"
                  style={{
                    padding: "1px 1px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    flex: 1,
                  }}
                />
              </td>
            </tr>
            <tr>
              <td style={{ backgroundColor: "#F1F9FF", padding: "12px" }}>
                Implementation
              </td>
              <td style={{ backgroundColor: "#F1F9FF", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#F1F9FF", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#F1F9FF", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#F1F9FF", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#F1F9FF", padding: "12px" }}></td>
            </tr>
            <tr>
              <td style={{ backgroundColor: "#E6F0FF", padding: "12px" }}>
                Non-Standard Quotation
              </td>
              <td style={{ backgroundColor: "#E6F0FF", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#E6F0FF", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#E6F0FF", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#E6F0FF", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#E6F0FF", padding: "12px" }}></td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default QuoteReviewPage;
