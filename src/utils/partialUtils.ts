import {
  DiscordAPIError,
  RESTJSONErrorCodes,
  Message,
  PartialMessage,
} from "discord.js";
const IGNORED_ERRORS = [
  RESTJSONErrorCodes.UnknownMessage,
  RESTJSONErrorCodes.UnknownChannel,
  RESTJSONErrorCodes.UnknownGuild,
  RESTJSONErrorCodes.UnknownUser,
  RESTJSONErrorCodes.UnknownInteraction,
  RESTJSONErrorCodes.MissingAccess,
];
export class PartialUtils {
  public static async fillMessage(
    msg: Message | PartialMessage
  ): Promise<Message> {
    if (msg.partial) {
      try {
        return await msg.fetch();
      } catch (error) {
        if (
          error instanceof DiscordAPIError &&
          typeof error.code == "number" &&
          IGNORED_ERRORS.includes(error.code)
        ) {
          return;
        } else {
          throw error;
        }
      }
    }
    return msg as Message;
  }
}
