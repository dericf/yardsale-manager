import React, { Fragment, useState, useEffect, useRef } from 'react'

import {
    Divider,
    Grid,
    Header,
} from "semantic-ui-react";

import { NAVBAR_HEIGHT } from '../../constants'

const Title = ({ title }) => {
    return (
        <Grid.Column verticalAlign="middle" style={{ padding: "0 0 0 0" }}>
            <Header
                as="h1"
                textAlign="center"
                content={title}
                style={{ marginBottom: 0 }}
            />
            <Divider style={{ marginBottom: 0, marginTop: 0 }} />
        </Grid.Column>
    )
}

export default Title