import { Config } from '@muku-ui/shared'

interface Options {
  foo: string
  bar: number
}

let config: Config<Options>

beforeEach(() => {
  config = new Config<Options>({ foo: 'myFoo' }, { foo: 'defaultFoo', bar: 100 })
})

test('Get config', () => {
  expect(config.get('foo')).toEqual('myFoo')
  expect(config.get('bar')).toEqual(100)
  expect(config.get()).toEqual({ foo: 'myFoo', bar: 100 })
})

test('Set single config item', () => {
  config.set('foo', 'newFoo').set({ bar: 200 })

  expect(config.get('foo')).toEqual('newFoo')
  expect(config.get('bar')).toEqual(200)
})

test('Set multiple config item', () => {
  config.set({ foo: 'newFoo', bar: 300 })
  expect(config.get('foo')).toEqual('newFoo')
  expect(config.get('bar')).toEqual(300)
})
