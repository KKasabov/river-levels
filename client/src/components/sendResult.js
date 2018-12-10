

export default (async function sendResult(values) {
  fetch("/api/subscribe/", {
  method: "POST",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(values)
})
.then((response) => { });
});
