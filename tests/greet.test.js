const fs = require('fs');
const path = require('path');
const { getByText, getByPlaceholderText, getByLabelText } = require('@testing-library/dom');

describe('Greeting App', () => {
  let html;
  let app;
  beforeAll(() => {
    const p = path.join(__dirname, '..', 'index.html');
    html = fs.readFileSync(p, 'utf8');
    app = require('../src/app.js');
  });

  beforeEach(() => {
    document.documentElement.innerHTML = html;
    // attach module behavior
    if (app && app.init) app.init(document);
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    // reset any current animation
    if (app && app._private && app._private.clearCurrentAnimation) {
      app._private.clearCurrentAnimation();
    }
  });

  test('renders label and input placeholder', () => {
    const label = getByText(document.body, 'Enter Your Name');
    expect(label).toBeTruthy();
    const input = getByPlaceholderText(document.body, 'Type your name here');
    expect(input).toBeTruthy();
  });

  test('greet button shows Hello with name', () => {
    const name = 'Anusha';
    const input = getByPlaceholderText(document.body, 'Type your name here');
    const btn = getByText(document.body, 'Greet');
    input.value = name;
    btn.click();
    const greeting = document.getElementById('greeting');
    expect(greeting).toHaveTextContent(`Hello ${name}`);
  });

  test('triggers exactly one animation and clears previous on new click', () => {
    // force deterministic random: first choose confetti (index 0), then burst (index 2)
    const originalRandom = Math.random;
    let calls = 0;
    Math.random = () => {
      calls++;
      if (calls === 1) return 0.01; // index 0
      if (calls === 2) return 0.99; // index 2
      return 0.5;
    };

    const input = getByPlaceholderText(document.body, 'Type your name here');
    const btn = getByText(document.body, 'Greet');
    input.value = 'X';
    btn.click();
    const root = document.getElementById('animation-root');
    // after click, an animation element should be present
    expect(root.children.length).toBe(1);

    // trigger second click
    input.value = 'Y';
    btn.click();
    // previous should have been cleared and only 1 present
    expect(root.children.length).toBe(1);

    Math.random = originalRandom;
  });
});

