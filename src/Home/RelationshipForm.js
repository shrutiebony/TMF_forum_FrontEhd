import React, { useState, useEffect } from 'react';
import "./RelationshipForm.css"
function GridComponent() {
  // Define the grid as a state variable
  const [grid, setGrid] = useState([]);
  const [rowCount, setRowCount] = useState(2);

  // Initialize with two rows
  useEffect(() => {
    const initialGrid = [];
    for (let row = 1; row <= 2; row++) {
      for (let col = 1; col <= 4; col++) {
        initialGrid.push({
          rowNumber: row,
          columnNumber: col,
          fieldValue: '',
        });
      }
    }
    setGrid(initialGrid);
  }, []);

  // State to store data for the first dropdown
  const [dropdown1Options, setDropdown1Options] = useState([]);

  // State to store data for the third dropdown
  const [dropdown3OptionsForRow, setDropdown3OptionsForRow] = useState({});

  // Generate random values for the second column
  const randomValues = Array.from({ length: 8 }, () =>
    Math.random().toString(36).substring(7)
  );

  // Fetch data from the first API and populate the first dropdown
  useEffect(() => {
    // Replace with your actual API URL
    const API_URL = 'http://localhost:1001/get-Table-name';

    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        // Assuming the API returns an array of options
        setDropdown1Options(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []); // Empty dependency array ensures the effect runs only once

  // Function to fetch data for the third dropdown based on tableName and currentRowDropdown3Value
  const fetchDropdown3Data = (tableName, rowNumber, currentRowDropdown3Value) => {
    // Replace with your actual API URL and query parameters
    const API_URL = `http://localhost:1001/getTableNameCorrespondingToFirst?tableName=${tableName}&currentRowDropdown3Value=${currentRowDropdown3Value}`;

    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        // Ensure data is an array
        if (Array.isArray(data)) {
          // Update only the specific row's dropdown options
          setGrid((prevGrid) => {
            return prevGrid.map((item) => {
              if (
                item.rowNumber === rowNumber &&
                item.columnNumber === 3
              ) {
                return {
                  ...item,
                  fieldValue: '', // Clear the selected value (if any)
                };
              }
              return item;
            });
          });

          // Set the dropdown3Options only for the current row
          setDropdown3OptionsForRow((prevOptions) => {
            return {
              ...prevOptions,
              [rowNumber]: data, // Assuming data is an array of options
            };
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  // Handle dropdown value changes and update SampleGridData
  const handleDropdownChange = (event, rowNumber, columnNumber) => {
    const selectedValue = event.target.value;
    const updatedGrid = grid.map((item) => {
      if (
        item.rowNumber === rowNumber &&
        item.columnNumber === columnNumber
      ) {
        return {
          ...item,
          fieldValue: selectedValue,
        };
      }
      return item;
    });

    // Check if the changed dropdown is the first dropdown (columnNumber 1)
    if (columnNumber === 1) {
      // Find the selected value of dropdown3 for the current row
      const currentRowDropdown3Value = grid.find(
        (item) => item.rowNumber === rowNumber && item.columnNumber === 3
      ).fieldValue;

      // Fetch data for the third dropdown based on the selected value
      fetchDropdown3Data(selectedValue, rowNumber, currentRowDropdown3Value);
    }

    setGrid(updatedGrid);
  };

  // Add a new row when the "Add Row" button is clicked
  const handleAddRowClick = () => {
    setRowCount(rowCount + 1);
    const newRow = Array.from({ length: 4 }, (_, index) => {
      const row = rowCount + 1;
      const column = index + 1;
      return {
        rowNumber: row,
        columnNumber: column,
        fieldValue: '',
      };
    });
    setGrid([...grid, ...newRow]);
  };

  // Function to send the entire grid data to an API
  const sendGridDataToAPI = () => {
    // Replace the API_URL with your actual API endpoint
    const API_URL = 'http://localhost:1001/saveTableToTableMapping';

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(grid),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the API response as needed
        console.log('API Response:', data);
      })
      .catch((error) => {
        // Handle errors
        console.error('Error:', error);
      });
  };

  return (
    <div className='gridWrapper'>
    <div className="grid-container">
      
      {grid.map((item, index) => (
        <div className="grid-item" key={index}>
   
          {item.columnNumber === 1 ? ( 
            <select
              className="dropdown"
              value={item.fieldValue}
              onChange={(event) =>
                handleDropdownChange(event, item.rowNumber, item.columnNumber)
              }
            >
              {dropdown1Options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : item.columnNumber === 3 ? ( // Render the third dropdown
            <select
              className="dropdown"
              value={item.fieldValue}
              onChange={(event) =>
                handleDropdownChange(event, item.rowNumber, item.columnNumber)
              }
            >
              {dropdown3OptionsForRow[item.rowNumber]?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            // Render textboxes for the second column
            <input
              className="textbox"
              type="text"
              value={item.fieldValue}
              onChange={(event) =>
                handleDropdownChange(event, item.rowNumber, item.columnNumber)
              }
            />
          )}
        </div>
      ))}
   
    </div>
    <button className="add-row-button" onClick={handleAddRowClick}>Add Row</button>

<button className="submit-button" onClick={sendGridDataToAPI}>Submit Entire Grid</button>
    </div>
  );
}

export default GridComponent;
