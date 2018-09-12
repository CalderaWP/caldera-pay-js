// @flow
import React from 'react';
import  classNames from 'classnames';
import type {ColumnHeader, Product, Row} from "../types";
import {ProductCell} from "./ProductCell";

type Props = {
	headers: Array<ColumnHeader>,
	rows: Array<Row>,
	onAddToCart: Function,
	bundles: Array<Product>
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
								if( headerColumn.showLabel ){
									return <th key={headerColumn.key}>{row[headerColumn.key]}</th>
								}
								const bundle = props.bundles.find((bundle:Product) => {return headerColumn.key ===  bundle.id } );
								return (

									<ProductCell
											key={headerColumn.key}
											product={row.product}
											bundle={bundle}
											isIncluded={row[headerColumn.key]}
											onAddToCart={props.onAddToCart}
									/>
								)
							})}
						</tr>
					);
				})}

			</tbody>
		</table>
	);
};