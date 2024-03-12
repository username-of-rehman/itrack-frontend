import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SingleRule = () => {
  const [selectedEntity, setSelectedEntity] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [responseKeys, setResponseKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [inputValue, setInputValue] = useState(''); // State for input value

  useEffect(() => {
    if (responseData) {
      const keys = Object.keys(responseData);
      setResponseKeys(keys);
    }
  }, [responseData]);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedEntity(selectedValue);
    
    // Make a GET API call when an option is selected
    axios.get(`http://localhost:8085/${selectedValue}/dynamic-params`)
      .then(response => {
        setResponseData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const getOperators = (key) => {
    const dataType = typeof responseData[key];
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
      collectionName: selectedEntity,
      paramName: selectedKey,
      value: [inputValue],
      comparisonType: selectedOperator,
      ruleAction: 'hello'
    };

    console.log(ruleEntity)
    // Make POST request to the backend
    axios.post('http://localhost:8085/global', ruleEntity)
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
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
          />
          <p>Selected Options: {selectedKey} {selectedOperator} {inputValue}</p>
          <button onClick={handleButtonClick}>Send post Request</button>
        </div>
      )}
    </div>
  );
};

export default SingleRule;
