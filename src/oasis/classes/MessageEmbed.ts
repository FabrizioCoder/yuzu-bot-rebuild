import type { Embed } from "discordeno";

export const MessageEmbed = {
  embed: <Embed> {},
  new(embed: Embed = {}): typeof this {
    const self = Object.assign(Object.create(this), { embed });
    return self;
  },
  end(): Embed {
    return this.embed;
  },
  color(color: number) {
    this.embed.color = color;
    return this;
  },
  field(name: string, value: string, inline = false) {
    this.embed.fields ??= [];
    this.embed.fields?.push({ name, value, inline });
    return this;
  },
  fields(fields: { name: string; value: string; inline: boolean }[]) {
    this.embed.fields = [...fields, ...this.embed.fields ?? []];
    return this;
  },
  timestamp(timestamp: string | number | Date) {
    this.embed.timestamp =
      timestamp instanceof Date
        ? timestamp.toDateString()
        : typeof timestamp === "number"
        ? new Date(timestamp).toDateString()
        : timestamp;

    return this;
  },
  image(url: string, proxyUrl?: string, height?: number, width?: number) {
    this.embed.image = { url, proxyUrl, height, width };
    return this;
  },
  video(url?: string, proxyUrl?: string, height?: number, width?: number) {
    this.embed.video = { url, proxyUrl, height, width };
    return this;
  },
  thumbnail(url: string, proxyUrl?: string, height?: number, width?: number) {
    this.embed.thumbnail = { url, proxyUrl, height, width };
    return this;
  },
  title(title: string) {
    this.embed.title = title;
    return this;
  },
  footer(text: string, iconUrl?: string, proxyIconUrl?: string) {
    this.embed.footer = { text, iconUrl, proxyIconUrl };
    return this;
  },
  author(name: string, iconUrl?: string, url?: string, proxyIconUrl?: string) {
    this.embed.author = { name, iconUrl, url, proxyIconUrl };
    return this;
  },
  provider(name: string, url: string) {
    this.embed.provider = { name, url };
    return this;
  },
  url(url: string) {
    this.embed.url = url;
    return this;
  },
  description(description: string) {
    this.embed.description = description;
    return this;
  },
};
