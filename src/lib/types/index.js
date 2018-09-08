export type CalderaPaySettings = {
	apiRoot: string,
	bundleOrder: Array<string|number>
}

export type WordPressFieldWithRendered = {
	rendered: string
};

export type CalderaPayPriceOption = {
	ID: number,
	name: string,
	amount: number,
	addtocart: string,

};

export type CalderaPayFeaturedImage = {
	ID: number,
	html: string,
	url: string,
	srcset: string,
	sizes: string,
	alt: string,
	height: number,
	width: number
}
export type CalderaPayPrices = {
	price: number,
	free: boolean,
	options: Array<CalderaPayPriceOption>
}

export type CalderaPayProductInfo = {
	prices: CalderaPayPrices,
	featuredImage?: CalderaPayFeaturedImage,
	bundle: {
		isBundle: boolean,
		includes: Array<number>
	}
}
export type Product = {
	title: WordPressFieldWithRendered,
	content: WordPressFieldWithRendered,
	excerpt: WordPressFieldWithRendered,
	calderaPay?: CalderaPayProductInfo
}


export type ColumnHeader = {
	key: string|number,
	label: string,
	className?: string,
	id: number
};

export type Row = {
	key: string|number,
	label: string,
	isFree: boolean
}

export type ProductCollection = {
	products?: ?Array<Product>,
	bundles?:Array<Product>
}