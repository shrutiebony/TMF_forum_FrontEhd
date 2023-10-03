import React, { useState } from 'react';
import axios from 'axios';
import './MapComponent.css'; // Import your custom CSS

function TMFSchemaComponent() {
  const [inputValue, setInputValue] = useState('');
  const [apiResponseAdd, setApiResponseAdd] = useState('');
  const [apiResponseMakeUsable, setApiResponseMakeUsable] = useState('');
  const [inputError, setInputError] = useState(false);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setInputError(false);
  };

  const handleAddTMFSchema = async () => {
    if (inputValue.trim() === '') {
      setInputError(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:1001/postTMFJsonByAdmin', {
        schema: inputValue
      });
      setApiResponseAdd(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Error adding TMF schema:', error);
    }
  };

  const handleMakeTMFSchemaUsable = async () => {
    try {
      const response = await axios.get('http://localhost:1001/persistAllTMF_FormatsBegins');
      setApiResponseMakeUsable(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Error making TMF schema usable:', error);
    }
  };

  return (
    <div className="tmf-schema-container">
      <h2 className="header">TMF Schema Management</h2>
      <div className="input-container">
        <textarea
          rows="5"
          value={inputValue}
          onChange={handleInputChange}
          className={`input-field ${inputError ? 'input-error' : ''}`}
          placeholder="Enter TMF Schema"
        />
        {inputError && <p className="error-message">Input cannot be empty</p>}
      </div>
      <div className="buttons-container">
        <button onClick={handleAddTMFSchema} className="btn-primary">
          Add TMF Schema
        </button>
        <button onClick={handleMakeTMFSchemaUsable} className="btn-primary">
          Make TMF Schema Usable
        </button>
      </div>
      <div className="api-response-container">
        <pre className="api-response">{apiResponseAdd}</pre>
        <pre className="api-response">{apiResponseMakeUsable}</pre>
      </div>
    </div>
  );
}

export default TMFSchemaComponent;
