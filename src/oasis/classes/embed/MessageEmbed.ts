import type { Embed } from "discordeno";

export class MessageEmbed {
  public constructor(public embed: Embed = {}) {
    this.embed = embed;
  }

  public color(color: number) {
    this.embed.color = color;
    return this;
  }

  public field(name: string, value: string, inline = false) {
    this.embed.fields ??= [];
    this.embed.fields?.push({ name, value, inline });
    return this;
  }

  public fields(fields: { name: string; value: string; inline: boolean }[]) {
    this.embed.fields = [...fields, ...this.embed.fields ?? []];
    return this;
  }

  public timestamp(timestamp: string | number | Date) {
    this.embed.timestamp =
      timestamp instanceof Date
        ? timestamp.toDateString()
        : typeof timestamp === "number"
        ? new Date(timestamp).toDateString()
        : timestamp;

    return this;
  }

  public image(url: string, proxyUrl?: string, height?: number, width?: number) {
    this.embed.image = { url, proxyUrl, height, width };
    return this;
  }

  public video(url?: string, proxyUrl?: string, height?: number, width?: number) {
    this.embed.video = { url, proxyUrl, height, width };
    return this;
  }

  public thumbnail(url: string, proxyUrl?: string, height?: number, width?: number) {
    this.embed.thumbnail = { url, proxyUrl, height, width };
    return this;
  }

  public title(title: string) {
    this.embed.title = title;
    return this;
  }

  public footer(text: string, iconUrl?: string, proxyIconUrl?: string) {
    this.embed.footer = { text, iconUrl, proxyIconUrl };
    return this;
  }

  public author(name: string, iconUrl?: string, url?: string, proxyIconUrl?: string) {
    this.embed.author = { name, iconUrl, url, proxyIconUrl };
    return this;
  }

  public provider(name: string, url: string) {
    this.embed.provider = { name, url };
    return this;
  }

  public url(url: string) {
    this.embed.url = url;
    return this;
  }

  public description(description: string) {
    this.embed.description = description;
    return this;
  }
}
