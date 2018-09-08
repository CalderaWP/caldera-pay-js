
export type CalderaPaySettings = {
	apiRoot: string,
	bundleOrder: Array<string|number>,
	cartRoute: string,
	checkoutLink: string
}

export type WordPressFieldWithRendered = {
	rendered: string
};

export type CalderaPayPriceOption = {
	ID: number,
	name: string,
	amount: number,
	addToCart: string,

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
	featuredImage: ?CalderaPayFeaturedImage,
	bundle: {
		isBundle: boolean,
		includes: Array<number>
	}
}
export type Product = {
	id: number|string,
	link: string,
	title: WordPressFieldWithRendered,
	content: WordPressFieldWithRendered,
	excerpt: WordPressFieldWithRendered,
	calderaPay: CalderaPayProductInfo
}


export type ColumnHeader = {
	key: string|number,
	label: string,
	className?: string,
	id: number,
	addToCart?: string
};

export type Row = {
	key: string|number,
	label: string,
	isFree: boolean,
	addToCart: ?string

}

export type ProductCollection = {
	products: ?Array<Product>,
	bundles:Array<Product>
}