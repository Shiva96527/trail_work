import React, { useState } from 'react';
import { Button, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faDownload, faSave } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
const QuoteSubmitPage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const navigate = useNavigate();

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
    width: 'auto',
    
  }}
>
  Quotation details
   {/* Back Button positioned at the top right */}
   <Button
            color="primary"
            onClick={() => navigate(-1)} // Go back to the previous page
            style={{
              position: "absolute", // Positioning the button
              top: "70px",
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
</div>

      
      <div style={{ fontSize: '15px', padding: '10px 15px', color:'black', fontWeight:'normal' }}>
        Survey Costing details
      </div>

      {/* OA# Input Section */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <label 
          style={{
            padding: '6px 110px',
            backgroundColor: '#293897',
            color: 'white',
            border: '1px solid #ddd',
            borderRadius: '0px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginRight: '10px',
            marginLeft:'15px'  
          }}
        >
          OA#
        </label>
        
        <Input 
          type="text" 
          style={{
            width: '220px',  
            padding: '10px',
            marginRight: '15px',
            marginLeft:'15px' 
          }} 
        />

        <Button color="primary">
          <FontAwesomeIcon icon={faSave} style={{ marginRight: '8px' }} />
          Save
        </Button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <label 
          style={{
            padding: '6px 65px',
            backgroundColor: '#293897',
            color: 'white',
            border: '1px solid #ddd',
            borderRadius: '0px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginRight: '10px',
            marginLeft:'15px'  
          }}
        >
          Select Template
        </label>
        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} style={{ width: '200px' }}>
          <DropdownToggle
            style={{
              width: '110%', 
              padding: '8px', 
              border: '1px solid #ced4da', 
              backgroundColor: 'white', 
              color: 'black', 
              borderRadius: '0', 
              textAlign: 'left', 
              boxShadow: 'none', 
              position: 'relative', 
              paddingRight: '30px', 
              marginLeft: '15px', 
            }}
          >
            {/* Placeholder */}
            <span style={{ color: '#6c757d' }}>&nbsp;</span>

            {/* Custom Caret */}
            <FontAwesomeIcon
              icon={faAngleDown}
              style={{
                position: 'absolute',
                right: '10px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                pointerEvents: 'none', 
                color: 'black', 
              }}
            />
          </DropdownToggle>
          <DropdownMenu style={{ width: '100%', border: '1px solid #ced4da' }}>
            <DropdownItem>Template 1</DropdownItem>
            <DropdownItem>Template 2</DropdownItem>
            <DropdownItem>Template 3</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

            {/* Buttons for Upload and Export */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
          <Button color="primary" style={{ marginRight: '10px', backgroundColor: '#007bff' }}>
            <FontAwesomeIcon icon={faCloudUploadAlt} style={{ marginRight: '8px' }} />
            Upload
          </Button>
          <Button color="primary" style={{ marginRight: '15px', backgroundColor: '#007bff' }}>
            <FontAwesomeIcon icon={faDownload} style={{ marginRight: '15px' }} />
            Export
          </Button>
        </div>

  

      {/* Table Section */}
      <div style={{ marginTop: '20px' }}>
        {/* First Table - Quotation Details */}
        
        <Table striped bordered style={{ borderColor: 'white', marginLeft:'15px',maxWidth: 'calc(100% - 30px)'  }}>
        <thead>
  <tr>
    <th style={{ width: '20%', backgroundColor: '#293897', color: 'white', padding: '12px' }}>MM#</th>
    <th style={{ width: '20%', backgroundColor: '#293897', color: 'white', padding: '12px' }}>Description</th>
    <th style={{ width: '20%', backgroundColor: '#293897', color: 'white', padding: '12px' }}>Quantity</th>
    <th style={{ width: '20%', backgroundColor: '#293897', color: 'white', padding: '12px' }}>Price</th>
    <th style={{ width: '20%', backgroundColor: '#293897', color: 'white', padding: '12px' }}>Plant Code</th>
  </tr>
</thead>

<tbody>
<tr>
  <td style={{ backgroundColor: '#E6F0FF', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    {/* + and - buttons with border and background colors */}
    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '5px', padding: '2px', width: '100%' }}>
      <div style={{ width: '30px', height: '23px', backgroundColor: 'green', color: 'white', textAlign: 'center', borderRadius: '5px', cursor: 'pointer', marginRight: '5px' }}>+</div>
      <div style={{ width: '30px', height: '23px', backgroundColor: 'red', color: 'white', textAlign: 'center', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>-</div>
      <input type="text" style={{ padding: '1px 1px', border: '1px solid #ddd', borderRadius: '5px', flex: 1 }} />
    </div>
  </td>
  <td style={{ backgroundColor: '#E6F0FF', padding: '12px' }}></td>
  <td style={{ backgroundColor: '#E6F0FF', padding: '12px' }}></td>
  <td style={{ backgroundColor: '#E6F0FF', padding: '12px' }}></td>
  <td style={{ backgroundColor: '#E6F0FF', padding: '12px' }}>
  <input type="text" style={{ padding: '1px 1px', border: '1px solid #ddd', borderRadius: '5px', flex: 1 }} />
  </td>
</tr>
    <tr>
      <td style={{ backgroundColor: '#F1F9FF', padding: '12px' }}></td>
      <td style={{ backgroundColor: '#F1F9FF', padding: '12px' }}></td>
      <td style={{ backgroundColor: '#F1F9FF', padding: '12px' }}></td>
      <td style={{ backgroundColor: '#F1F9FF', padding: '12px' }}></td>
      <td style={{ backgroundColor: '#F1F9FF', padding: '12px' }}></td>
    </tr>
  </tbody>
        </Table>

        {/* Second Table - Implementation Costing Details */}
        <div style={{ fontSize: '15px', padding: '10px 15px', fontWeight: 'bold',  color: 'black', marginBottom: '10px' }}>
          Implementation Costing Details
        </div>
        <Table striped bordered style={{ borderColor: 'white',marginLeft:'15px',maxWidth: 'calc(100% - 30px)' }}>
        <thead>
  <tr>
    <th style={{ width: '20%', backgroundColor: '#666666', color: 'white', padding: '12px' }}>MM#</th>
    <th style={{ width: '20%', backgroundColor: '#666666', color: 'white', padding: '12px' }}>Description</th>
    <th style={{ width: '20%', backgroundColor: '#666666', color: 'white', padding: '12px' }}>Quantity</th>
    <th style={{ width: '20%', backgroundColor: '#666666', color: 'white', padding: '12px' }}>Price</th>
    <th style={{ width: '20%', backgroundColor: '#666666', color: 'white', padding: '12px' }}>Plant Code</th>
  </tr>
</thead>

<tbody>
    <tr>
      <td style={{ backgroundColor: '#e0e0e0', padding: '12px' }}></td>
      <td style={{ backgroundColor: '#e0e0e0', padding: '12px' }}></td>
      <td style={{ backgroundColor: '#e0e0e0', padding: '12px' }}></td>
      <td style={{ backgroundColor: '#e0e0e0', padding: '12px' }}></td>
      <td style={{ backgroundColor: '#e0e0e0', padding: '12px' }}></td>
    </tr>
    <tr>
      <td style={{ backgroundColor: '#f0f0f0', padding: '12px' }}></td>
      <td style={{ backgroundColor: '#f0f0f0', padding: '12px' }}></td>
      <td style={{ backgroundColor: '#f0f0f0', padding: '12px' }}></td>
      <td style={{ backgroundColor: '#f0f0f0', padding: '12px' }}></td>
      <td style={{ backgroundColor: '#f0f0f0', padding: '12px' }}></td>
    </tr>
  </tbody>
        </Table>

        {/* Third Table - Non Standard Quotation */}
        <div style={{ fontSize: '15px', padding: '10px 15px', fontWeight: 'bold', color: 'black', marginBottom: '10px' }}>
          Non Standard Quotation
        </div>
        <Table striped bordered style={{ borderColor: 'white',marginLeft:'15px',maxWidth: 'calc(100% - 30px)' }}>
        <thead>
  <tr>
    <th style={{ width: '20%', backgroundColor: '#666666', color: 'white', padding: '12px' }}>MM#</th>
    <th style={{ width: '20%', backgroundColor: '#666666', color: 'white', padding: '12px' }}>Description</th>
    <th style={{ width: '20%', backgroundColor: '#666666', color: 'white', padding: '12px' }}>Quantity</th>
    <th style={{ width: '20%', backgroundColor: '#666666', color: 'white', padding: '12px' }}>Price</th>
    <th style={{ width: '20%', backgroundColor: '#666666', color: 'white', padding: '12px' }}>Plant Code</th>
  </tr>
</thead>
          <tbody>
    <tr>
      <td style={{ backgroundColor: '#e0e0e0', padding: '12px' }}></td>
      <td style={{ backgroundColor: '#e0e0e0', padding: '12px' }}></td>
      <td style={{ backgroundColor: '#e0e0e0', padding: '12px' }}></td>
      <td style={{ backgroundColor: '#e0e0e0', padding: '12px' }}></td>
      <td style={{ backgroundColor: '#e0e0e0', padding: '12px' }}></td>
    </tr>
    <tr>
      <td style={{ backgroundColor: '#f0f0f0', padding: '12px' }}></td>
      <td style={{ backgroundColor: '#f0f0f0', padding: '12px' }}></td>
      <td style={{ backgroundColor: '#f0f0f0', padding: '12px' }}></td>
      <td style={{ backgroundColor: '#f0f0f0', padding: '12px' }}></td>
      <td style={{ backgroundColor: '#f0f0f0', padding: '12px' }}></td>
    </tr>
  </tbody>
        </Table>
      </div>
    </div>
  );
};

export default QuoteSubmitPage;
