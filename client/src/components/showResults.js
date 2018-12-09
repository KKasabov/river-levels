
export default (async function showResults(values) {
  //TODO send real values from the form and add Lat and Long
  fetch("/api/subscribe/", {
  method: "POST",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    lat: 123,
    long: 141,
    name: "as",
    email: "123@mail.com",
    phone: 12312
  })
})
.then((response) => { });
});
