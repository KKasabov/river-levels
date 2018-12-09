export default function(values) {
  const errors = {};
  if (!values["email"] && !values["phone"]) {
    errors["email"] = "Email or phone number is required!";
    errors["phone"] = "Email or phone number is required!";
  }
  if (
    values.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = "Invalid email address";
  }
  if (values.phone && !/^[0-9]{2,25}$/i.test(values.phone)) {
    errors.phone = "Invalid phone number";
  }
  return errors;
}
