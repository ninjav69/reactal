export default class ClarityGatewayManager {

	clients = {};

	constructor(clients, connected) {
		clients.forEach(c => {
			this.clients[c.name] = new ClarityClient(c);

			this.clients[c.name].begin()
				.then(res => {
					console.log("New session", res)
					connected(c.name, true);
				})
				.catch(res => {
					console.log("Client setup failure", res)
					connected(c.name, false, res);
				});
		});
	}

	subscribe(gateway, types, listener) {
		return new Promise((resolve, reject) => {
			if (this.clients[gateway]) {
				this.clients[gateway].subscribe(types, listener)
					.then(res => resolve(res))
					.catch(err => reject(err))
			} else {
				reject("unknown gateway " + gateway);
			}
		});
	}

	unsubscribe(gateway, types, listener) {
		return new Promise((resolve, reject) => {
			if (this.clients[gateway]) {
				this.clients[gateway].unsubscribe(types, listener)
					.then(res => resolve(res))
					.catch(err => reject(err))
			} else {
				reject("unknown gateway " + gateway);
			}
		});
	}

	request(gateway, request) {
		return new Promise((resolve, reject) => {
			if (this.clients[gateway]) {
				this.clients[gateway].request(request)
					.then(res => resolve(res))
					.catch(err => reject(err))
			} else {
				reject("unknown gateway " + gateway);
			}
		});
	}
}

export class ClarityClient {

	running = false;
	sessionTimeout = null;
	sessinId = null;
	types = [];

	listeners = {};

	constructor(config) {
		this.config = config;
	}

	begin() {
		return this.subscribe(["VersionResponse"]);
	}

	subscribe(types, listener) {
		types.forEach(t => {
			if (this.types.indexOf(t) < 0) this.types.push(t);

			if (listener) {
				var listeners = this.listeners[t];
				if (!listeners) listeners = [];
				if (listeners.indexOf(listener) < 0) listeners.push(listener);
				this.listeners[t] = listeners;
			}
		});

		return this._session();
	}

	unsubscribe(types, listener) {
		types.forEach(t => {
			if (listener) {
				var listeners = this.listeners[t];
				var x = listeners.indexOf(listener);
				if (x > -1) listeners.splice(x, 1);

				// there are no more listeners for this event, so unsubscribe
				if (listeners.length == 0) {
					var i = this.types.indexOf(t);
					if (i > -1) this.types.splice(i, 1);
				}
			}
		});

		return this._session();
	}

	request(request) {
		if (!request.eventId) request.eventId = ident(10);

		return new Promise((resolve, reject) => {
			var url = this.config.url;
			if (this.sessionId != null) url += "?sessionId=" + this.sessionId;

			// perform a POST of request
			fetch(url, {
					method: "POST",
					body: JSON.stringify(request),
					mode: 'cors',
					cache: 'no-cache'
				})
				.then(function(res) {
					resolve(request.eventId);
				})
				.catch(function(err) {
					reject(err);
				});
		});
	}

	stop() {
		if (this.sessionTimeout != null) clearTimeout(this.sessionTimeout);
		this.running = false;
	}

	_session() {
		if (this.sessionTimeout != null) clearTimeout(this.sessionTimeout);

		return new Promise((resolve, reject) => {
			// create session
			var url = this.config.url + "/session";
			if (this.sessionId != null) url += "?sessionId=" + this.sessionId;

			fetch(url, {
					method: "POST",
					body: JSON.stringify({
						ttlSeconds: this.config.sessionTtl,
						types: this.types
					}),
					mode: 'cors',
					cache: 'no-cache'
				})
				.then(function(res) {
					res.json().then(function(data) {
						if (data.sessionId) {
							this.sessionId = data.sessionId;

							// after session create, start listening
							if (!this.running) this._listen();

							// set up re-subscribe
							this.sessionTimeout = setTimeout(() => {
								this._session();
							}, Math.ceil((this.config.sessionTtl * 1000) * 0.90));
						}

						resolve(data.sessionId);
					}.bind(this));
				}.bind(this))
				.catch(function(err) {
					reject(err);
				});
		});
	}

	_listen() {
		this.running = true;

		// perform long get
		var url = this.config.url;
		if (this.sessionId != null) url += "?sessionId=" + this.sessionId;
		fetch(url, {
				method: "GET",
				mode: 'cors',
				cache: 'no-cache'
			})
			.then(function(res) {
				if (res.status > 399) {
					// we're only expecting happy successful responses, if something failed, just abort
					throw "Server responded with response code: " +	res.status + ": " + res.statusText;
				}

				res.json().then(function(data) {
					// emit event for data.forEach
					data.forEach(event => {
						event._client = this.config.name;
						this.listeners[event.type].forEach(l => {
							if (l.received) l.received(event);
						});
					});
				}.bind(this));
			}.bind(this))
			.catch(function(err) {
				console.log(err);

				// stop listening on error
				this.stop();

				// alert user that it's broken
				var event = {
					type: "Disconnected",
					eventId: null,
					reason: err,
					_client: this.config.name
				}
				Object.values(this.listeners).forEach(v => {
					v.forEach(l => {
						if (l.received) l.received(event);
					});
				});
			}.bind(this))
			.then(function() {
				// after long get, call listen again if still running
				if (this.running) this._listen();
			}.bind(this));
	}
}

/**
 * utility function to generate a unique identifier
 */
export function ident(len = 10) {
	const RANGES = [
		[48, 57], // 0-9
		[65, 90], // A-Z
		[97, 122] // a-z
	];

	var result = "";
	for (var i = 0; i < len; i++) {
		var r = RANGES[Math.floor(Math.random() * RANGES.length)];
		result += String.fromCharCode(Math.floor(Math.random() * (r[1] - r[0] + 1)) + r[0]);
	}

	return result;
}
