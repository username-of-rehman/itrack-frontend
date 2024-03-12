import React, { useState } from 'react';
import SingleRule from './SingleRule';
import MultiRule from './MultiRule';

function App() {
  const [selectedOption, setSelectedOption] = useState('single');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <div>
        <input
          type="radio"
          id="single"
          name="ruleType"
          value="single"
          checked={selectedOption === 'single'}
          onChange={handleChange}
        />
        <label htmlFor="single">Single Rule</label>
      </div>
      <div>
        <input
          type="radio"
          id="multi"
          name="ruleType"
          value="multi"
          checked={selectedOption === 'multi'}
          onChange={handleChange}
        />
        <label htmlFor="multi">Multi Rule</label>
      </div>

      {selectedOption === 'single' ? <SingleRule /> : <MultiRule />}
    </div>
  );
}

export default App;
