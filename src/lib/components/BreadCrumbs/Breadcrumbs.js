// @flow
import React from 'react';

type BreadCrumbItem = {
	active: boolean,
	page: number,
	pageElementId: string,
	label: string
};

type Props = {
	onNavigate: (page:number) => void,
	items: Array<BreadCrumbItem>
}

export const BreadCrumbs = (props: Props) => {
	const {items,onNavigate} = props;
	return(
		<ol
			className="breadcrumb"

		>
			{ items.map( (item: BreadCrumbItem) => {
				const {
					active,
					page,
					pageElementId,
					label,
				} = item;

				const className = active ? 'active' : '';

				return(
					<li
						key={page}
						className={className}
					>
						<a
							onClick={() => onNavigate(page)}
							aria-controls={pageElementId}
							aria-expanded={active ? "true" : "false"}
						>
							{label}
						</a>
					</li>
				);
			})}
		</ol>
	)
};