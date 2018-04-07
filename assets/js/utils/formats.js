import moment from 'moment';


const filterDuplicates = (l, key) => (
  l.filter(
    (el, index, self) => self.findIndex(
      t => ((t[key] === el[key])),
    ) === index,
  )
);


const formatDate = date => (
  moment(date).format('MMM, D YYYY [at] h:mm:ss A')
);


export {
  filterDuplicates,
  formatDate,
};
