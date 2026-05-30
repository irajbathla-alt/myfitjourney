window.mfjCallApi = function(action, payload, timeoutMs){
  const timeout = Number(timeoutMs || 10000);
  const safePayload = payload || {};
  const baseUrls = Array.isArray(window.MFJ_SCRIPT_URLS) && window.MFJ_SCRIPT_URLS.length
    ? window.MFJ_SCRIPT_URLS
    : [window.MFJ_SCRIPT_URL];

  const callViaJsonp = (baseUrl) => new Promise((resolve, reject) => {
    const callbackName = "mfjApiCb_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    const script = document.createElement("script");
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("Member API timeout."));
    }, timeout);

    const cleanup = () => {
      window.clearTimeout(timer);
      if (window[callbackName]) delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    window[callbackName] = (data) => {
      cleanup();
      if (!data) {
        reject(new Error("Invalid API response."));
        return;
      }
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Member API could not be reached."));
    };

    const params = new URLSearchParams({
      action: action,
      secret: window.MFJ_SECRET,
      callback: callbackName,
      _ts: String(Date.now()),
      _r: String(Math.random()),
      ...safePayload
    });

    script.src = baseUrl + "?" + params.toString();
    document.body.appendChild(script);
  });

  const attempts = [];
  baseUrls.forEach((url) => {
    attempts.push(() => callViaJsonp(url));
    attempts.push(() => callViaJsonp(url));
  });

  return attempts.reduce((chain, attemptFn) => chain.catch(() => attemptFn()), Promise.reject());
};