import React, { Component, Fragment, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { Card, Icon, Divider, Grid, Header, Segment } from "semantic-ui-react";
import SellerActionCard from "../../SellerActionCard/SellerActionCard";

const SellerCard = ({ seller, ...props }) => {
  // TODO: (Future) make this more responsive. Add more than just two widths

  if (seller)
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
          <Grid centered>
            <Grid.Row verticalAlign="top" className="py16">
              <Grid.Column mobile={8} tablet={8} computer={10}>
                <Grid.Row>
                  <Grid.Column
                    mobile={8}
                    tablet={8}
                    computer={10}
                    verticalAlign="top"
                  >
                    <Card.Content>
                      <Card.Header as="h3" className="mb0">
                        {seller.name}{" "}
                        {seller.initials && <span>({seller.initials})</span>}
                      </Card.Header>
                      <Card.Meta
                        as="h6"
                        className={`m0 ${props.inverted ? "inverted" : ""}`}
                      >
                        {seller.company}
                      </Card.Meta>
                      {/* <Card.Header as="h5" className="m0"><strong>Status:</strong> {(seller.is_active === true) && (<Icon name="genderless" title="Active" className="active-icon" color="green"></Icon>)}{(seller.is_active === false) && (<Icon name="genderless" color="red" title="Inactive" className="deactivated-icon"></Icon>)}</Card.Header> */}
                    </Card.Content>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column computer={16} mobile={16}>
                    <Card.Content>
                      {seller.phone && (
                        <Card.Description>
                          <strong>Phone: </strong>
                          {seller.phone}
                        </Card.Description>
                      )}
                      {seller.email && (
                        <Card.Description>
                          <strong>Email: </strong>
                          {seller.email}
                        </Card.Description>
                      )}
                      {seller.notes && seller.notes.length > 1 && (
                        <Card.Description>
                          <strong>Notes: </strong>
                          {String(seller.notes)
                            .split("\n")
                            .map(line => (
                              <Fragment>
                                {line} <br />
                              </Fragment>
                            ))}
                        </Card.Description>
                      )}
                    </Card.Content>
                  </Grid.Column>
                </Grid.Row>
              </Grid.Column>

              <Grid.Column
                mobile={8}
                tablet={8}
                computer={6}
                textAlign="right"
                verticalAlign="middle"
              >
                <SellerActionCard seller={seller} />
              </Grid.Column>
            </Grid.Row>
            {seller.projects && seller.projects.length > 1 && (
              <Grid.Row>
                <Divider horizontal className=""></Divider>
                <Divider
                  content="Active Yardsales"
                  horizontal
                  className=""
                ></Divider>
              </Grid.Row>
            )}
          </Grid>
        </Segment>
      </Fragment>
    );
};

export default withRouter(SellerCard);
