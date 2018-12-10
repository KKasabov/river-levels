import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import validate from "./validate";
import PropTypes from 'prop-types';
import TextField from "material-ui/TextField";
import MenuItem from "material-ui/MenuItem";
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const renderTextField = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <TextField
    hintText={label == "Phone" ? "e.g. 447111222333" : label}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}
  />
);

const MaterialUiForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props;
  return (
    <Card>
      <CardContent>
        <h1>Warning & Alerts</h1>
        <h2>For Lat: {parseFloat(props.location[0].toFixed(3))} & Long: {parseFloat(props.location[1].toFixed(3))} </h2>
        <form>
          <div>
            <Field name="name" component={renderTextField} label="Name" />
          </div>
          <div>
            <Field name="email" component={renderTextField} label="Email" />
          </div>
          <div>
            <Field name="phone" component={renderTextField} label="Phone" />
          </div>
        </form>
      </CardContent>
      <CardActions>
        <div>
          <Button variant="contained" color="primary" type="button" disabled={pristine || submitting} onClick={handleSubmit}>
            Submit
         </Button>
        </div>
      </CardActions>
    </Card>
  );
};

const mapStateToProps = state => {
  return {
    location: state.getMapInputReducer.location,
    floodAlertAreasItems: state.getMapInputReducer.floodAlertAreasItems,
    floodAlertAreas: state.getMapInputReducer.floodAlertAreas,
    currentAlertAreasItems: state.getMapInputReducer.currentAlertAreasItems,
    currentAlertAreas: state.getMapInputReducer.currentAlertAreas
  };
};

export default connect(mapStateToProps)(reduxForm({
  form: "MaterialUiForm",
  validate,
})(MaterialUiForm));
