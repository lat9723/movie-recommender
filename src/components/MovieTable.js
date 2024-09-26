import { DataGrid } from "@mui/x-data-grid";

export const MovieTable = ({ recommendations }) => {
	const columns = [
		{ field: "director", headerName: "Director", flex: 1 },
		{ field: "movie", headerName: "Movie", flex: 1 },
		{ field: "imdb", headerName: "IMDB", flex: 1 },
		{ field: "trailer", headerName: "Trailer", flex: 1 },
	];

	return (
		<DataGrid
			getRowId={(row) => row.imdb}
			rows={recommendations}
			columns={columns}
			pageSize={5}
		/>
	);
};
