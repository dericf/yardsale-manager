import React, { Component, Fragment, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { Card, Icon, Divider, Grid, Header, Segment } from "semantic-ui-react";

import SellerCard from "../SellerCard/SellerCard";

import YardsaleActionCard from "../../YardsaleActionCard/YardsaleActionCard";

const YardsaleCard = ({ yardsale, handleClick, setCashierActive, ...props }) => {
  // TODO: (Future) make this more responsive. Add more than just two widths
  const [expandSellers, setExpandSellers] = useState(false);
  if (yardsale)
    return (
      <Fragment>
        <Segment
          textAlign="left"
          fluid
          compact
          style={{ border: "0px !important", width: "100%" }}
          className={`yardsale-card yardsale-list-segment ${
            props.inverted ? "inverted" : ""
          } rounded`}
        >
          <Grid>
            <Grid.Row>
              <Grid.Column mobile={8} tablet={8} computer={10} onClick={(e) => handleClick(yardsale)}>
                <Grid.Row verticalAlign="top" className="pb0">
                  <Grid.Column computer={6} mobile={16} verticalAlign="top" >
          
                    <Card.Content>
                      <Card.Header as="h3" className="mb0">
                        {yardsale.name}
                      </Card.Header>
                      <Card.Meta
                        as="h6"
                        className={`m0 ${props.inverted ? "inverted" : ""}`}
                      >
                        {yardsale.company}
                      </Card.Meta>
                      {/* <Card.Header as="h5" className="m0"><strong>Status:</strong> {(yardsale.is_active === true) && (<Icon name="genderless" title="Active" className="active-icon" color="green"></Icon>)}{(yardsale.is_active === false) && (<Icon name="genderless" color="red" title="Inactive" className="deactivated-icon"></Icon>)}</Card.Header> */}
                    </Card.Content>
                  </Grid.Column>
                </Grid.Row>

                {(yardsale.notes.length > 0 ||
                  yardsale.address_text.length > 0) && (
                  <Divider className="my0 m0" fitted></Divider>
                )}
                <Grid.Row className="py0">
                  <Grid.Column computer={10} mobile={16}>
                    <Card.Content>
                      {yardsale.address_text &&
                        yardsale.address_text.length > 1 && (
                          <Card.Description>
                            {String(yardsale.address_text)
                              .split("\n")
                              .map((line, index) => (
                                <Fragment key={`line1${index}`}>
                                  {line} <br />
                                </Fragment>
                              ))}
                          </Card.Description>
                        )}
                    </Card.Content>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row className="pt0">
                  <Grid.Column computer={10} mobile={16}>
                    <Card.Content>
                      {yardsale.notes && yardsale.notes.length > 1 && (
                        <Card.Description>
                          <strong>Notes: </strong>
                          {String(yardsale.notes)
                            .split("\n")
                            .map((line, index) => (
                              <Fragment key={`line2${index}`}>
                                {line} <br />
                              </Fragment>
                            ))}
                        </Card.Description>
                      )}
                    </Card.Content>
                  </Grid.Column>
                </Grid.Row>
              </Grid.Column>
              <Grid.Column mobile={8} tablet={8} computer={6} textAlign="right" verticalAlign="middle">
                <YardsaleActionCard yardsale={yardsale} setCashierActive={setCashierActive} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          </Segment>
      </Fragment>
    );
};

export default withRouter(YardsaleCard);
