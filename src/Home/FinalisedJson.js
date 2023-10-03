/// For displaying the content ent by the API as it is                                                                                                                                                                                                   import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';

function LandingPage() {
    const [popupContent, setPopupContent] = useState(null);
  
    const fetchAPI = async () => {
      try {
        const response = await fetch('https://petstore.swagger.io/v2/store/inventory');
        const data = await response.json();
        setPopupContent(JSON.stringify(data, null, 2)); // Format JSON for display
      } catch (error) {
        console.error('Error fetching API:', error);
      }
    };
  
    const closePopup = () => {
      setPopupContent(null);
    };
  
    return (
      <div>
        <button onClick={fetchAPI}>Fetch API</button>
        {popupContent && (
          <div className="popup">
            <div className="popup-content">
              <pre>{popupContent}</pre>
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  export default LandingPage;
  