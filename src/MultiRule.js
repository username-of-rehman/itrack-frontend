import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MultiRule = () => {
  const [selectedEntity, setSelectedEntity] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [responseKeys, setResponseKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [selectedInwardTransactionKey, setSelectedInwardTransactionKey] = useState('');
  const [inwardTransactionKeys, setInwardTransactionKeys] = useState([]);
  const apiUrl = 'http://localhost:8085'; // Replace this with your actual API endpoint

  useEffect(() => {
    if (responseData) {
      const keys = Object.keys(responseData);
      setResponseKeys(keys);
    }
  }, [responseData]);

  useEffect(() => {
    axios.get(`${apiUrl}/inward-transaction/dynamic-params`)
      .then(response => {
        setInwardTransactionKeys(Object.keys(response.data));
      })
      .catch(error => {
        console.error('Error fetching inward transaction keys:', error);
      });
  }, []);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedEntity(selectedValue);
    
    // Make a GET API call when an option is selected
    axios.get(`${apiUrl}/${selectedValue}/dynamic-params`)
      .then(response => {
        setResponseData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const getOperators = (key) => {
    const dataType = typeof responseData[key];
    console.log(dataType)
    switch (dataType) {
      case 'number':
        return ['EQUALS', 'NOT_EQUALS', 'LESS_THAN', 'LESS_THAN_OR_EQUAL', 'GREATER_THAN','GREATER_THAN_OR_EQUAL'];
      case 'string':
        return ['MEMBER_OF', 'MATCHES', 'AFTER (For Date)', 'BEFORE(For Date)'];
      // Add cases for other data types as needed
      default:
        return [];
    }
  };

  const handleButtonClick = () => {
    const ruleEntity = {
      ruleName: 'Example Rule', // Adjust as needed
      secondaryCollectionName: "inward-transaction",
      secondaryDynamicParam: selectedInwardTransactionKey,
      primaryCollectionName:selectedEntity,
      primaryDynamicParam: selectedKey,
      comparisonType: selectedOperator,
      ruleAction: 'hello'
    };

    console.log(ruleEntity)
    // Make POST request to the backend
    axios.post('http://localhost:8085/user-level', ruleEntity)
      .then(response => {
        // Handle response if needed
        console.log('API call successful:', response);
      })
      .catch(error => {
        // Handle error if needed
        console.error('Error making API call:', error);
      });
  };
  

  return (
    <div>
      <label htmlFor="entityDropdown">Select Entity: </label>
      <select id="entityDropdown" value={selectedEntity} onChange={handleChange}>
        <option value="">Select...</option>
        <option value="account">Account</option>
        <option value="outward-profile">Outward Profile</option>
        <option value="blacklist-profile">Black List Profile</option>
        <option value="inward-profile">Inward Profile</option>
        <option value="watchlist-profile">Watchlist Profile</option>
      </select>
      {responseKeys.length > 0 && (
        <div>
          <h2>Create Rule</h2>
          <select onChange={(e) => setSelectedKey(e.target.value)}>
            <option value="">Select Key</option>
            {responseKeys.map((key, index) => (
              <option key={index} value={key}>{key}</option>
            ))}
          </select>
          <select onChange={(e) => setSelectedOperator(e.target.value)}>
            {selectedKey && (
              <option value="">Select Operator</option>
            )}
            {selectedKey && (
              getOperators(selectedKey).map((operator, index) => (
                <option key={index} value={operator}>{operator}</option>
              ))
            )}
          </select>
          <select onChange={(e) => setSelectedInwardTransactionKey(e.target.value)}>
            {selectedKey && (
              <option value="">Select Inward Transaction Key</option>
            )}
            {selectedKey && (
              inwardTransactionKeys.map((key, index) => (
                <option key={index} value={key}>{key}</option>
              ))
            )}
          </select>
          <p>Selected Options: {selectedKey} {selectedOperator} {selectedInwardTransactionKey}</p>
          <button onClick={handleButtonClick}>Send API Request</button>
        </div>
      )}
    </div>
  );
};

export default MultiRule;
