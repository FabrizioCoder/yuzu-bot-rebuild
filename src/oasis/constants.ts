export enum Milliseconds {
  Week = 1000 * 60 * 60 * 24 * 7,
  Day = 1000 * 60 * 60 * 24,
  Hour = 1000 * 60 * 60,
  Minute = 1000 * 60,
  Second = 1000,
}

export enum Limits {
  Title = 256,
  Description = 4096,
  FieldName = 256,
  FieldValue = 1024,
  FooterText = 2048,
  AuthorName = 256,
  Fields = 25,
  Total = 6000,
}
