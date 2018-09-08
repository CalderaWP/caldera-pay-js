import React from "react";

export const ThemeContext = React.createContext();
export const ThemeConsumer = ThemeContext.Consumer;
export class ThemeProvider extends React.Component {
	toggleTheme = evt => {
		this.setState({ theme: evt.target.checked ? "night" : "day" });
	};

	state = {
		theme: "night",
		toggleTheme: this.toggleTheme
	};

	render() {
		return (
			<ThemeContext.Provider value={this.state}>
				{this.props.children}
			</ThemeContext.Provider>
		);
	}
}

