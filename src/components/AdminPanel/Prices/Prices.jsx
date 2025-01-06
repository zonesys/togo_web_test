
import React from 'react';

const Prices = () => {
  console.log("hi prices from sara")
  return (
    <>
    {/* Hi */}
    <iframe
      src={`https://${process.env.REACT_APP_NEW_BACKEND_URL}/prices`}
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      className='w-100 h-100'
    />
    </>
    
  );
};

export default Prices;