import { domUtils } from '@muku-ui/shared';

test('hasClosestElement', () => {
  const childElement = document.createElement('div');
  const parentElement = document.createElement('div');
  const ancestorElement = document.createElement('div');

  parentElement.appendChild(childElement);
  ancestorElement.appendChild(parentElement);

  expect(domUtils.hasClosestElement(childElement, childElement)).toEqual(true);
  expect(domUtils.hasClosestElement(childElement, parentElement)).toEqual(true);
  expect(domUtils.hasClosestElement(childElement, ancestorElement)).toEqual(true);

  expect(domUtils.hasClosestElement(parentElement, childElement)).toEqual(false);
  expect(domUtils.hasClosestElement(ancestorElement, childElement)).toEqual(false);
});
