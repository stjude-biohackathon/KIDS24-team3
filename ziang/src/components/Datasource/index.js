//const datasourceUrl = "http://localhost:5050";
const datasourceUrl = "https://svlplsfexplorer.stjude.org/db";
export { datasourceUrl };

const fetchData = (api) => {
  var promise = new Promise((resolve, reject) => {
    fetch(`${datasourceUrl}/${api}`)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
  return promise;
};

export { fetchData };
