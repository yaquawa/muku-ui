export function hasClosestElement(element: Element, closestElement: Element): boolean {
  if (element === closestElement) {
    return true;
  }

  let parent = element.parentElement;

  while (parent) {
    if (parent === closestElement) {
      return true;
    }
    parent = parent.parentElement;
  }

  return false;
}
