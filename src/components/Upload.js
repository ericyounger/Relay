/* eslint-disable no-undef */
import "../App.css";
import "../css/upload.css";
import "../css/download.css";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Icon from "@material-ui/core/Icon";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";


var uuid = require("uuid");
var WebTorrent = require("webtorrent");

export default Upload;

var client = new WebTorrent();



function Upload() {
	const [files, setFiles] = useState([]);

	function callbackOnChangeFiles(event){
		console.log(event.target.files);
		setFiles(event.target.files);
	}

	function callbackOnShare(identifier){
	    client.seed(files, function (torrent) {
			const json = {"uuid": identifier, "magnet": `${torrent.magnetURI}`};
			axios.post("http://localhost:4000/files", json).then(res => console.log(res)).catch(rej => console.log(rej));
			console.log("Client is seeding " + torrent.magnetURI);
		});
	}

	return (
		<div className="wrapper">
			<div className="logo">Relay</div>
			<div className="grid-container">
				<div className="upload-form">
					<UploadFiles 
						onChangeFiles={callbackOnChangeFiles}
						onShareCallback={callbackOnShare} />
				</div>
				<div className="dowload-status">
					<DownloadStatus />
				</div>
				<InfoColumn />
				<div className="stickyDonate">
					<Button
						variant="outlined"
						color="default"
						component="span"
						className="outlineBtnWhite"
					>
		
					Donate
					</Button>
				</div>
			</div>
		</div>
    
	);
}

function UploadFiles({onChangeFiles, onShareCallback}){
	const [urlVisible, setUrlVisible] = useState(false);
	const baseUrl ="http://localhost:3000/files/";
	const [url, setUrl] = useState("");
	const fileInputRef = useRef(null);
	const urlInputField = useRef(null);
	const [alertVisible, setAlertVisible] = useState(false);

	function onShare(){
		const identifier = uuid.v4();
		setUrl(baseUrl+identifier);
		setUrlVisible(true);
		onShareCallback(identifier);
	}

	function onSelectUrl(){
		urlInputField.current.select(); 
		document.execCommand("copy");
		setAlertVisible(true);
	}

	return (
		<div className="uploadContainer">
			<h1>P2P Decentralized file sharing.</h1>
			<h4>Keep your browser up until recipient have finished downloading.</h4>
			<div className="buttons">
				<Button
					variant="contained"
					color="default"
					startIcon={<CloudUploadIcon />}
					component="span"
					onClick={() => fileInputRef.current.click()}
				>
	
				Add files
				</Button>
				<input type="file"
					ref={fileInputRef}
					style={{display:"none"}}
					onChange={onChangeFiles}
					multiple 
				/> 
			&nbsp;
				<Button
					variant="contained"
					color="primary"
					onClick={onShare}
					endIcon={<Icon>send</Icon>}
				>
				Share
				</Button>
			</div>
			{urlVisible?
				<div>
					<input 
						type="text"
					 	value={url} 
						ref={urlInputField} 
						onClick={onSelectUrl} 
						className="outlineUploadTextField select-all" 
						readonly="readonly"
						inputmode='none'
						/>
					<Snackbar
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "left",
						}}
						open={alertVisible}
						autoHideDuration={6000}
						onClose={() => setAlertVisible(false)}
						message="Copied to clipboard"
						color="default"
						action={
							<React.Fragment>
								<IconButton size="small" aria-label="close" color="inherit">
									<CloseIcon fontSize="small" onClick={() => setAlertVisible(false)} />
								</IconButton>
							</React.Fragment>
						}
					/>
				</div>
				:null}
		</div>
	);
}

function DownloadStatus(){
	const [downloadSpeed, setDownloadSpeed] = useState(0.0);
	const [uploadSpeed, setUploadSpeed] = useState(0.0);
	const [numPeers, setNumPeers] = useState(0);
	const [progress, setProgress] = useState(0.0);
	const [timeRemaining, setTimeRemaining] = useState(0.0);

	const onLoad = useEffect(() => {
		//This sets a interval only on mount.
		let intervall = setInterval(() => {
			setDownloadSpeed(client.downloadSpeed*0.000008);
			setUploadSpeed(client.uploadSpeed*0.000008);
			if(client.torrents[0] !== undefined){
				setNumPeers(client.torrents[0].numPeers);
				setProgress(client.torrents[0].ratio);
				setTimeRemaining(client.torrents[0].timeRemaining);
			}
	
		},200);
	},[]);



	return (
		<div className="downloadStatusUploadPage">
			<div className="numPeers">
				<h1>{numPeers?numPeers:0}</h1>
				<span className="statsTextInfo">peers connected</span>
			</div>
			<div className="download-rate">
				<div className="rowFlex">
					<h1>{downloadSpeed?downloadSpeed.toFixed(1):0.0}</h1>mbit/s
				</div>
				<span className="statsTextInfo">download-rate</span>
			</div>
			<div className="upload-rate">
				<div className="rowFlex">
					<h1>{uploadSpeed?uploadSpeed.toFixed(1):0.0}</h1>mbit/s
				</div>
				<span className="statsTextInfo">upload-rate</span>
			</div>
			<div className="totalAmountUploaded">
				<div className="rowFlex">
					<h1>{progress?(progress*100).toFixed(0):0.0}</h1>%
				</div>
				<span className="statsTextInfo">uploaded</span>
			</div>
			<div className="extra-info">
				<div className="rowFlex">
					<h1>{timeRemaining?timeRemaining:0.0}</h1>
				</div>
				<span className="statsTextInfo">time remaining</span>
			
			</div>
			<div className="extra-info2"></div>		
		</div>
	);
}

function InfoColumn(){
	return (
		<div className="info-bar">
			<div className="infoContainer">
				<h1>What is P2P?</h1>

				<p>P2P stand for “point-to-point”, and is a technology for communication between to machines.</p>
				<br></br>
				<p>This means that your files are not stored on server, and goes directly from you to the recipient.</p>
			</div>
		</div>
	);
}