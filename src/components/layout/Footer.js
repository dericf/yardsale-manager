import React, { Component } from 'react'

import { NAVBAR_HEIGHT, FOOTER_HEIGHT } from '../../constants'

import {
    Container,
    Divider,
    Button,
    Dropdown,
    Grid,
    Header,
    Image,
    List,
    Menu,
    Segment,
    Card,
    Icon
  } from "semantic-ui-react";

export default function NavBar(props) {

    return (
        <Segment inverted id="Footer"  vertical fluid style={{height: `${FOOTER_HEIGHT}px`}} >
            <Container fluid textAlign="center">
                <Header content="Copyright &copy; 2019 | MEQ Software" style={{color: "#ffffff"}}/>
            </Container>
        </Segment>
    )
}