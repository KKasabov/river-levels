

export default (async function sendResult(values) {
  fetch("/api/subscribe/", {
  method: "POST",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    lat: values.location[0],
    long: values.location[1],
    name: values.genValues.name,
    email: values.genValues.email,
    phone: values.genValues.phone
  })
})
.then((response) => { });
});
