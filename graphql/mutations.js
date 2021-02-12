/*
  USER
*/
//
// Update User Onbording complete
//
export const UPDATE_USER_ONBOARDING = `
  mutation setOnboardingComplete (
    $UUID: uuid!
  ) {
    update_user(
      where: { uuid: { _eq: $UUID } }
      _set: {
        has_completed_onboarding: true
      }
    ) {
      returning {
        uuid
        has_completed_onboarding
      }
    }
  }
`;


/* 
  SELLERS 
*/

//
// Insert Seller
//
export const CREATE_SELLER = `
  mutation CreateSeller(
    $email: String
    $initials: String
    $name: String
    $phone: String
    $address: String
    $company: String
    $notes: String
  ) {
    insert_seller(
      objects: {
        email: $email
        initials: $initials
        name: $name
        address_text: $address
        company: $company
        notes: $notes
        phone: $phone
      }
    ) {
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
  }
`;
//
// Update Seller
//
export const UPDATE_SELLER = `
  mutation updateSeller(
    $sellerUUID: uuid!
    $phone: String
    $initials: String
    $notes: String
    $name: String
    $email: String
    $company: String
    $address: String
  ) {
    update_seller(
      where: { uuid: { _eq: $sellerUUID } }
      _set: {
        updated_at: "NOW()"
        initials: $initials
        phone: $phone
        notes: $notes
        name: $name
        email: $email
        company: $company
        address_text: $address
      }
    ) {
      returning {
        uuid
        updated_at
      }
    }
  }
`;

//
// Delete Seller
//
export const DELETE_SELLER = `
  mutation updateSeller($sellerUUID: uuid!) {
    update_seller(
      where: { uuid: { _eq: $sellerUUID } }
      _set: { is_deleted: true, is_active: false }
    ) {
      returning {
        uuid
        updated_at
      }
    }
  }
`;

/* 
  YARDSALES 
*/

//
// Insert Yardsale
//
export const CREATE_YARDSALE = `
  mutation CreateYardsale(
    $email: String
    $name: String
    $phone: String
    $address_text: String
    $notes: String
    $company: String
  ) {
    insert_yardsale(
      objects: {
        email: $email
        name: $name
        address_text: $address_text
        notes: $notes
        phone: $phone
        company: $company
      }
    ) {
      returning {
        uuid
        name
      }
    }
  }
`;

/**
 * Here's an example of inserting an address object within a yardsale insert.
 * mutation MyMutation {
  insert_yardsale_one(object: {address: {data: {city: "Edmonton", country: "Canada"}}, name: "Fall 2021"}) {
    address_id
    address_text
    company
    days_of_week
    email
    end_date
    end_time
    hours_close
    hours_open
    is_public
    notes
    phone
    pos_lat
    pos_lng
    start_date
    start_time
  }
}

 */

//
// Update Yardsale
//
export const UPDATE_YARDSALE = `
  mutation updateYardsale(
    $yardsaleUUID: uuid!
    $phone: String
    $notes: String
    $name: String
    $email: String
    $address_text: String
    $company: String
    $is_public: Boolean
    $pos_lat: float8
    $pos_lng: float8
  ) {
    update_yardsale(
      where: { uuid: { _eq: $yardsaleUUID } }
      _set: {
        phone: $phone
        notes: $notes
        name: $name
        email: $email
        address_text: $address_text
        company: $company,
        is_public: $is_public
        pos_lat: $pos_lat
        pos_lng: $pos_lng
      }
    ) {
      returning {
        uuid
        name
      }
    }
  }
`;

//
// Delete Yardsale
//
export const DELETE_YARDSALE = `
  mutation deleteYardsale($yardsaleUUID: uuid!) {
    delete_yardsale(where: { uuid: { _eq: $yardsaleUUID } }) {
      returning {
        uuid
      }
    }
  }
`;

//
// Transaction Item
//
export const CREATE_TRANSACTION_ITEM = `
  mutation CreateTransactionItem(
    $sellerUUID: uuid
    $description: String
    $price: money
    $yardsaleUUID: uuid!
  ) {
    insert_transaction(
      objects: {
        description: $description
        price: $price
        seller_uuid: $sellerUUID
        yardsale_uuid: $yardsaleUUID
      }
    ) {
      returning {
        uuid
      }
    }
  }
`;

//
// Create Yardsale Seller Link
//
export const CREATE_YARDSALE_SELLER_LINK = `
  mutation CreateYardsaleSellerLink($sellerUUID: uuid!, $yardsaleUUID: uuid!) {
    insert_yardsale_seller_link(
      objects: { seller_uuid: $sellerUUID, yardsale_uuid: $yardsaleUUID }
    ) {
      returning {
        uuid
      }
    }
  }
`;

//
// Delete Yardsale Seller Link
//
export const DELETE_YARDSALE_SELLER_LINK = `
  mutation DeleteYardsaleSellerLink($UUID: uuid!) {
    delete_yardsale_seller_link(where: { uuid: { _eq: $UUID } }) {
      returning {
        uuid
      }
    }
  }
`;

/**
 * TRANSACTIONS
 */

 export const DELETE_TRANSACTION_BY_UUID = `
 mutation MyMutation($id: uuid!) {
    delete_transaction_by_pk(uuid: $id) {
      description
    }
  }
`