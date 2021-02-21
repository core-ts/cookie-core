export interface CookieService {
  /**
   * @param name Cookie name
   * @returns {boolean}
   */
  check(name: string): boolean;

  /**
   * @param name Cookie name
   * @returns {any}
   */
  get(name: string): string;

  /**
   * @returns {}
   */
  getAll(): {};

  /**
   * @param name  Cookie name
   * @param value   Cookie value
   * @param expires Number of days until the cookies expires or an actual `Date`
   * @param path  Cookie path
   * @param domain  Cookie domain
   * @param secure  Secure flag
   */
  set(name: string, value: string, expires?: number | Date, path?: string, domain?: string, secure?: boolean): void;

  /**
   * @param name   Cookie name
   * @param path   Cookie path
   * @param domain Cookie domain
   */
  delete(name: string, path?: string, domain?: string): void;

  /**
   * @param path   Cookie path
   * @param domain Cookie domain
   */
  deleteAll(path?: string, domain?: string): void;

  /**
   * @param name Cookie name
   * @returns {RegExp}
   */
  getCookieRegExp?(name: string): RegExp;
}

export class DefaultCookieService implements CookieService {
  private document: any;
  private documentIsAccessible = true;

  constructor(document: any) {
    this.document = document;
    this.check = this.check.bind(this);
    this.get = this.get.bind(this);
    this.getAll = this.getAll.bind(this);
    this.set = this.set.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
    this.getCookieRegExp = this.getCookieRegExp.bind(this);
  }

  /**
   * @param name Cookie name
   * @returns {boolean}
   */
  check(name: string): boolean {
    if (!this.documentIsAccessible) {
      return false;
    }
    name = encodeURIComponent(name);
    const regExp = this.getCookieRegExp(name);
    const exists = regExp.test(this.document.cookie);
    return exists;
  }

  /**
   * @param name Cookie name
   * @returns {any}
   */
  get(name: string): string {
    if (this.documentIsAccessible && this.check(name)) {
      name = encodeURIComponent(name);
      const regExp = this.getCookieRegExp(name);
      const result = regExp.exec(this.document.cookie);
      return decodeURIComponent(result[1]);
    } else {
      return '';
    }
  }

  /**
   * @returns {}
   */
  getAll(): any {
    if (!this.documentIsAccessible) {
      return {};
    }
    const cookies = {};
    const document = this.document;
    if (document.cookie && document.cookie !== '') {
      const split = document.cookie.split(';');
      for (const item of split) {
        const currentCookie = item.split('=');
        currentCookie[0] = currentCookie[0].replace(/^ /, '');
        cookies[decodeURIComponent(currentCookie[0])] = decodeURIComponent(currentCookie[1]);
      }
    }
    return cookies;
  }

  /**
   * @param name  Cookie name
   * @param value   Cookie value
   * @param expires Number of days until the cookies expires or an actual `Date`
   * @param path  Cookie path
   * @param domain  Cookie domain
   * @param secure  Secure flag
   */
  set(name: string, value: string, expires?: number | Date, path?: string, domain?: string, secure?: boolean): void {
    if (!this.documentIsAccessible) {
      return;
    }
    let cookieString = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';';
    if (expires) {
      if (typeof expires === 'number') {
        const dateExpires = new Date(new Date().getTime() + expires * 1000 * 60 * 60 * 24);
        cookieString += 'expires=' + dateExpires.toUTCString() + ';';
      } else {
        cookieString += 'expires=' + expires.toUTCString() + ';';
      }
    }
    if (path) {
      cookieString += 'path=' + path + ';';
    }
    if (domain) {
      cookieString += 'domain=' + domain + ';';
    }
    if (secure) {
      cookieString += 'secure;';
    }
    this.document.cookie = cookieString;
  }

  /**
   * @param name   Cookie name
   * @param path   Cookie path
   * @param domain Cookie domain
   */
  delete(name: string, path?: string, domain?: string): void {
    if (!this.documentIsAccessible) {
      return;
    }
    this.set(name, '', -1, path, domain);
  }

  /**
   * @param path   Cookie path
   * @param domain Cookie domain
   */
  deleteAll(path?: string, domain?: string): void {
    if (!this.documentIsAccessible) {
      return;
    }
    const cookies = this.getAll();
    for (const cookieName in cookies) {
      if (cookies.hasOwnProperty(cookieName)) {
        this.delete(cookieName, path, domain);
      }
    }
  }

  /**
   * @param name Cookie name
   * @returns {RegExp}
   */
  getCookieRegExp(name: string): RegExp {
    const escapedName = name.replace(/([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/ig, '\\$1');
    return new RegExp('(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)', 'g');
  }
}
