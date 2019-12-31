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
    Input,
    ButtonGroup
} from 'semantic-ui-react'


const SellersFilterForm = ({ filter, setFilter, myLocation, setMyLocation, loadingMyLocation, setLoadingMyLocation, autofocus, ...props }) => {
    // console.log('props for sellers filter forms', props)
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
        // console.log('changed')
        setFilter({ ...filter, status: value })
    }

    const handleSearchInput = (e) => {
        //  console.log('filter.searchText', e.target.value, filter.searchText);
        setFilter({ ...filter, searchText: e.target.value })
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

    const enableMyLocation = () => {
        setLoadingMyLocation(true)
        setMyLocation(true)
        localStorage.setItem('useMyLocation', true)
    }

    const disableMyLocation = () => {
        setLoadingMyLocation(true)
        setMyLocation(false)
        localStorage.setItem('useMyLocation', false)
    }

    return (
        <Container>
            <Form>
                <Form.Group inline className="mb0" >
                    {/* <Form.Field>
                        <Radio
                            label='Active'
                            name='active'
                            value='active'
                            checked={filter.status === 'active'}
                            onChange={handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='Inactive'
                            name='inactive'
                            value='inactive'
                            checked={filter.status === 'inactive'}
                            onChange={handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='All'
                            name='all'
                            value='all'
                            checked={filter.status === 'all'}
                            onChange={handleChange}
                        />
                    </Form.Field> */}
                    <Form.Field>
                        <Input
                            placeholder="Search Address, City"
                            icon="search"
                            focus
                            value={filter.searchText}
                            onChange={handleSearchInput}
                            ref={searchRef}
                            
                        />
                    </Form.Field>

                    <Form.Field>
                        <ButtonGroup>
                            <Button
                                content={ myLocation === true ? "Location Enabled" : "Use my Location"}
                                icon="location arrow"
                                labelPosition="right"
                                color={myLocation === true ? 'green' : 'grey'}
                                onClick={enableMyLocation}
                                loading={loadingMyLocation}
                            />
                            {myLocation === true && (
                                <Button
                                icon="close"
                                color='green'
                                title="Disable my Location"
                                onClick={disableMyLocation}
                                />
                            )}
                        </ButtonGroup>
                    </Form.Field>
                </Form.Group>
            </Form>
        </Container>
    )
}

export default withRouter(SellersFilterForm)