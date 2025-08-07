import React from 'react';
import Header from '../components/layout/Header';
import styles from './HomePage.module.css'

const HomePage: React.FC = () => {
    const homeActions = (
        <button className = {  styles.homeButton  }>Configure Tracing</button>
    );

    return (
        <div>
            <Header title = "Home" actions = {homeActions} />
            <div className={ styles.homeContainer }></div>
            <p>Dashboard Content coming soon...</p>
        </div>
    );
};

export default HomePage;