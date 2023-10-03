import React, { useState } from 'react';
import axios from 'axios';
import './StoreJson.css';

function JsonInput() {
  const [jsonInput, setJsonInput] = useState('');
  const [additionalText, setAdditionalText] = useState('');
  const [apiInput, setApiInput] = useState('');
  const [response, setResponse] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility

  const handleJsonInputChange = (event) => {
    setJsonInput(event.target.value);
  };

  const handleAdditionalTextChange = (event) => {
    setAdditionalText(event.target.value);
  };

  const handleAddAnother = () => {
    // Combine the content from the textarea and additionalText into a JSON object


    // Convert the JSON object to a string and set it as the input value
    setJsonInput('');
    // Clear the additional text field
    setAdditionalText('');
  };

  const handleSendJson = async () => {
    try {

      const combinedInput = {
        textareaContent: jsonInput,
        table_Name: additionalText,
      };
      setApiInput(JSON.stringify(combinedInput, null, 2));

      // Parse the JSON input back into an object for sending to the API
      const inputObject = JSON.parse(apiInput);
      if (!jsonInput.trim()) {
        setResponse('API input must not be empty.');
        return;
      }

      if (!additionalText.trim()) {
        setResponse('Table name must not be empty.');
        return;
      }

      const response = await axios.post('http://localhost:1001/storeJsonToMongo', inputObject, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle the response as needed
      setResponse('Response: ' + JSON.stringify(response.data));
      setIsPopupVisible(true); // Show the response popup
      setAdditionalText('');
      setJsonInput('')
      setApiInput('')

    } catch (error) {
      console.error('Error sending JSON:', error);
      setResponse('Error: ' + error.message);
      setIsPopupVisible(true); // Show the response popup
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className="json-container">
      <h2 className="heading">Input Json:</h2>
      <textarea
        className="textarea"
        rows={10}
        cols={50}
        value={jsonInput}
        onChange={handleJsonInputChange}
        placeholder="Enter JSON data"
      />
      <input
        type="text"
        value={additionalText}
        onChange={handleAdditionalTextChange}
        placeholder="Enter table name"
      />
      <button className="button" onClick={handleAddAnother}>
        Add Another
      </button>
      <button className="button" onClick={handleSendJson}>
        Send JSON
      </button>
      {isPopupVisible && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup">
            <span className="close" onClick={handleClosePopup}>
              &times;
            </span>
            <div className="popup-content">
              <p>{response}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JsonInput;
