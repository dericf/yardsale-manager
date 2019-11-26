import React, { Component, Fragment, useState, useEffect, useRef } from 'react'
import { Link, withRouter } from 'react-router-dom';

import {
    Button,
    Container,
    Divider,
    Grid,
    Header,
    Icon,
    Image,
    List,
    Menu,
    Responsive,
    Segment,
    Sidebar,
    Visibility,
    Card,
    Radio,
    Form,
    Input
} from 'semantic-ui-react'


const SellersFilterForm = ({ value, setValue, searchVal, setSearchVal, autofocus, ...props }) => {
    console.log('props for sellers filter forms', props)
    const [active, setActive] = useState(true)
    const [inactive, setInactive] = useState(false)
    const [all, setAll] = useState(false)

    const searchRef = useRef()

    useEffect(() => {
        if (autofocus) {
            searchRef.current.focus()
        }
    }, [])

    const handleChange = (e, { value }) => {
        console.log('changed')
        setValue(value)
    }

    const onChange = (e) => {
        // TODO: parametrize
        if (e.target.name == 'active') {
            setActive(true)
            setInactive(false)
            setAll(false)
        } else if (e.target.name == 'inactive') {
            setActive(false)
            setInactive(true)
            setAll(false)
        } else if (e.target.name == 'all') {
            setActive(false)
            setInactive(false)
            setAll(true)
        }
    }

    return (
        <Fragment>
            <Form>
                <Form.Group inline className="mb0" >
                    <Form.Field>
                        <Radio
                            label='Active'
                            name='active'
                            value='active'
                            checked={value === 'active'}
                            onChange={handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='Inactive'
                            name='inactive'
                            value='inactive'
                            checked={value === 'inactive'}
                            onChange={handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='All'
                            name='all'
                            value='all'
                            checked={value === 'all'}
                            onChange={handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            placeholder="search"
                            icon="search"
                            focus
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            ref={searchRef}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
        </Fragment>
    )
}

export default withRouter(SellersFilterForm)