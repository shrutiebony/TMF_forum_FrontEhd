import React from 'react';
import MergedComponent from './Cards';
import Header from '../Header/Header';
import RelationshipForm from './RelationshipForm';
import Footer from '../Footer/Footer';
import JsonInput from './StoreJsonInput';
const Home = () => {

  return (
    <div>
      <Header />
     
      <JsonInput></JsonInput>
      {/* <RelationshipForm></RelationshipForm> */}
      <div style={{ marginBottom: '20px' }}>
        <MergedComponent></MergedComponent>
      </div>
    </div>
  );
};

export default Home;
