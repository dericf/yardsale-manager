import gql from 'graphql-tag'
/* 
  SELLERS 
*/

// 
// Insert Seller
// 
export const CREATE_SELLER = gql`
mutation CreateSeller($email: String, $initials: String, $name: String, $phone: String, $address: String, $company: String, $notes: String) {
    insert_seller(objects: {email: $email, initials: $initials, name: $name, address_text: $address, company: $company, notes: $notes, phone: $phone}) {
      returning {
        uuid
        user_uuid
        name
        is_active
        email
        created_at
        is_user_link
      }
    }
}`
//
// Update Seller
//
export const UPDATE_SELLER = gql`
mutation updateSeller($sellerUUID: uuid!, $phone: String, $initials: String, $notes: String, $name: String, $email: String, $company: String, $address: String) {
  update_seller(where: {uuid: {_eq: $sellerUUID}}, _set: {updated_at: "NOW()", initials: $initials, phone: $phone, notes: $notes, name: $name, email: $email, company: $company, address_text: $address}) {
    returning {
      uuid
      updated_at
    }
  }
}
`

//
// Delete Seller
//
export const DELETE_SELLER = gql`
mutation updateSeller($sellerUUID: uuid!) {
  update_seller(where: {uuid: {_eq: $sellerUUID}}, _set: {is_deleted: true}) {
    returning {
      uuid
      updated_at
    }
  }
}`

/* 
  YARDSALES 
*/

// 
// Insert Yardsale
// 
export const CREATE_YARDSALE = gql`
mutation CreateYardsale($email: String, $name: String, $phone: String, $address: String, $notes: String) {
    insert_yardsale(objects: {email: $email, name: $name, address_text: $address, notes: $notes, phone: $phone}) {
      returning {
        uuid
        name
      }
    }
}`
//
// Update Yardsale
//
export const UPDATE_YARDSALE = gql`
mutation updateYardsale($yardsaleUUID: uuid!, $phone: String, $notes: String, $name: String, $email: String $address: String) {
  update_seller(where: {uuid: {_eq: $yardsaleUUID}}, _set: {updated_at: "NOW()", phone: $phone, notes: $notes, name: $name, email: $email, address_text: $address}) {
    returning {
      uuid
      name
    }
  }
}
`

//
// Delete Yardsale
//
export const DELETE_YARDSALE = gql`
mutation updateYardsale($yardsaleUUID: uuid!) {
  delete_yardsale(where: {uuid: {_eq: $yardsaleUUID}}) {
    returning {
      uuid
    }
  }
}`



//
// Transaction Item
//
export const CREATE_TRANSACTION_ITEM = gql`
mutation CreateTransactionItem($sellerUUID: uuid, $description: String, $price: money, $yardsaleUUID: uuid!) {
  insert_transaction(objects: {description: $description, price: $price, seller_uuid: $sellerUUID, yardsale_uuid: $yardsaleUUID}) {
    returning {
      uuid
    }
  }
}`


//
// Create Yardsale Seller Link
//
export const CREATE_YARDSALE_SELLER_LINK = gql`
mutation CreateYardsaleSellerLink($sellerUUID: uuid!, $yardsaleUUID: uuid!) {
  insert_yardsale_seller_link(objects: {seller_uuid: $sellerUUID, yardsale_uuid: $yardsaleUUID}) {
    returning {
      uuid
    }
  }
}`


//
// Delete Yardsale Seller Link
//
export const DELETE_YARDSALE_SELLER_LINK = gql`
mutation DeleteYardsaleSellerLink($UUID: uuid!) {
  delete_yardsale_seller_link(where: {uuid: {_eq: $UUID}}) {
    returning {
      uuid
    }
  }
}
`

