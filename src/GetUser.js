import React, { Fragment, useEffect } from 'react'
import { GET_USER } from './graphql/queries'
import { useQuery } from '@apollo/react-hooks';

import { AuthContext } from './App'

const GetUserComp = () => {
    const { auth, setAuth } = React.useContext(AuthContext)

    const { loading, error, data } = useQuery(GET_USER, {
        onError: () => console.log('ERROR WITH QUERY'),

        onCompleted: (data) => {
            if (data == null || typeof data == 'undefined') {
                return false
            }
            console.log('USER FROM QUERY: ', data["user"][0])
            // setFetchUser(false)
            // client.writeData({ user: data["user"][0] })
            return true
        }
    })

    useEffect(() => {
        if (!loading && data && data["user"]) {
            // setAuth({ ...auth, user: data["user"][0] })
        }
    }, [loading, data, auth])
    return (
        <Fragment></Fragment>
    )
}

export default GetUserComp