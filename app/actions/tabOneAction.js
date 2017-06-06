export function goSecond(data) {
  return {
    type: 'goSecond',
    payload: {
      tagList: data,
    },
  };
}
