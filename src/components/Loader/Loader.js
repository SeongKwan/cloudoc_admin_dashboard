import React from 'react';

const Loader = () => {
    return (
        <span 
            className="loader" 
            style={{display: "inline-block", margin: "0 3rem 2rem", textAlign: "center"}}>
            <span className="load-3">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </span>
        </span>
    );
};

export default Loader;