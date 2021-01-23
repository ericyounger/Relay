/* eslint-disable no-undef */
import {useHistory} from "react-router-dom";
import React from "react";
import Button from "@material-ui/core/Button";

import "../App.css";



export default NotFound;


function NotFound(){
	const history = useHistory();
    
	function onHeadBack(){
		history.push("/");
	}

	return (
		<div className="errorContainer">
			<h1>404</h1>
			<span>These are not the files you're looking for.</span>
			<Button
				variant="outlined"
				color="default"
				component="span"
				className="btn"
				onClick={onHeadBack}
			>
		
					Head back
			</Button>
		</div>
	);
}