import { fetchIndex } from '../../scripts/scripts.js';

const componentName = 'home-hero';

const CLASSES = {
  wrapper: `${componentName}-inner-container`,
  title: `${componentName}-title`,
  description: `${componentName}-description`,
  link: `${componentName}-link button`,
  image: `${componentName}-image`,
  overlay: `${componentName}-overlay`,
};

const fetchData = async (url) => {
  try {
    return await fetchIndex(url);
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const formatData = (data) => data.reduce((acc, { key, value }) => {
  acc[key] = value;
  return acc;
}, {});

const createMarkup = (data, picture) => {
  const textColor = data['text-color'] ? `style="color: ${data['text-color']}"` : '';
  const overlay = data.overlay ? `<div class="${CLASSES.overlay} ${CLASSES.overlay}-${data['content-position']}"></div>` : '';
  const title = data['title-text'] ? `<h1 class="${CLASSES.title} ${data['title-class']}" ${textColor}>
    ${data['title-text']}
  </h1>` : '';
  const description = data['description-text'] ? `<p class="${CLASSES.description} ${data['description-class']}" ${textColor}>
    ${data['description-text']}
  </p>` : '';
  const cta = data['cta-text'] ? `<div>
    <a href="${data['cta-link']}" class="${CLASSES.link} ${data['cta-class']}">
      ${data['cta-text']}
    </a>
  </div>` : '';
  picture.classList.add(CLASSES.image, data['image-class']);
  const elPicture = picture.outerHTML || '';

  return (`
    <div class="${CLASSES.wrapper} ${CLASSES.wrapper}-${data['content-position']} ${data['wrapper-class']}">
      ${overlay}
      ${elPicture}
      ${title}
      ${description}
      ${cta}
    </div>`
  );
};

const updateDOM = (block, markup) => {
  const sectionEl = document.createElement('section');
  sectionEl.innerHTML = markup;
  block.replaceChildren(sectionEl);
};

export default async function decorate(block) {
  const picture = block.querySelector('picture');
  const index = await fetchData('merkle/home/home-hero');

  if (!index || !index.data.length) {
    console.error('No data available');
    return;
  }

  const formattedData = formatData(index.data);
  const markup = createMarkup(formattedData, picture);
  updateDOM(block, markup);
}
