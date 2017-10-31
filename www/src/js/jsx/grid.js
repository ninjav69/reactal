import React from 'react'

export class Grid extends React.Component {
	render() {
		return (
			<div className={"grid " + this.props.className}>{this.props.children}</div>
		);
	}
}

class GridCell extends React.Component {
	cellClass = "";

	render() {
		return (
			<div className={this.cellClass + " " + this.props.className}>{this.props.children}</div>
		);
	}
}

export class Main extends GridCell {
	cellClass = "main";
}

export class Left extends GridCell {
	cellClass = "left";
}

export class Right extends GridCell {
	cellClass = "right";
}
