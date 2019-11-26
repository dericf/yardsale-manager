import React, { Component, Fragment, useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom';

import { Icon, Menu, ItemGroup, Modal, Responsive, Sidebar, Container, Image, Segment, Header, Divider } from 'semantic-ui-react'

const SidebarNav = ({ user, visible, setVisible, isAuthenticated }) => {
    // const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
    
    return (
        <Sidebar
            as={Menu}
            animation='overlay'
            inverted
            onHide={() => setVisible(false)}
            vertical
            visible={visible}
            width='thin'
            direction="left"
        >
            {/* Potentially add onClick={() => setVisible(false)} to make the sidebar autoclose when a link is clicked*/}
            <Menu.Header as="h2" className="mb0" content="Navigation" style={{ color: "#ffffff", padding: 16 }} />
            <Divider inverted className="m0"></Divider>
            { isAuthenticated && (
                <Fragment>
                    <Menu.Item as={Link} to="/" >
                        Home
                        </Menu.Item>
                    <Menu.Item as={Link} to="/yardsales">
                        Yardsales
                        </Menu.Item>
                    <Menu.Item as={Link} to="/sellers">
                        Sellers
                        </Menu.Item>


                    {/* <SettingsModal></SettingsModal> */}
                    
                    <Menu.Item to="logout" className="ml0"  position="right" key="logout" index="logout" className="vertical" style={{marginLeft: "0 !important"}} >
                        { user && (
                            <div onClick={() => alert('Log user out here')}><Icon name="power off" ></Icon> {`Logout (${user.username})`}</div>
                        )}
                    </Menu.Item>
                </Fragment>
                )
            }
        </Sidebar>
    )
}

export default withRouter(SidebarNav)