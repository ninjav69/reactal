import React from 'react'
import css from '@blueprintjs/core/dist/blueprint.css'

import { Heading } from './common';

export class Landing extends React.Component {

	render() {
		return (
			<div>
				<header>
					<Navbar title="Relearn"/>
				</header>
				<article>
					<div>
						<Heading size="medium">{this.props.title}</Heading>
						<hr/>
						<p>{this.props.content}</p>
					</div>
				</article>
			</div>
		);
	}
}

class Navbar extends React.Component {

    render() {
        return (
			<nav className="pt-navbar">
				<div className="fixed">
					<div className="pt-navbar-group pt-align-left">
						<object className="logo" data="assets/reactal.svg" style={{width: "32px", margin: "5px"}} />
						<div className="pt-navbar-heading">Entities</div>
					</div>
					<div className="pt-navbar-group pt-align-right">
						<a href="">Home</a>
					</div>
				</div>
			</nav>
        );
    }
}

