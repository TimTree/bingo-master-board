// Check Local Storage support
function testLocalStorage() {
  const doesItWork = 'test';
  try {
    localStorage.setItem(doesItWork, '1');
    localStorage.removeItem(doesItWork);
    return true;
  }
  catch (error) {
    return false;
  }
}

const supportsLocalStorage = testLocalStorage();
