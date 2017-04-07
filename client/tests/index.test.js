import React from 'react';
import App from '../components/App';
import renderer from 'react-test-renderer';

it('renders App component to DOM', () => {
  const app = renderer.create(<App />
  ).toJSON();
  expect(app).toMatchSnapshot();
});
