import "./App.css";
import React, { useState, useCallback } from "react";
import theme from "./theme";
import { ThemeProvider, styled } from "@mui/material/styles";
import { InputAdornment, TextField, Button, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { DarkSelect } from "./components/DarkSelect";
import { MovieTable } from "./components/MovieTable";

const StyledDarkSelect = styled(DarkSelect)(({ theme }) => ({
	marginTop: "20px",
}));

const InputsWrapper = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
}));

const Wrapper = styled("div")(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	backgroundColor: theme.palette.background.default,
	marginTop: "20px",
}));

const WrapperImage = styled("div")(({ theme }) => ({
	backgroundColor: theme.palette.background.default,
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	height: "align",
	marginTop: "20px",
}));

const Title = styled(Typography)(({ theme }) => ({
	fontWeight: "bold",
	textAlign: "center",
	marginLeft: "1rem",
	marginRight: "1rem",
	marginBottom: "1rem",
	color: theme.palette.text.secondary,
}));

const Form = styled("form")(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
}));

const Label = styled("label")(({ theme }) => ({
	fontSize: "1rem",
	marginLeft: "4rem",
	marginRight: "4rem",
	color: "#ffffff",
}));

const textFieldStyles = {
	gridColumn: "3 / 4",
	gridRow: "2 / 3",
	position: "relative",
	display: "flex",
	alignItems: "center",
	marginLeft: "20px",
};

const inputStyles = {
	width: "20.4rem",
	height: "4rem",
	border: "none",
	borderRadius: "1rem",
	fontSize: "1.4rem",
	paddingLeft: "3rem",
	boxShadow: (theme) => theme.shadows[2],
	background: "none",
	fontFamily: "inherit",
	color: "var(--greyDark)",
	"&::placeholder": { color: "var(--greyLight-3)" },
	"&:focus": {
		outline: "none",
		boxShadow: (theme) => theme.shadows[4],
	},
};

const Input = styled(TextField)(({ theme }) => ({
	marginTop: "20px",
	gridColumn: "3 / 4",
	gridRow: "2 / 3",
	position: "relative",
	display: "flex",
	alignItems: "center",

	"& .MuiInputBase-root": {
		width: "20.4rem",
		height: "4rem",
		border: "none",
		borderRadius: "1rem",
		fontSize: "1.4rem",
		paddingLeft: "3.8rem",
		boxShadow: theme.shadows[1],
		background: "none",
		fontFamily: "inherit",
		color: theme.palette.text.primary,

		"&::placeholder": { color: theme.palette.grey[500] },

		"&:focus": {
			outline: "none",
			boxShadow: theme.shadows[2],

			"+ .search__icon": {
				color: theme.palette.primary.main,
			},
		},
	},
}));

const searchIconStyles = {
	height: "2rem",
	position: "absolute",
	left: "1rem",
	display: "flex",
	alignItems: "center",
	color: (theme) => theme.palette.grey[500],
	transition: "0.3s ease",
};

const SubmitButton = styled(Button)(({ theme }) => ({
	backgroundColor: theme.palette.primary.main,
	color: "#ffffff",
	fontSize: "1.2rem",
	fontWeight: "bold",
	marginTop: "20px",
	"&:hover": {
		backgroundColor: theme.palette.primary.dark,
	},
}));

const Body = styled("div")(({ theme }) => ({
	fontSize: "1.2rem",
	color: "#ffffff",
	marginLeft: "4rem",
	marginRight: "4rem",
	marginTop: "20px",
}));

function App() {
	const [seedValue, setSeedValue] = useState("");
	const [click, setClick] = useState(false);
	const [recommendations, setRecommendations] = useState(null);
	const [seedType, setSeedType] = useState("");

	const onSeedValueChange = (event) => {
		setSeedValue(event.target.value);
	};

	const onSeedTypeChange = useCallback((option) => {
		setSeedValue("");
		setSeedType(option);
	}, []);

	const handleSubmit = (event) => {
		setClick(true);

		setRecommendations(null);
		event.preventDefault();

		const seedEndpoint =
			seedType.value === "movie"
				? "movie-recommendations"
				: seedType.value === "actor"
				? "actor-recommendations"
				: "recommendations"; // default value === 'director' ? 'recommendations';

		axios.get(`http://localhost:3001/${seedEndpoint}`, {
			params: {
				[seedType.value]: seedValue,
			},
		})
			.then((response) => {
				console.log(response.data);
				setRecommendations(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const seedTypes = [
		{ value: "director", label: "Director" },
		{ value: "movie", label: "Movie" },
		{ value: "actor", label: "Actor" },
	];

	return (
		<ThemeProvider theme={theme}>
			<div>
				<WrapperImage>
					<img
						src={require("./img/watching-movie.png")}
						alt="logo"
						width="40"
						height="40"
						className="logo"
					/>
				</WrapperImage>
				<Title variant="h1">Movie Recommender</Title>
			</div>
			<Wrapper>
				<Form onSubmit={handleSubmit}>
					<Label htmlFor="option-select">
						Choose Movie, Actor or Director
					</Label>
					<Label htmlFor="director-name">
						Input one that you like, and I
						will recommend you movies:
					</Label>
					<InputsWrapper>
						<StyledDarkSelect
							id="option-select"
							name="option-select"
							options={seedTypes}
							value={seedType}
							onChange={
								onSeedTypeChange
							}
							required
						></StyledDarkSelect>

						<Input
							placeholder="Search"
							sx={textFieldStyles}
							variant="outlined"
							InputProps={{
								sx: inputStyles,
								startAdornment:
									(
										<InputAdornment position="start">
											<SearchIcon
												sx={
													searchIconStyles
												}
											/>
										</InputAdornment>
									),
							}}
							id="director-name"
							name="director-name"
							required
							value={seedValue}
							onChange={
								onSeedValueChange
							}
						/>
					</InputsWrapper>
					<SubmitButton type="submit">
						Submit
					</SubmitButton>
				</Form>
			</Wrapper>
			<Wrapper>
				{click && !recommendations && (
					<div style={{ marginTop: "20px" }}>
						<img
							src={require("./img/waiting.gif")}
							alt="loading..."
							width="80"
							height="80"
							className="waiting-gif"
						/>
					</div>
				)}
				{recommendations && (
					<div style={{ width: "100%" }}>
						<Title
							variant="h2"
							align="center"
						>
							Recommendations
						</Title>
						<Body>
							<div
								style={{
									height: 400,
									width: "100%",
								}}
							>
								<MovieTable
									recommendations={
										recommendations
									}
								/>
							</div>
						</Body>
					</div>
				)}
			</Wrapper>
		</ThemeProvider>
	);
}

export default App;
