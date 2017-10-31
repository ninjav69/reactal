/**
* Config file should be named 'config.js', and deployed
* along with the built index.js and index.html files.
*/
function Config() {
	return {
		gateways: [
			{
				"name": "clarity",
				"url": "%%CLARITY_URL%%", // http://localhost:8090/gateway/clarity
				"sessionTtl": 360 // seconds
			},
			{
				"name": "resources",
				"url": "%%RESOURCES_URL%%", // http://localhost:8090/gateway/resources
				"sessionTtl": 360 // seconds
			},
			{
				"name": "deployment",
				"url": "%%DEPLOYMENT_URL%%", // http://localhost:8090/gateway/deployment
				"sessionTtl": 360 // seconds
			}
		]
	};
}
