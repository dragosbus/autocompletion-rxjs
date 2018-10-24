import { from, fromEvent } from "rxjs";
import {
	map,
	concatAll,
	filter,
	throttleTime,
	skipUntil,
	takeUntil
} from "rxjs/operators";

const API_KEY = "cd8616dd1859d5e422a87d51ad82a0b9";

const getMovies = query => {
	return fetch(
		`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`
	).then(res => res.json());
};

const sugestion = document.querySelector(".sugestions");
const searchInput = document.getElementById("search");
const addSugestion = data => `<li>${data}</li>`;

const getData$ = fromEvent(searchInput, "input").pipe(
	map(key => {
		return from(getMovies(key.target.value || "s")).pipe(
			map(results => results.results),
			concatAll(),
			filter(movie => movie.vote_average > 7)
		);
	}),
	concatAll()
);

getData$.subscribe(
	data => {
		console.log(data);
		sugestion.innerHTML = "";
		setTimeout(() => {
			sugestion.innerHTML += addSugestion(data.title);
		}, 100);
	},
	err => console.log(err),
	() => console.log("completed")
);
