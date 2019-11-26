import gql from 'graphql-tag'

// 
// Insert Seller
// 
export const CREATE_SELLER = gql`
mutation CreateSeller($email: String, $initials: String, $name: String) {
    insert_seller(objects: {email: $email, initials: $initials, name: $name}) {
      returning {
        uuid
        user_uuid
        name
        is_active
        email
        created_at
      }
    }
}`