// @flow
import React from 'react';
import type {CrumbName} from "../CalderaPay";

export type BreadCrumbItem = {
	active: boolean,
	page: number,
	pageElementId: string,
	label: string,
	crumbName: CrumbName,
	disabled: boolean
};

type Props = {
	onNavigate: (crumbName: CrumbName) => void,
	items: Array<BreadCrumbItem>
}

export const BreadCrumbs = (props: Props) => {
	const {items, onNavigate} = props;
	return (
		<ol
			className="breadcrumb"

		>
			{items.map((item: BreadCrumbItem) => {
				const {
					active,
					page,
					pageElementId,
					label,
					crumbName,
					disabled
				} = item;

				const className = active ? 'active breadcrumb' : 'breadcrumb';

				return (
					<li
						key={page}
						className={className}
					>
						{disabled &&
							<span
								className={'disabled'}
							>
								{label}
							</span>

						}
						{!disabled &&
							<a
								onClick={() => onNavigate(crumbName)}
								aria-controls={pageElementId}
								aria-expanded={active ? "true" : "false"}
							>
								{label}
							</a>
						}

					</li>
				);
			})}
		</ol>
	)
};