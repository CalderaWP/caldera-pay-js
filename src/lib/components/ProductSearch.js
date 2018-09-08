// @flow
import React from 'react';
import {RenderGroup} from '@caldera-labs/components';


type Props = {
	onProductSearch: Function,
	searchTerm: string
};
export  const ProductSearch = (props : Props) => {

	const searchField = {
		id: 'caldera-pay-product-search',
		label: 'Search Products',
		desc: '',
		type: 'input',
		innerType: 'search',
		inputClass: '',
		value: props.searchTerm,
		onValueChange: (newValue) => {
			props.onProductSearch(newValue);
		}
	};

	return (
		<div>
			<RenderGroup
				configFields={[
					searchField
				]}
				className={'caldera-pay-product-search-options'}
			/>
		</div>
	);

};

