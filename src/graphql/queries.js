import gql from 'graphql-tag'

// 
// GET ONE USER
// by email
export const GET_USER = gql`
query GetUser {
    user {
      uuid
      id
      created_at
      updated_at
      email
      confirmation_key
      has_confirmed
      first_name
      last_name
      role
    }
}
  
`
// 
// GET ALL SELLERS
// (permission: for the current user)
export const GET_SELLERS = gql`
query GetSellers {
    seller(where: {is_deleted: {_eq: false}}, order_by: {name: asc}) {
        address_text
        email
        initials
        name
        notes
        phone
        is_active
        created_at
        updated_at
        user_uuid
        uuid
        company
        is_user_link
    }
}`

// 
// GET ONE SELLER
// by id
export const GET_SELLER_BY_UUID = gql`
query GetSeller($uuid: uuid!) {
    seller(where: {uuid: {_eq: $uuid}}) {
        address_text
        email
        initials
        name
        notes
        phone
        is_active
        created_at
        updated_at
        user_uuid
        uuid
        company
        is_user_link
    }
}
`
// 
// GET ALL YARDSALES
// (permission: for the current user)
export const GET_YARDSALES = gql`
query GetYardsales {
    yardsale {
      address_text
      days_of_week
      end_date
      end_time
      start_date
      start_time
      user_uuid
      uuid
      name
      yardsale_seller_links {
        seller {
          name
          email
          is_active
          uuid
          phone
          notes
          initials
          company
          address_text
        }
      }
    }
}
`
// 
// GET ONE YARDSALE
// by id
export const GET_YARDSALE = gql`
query GetYardsale($yardsaleUUID: uuid) {
    yardsale(where: {uuid: {_eq: $yardsaleUUID}}) {
      address_text
      days_of_week
      end_date
      end_time
      start_date
      start_time
      user_uuid
      uuid
      name
      yardsale_seller_links {
        seller {
          name
          email
          is_active
          uuid
          phone
          notes
          initials
          company
          address_text
        }
      }
    }
}
`


//
// GET ALL SALE ITEMS
// by seller.id

// 
// GET ALL SALE ITEMS
// by yardsale.id

// 
// GET SALE ITEM
// by id
