window.mfjCallApi = function(action, payload, timeoutMs){
  const callbackName = "mfjApiCb_" + Date.now() + "_" + Math.floor(Math.random()*1000);
  const timeout = Number(timeoutMs || 10000);
  const safePayload = payload || {};

  return new Promise((resolve, reject) => {
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
      ...safePayload
    });

    script.src = window.MFJ_SCRIPT_URL + "?" + params.toString();
    document.body.appendChild(script);
  });
};
