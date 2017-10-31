import React from 'react'
import css from '@blueprintjs/core/dist/blueprint.css'

import axios from 'axios';
import { Landing } from './landing'

export default class App extends React.Component {

	constructor(props, context) {
		super(props, context);

        this.state = {
            title: "Loading...",
            content: "Please wait..."
        };
    }

    componentDidMount() {
        axios.get('http://localhost:3000/home')
            .then(response => {
                console.log(response);
                this.setState({
						title:response.data.title,
						content:response.data.content,
					});
            })
            .catch(error => {
                console.log(error);
            });
	}

	render() {
		return (
			<Landing title={this.state.title} content={this.state.content} />
		);
	}
}

