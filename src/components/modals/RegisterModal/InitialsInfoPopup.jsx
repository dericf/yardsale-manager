import React, { Fragment, useState, useContext, useEffect } from "react";
import { Grid, Button, Icon } from "semantic-ui-react";

const InitialsInfoPopup = ({ ...props }) => {
  const [userAsSeller, setUserAsSeller] = useState(null);
  return (
    <Grid centered>
      <Grid.Row centered>
        <Grid.Column width={16}>
          <p className="text">
            Will this user be a Seller?
            {/* If the user you are creating now will be a seller, use this field as a unique identifier for this seller.  */}
            {/* <br />  */}
            {/* <br /> */}
            {/* Typically this is simply the initials of the seller but can be any unique value." */}
          </p>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={8}>
          <Button
            fluid
            className="cancel"
            onClick={() => setUserAsSeller(false)}
          >
            <Icon name="close" />
            No
          </Button>
        </Grid.Column>
        <Grid.Column width={8}>
          <Button fluid className="save" onClick={() => setUserAsSeller(true)}>
            <Icon name="check" />
            Yes
          </Button>
        </Grid.Column>
      </Grid.Row>

      {userAsSeller === false && (
        <Grid.Row>
          <Grid.Column textAlign="left">
            <p className="ui text">
              You can ignore this field since it is only used to refer to a
              seller
            </p>
          </Grid.Column>
        </Grid.Row>
      )}

      {userAsSeller === true && (
        <Grid.Row>
          <Grid.Column textAlign="left">
            <p className="ui text">
              This field is used as a unique ID for a seller. <br/> <br/> Typically it is a
              person's initials but it can be a number or any combination.
            </p>
          </Grid.Column>
        </Grid.Row>
      )}
    </Grid>
  );
};

export default InitialsInfoPopup;
