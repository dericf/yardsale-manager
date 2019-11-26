import { gql } from "apollo-boost";

// 
// YARDSALES
// 
export const CREATE_YARDSALE = gql`
  mutation insert_yardsales($name: String!) {
  insert_yardsales(objects: {address_id: 1, name: $name}) {
    returning {
      address {
        city
        country
        postal
        province
        street1
        street2
      }
      user_id
      name
    }
  }
}
`

export const UPDATE_YARDSALE = gql`
mutation update_yardsale($userID: String!, $changes: yardsales_set_input) {
  update_yardsales(where: {yardsale_id: {_eq: 38}, _and: {user_id: {_eq: $userID}}}, _set: $changes) {
    returning {
      yardsale_id
      user_id
      address_id
      name
      days_of_week
      end_date
      end_time
      start_date
      start_time
    }
  }
}
`

export const GET_YARDSALES_FOR_USER = gql`
query yardsales($userID: String) {
  yardsales( where: {user_id: {_eq: $userID}}) {
    yardsale_id
    days_of_week
    end_date
    end_time
    start_date
    start_time
    user_id
    name
    address {
        city
        country
        postal
        province
        street1
        street2
      }
  }
} 
`

// 
// USERS
//


//
// ADDRESSES
//
export const GET_ADDRESSES = gql`
query addresses($userID: String) {
  yardsales( where: {user_id: {_eq: $userID}}) {
    address {
        city
        country
        postal
        province
        street1
        street2
        user_id
      }
  }
} 
`