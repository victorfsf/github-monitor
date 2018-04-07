
const filterDuplicates = (l, key) => (
  l.filter(
    (el, index, self) => self.findIndex(
      t => ((t[key] === el[key])),
    ) === index,
  )
);


export default filterDuplicates;
