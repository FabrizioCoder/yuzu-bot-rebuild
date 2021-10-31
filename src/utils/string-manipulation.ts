/* eslint-disable @typescript-eslint/explicit-module-boundary-types  */

export var isInvite = (str: string) => /(https:\/\/)?.*(discord.*\.?g.*g.*|invite\/*)\/?.+/igm.test(str);
export var isURL = (str: string) => /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/.test(str);
export var isEmpty = (str: string) => !/^(\w+\S+)$/.test(str);
export var isMention = (str: string) => /^<(@&|@|#)\d{18}>/i.test(str);
export var isCustomEmoji = (str: string) =>  /^<([a]?):.*[a-z0-9]:\d{18}>/i.test(str);
export var findId = (str: string) => /\d{18}/i.exec(str);
export var isNotAscii = (str: string) => /[^\x00-\x7F]+/g.test(str); // eslint-disable-line no-control-regex