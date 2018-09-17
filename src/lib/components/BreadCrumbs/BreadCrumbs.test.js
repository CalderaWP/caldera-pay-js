import React from "react";
import renderer from "react-test-renderer";
import {BreadCrumbs} from "./Breadcrumbs";

const genericHandler = () => {};


describe( 'Breadcrumbs components', () => {

	const items = [
		{
			active: false,
			page: 1,
			pageElementId: 'page-1',
			label: 'Not Active'
		},

		{
			active: true,
			page: 2,
			pageElementId: 'page-2',
			label: 'Active'
		},

	]
	it( 'shows active tab', () => {
		const component = renderer.create(
			<BreadCrumbs onNavigate={genericHandler} items={[items[1]]}/>
		);
		expect( component.toJSON() ).toMatchSnapshot();
	});

	it( 'shows not tab', () => {
		const component = renderer.create(
			<BreadCrumbs onNavigate={genericHandler} items={[items[0]]}/>
		);
		expect( component.toJSON() ).toMatchSnapshot();
	});


	it( 'works with multiple tabs', () => {
		const component = renderer.create(
			<BreadCrumbs onNavigate={genericHandler} items={items}/>
		);
		expect( component.toJSON() ).toMatchSnapshot();
	});

});