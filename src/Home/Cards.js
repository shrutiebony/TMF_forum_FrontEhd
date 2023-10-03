import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cards.css';

function MergedComponent() {
  const [endPoints, setEndPoints] = useState([]);
  const [outputEndPoints, setOutputEndPoints] = useState('');

  const [pathNames, setPathNames] = useState([]);
  const [outputPathName, setOutputPathName] = useState('');
  const [httpStatuses, setHttpStatuses] = useState([]);
  const [selectedHttpStatus, setSelectedHttpStatus] = useState('');
  const [responseTypes, setResponseTypes] = useState([]);
  const [selectedResponseType, setSelectedResponseType] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [apiResponseFinal, setApiResponseFinal] = useState('');
  const [outResponseAPI, setOutResponseAPI] = useState('');
  const [finalResponse, setFinalResponse] = useState('');
  const [isFieldsChosen, setIsFieldsChosen] = useState(false);
  const [isEmptyField, setIsEmptyField] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [availableFields, setAvailableFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [defaultFieldNames, setDefaultFieldNames] = useState([]);

  const [defaultFieldValues, setDefaultFieldValues] = useState([]);
  const [rowCount, setRowCount] = useState(1);


  useEffect(() => {
    fetchEndPoints();
        fetchAvailableFields();
  }, []);

  
  const fetchPathNames = async (selectedEndPoint) => {
    try {
      const response = await axios.get('http://localhost:1001/getAllPathNames', {
        params: {
          endPoint: selectedEndPoint,
        },
      });
      setPathNames(response.data);
    } catch (error) {
      console.error('Error fetching HTTP statuses:', error);
    }
  };



  const fetchEndPoints = async () => {
    try {
      const response = await axios.get('http://localhost:1001/getAllTitles');
      setEndPoints(response.data);
    } catch (error) {
      console.error('Error fetching path names:', error);
    }
  };


  const fetchAvailableFields = async () => {
    try {
      const response = await axios.get(
        'http://localhost:1001/getAllTMF_Forum_FieldsToChooseFrom'
      );
      setSelectedFields([]);
      setAvailableFields(response.data);
    } catch (error) {
      console.error('Error fetching available fields:', error);
    }
  };

  const handlePathNameSelect = (event) => {
    const selectedPathName = event.target.value;
    setOutputPathName(selectedPathName);
    fetchHttpStatuses(selectedPathName);
  };
  const handleEndPointSelect = (event) => {
    const selectedEndPoint = event.target.value;
    setOutputEndPoints(selectedEndPoint);
    fetchPathNames(selectedEndPoint);
  };
  const fetchHttpStatuses = async (selectedPathName) => {
    try {
      const response = await axios.get('http://localhost:1001/getAllMethodTypes', {
        params: {
          pathName: selectedPathName,
          endPoint:outputEndPoints,
        },
      });
      setHttpStatuses(response.data);
    } catch (error) {
      console.error('Error fetching HTTP statuses:', error);
    }
  };

  const fetchResponseTypes = async (selectedMethodType) => {
    try {
      const response = await axios.get('http://localhost:1001/getAllResponseStatuses', {
        params: {
          endPoint:outputEndPoints,
          pathName: outputPathName,
          methodType: selectedMethodType,
        },
      });
      setResponseTypes(response.data);
    } catch (error) {
      console.error('Error fetching response types:', error);
    }
  };


  const handleAddDefault = async () => {
    try {
      const defaultsData = Object.keys(defaultFieldValues).map((fieldName) => ({
        tmfFieldName: fieldName,
        defaultValue: defaultFieldValues[fieldName],
      }));
      const requestBody = {
        endPoint:outputEndPoints,
        pathName: outputPathName,
        methodType: selectedHttpStatus,
        defaults: defaultsData,
      };
      const response = await axios.post('http://localhost:1001/saveDefaults', requestBody);
      console.log('Defaults saved:', response.data);
        setDefaultFieldValues({});
      } catch (error) {
      console.error('Error saving defaults:', error);
    }
  };


  const fetchResponseTMF = async () => {
    try {
      const response = await axios.get('http://localhost:1001/getResponseJson', {
        params: {
          endPoint:outputEndPoints,
          pathName: outputPathName,
          methodType: selectedHttpStatus,
          statusCode: selectedResponseType,
        },
      });
      setOutResponseAPI(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Error fetching API response:', error);
    }
  };
  const fetchApiResponse = async () => {
    try {
      const response = await axios.get('http://localhost:1001/showTMF_StructureForSelectedUserInput', {
        params: {
          endpoint:outputEndPoints,
          pathName: outputPathName,
          methodType: selectedHttpStatus,
        },
      });
      setApiResponse(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Error fetching API response:', error);
    }
  };

  const handleHttpStatusSelect = (event) => {
    const selectedMethodType = event.target.value;
    setSelectedHttpStatus(selectedMethodType);
    fetchResponseTypes(selectedMethodType);
  };

  const handleResponseTypeSelect = (event) => {
    const selectedResponseType = event.target.value;
    setSelectedResponseType(selectedResponseType);
  };

  const handleAddField = (field) => {
    if (!selectedFields.includes(field)) {
      setSelectedFields([...selectedFields, field]);
      setFieldValues((prevFieldValues) => ({
        ...prevFieldValues,
        [field]: { table: '', fieldName: '' }, // Initialize with empty values
      }));
      setInputValue('');
    }
  };

  const handleRemoveField = (field) => {
    const updatedSelectedFields = selectedFields.filter((selectedField) => selectedField !== field);
    const updatedFieldValues = { ...fieldValues };
    delete updatedFieldValues[field];

    setSelectedFields(updatedSelectedFields);
    setFieldValues(updatedFieldValues);
  };

  const handleInputChange = (event, field, inputType) => {
    setFieldValues((prevFieldValues) => ({
      ...prevFieldValues,
      [field]: { ...prevFieldValues[field], [inputType]: event.target.value },
    }));
  };

  const handleChooseSchema = async () => {
    try {
      const requestBody = {
        endPoint:outputEndPoints,
        pathName: outputPathName,
        methodType: selectedHttpStatus,
        responseType: selectedResponseType,

      };
      const response = await axios.post('http://localhost:1001/storeTheUserChosenParameters', requestBody);

      fetchAvailableFields();
    } catch (error) {
      console.error('Error storing user chosen schema:', error);
    }
  };



    const [criteria, setCriteria] = useState([
      { tableName: '', fieldName: '', searchCriteria: '' },
    ]);
  
    const handleAddCriteria = async () => {
      setRowCount(rowCount + 1);
    
      // Create an array to hold criteria objects
      const newCriteriaArray = [];
    
      // Iterate through the existing criteria and add them to the array
      criteria.forEach((item) => {
        newCriteriaArray.push({
          tableName: item.tableName,
          fieldName: item.fieldName,
          searchCriteria: item.searchCriteria,
        });
      });
    
      // Make the POST request to the API with the array of criteria
      const apiUrl = 'http://localhost:1001/saveDatabaseSearchCriteria';
    
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCriteriaArray), // Send the array of criteria
      });
    
      if (response.ok) {
        console.log('Successfully saved criteria');
      } else {
        console.error('Failed to save criteria');
      }
    
      // Add a new empty criteria item after making the API request
      setCriteria([...criteria, { tableName: '', fieldName: '', searchCriteria: '' }]);
    };
    
    
    const handleDeleteCriteria = async () => {
      setRowCount(1);
    
      setCriteria([
        { tableName: '', fieldName: '', searchCriteria: '' }      ]);
      };
  

    const handleResetCriteria = async () => {
      setRowCount(1);
    
      setCriteria([
        { tableName: '', fieldName: '', searchCriteria: '' }      ]);
    
      try {
        const response = await axios.get('http://localhost:1001/deleteAllSearchCriteria');
        console.log('Search criteria reset:', response.data);
      } catch (error) {
        console.error('Error resetting search criteria:', error);
      }
    };
    
    
      const handleSearch = async () => {
        try {
          const apiUrl = 'http://localhost:1001/saveDatabaseSearchCriteria';
          const finalResponseApiUrl = 'http://localhost:1001/getFinalResponse';
    
          const searchData = criteria.map(item => ({
            tableName: item.tableName,
            fieldName: item.fieldName,
            searchCriteria: item.searchCriteria,
          }));
    
          const response = await axios.post(apiUrl, searchData);
          const finalResponse = await axios.get(finalResponseApiUrl);
          setFinalResponse(finalResponse.data); 
          console.log("finalResponse = ", finalResponse)
        } catch (error) {
          console.error('Error sending data to API:', error);
        }
      };
    
  
    const handleChange = (index, field, value) => {
      const updatedCriteria = [...criteria];
      updatedCriteria[index][field] = value;
      setCriteria(updatedCriteria);
    };

  const handleChooseFields = async () => {
    try {
      const saveCustomerMapping = "http://localhost:1001/saveTmfToCustomerMapping";
      setIsFieldsChosen(true);
      
      const mapping = selectedFields.map((field) => ({
        tmfFieldName: field,
        customerTableName: fieldValues[field]?.table,
        customerFieldName: fieldValues[field]?.fieldName,
      }));
            const payload = {
        endPoint: outputEndPoints,
        methodType: selectedHttpStatus,
        pathName: outputPathName,
        mapping: mapping,
      };
      

      const response = await axios.post(saveCustomerMapping, payload);
      setDefaultFieldNames(response.data);
    } catch (error) {
      console.error('Error choosing fields:', error);
    }
  };
  const handleDownload = () => {
    const apiResponseFinal = finalResponse;
  
    const blob = new Blob([JSON.stringify(apiResponseFinal)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'apiResponse.json';
    link.click();
  };
  

  const handleReset = async () => {
    try {
      await axios.get('http://localhost:1001/deleteAllUserInput');
      console.log('User input reset successful');
    } catch (error) {
      console.error('Error resetting user input:', error);
    }
  };
  const handleDefaultValues = (event, fieldNameMandatory) => {
    const inputValue = event.target.value;
    setDefaultFieldValues((prevDefaultFieldValues) => ({
      ...prevDefaultFieldValues,
      [fieldNameMandatory]: inputValue,
    }));
    console.log('DefaultFieldValues', defaultFieldNames);
  };

  return (
    <div>
    <div className="container">
      <div className="button-container">
      <button className="black-square-button" onClick={fetchEndPoints}>Get Endpoints </button>
        <select className="select" value={outputEndPoints} onChange={handleEndPointSelect}>
          <option value="">Select an endPoint</option>
          {endPoints.map((endPoint, index) => (
            <option key={index} value={endPoint}>
              {endPoint}
            </option>
          ))}
          </select>
        <button className="black-square-button" onClick={fetchPathNames}>Get Path Names</button>
        <select className="select" value={outputPathName} onChange={handlePathNameSelect}>
          <option value="">Select a path</option>
          {pathNames.map((pathName, index) => (
            <option key={index} value={pathName}>
              {pathName}
            </option>
          ))}
        </select>
        <button className="black-square-button" onClick={fetchHttpStatuses}>HTTP Status</button>
        <select className="select" value={selectedHttpStatus} onChange={handleHttpStatusSelect}>
          <option value="">Select an option</option>
          {httpStatuses.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button className="black-square-button" onClick={fetchResponseTypes}>Response Types</button>
        <select className="select" value={selectedResponseType} onChange={handleResponseTypeSelect}>
          <option value="">Select an option</option>
          {responseTypes.map((responseType, index) => (
            <option key={index} value={responseType}>
              {responseType}
            </option>
          ))}
        </select>
      </div>

      <button className="button json-button" onClick={() => {
        fetchApiResponse();
        fetchResponseTMF();
      }}>JSON Format</button>
      <h2 className="heading">JSON Format:</h2>
      <pre className="pre">{apiResponse}</pre>
      <pre className="pre">{outResponseAPI}</pre>

      <button className="button json-button" onClick={handleChooseSchema}>Choose Schema</button>

      <div className="field-selection-container">
        <div className="column">
          <h2 className="heading">Fields</h2>
          <ul className="list">
            {availableFields.map((field) => (
              <li key={field} className="list-item">
                {field}
                <button className="button" onClick={() => handleAddField(field)}>Add</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="column">
          <h2 className="heading">Chosen</h2>
          <ul className="list">
            {selectedFields.map((field) => (
              <li key={field} className="list-item">
                {field}
                <input
                  type="text"
                  className="textbox"
                  placeholder="Enter table"
                  value={fieldValues[field]?.table || ''}
                  onChange={(e) => handleInputChange(e, field, 'table')}
                />
                <input
                  type="text"
                  className="textbox"
                  placeholder="Enter field name"
                  value={fieldValues[field]?.fieldName || ''}
                  onChange={(e) => handleInputChange(e, field, 'fieldName')}
                />
                <button className="button red-button" onClick={() => handleRemoveField(field)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="controls">
        <button className="button search-button" onClick={handleChooseFields}>Choose Fields</button>
      </div>
    

      
      {isFieldsChosen && (
        <>
          <h2>Enter default values</h2>
          <div className="field-selection-container-border">
            <div className="field-selection-container">
              <ul className="list">
                {defaultFieldNames.map((fieldName) => (
                  <li key={fieldName} className="list-item">
                    {fieldName}
                    <input
                      type="text"
                      className={`textbox ${isEmptyField[fieldName] ? 'empty-field' : ''}`}
                      placeholder="Enter value"
                      value={defaultFieldValues[fieldName] || ''}
                      onChange={(e) => handleDefaultValues(e, fieldName)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button onClick={handleAddDefault} className='button search-button'>Add Defaults</button>
        </>
      )}

      <div className='criteria-row-wrapper'>
      {criteria.map((item, index) => (
        <div key={index} className="criteria-row">
          <input
            type="text"
            placeholder="Table Name"
            value={item.tableName}
            className='textbox'
            onChange={(e) => handleChange(index, 'tableName', e.target.value)}
          />
          <input
            type="text"
            placeholder="Field Name"
            value={item.fieldName}
            className='textbox'
            onChange={(e) => handleChange(index, 'fieldName', e.target.value)}
          />
          <input
            type="text"
            placeholder="Criteria"
            className='textbox'
            value={item.searchCriteria}
            onChange={(e) => handleChange(index, 'searchCriteria', e.target.value)}
          />
        </div>
      ))}
       <div>
      <button onClick={handleAddCriteria} className='button'>Add Criteria</button>
      <button onClick={handleDeleteCriteria} className='button'>Delete Criteria</button>

      <button className="button" onClick={handleResetCriteria}>
  Reset Criteria
</button>
</div>
<div>
      <button onClick={handleSearch} className='search-button red-button'>Search</button>
      </div>
    </div>

      <div className="api-response">
        <h2 className="heading">API Response</h2>

        <div>
      {finalResponse && (
        <div>
          <pre>{JSON.stringify(finalResponse)}</pre>
        </div>
      )}

    </div>      </div>
      <div className="buttons">
        <button className="button" onClick={handleDownload}>Download</button>
        <button className="red-button" onClick={handleReset}>Delete All My Data</button>
      </div>
     
      </div>
      <style jsx>{`
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-family: 'Montserrat', Roboto;
  margin: 20px;
}

.heading {
  font-size: 1rem;
  margin-bottom: 10px;
}

.button {
  background-color: rgb(2, 2, 54);
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, transform 0.2s;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-right: 10px;
}
.button:hover {
  background-color: rgb(80, 3, 3);
  transform: scale(1.05);
  color: white;
}

.select {
  padding: 10px 5px;
  border: 1px solid #ccc;
  border-radius: 25px;
  margin: 0 5px;
}

.search-button {
  background-color: #002800;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, transform 0.2s;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 10px;
  margin-bottom: 30px;
}

.search-button:hover {
  background-color: #005000;
}

.empty-field {
  border-color: red;
}

.json-button {
  margin-top: 20px;
  padding: 10px 20px;
}

.pre {
  background-color: #f5f5f5;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 25px;
  white-space: pre-wrap;
  text-align: left;
}

.field-selection-container {
  display: flex;
  gap: 20px;
  margin: 20px;
}

.field-selection-container-border {
  padding: 20px;
  border: 2px solid black;
  border-radius: 12%;
  margin-bottom: 30px;
}

.column {
  flex: 1;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 25px;
  margin: 5px;
}

.list {
  list-style: none;
  padding-left: 0;
}

.list-item {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  align-items: center;
  margin-bottom: 8px;
}

.textbox {
  padding: 10px;
  border: 2px solid black;
  border-radius: 25px;
  width: 200px;
  margin: 5px;
}

.criteria-row {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
}

.criteria-row-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.api-response {
  margin-top: 20px;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
      `}</style>
    </div>
  );
}

export default MergedComponent;
