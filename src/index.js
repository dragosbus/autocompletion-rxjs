import { from, fromEvent } from "rxjs";
import {
	map,
	concatAll,
	filter,
	throttleTime,
	skipUntil,
	takeUntil
} from "rxjs/operators";

const movies = [
	{ title: "Superman" },
	{ title: "Batman vs Superman" },
	{ title: "Spiderman 1" },
	{ title: "Spiderman 2" },
	{ title: "Spiderman 3" },
	{ title: "GodFather 1" },
	{ title: "GodFather 3" },
	{ title: "Wolf" }
];

const sugestion = document.querySelector(".sugestions");
const searchInput = document.getElementById("search");
const addSugestion = data => `<li>${data}</li>`;

sugestion.innerHTML = "";

const getData$ = fromEvent(searchInput, "input").pipe(
	throttleTime(250),
	map(key => {
		return from(movies).pipe(
			filter(movie => {
				return movie.title.toLowerCase().startsWith(key.target.value);
			})
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
