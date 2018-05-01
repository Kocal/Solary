require('../src/background');

describe('background', function() {
  it('should add listener on chrome.runtime.onMessage', () => {
    expect(chrome.runtime.onMessage.addListener).toHaveBeenCalled();
  });
});
