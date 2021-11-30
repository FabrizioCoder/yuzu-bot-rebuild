export const isInvite = (str: string) =>
  /(https:\/\/)?.*(discord.*\.?g.*g.*|invite\/*)\/?.+/igm.test(str);

export const isURL = (str: string) =>
  /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/
    .test(str);
