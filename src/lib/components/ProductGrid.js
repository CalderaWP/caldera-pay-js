// @flow
import React from 'react';
import  classNames from 'classnames';
import type {ColumnHeader, Row} from "../types";

type Props = {
	headers: Array<ColumnHeader>,
	rows: Array<Row>,
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
					return (<th key={header.key}>{header.label}</th>);
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
							return (<th key={headerColumn.key}>{row[headerColumn.key]}</th>)
						})}
					</tr>
				)

			})}

			</tbody>
		</table>
	);
};