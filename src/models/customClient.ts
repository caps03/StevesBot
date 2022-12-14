import { Client, ClientOptions, Collection } from "discord.js";
import { Command, GetNextGame, Movie } from "../commands/index.js";
export class CustomClient extends Client {
  public Commands: Collection<string, Command> = new Collection();
  constructor(clientOptions: ClientOptions) {
    super(clientOptions);
    this.Commands.set(GetNextGame.name, new GetNextGame());
    this.Commands.set(Movie.name, new Movie());
  }
}
