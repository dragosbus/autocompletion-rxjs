import config from './config';
import {
	from,
	fromEvent
} from "rxjs";
import {
	map,
	concatAll,
	filter,
	throttleTime,
	take,
	switchAll
} from "rxjs/operators";

const API_KEY = config.API_KEY;

const getMovies = query => {
	return fetch(
		`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`
	).then(res => res.json());
};

const sugestion = document.querySelector(".sugestions");
const searchInput = document.getElementById("search");
const addSugestion = data => `<li>
  <img class='poster-title' src='https://image.tmdb.org/t/p/w600_and_h900_bestv2${
		data.poster_path
	}' alt="poster">
  <p class='title'>${data.original_title}</p>
</li>`;

const hide$ = fromEvent(sugestion, 'click');

const getData$ = fromEvent(searchInput, "input").pipe(
	throttleTime(1000),
	map(key => {
		return from(getMovies(key.target.value)).pipe(
			filter(res=>res),
			map(results => results.results),
			concatAll(),
			filter(movie => movie.vote_average > 7),
			map(({
				id,
				original_title,
				poster_path,
				overview
			}) => ({
				id,
				original_title,
				poster_path,
				overview
			})),
			take(4),
		);
	}),
	switchAll()
);

getData$.subscribe(
	data => {
		sugestion.innerHTML = "";

		hide$.subscribe(event => {
			const targetTag = event.target.tagName;
			if (targetTag === 'LI' || targetTag === 'P' || targetTag === 'IMG') {
				searchInput.value = data.original_title;
				sugestion.style.display = 'none';
			}
		});

		setTimeout(() => {
			sugestion.innerHTML += addSugestion(data);
			sugestion.style.display = 'block';
		}, 100);
	},
	err => console.log(err),
	() => console.log("completed")
);