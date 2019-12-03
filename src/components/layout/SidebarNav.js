import React, { Component, Fragment, useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom';

import { Icon, Menu, ItemGroup, Modal, Responsive, Sidebar, Container, Image, Segment, Header, Divider } from 'semantic-ui-react'
import LoginModal from '../../components/modals/LoginModal/LoginModal'

import { AuthContext } from '../../App'

const SidebarNav = ({ user, visible, setVisible, isAuthenticated }) => {
    const { auth, setAuth } = React.useContext(AuthContext)

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
            {auth.isAuthenticated && (
                <Fragment>
                    <Menu.Item as={Link} to="/" >
                        Market
                        </Menu.Item>
                    <Menu.Item as={Link} to="/yardsales">
                        Yardsales
                        </Menu.Item>
                    <Menu.Item as={Link} to="/sellers">
                        Sellers
                        </Menu.Item>


                    {/* <SettingsModal></SettingsModal> */}

                    <Menu.Item
                        position="left"
                        as={Link}
                        onClick={() => auth.logout(auth, setAuth)}
                        content=" Logout"
                        icon={<Icon name="power off" style={{ marginLeft: 0 }} />}
                        key="logout"
                        index={101}

                    >

                    </Menu.Item>

                </Fragment>
            )}
            {!auth.isAuthenticated && (
                <Menu.Item position="right" key="login" index={100} className="ml0" style={{ marginLeft: 0 }} >
                    <LoginModal />
                </Menu.Item>
            )}
        </Sidebar>
    )
}

export default withRouter(SidebarNav)