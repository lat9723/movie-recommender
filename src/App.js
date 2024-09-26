import "./App.css";
import React, { useState, useCallback } from "react";
import theme from "./theme";
import { ThemeProvider, styled } from "@mui/material/styles";
import { TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import Select from "react-select";
import { MovieTable } from "./components/MovieTable";

const StyledSelect = styled(Select)(({ theme }) => ({
	marginTop: "20px",
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

const Input = styled(TextField)(({ theme }) => ({
	marginTop: "20px",
}));

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
			<WrapperImage>
				<img
					src={require("./img/watching-movie.png")}
					alt="logo"
					width="100"
					height="100"
					className="logo"
				/>
			</WrapperImage>
			<Wrapper>
				<Title variant="h1">Movie Recommender</Title>
				<Form onSubmit={handleSubmit}>
					<Label htmlFor="option-select">
						Choose Movie, Actor or Director
					</Label>
					<Label htmlFor="director-name">
						Input one that you like, and I
						will recommend you movies:
					</Label>
					<StyledSelect
						id="option-select"
						name="option-select"
						options={seedTypes}
						value={seedType}
						onChange={onSeedTypeChange}
						required
					></StyledSelect>
					<Input
						id="director-name"
						name="director-name"
						variant="outlined"
						required
						value={seedValue}
						onChange={onSeedValueChange}
					/>
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
