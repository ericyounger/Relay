/* eslint-disable react/no-children-prop */
import "./App.css";
import Upload from "./components/Upload";
import Download from "./components/Download";
import React from "react";
import NotFound from "./components/404";

import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";

export default App;

function App() {
	return (
		<Router>
			<Switch>
				<Route exact path="/" children={<Upload />} />
				<Route exact path="/404" children={<NotFound />} />
				<Route path="/files/:id" children={<Download />} />
				<Route component={NotFound} />
			</Switch>
		</Router>
	);
}
