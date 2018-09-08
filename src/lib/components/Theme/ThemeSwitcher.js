import React from "react";
import {ThemeConsumer} from "./ThemeContext";



export class ThemeSwitcher extends React.Component {
	render() {
		return (
			<label className="switch">
				<ThemeConsumer>
					{({ toggleTheme, theme }) => (
						<input
							onChange={toggleTheme}
							type="checkbox"
							checked={theme === "night"}
						/>
					)}
				</ThemeConsumer>
				<span className="slider round" />
			</label>
		);
	}
}