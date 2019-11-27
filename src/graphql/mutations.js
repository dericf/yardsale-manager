import gql from 'graphql-tag'

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