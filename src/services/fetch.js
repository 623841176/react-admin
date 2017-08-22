import xFetch from './xFetch';

export async function Get(url) {
  return xFetch(url);
}

export async function Post(url, data, noForm) {
  data = data || {};
  const formData = new FormData();
  if (noForm !== true) {
    for (const key in data) {
      formData.append(key, data[key]);
    }
  }
  return xFetch(url, {
    method: 'POST',
    body: noForm && JSON.stringify(data) || formData
  });
}
