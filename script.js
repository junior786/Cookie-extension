const past = document.querySelector(".past");
const save = document.querySelector(".save");
const cookieTxt = document.querySelector(".cookie");

copyCookie = () => {
  copyTextToClipboard(document.cookie);

  function copyTextToClipboard(text) {
    var copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand("copy");
    copyFrom.blur();
    document.body.removeChild(copyFrom);
  }
};

past.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: copyCookie,
  });
});

save.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: saveCookie,
    args: [cookieTxt.value]
  });
});


saveCookie = (value) => {
  clearAllCookies();
  const cookies = value.trim().split(';');

  for (let index = 0; index < cookies.length; index++) {
    const cookie = cookies[index].split("=");
      setCookie(cookie[0], cookie[1], 3);
  }
  function setCookie(name, value, daysToExpire) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + value + expires + "; path=/";
  }

  function clearAllCookies() {
    const cookies = document.cookie.split(";");
      const pastDate = new Date(0).toUTCString();
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=; expires=" + pastDate + "; path=/";
    }
  }
}

