import React from 'react';

export default class Masonry extends React.Component{
	constructor(props) {
		super(props);
		this.state = { columns: 1 };
		this.onResize = this.onResize.bind(this);
  }

	componentDidMount() {
		this.onResize();
		window.addEventListener('resize', this.onResize);
	}
	
	getColumns(width) {
		/**
		 * Every time the page is resized we want to call this method
		 * and resize the value of the columns based on the width of the Masonry element
		 */
		return this.props.breakPoints.reduceRight((length, breakpoint, index) => {
			/**
			 * If the breakpoints provided is equal to the width of the Masonry element
			 * we want to instead return the index of the current breakpoint and add 1
			 */
			return breakpoint < width ? length : index;
		}, this.props.breakPoints.length) + 1;
	}
	
	onResize() {
		/**
		 * This should be called whenever the page resizes.
		 */
		const columns = this.getColumns(this.refs.Masonry.offsetWidth);
		/**
		 * Update the state of the column is it not equal.
		 */
		if(columns !== this.state.columns) this.setState({ columns });
	}
	
	mapChildren() {
		let col = [];
		const numColumn = this.state.columns;
		for(let i = 0; i < numColumn; i++) col.push([]);
	
		return this.props.children.reduce((column, singleChild, index) => {
			column[index%numColumn].push(singleChild);
			return column;
		}, col);
	}
	
	render() {
		return (
			<div className="masonry" ref="Masonry">
				{this.mapChildren().map((column, index) => {
					return (
						<div className="column" key={index} >
							{column.map((child, i) => {
								return <div key={i} >{child}</div>
							})}
						</div>
					)
				})}
			</div>
		)
	}
}
