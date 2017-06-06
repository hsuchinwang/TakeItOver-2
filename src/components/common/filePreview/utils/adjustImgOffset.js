const factor = 1.4;
export function adjustOffsetToCenter(imgSize, _windowSize = {}) {
  const windowWidth = (_windowSize.width) ? (_windowSize.width): window.innerWidth;
  const windowHeight = (_windowSize.height) ? (_windowSize.height): window.innerHeight;
  let top = (windowHeight - imgSize.height) / 2;
  let left = (windowWidth - imgSize.width) / 2;
  top = parseFloat(top.toFixed(1));
  left = parseFloat(left.toFixed(1));
  return {
    'top': top,
    'left': left
  };
}
export function adjustOffset(options, _cursor = {}, _windowSize = {}) {
  const { delta, imgSize, offset } = options;
  const windowSize = {
    'height': (_windowSize.height) ? (_windowSize.height): window.innerHeight,
    'width': (_windowSize.width) ? (_windowSize.width): window.innerWidth
  };
  const edge = {
    'top': (windowSize.height - imgSize.height),
    'left': (windowSize.width - imgSize.width)
  };
  const cursor = {
    'x':(_cursor.x) ? _cursor.x : (windowSize.width / 2),
    'y':(_cursor.y) ? _cursor.y : (windowSize.height / 2)
  };
  const newOffset = adjustOffsetToCenter(imgSize, windowSize);
  let newTopOffset = (-1) * (Math.pow(factor, delta) * (Math.abs(offset.top) + cursor.y) - cursor.y);
  let newLeftOffset = (-1) * (Math.pow(factor, delta) * (Math.abs(offset.left) + cursor.x) - cursor.x);
  if (!(edge.top < 0 && edge.top <= newTopOffset && newTopOffset <= 0)) {
    if (edge.top >= 0) {
      newTopOffset = newOffset.top;
    } else {
      if (newTopOffset > 0) {
        newTopOffset = 0;
      } else if (newTopOffset < edge.top) {
        newTopOffset = edge.top;
      }
    }
  }

  if (!(edge.left < 0 && edge.left <= newLeftOffset && newLeftOffset <= 0)) {
    if (edge.left >= 0) {
      newLeftOffset = newOffset.left;
    } else {
      if (newLeftOffset > 0) {
        newLeftOffset = 0;
      } else if (newLeftOffset < edge.left) {
        newLeftOffset = edge.left;
      }
    }
  }

  newTopOffset = parseFloat(newTopOffset.toFixed(1));
  newLeftOffset = parseFloat(newLeftOffset.toFixed(1));

  return {
    'top': newTopOffset,
    'left': newLeftOffset
  };
}
