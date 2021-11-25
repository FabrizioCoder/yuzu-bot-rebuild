import "https://deno.land/x/dotenv/load.ts";

export const Options = {
  // ids
  CHANNEL_ID: 895959965469134858n,
  GUILD_ID: 891367004903182336n,
  OWNER_ID: 774292293020155906n,
  SESSION_ID: 904922230285291531n,
  // ETC
  PREFIX: "!",
  TOKEN: Deno.env.get("TOKEN") ?? "..",
};
