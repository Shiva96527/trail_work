import React, { useState } from 'react';
import { Button, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

const QuoteReviewPage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div>
      {/* Title Section */}
      <div 
        style={{
          fontSize: '18px',
          backgroundColor: '#293897',  
          color: 'white', 
          padding: '5px 100px', 
          display: 'inline-block',  
          marginTop: '30px', 
          marginLeft: '15px',
          borderTopLeftRadius: '10px', 
          borderTopRightRadius: '10px', 
          border: 'none',  
          boxShadow: 'none',  
          width: 'auto'  
        }}
      >
        Quotation details
      </div>
      
      <div style={{ fontSize: '15px', padding: '10px 15px', color:'black', fontWeight:'normal' }}>
        Overall Costing details
      </div>

      {/* Buttons for Upload and Export */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px', marginLeft: '15px' }}>
        <Button color="primary" style={{ marginRight: '10px', backgroundColor: '#007bff' }}>
          <FontAwesomeIcon style={{ marginRight: '8px' }} />
          Update
        </Button>
      </div>

      {/* First Table (2 Columns) */}
      <div style={{ marginTop: '20px' }}>
        <Table striped bordered style={{ borderColor: 'white', marginLeft: '15px', maxWidth: 'calc(100% - 30px)' }}>
          <thead>
            <tr>
              <th style={{ width: '30%', backgroundColor: '#293897', color: 'white', padding: '12px' }}>&nbsp;</th>
              <th style={{ width: '70%', backgroundColor: '#293897', color: 'white', padding: '12px' }}>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ backgroundColor: '#E6F0FF', padding: '12px' }}>Total Quotation (RM)</td>
              <td style={{ backgroundColor: '#E6F0FF', padding: '12px' }}>1,489.36</td>
            </tr>
            <tr>
              <td style={{ backgroundColor: '#E6F0FF', padding: '12px' }}>Total SRF Cost (RM)</td>
              <td style={{ backgroundColor: '#E6F0FF', padding: '12px',color: '#A9A9A9' }}>*not visible for vendor view*</td>
            </tr>
            <tr>
              <td style={{ backgroundColor: '#E6F0FF', padding: '12px' }}>Balance in SRF (RM)</td>
              <td style={{ backgroundColor: '#E6F0FF', padding: '12px',color: '#A9A9A9' }}>*not visible for vendor view*</td>
            </tr>
          </tbody>
        </Table>
      </div>

      {/* Second Table (6 Columns and 4 Rows) */}
      <div style={{ marginTop: '20px' }}>
        <Table striped bordered style={{ borderColor: 'white', marginLeft: '15px', maxWidth: 'calc(100% - 30px)' }}>
          <thead>
            <tr>
              <th style={{ width: '16.67%', backgroundColor: '#293897', color: 'white', padding: '12px' }}>Breakdwon</th>
              <th style={{ width: '16.67%', backgroundColor: '#293897', color: 'white', padding: '12px' }}>Price book Value (RM) </th>
              <th style={{ width: '16.67%', backgroundColor: '#293897', color: 'white', padding: '12px' }}>Quotation (RM)</th>
              <th style={{ width: '16.67%', backgroundColor: '#293897', color: 'white', padding: '12px' }}>Variance (RM)</th>
              <th style={{ width: '16.67%', backgroundColor: '#293897', color: 'white', padding: '12px' }}>Approve/Reject</th>
              <th style={{ width: '16.67%', backgroundColor: '#293897', color: 'white', padding: '12px' }}>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ backgroundColor: '#E6F0FF', padding: '12px' }}>Survey</td>
              <td style={{ backgroundColor: '#E6F0FF', padding: '12px',color: '#A9A9A9' }}>*not visible for vendor view*</td>
              <td style={{ backgroundColor: '#E6F0FF', padding: '12px' }}>1,489.36</td>
              <td style={{ backgroundColor: '#E6F0FF', padding: '12px',color: '#A9A9A9' }}>*not visible for vendor view*</td>
              <td style={{ backgroundColor: '#E6F0FF', padding: '12px' }}></td>
              <td style={{ backgroundColor: '#E6F0FF', padding: '12px' }}><input type="text" style={{ padding: '1px 1px', border: '1px solid #ddd', borderRadius: '5px', flex: 1 }} /></td>
            </tr>
            <tr>
              <td style={{ backgroundColor: '#F1F9FF', padding: '12px' }}>Implementation</td>
              <td style={{ backgroundColor: '#F1F9FF', padding: '12px' }}></td>
              <td style={{ backgroundColor: '#F1F9FF', padding: '12px' }}></td>
              <td style={{ backgroundColor: '#F1F9FF', padding: '12px' }}></td>
              <td style={{ backgroundColor: '#F1F9FF', padding: '12px' }}></td>
              <td style={{ backgroundColor: '#F1F9FF', padding: '12px' }}></td>
            </tr>
            <tr>
              <td style={{ backgroundColor: '#E6F0FF', padding: '12px' }}>Non-Standard Quotation</td>
              <td style={{ backgroundColor: '#E6F0FF', padding: '12px' }}></td>
              <td style={{ backgroundColor: '#E6F0FF', padding: '12px' }}></td>
              <td style={{ backgroundColor: '#E6F0FF', padding: '12px' }}></td>
              <td style={{ backgroundColor: '#E6F0FF', padding: '12px' }}></td>
              <td style={{ backgroundColor: '#E6F0FF', padding: '12px' }}></td>
            </tr>
    
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default QuoteReviewPage;
