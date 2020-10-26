import gql from "graphql-tag";
// 
// GET ALL YARDSALES
// (permission: for the current user)
export const SUBSCRIBE_YARDSALES = gql`
subscription GetYardsales {
    yardsale(order_by: {created_at: desc}) {
      uuid
      created_at
      updated_at
      address_text
      days_of_week
      end_date
      end_time
      start_date
      start_time
      user_uuid
      name
      company
      phone
      email
      address_text
      notes
      is_active
      pos_lng
      pos_lat
      is_public
      yardsale_seller_links {
        seller {
          name
          email
          is_active
          is_deleted
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