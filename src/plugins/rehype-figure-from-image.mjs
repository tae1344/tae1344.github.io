function isSingleImageParagraph(node) {
  if (!node || node.type !== 'element' || node.tagName !== 'p') return false;
  if (!Array.isArray(node.children) || node.children.length !== 1) return false;
  const onlyChild = node.children[0];
  return onlyChild?.type === 'element' && onlyChild?.tagName === 'img';
}

function transformNode(node) {
  if (!node || !Array.isArray(node.children)) return;

  for (let i = 0; i < node.children.length; i += 1) {
    const child = node.children[i];

    if (isSingleImageParagraph(child)) {
      const img = child.children[0];
      const alt = typeof img?.properties?.alt === 'string' ? img.properties.alt.trim() : '';

      const figure = {
        type: 'element',
        tagName: 'figure',
        properties: {},
        children: alt
          ? [
              img,
              {
                type: 'element',
                tagName: 'figcaption',
                properties: {},
                children: [{ type: 'text', value: alt }],
              },
            ]
          : [img],
      };

      node.children[i] = figure;
      continue;
    }

    transformNode(child);
  }
}

export default function rehypeFigureFromImage() {
  return (tree) => {
    transformNode(tree);
  };
}
