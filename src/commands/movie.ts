import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsString,
} from "discord.js";
import { InteractionUtils } from "../utils/index.js";
import { CommandDeferType } from "./index.js";
import { Command } from "./index.js";
import { createRequire } from "node:module";
import axios from "axios";
import { MovieGenres } from "../constants/index.js";
const require = createRequire(import.meta.url);
let Config = require("../../config.json");
export class Movie implements Command {
  public name: string = "movie";
  public deferType = CommandDeferType.PUBLIC;
  public requireClientPerms: PermissionsString[] = [];
  public async execute(intr: ChatInputCommandInteraction): Promise<void> {
    let movie = intr.options.getString("movie");
    let movieSearch = await axios.get<any>(
      Config.APIKeys.TheMovieDB.Url +
        "3/search/movie?api_key=" +
        Config.APIKeys.TheMovieDB.V3.Key +
        "&query=" +
        movie,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    if (movieSearch?.data?.results?.length > 0) {
      let movieId: number = movieSearch.data.results[0].id;
      let movieData = await axios.get<any>(
        Config.APIKeys.TheMovieDB.Url +
          "3/movie/" +
          movieId +
          "?api_key=" +
          Config.APIKeys.TheMovieDB.V3.Key,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      let title: string = movieSearch?.data?.results[0].title;
      let posterPath: string =
        "https://www.themoviedb.org/t/p/w300_and_h450_bestv2/" +
        movieSearch?.data?.results[0].poster_path;
      let overview: string = movieSearch?.data?.results[0].overview;
      let rating: number = movieSearch?.data?.results[0].vote_average;
      let genreIds: Array<number> = movieSearch?.data?.results[0].genre_ids;
      let releaseDate: string = movieSearch?.data?.results[0].release_date;
      let backdropPath: string =
        "https://www.themoviedb.org/t/p/w533_and_h300_bestv2/" +
        movieSearch?.data?.results[0].backdrop_path;
      let genres: string = "";
      let tvmdbLink: string = "https://www.themoviedb.org/movie/" + movieId;
      let imdbLink: string = "";
      if (movieData?.data?.id == movieId) {
        movieData?.data?.genres.forEach((genre: any) => {
          if (genres == "") {
            genres = genre.name;
          } else {
            genres += ", " + genre.name;
          }
        });
        imdbLink =
          "https://www.imdb.com/title/" + movieData?.data?.imdb_id + "/";
      } else {
        genreIds.forEach((genreId: number) => {
          if (genres == "") {
            genres = MovieGenres[genreId];
          } else {
            genres += ", " + MovieGenres[genreId];
          }
        });
      }
      let embed = new EmbedBuilder();
      embed.setColor(0x0099ff);
      embed.setTitle(title);
      embed.setURL(tvmdbLink);
      embed.setThumbnail(posterPath);
      embed.addFields(
        { name: "Overview", value: overview, inline: false },
        { name: "Rating", value: rating.toString(), inline: false },
        { name: "Genres", value: genres, inline: false },
        { name: "Release Date", value: releaseDate, inline: false }
      );
      embed.setImage(backdropPath);
      await InteractionUtils.send(intr, embed);
    } else {
      await InteractionUtils.send(intr, "Team Not Found!");
    }
  }
}
