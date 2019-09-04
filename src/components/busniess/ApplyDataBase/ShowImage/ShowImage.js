import React, { Component } from "react";
import "./ShowImage.less";
export const ShowImage = props => {
  console.log("proprs", props);
  return (
    <div className="showImage">
      <img src={props.image} style={{width:"90%",border:"1px solid #ccc"}}/>
    </div>
  );
};
