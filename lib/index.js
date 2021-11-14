"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultCookieService = (function () {
  function DefaultCookieService(document) {
    this.documentIsAccessible = true;
    this.document = document;
    this.check = this.check.bind(this);
    this.get = this.get.bind(this);
    this.getAll = this.getAll.bind(this);
    this.set = this.set.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
    this.getCookieRegExp = this.getCookieRegExp.bind(this);
  }
  DefaultCookieService.prototype.check = function (name) {
    if (!this.documentIsAccessible) {
      return false;
    }
    name = encodeURIComponent(name);
    var regExp = this.getCookieRegExp(name);
    var exists = regExp.test(this.document.cookie);
    return exists;
  };
  DefaultCookieService.prototype.get = function (name) {
    if (this.documentIsAccessible && this.check(name)) {
      name = encodeURIComponent(name);
      var regExp = this.getCookieRegExp(name);
      var result = regExp.exec(this.document.cookie);
      if (!result) {
        return undefined;
      }
      else {
        return decodeURIComponent(result[1]);
      }
    }
    else {
      return '';
    }
  };
  DefaultCookieService.prototype.getAll = function () {
    if (!this.documentIsAccessible) {
      return {};
    }
    var cookies = {};
    var document = this.document;
    if (document.cookie && document.cookie !== '') {
      var split = document.cookie.split(';');
      for (var _i = 0, split_1 = split; _i < split_1.length; _i++) {
        var item = split_1[_i];
        var currentCookie = item.split('=');
        currentCookie[0] = currentCookie[0].replace(/^ /, '');
        cookies[decodeURIComponent(currentCookie[0])] = decodeURIComponent(currentCookie[1]);
      }
    }
    return cookies;
  };
  DefaultCookieService.prototype.set = function (name, value, expires, path, domain, secure) {
    if (!this.documentIsAccessible) {
      return;
    }
    var cookieString = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';';
    if (expires) {
      if (typeof expires === 'number') {
        var dateExpires = new Date(new Date().getTime() + expires * 1000 * 60 * 60 * 24);
        cookieString += 'expires=' + dateExpires.toUTCString() + ';';
      }
      else {
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
  };
  DefaultCookieService.prototype.delete = function (name, path, domain) {
    if (!this.documentIsAccessible) {
      return;
    }
    this.set(name, '', -1, path, domain);
  };
  DefaultCookieService.prototype.deleteAll = function (path, domain) {
    if (!this.documentIsAccessible) {
      return;
    }
    var cookies = this.getAll();
    for (var cookieName in cookies) {
      if (cookies.hasOwnProperty(cookieName)) {
        this.delete(cookieName, path, domain);
      }
    }
  };
  DefaultCookieService.prototype.getCookieRegExp = function (name) {
    var escapedName = name.replace(/([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/ig, '\\$1');
    return new RegExp('(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)', 'g');
  };
  return DefaultCookieService;
}());
exports.DefaultCookieService = DefaultCookieService;
