const handleFilter = (data, filter) =>
  data.filter(({ gender }) => gender === filter);

const sumHeight = (data) =>
  data.reduce((acc, curr) => acc + parseFloat(curr.height), 0);

const handleSort = (data, sortOrder, sortBy) =>
  data.sort((a, b) => {
    const order = sortOrder === 'ascending' ? 1 : -1;

    const c = typeof a[sortBy] === 'string' ? a[sortBy].toLowerCase() : a;
    const d = typeof b[sortBy] === 'string' ? b[sortBy].toLowerCase() : b;

    if (c < d) {
      return -1 * order;
    }
    if (c > d) {
      return 1 * order;
    }
    return 0;
  });

const convertHeightToFeet = (height) => {
  const realFeet = (height * 0.3937) / 12;
  const feet = Math.floor(realFeet);
  const inches = Math.round((realFeet - feet) * 12);
  return `${feet}ft and ${inches}inches`;
};

module.exports = {
  sumHeight,
  handleSort,
  handleFilter,
  convertHeightToFeet
};
