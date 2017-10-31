import React from 'react'

import { Button, Dialog, Intent } from '@blueprintjs/core'

export class SimpleTable extends React.Component {

	constructor(props, context) {
		super(props, context);
	}

	render() {
		var head = this.props.head.map(h => {
			return (<th key={h.key ? h.key : h}>{h}</th>);
		});

		return (
			<table className={this.props.className}>
				<thead>
					<tr>
						{head}
					</tr>
				</thead>
				<tbody>
					{this.props.rows}
				</tbody>
			</table>
		);
	}
}

export class SimpleRow extends React.Component {
	render() {
		var cols = this.props.cols.map(c => {
			return (<td key={c.key ? c.key : c}>{c}</td>);
		});
		return (
			<tr key={this.props.rowKey}>{cols}</tr>
		);
	}
}

export class Heading extends React.Component {
	static defaultProps = {
		size: "big"
	}

	render() {
		var icon = this.props.iconName != null ?
			(<span className={"icon pt-icon-" + this.props.iconName}></span>) :
			null;

		return (
			<div className={"heading " + this.props.size + " " + this.props.className}>
				{icon}
				{this.props.children}
			</div>
		);
	}
}

export class LabelValues extends React.Component {
	render() {
		var list = this.props.values.map(v => {
			return <LabelValue key={v.label} label={v.label} value={v.value}/>
		});

		return (
			<div className="lv">
				{list}
			</div>
		);
	}
}

export class LabelValue extends React.Component {
	render() {
		return (
			<div className="lv-item">
				<label>{this.props.label}</label>
				<span>{this.props.value}</span>
			</div>
		);
	}
}

/**
 * Renders an error based on the contents of a Java exception.
 * Expects the `error` prop to have a property named "message" which will be
 * displayed to users.
 */
export class ErrorDialog extends React.Component {
	static defaultProps = {
		open: false,
		title: "Error",
		onClose: null,
		iconName: 'warning-sign'
	}

	constructor(props, context) {
		super(props, context);
	}

	render() {
		var error = this.props.error != null
			? this.props.error.message
			: "";

		return (
			<Dialog
				iconName={this.props.iconName}
				isOpen={this.props.open}
				onClose={this.props.onClose}
				title={this.props.title}
				intent={Intent.DANGER}
				>
				<div className="pt-dialog-body">
					{error}
				</div>
				<div className="pt-dialog-footer">
					<div className="pt-dialog-footer-actions">
						<Button
							intent={Intent.PRIMARY}
							onClick={this.props.onClose}
							text="OK"
							/>
					</div>
				</div>
			</Dialog>
		);
	}
}
