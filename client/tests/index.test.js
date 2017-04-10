import React from 'react'
import App from '../components/App'
import PostList from '../components/PostList'
import ListEntry from '../components/ListEntry'
import CurrentLocation from '../components/CurrentLocation'
import renderer from 'react-test-renderer'

it('renders App component to DOM', () => {
  const app = renderer.create(<App />
  ).toJSON()
  expect(app).toMatchSnapshot()
})

it('renders PostList component to DOM', () => {
  const app = renderer.create(<PostList />
  ).toJSON()
  expect(app).toMatchSnapshot()
})

it('renders ListEntry component to DOM', () => {
  const app = renderer.create(<ListEntry />
  ).toJSON()
  expect(app).toMatchSnapshot()
})

it('renders CurrentLocation component to DOM', () => {
  const app = renderer.create(<CurrentLocation />
  ).toJSON()
  expect(app).toMatchSnapshot()
})