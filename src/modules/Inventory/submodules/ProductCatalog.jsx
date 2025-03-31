import React from "react";
import "../styles/ProductCatalog.css";

const BodyContent = () => {
    return (
        <div className="prodcat">
            <div className="body-content-container">
                <p>Hello Product Catalog SubModule!</p>
                <p>Fill this container with your elements, change the display if need be.</p>
                <p>If you're going to style with css, use your unique namespace '.prodcat' at the start.</p>
            </div>
        </div>

    );
};

export default BodyContent;
