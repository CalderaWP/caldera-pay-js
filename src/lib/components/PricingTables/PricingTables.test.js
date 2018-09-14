import {PriceTables} from "./PriceTables";
import {PriceTableItem} from "./PriceTableItem";
import React from 'react';
import renderer from "react-test-renderer";
import bundles from '../../__MOCKDATA__/bundles'

function genericHandler(){}
describe( 'Pricing table components', () => {
	it( 'Item in table snapshot', () => {
		const product = bundles[0];
		const component = renderer.create(<PriceTableItem product={product} onSelectOption={genericHandler} features={['feature1', 'feature 2']} callToAction={'Buy Me!'}/>)
		expect( component.toJSON() ).toMatchSnapshot();
	});
	it( 'Pricing Tables with 3 products', () => {
		const componentWith3Products = renderer.create(
			<PriceTables products={bundles} callToAction={'Buy This ONe'} onSelectOption={genericHandler}/>
		);

		expect( componentWith3Products.toJSON() ).toMatchSnapshot();

	});


	it( 'Pricing Tables with 1 products', () => {

		const product = bundles[0];

		const componentWith1Products = renderer.create(
			<PriceTables products={[product]} callToAction={'Buy the only option'} onSelectOption={genericHandler}/>
		);

		expect( componentWith1Products.toJSON() ).toMatchSnapshot();
	});
})

