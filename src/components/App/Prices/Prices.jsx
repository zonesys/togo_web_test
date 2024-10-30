
import React from 'react';

const Prices = () => {
  return (
    <iframe
      src={"https://api.dev.togo.ps/prices"}
      sandbox="allow-scripts allow-same-origin allow-popups"
    />
  );
};

export default Prices;