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
    seller {
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

// 
// GET ALL YARDSALES
// (permission: for the current user)

// 
// GET ONE YARDSALE
// by id