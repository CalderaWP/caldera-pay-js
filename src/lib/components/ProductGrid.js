// @flow
import React from 'react';
import  classNames from 'classnames';
import type {ColumnHeader, Row} from "../types";
import {Button} from '@wordpress/components'


type Props = {
	headers: Array<ColumnHeader>,
	rows: Array<Row>,
	onAddToCart: Function
};

/**
 * Displays all products in a table
 * @param props
 * @return {*}
 * @constructor
 */
export  const  ProductGrid =  (props: Props) => {

	return(
		<table
			className={classNames([
				'striped', 'bordered', 'condensed', 'hover', 'table'
			])} >
			<thead>
			<tr>
				{props.headers.map((header:ColumnHeader) => {
					if( header.addToCart ){
						return (
							<th
								key={header.key}
								className={header.className}
							>
								<a href={header.addToCart} >
									{header.label}
								</a>
							</th>
						);

					}
					return (
						<th
							key={header.key}
							className={header.className}
						>
							{header.label}
						</th>
					);
				})}
			</tr>
			</thead>
			<tbody>
				{props.rows.map((row: Row)=> {
					return(
						<tr
							key={row.key}
						>
							{Object.values(props.headers).map((headerColumn: ColumnHeader) => {
								return (
									<th key={headerColumn.key}>
										<Button onClick={() => {
												props.onAddToCart(headerColumn.id);
											}
										}>
											{row[headerColumn.key]}
										</Button>
									</th>)
							})}
						</tr>
					);

				})}

			</tbody>
		</table>
	);
};