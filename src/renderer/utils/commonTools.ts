export const getUrlParams = (
  url = window.location.href
): Record<string, string> => {
  const params: Record<string, string> = {};

  if (!url || typeof url !== 'string' || url.lastIndexOf('?') === -1)
    return params;

  const hashIndex = url.indexOf('#');
  let str = url;
  if (hashIndex > 0) {
    // 为兼容 hash history 模式
    str = url.slice(0, hashIndex);
    if (str.lastIndexOf('?') === -1) {
      str = url.slice(hashIndex, url.length);
    }
  }

  const search = str.slice(str.lastIndexOf('?') + 1);
  const arr = search.split('&');

  while (arr.length) {
    const value = arr.pop();
    if (value) {
      const [k, v] = value.split('=');
      if (k) {
        params[k] = v ? decodeURIComponent(v) : v;
      }
    }
  }
  return params;
};

export function toPercent(param: string | number) {
  const num = Number(param);
  if (Number.isNaN(num)) {
    return '-';
  }

  return `${Math.floor(num * 100)}%`;
}
