import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class InfoDialog extends React.Component {
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Subscription Successful!</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You would receive information regarding flood warnings and alerts in your area!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default InfoDialog;
