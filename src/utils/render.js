export const createElement = (template) => {
  const parent = document.createElement(`div`);
  parent.innerHTML = template.trim();
  return parent.firstChild;
};

export const render = (container, component, place = `beforeend`) => {
  const element = component.getElement();
  container.insertAdjacentElement(place, element);
};

export const replace = (newComponent, oldComponent) => {
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();
  const parentElement = oldComponent.getElement().parentElement;

  const isExistElements = !!(parentElement && newElement && oldElement);
  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};
