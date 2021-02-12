// import  from "graphql-tag";

//
// GET ONE USER
// by email
export const GET_USER = `
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
      has_completed_onboarding
    }
  }
`;
//
// GET ALL SELLERS
// (permission: for the current user)
export const GET_SELLERS = (sortCol: string, sortDir: string) => `
  query GetSellers {
    seller(where: { is_deleted: { _eq: false } }, order_by: { ${sortCol}: ${sortDir} }) {
      address_text
      email
      initials
      name
      notes
      phone
      is_active
      is_deleted
      created_at
      updated_at
      user_uuid
      uuid
      company
      is_user_link
    }
  }
`;

//
// GET ALL SELLER LINKS FOR YARDSALE
//
export const GET_SELLER_LINKS_FOR_YARDSALE = `
  query GetSellerLinksForYardsale($yardsaleUUID: uuid!) {
    yardsale_seller_link(where: { yardsale_uuid: { _eq: $yardsaleUUID } }) {
      uuid
      yardsale_uuid
      seller {
        uuid
        name
        initials
        is_active
        is_deleted
        transactions(where: { yardsale_uuid: { _eq: $yardsaleUUID } }) {
          seller_uuid
          yardsale_uuid
          price
          description
        }
      }
    }
  }
`;

//
// GET ALL SELLER LINKS FOR SELLER
//
export const GET_SELLER_LINKS_FOR_SELLER = `
  query GetSellerLinksForYardsale($sellerUUID: uuid!) {
    yardsale_seller_link(where: { seller_uuid: { _eq: $sellerUUID } }) {
      uuid
      yardsale_uuid
      yardsale {
        uuid
        name
        transactions(where: { seller_uuid: { _eq: $sellerUUID } }) {
          seller_uuid
          yardsale_uuid
          price
          description
        }
      }
    }
  }
`;

//
// GET ONE SELLER
// by id
export const GET_SELLER_BY_UUID = `
  query GetSeller($uuid: uuid!) {
    seller(where: { uuid: { _eq: $uuid } }) {
      address_text
      email
      initials
      name
      notes
      phone
      is_active
      is_deleted
      created_at
      updated_at
      user_uuid
      uuid
      company
      is_user_link
    }
  }
`;
//
// GET ALL YARDSALES
// (permission: for the current user)
export const GET_YARDSALES = (sortCol, sortDir) => `
  query GetYardsales{
    yardsale(order_by: { ${sortCol}: ${sortDir} }) {
      uuid
      created_at
      updated_at
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
`;
//
// PREVIEW: GET ALL YARDSALES
// (permission: for the current user)
export const GET_YARDSALES_PREVIEW = `
  query GetYardsales {
    yardsale(order_by: { updated_at: desc }) {
      uuid
      updated_at
      address_text
      user_uuid
      name
      company
      phone
      email
      notes
      is_active
    }
  }
`;
//
// GET ONE YARDSALE
// by id
export const GET_YARDSALE = `
  query GetYardsale($yardsaleUUID: uuid) {
    yardsale(where: { uuid: { _eq: $yardsaleUUID } }) {
      address_text
      days_of_week
      end_date
      end_time
      start_date
      start_time
      user_uuid
      uuid
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
`;

//
// GET ALL SALE ITEMS
// by seller.id
export const GET_TRANSACTION_ITEM = `
  query GetTransactionItem($UUID: uuid!) {
    transaction(where: { _eq: { uuid: $UUID } }) {
      seller_uuid
      created_at
      description
      price
      uuid
      yardsale_uuid
      seller {
        name
        initials
        email
      }
      yardsale {
        name
        address_text
      }
    }
  }
`;
//
// GET ALL SALE ITEMS FOR YARDSALE
// by yardsale.id
export const GET_TRANSACTION_ITEMS_FOR_YARDSALE = `
  query GetTransactionItem($yardsaleUUID: uuid!) {
    transaction(where: { yardsale_uuid: { _eq: $yardsaleUUID } }) {
      seller_uuid
      created_at
      description
      price
      uuid
      yardsale_uuid
      seller {
        uuid
        is_active
        is_deleted
        name
        initials
        email
        transactions(where: { yardsale_uuid: { _eq: $yardsaleUUID } }) {
          price
          description
          yardsale_uuid
        }
      }
    }
  }
`;

export const GET_TRANSACTION_ITEMS_FOR_SELLER_ON_YARDSALE = `
query GetTransactionItem($yardsaleUUID: uuid!, $sellerUUID: uuid!) {
  transaction(where: {yardsale_uuid: {_eq: $yardsaleUUID}, seller_uuid: {_eq: $sellerUUID}}) {
    seller_uuid
    created_at
    description
    price
    uuid
    yardsale_uuid
  }
}
`
//
// GET ALL SALE ITEMS FOR SELLER
// by yardsale.id
export const GET_TRANSACTION_ITEMS_FOR_SELLER = `
  query GetTransactionItem($sellerUUID: uuid!) {
    transaction(where: { seller_uuid: { _eq: $sellerUUID } }) {
      uuid
      seller_uuid
      yardsale_uuid
      price
      description
      created_at
      yardsale {
        uuid
        is_active
        name
      }
      seller {
        uuid
        is_active
        is_deleted
        name
        initials
        email
      }
    }
  }
`;

//
// GET SALE ITEM
// by id

/**
 * 
 * Query Examples from: https://hasura.io/docs/1.0/graphql/core/queries/sorting.html
 * query {
  article (
    order_by: {author: {id: desc}}
  ) {
    id
    rating
    published_on
    author {
      id
      name
    }
  }
}


query {
  author (
    order_by: {
      articles_aggregate: {count: desc}
    }
  ) {
    id
    name
    articles_aggregate {
      aggregate{
        count
      }
    }
  }
}


query {
  author(
    order_by: {
      articles_aggregate: {
        max: {rating: asc_nulls_last}
      }
    }
  ) {
    id
    name
    articles_aggregate {
      aggregate{
        max {rating}
      }
    }
  }
}

query {
  article (
    order_by: [
      {rating: desc},
      {published_on: asc_nulls_first}
    ]
  ) {
    id
    rating
    published_on
  }
}

 */