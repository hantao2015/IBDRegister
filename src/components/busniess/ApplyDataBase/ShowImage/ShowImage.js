import React, { Component } from "react";
import "./ShowImage.less";
export const ShowImage = props => {
  return (
    <div className="showImage">
      <img
        src={props.image}
        style={{ border: "1px solid #ccc", height: "600px" }}
      />
    </div>
  );
};
