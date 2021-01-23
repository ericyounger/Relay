/* eslint-disable no-undef */
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import { useParams, useHistory} from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import CircularProgressWithLabel from "@material-ui/core/CircularProgress";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import {useSpring, animated} from "react-spring";
import React from "react";
import "../css/download.css";

const validator = require("validator");
const axios = require("axios");
var WebTorrent = require("webtorrent");



var client = new WebTorrent();


export default Download;


function Download(){
	const history = useHistory();
	const props = useSpring({opacity: 1, from: {opacity: 0}});
	let { id } = useParams(); //URL UNIQUE FILE IDENTIFIER
	const [downloadProgress, setDownloadProgress] = useState(0.0);
	const [infoText, setInfoText] = useState("files ready to download");
	const [downloadClicked, setDownloadClicked] = useState(false);
	const [passwordProtected, setPasswordProtected] = useState(true);
	const [timeRemaining, setTimeRemaining] = useState(null);

	const onLoad = useEffect(() => {
		const validUUID = validator.isUUID(id);
		if(!validUUID) {
			history.push("/404");
		}
	},[]);
    
	//TODO: FIX MODAL / PASSWORD PROTECTION
    

	function onDownloadClick(){
		axios.get("http://localhost:4000/files/"+id)
			.then(res => {
				let json = res.data[0];
				console.log(json);
				console.log(json.magnet);

				setInfoText("Downloading");
				setDownloadClicked(true);
            
				client.add(json.magnet, { path: "/path/to/folder" }, function (torrent) {
					let interval = setInterval(() => {
						setDownloadProgress(torrent.progress);
						const seconds = parseInt(torrent.timeRemaining/1000,10);
						const minutes = parseInt(seconds/60, 10);
						if(!(isNaN(seconds) && isNaN(minutes))){
							setTimeRemaining(`${minutes}:${seconds}`);
						}
	
					}, 100);

					torrent.on("done", function () {
						console.log("torrent download finished");
						setInfoText("Download complete");
						torrent.files.forEach(function (file) {
							file.getBlob(function callback (err, blob) {
								var blobUrl = URL.createObjectURL(blob);
								let a = document.createElement("a");
								a.style = "display: none";
								a.href = blobUrl;
								a.download = torrent.name;
								a.click();
								window.URL.revokeObjectURL(blobUrl);
								a.remove();
							});
						});
						setDownloadProgress(1.0);
						setTimeRemaining("0:0");
						clearInterval(interval);
					});
				});
			})
			.catch(rej => console.log(rej));
	}

	function onSubmitPassword(){
		setPasswordProtected(false);
	}

	if (passwordProtected){
		return (
			<div className="downloadContainer">
				<Modal
					open={passwordProtected}
					onClose={() => setPasswordProtected(false)}
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
					disableEscapeKeyDown
					disableBackdropClick
				>
					<div className="modalContainer">
						<h1>Ahoy!</h1>
						<span>These files are password protected. </span>

						<input 
							type="password" 
							className="modalPasswordInput" 
							placeholder="enter password"
							onKeyDown={(event) => {
								if(event.keyCode === 13){
									onSubmitPassword();
								}
							}}
						/>
						<div className="rowFlex justify-content-right">
							<Button variant="contained" className="cyan customModalBtn" onClick={onSubmitPassword}>
                        Submit
							</Button>
						</div>

					</div>
				</Modal>
			</div>
		);
	} else {
		return (
			<div className="downloadContainer">        
				<p className="infotext">{infoText}</p>
				{downloadClicked?
					<div className="progressWrapper">
						<div className="progressBar">
							<CircularProgressWithLabel className="outlineBtnWhite" size="20rem" variant="determinate" value={downloadProgress*100} label={downloadProgress*100}/>
							<div className="percentage-downloaded">
								{(downloadProgress*100).toFixed(0)}%
							</div>
						</div>
		

						<div className="time-remaining-download">
							Time remaining: {timeRemaining?timeRemaining: "infinity"} 
						</div>
					</div>
					:null}

				<Button
					variant="outlined"
					color="primary"
					endIcon={<Icon>download</Icon>}
					className="outlineBtnWhite"
					onClick={onDownloadClick}
				>
                    Download
				</Button>
			</div>
		);
	}
}