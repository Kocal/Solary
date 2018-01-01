const setTitle = (title: string): void => chrome.browserAction.setTitle({
  title,
});

const setBadgeText = (text: string): void => chrome.browserAction.setBadgeText({
  text,
});

const setBadgeColor = (color: string): void => chrome.browserAction.setBadgeBackgroundColor({
  color,
});

export {
  setBadgeColor,
  setBadgeText,
  setTitle,
};
