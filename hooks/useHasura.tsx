import { useState, useContext, createContext } from "react";
import { useToasts } from "react-toast-notifications";

import React from "react";
import { HasuraContextInterface } from "../types/Context";
import jwtDecode from "jwt-decode";
import { FormValues } from "./useForm";
import { useAuth } from "./useAuth";
import { JWTToken } from "../types/JWT";
import { HasuraQueryResponse } from "../types/GraphQL";

export const HasuraContext = createContext<HasuraContextInterface>(
  {} as HasuraContextInterface,
);
interface GraphQlRequestBody {
  query: string;
  variables?: [];
}

const tryFetch = async (token, query, variables?): Promise<Response> => {
  let jwt = jwtDecode(token) as JWTToken;
  let requestBody: GraphQlRequestBody = {
    query,
  };
  if (variables) requestBody.variables = variables;

  let fetchOptions = {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "X-Hasura-Role": jwt["https://hasura.io/jwt/claims"]["x-hasura-role"],
      "X-Hasura-User-Id":
        jwt["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
    },
    body: JSON.stringify(requestBody),
  };

  return await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, fetchOptions);
};

export default function HasuraProvider({ children }) {
  const [context, setContext] = useState();
  const { isTokenExpired, refreshNewAccessToken, refreshToken } = useAuth();

  const query = async (q: string, variables?: any): Promise<any> => {
    let token = localStorage?.getItem("accessToken");
    if (token === null) {
      return null;
    }

    try {
      let response: Response;
      response = await tryFetch(token, q, variables ?? null);
      let data: HasuraQueryResponse = await response.json();
      // Check if the token was expired
      if (data.errors) {
        if (data?.errors[0]?.message === 'Could not verify JWT: JWTExpired') {
          // Token is expired. request a new one and then try the request again.
          // Only retries once. Might need to add more logic here if second attempt fails...
          const newToken = await refreshNewAccessToken(refreshToken);
          response = await tryFetch(newToken, q, variables ?? null);
          data = await response.json();
        }
      }
      return data.data;
    } catch (error) {
      console.log("Error with query");
      console.log(error);
    }
  };

  const mutation = async (m: string, variables?: any): Promise<any> => {
    return await query(m, variables ?? null)
  };

  return (
    <HasuraContext.Provider value={{ context, query, mutation }}>
      {children}
    </HasuraContext.Provider>
  );
}

export const useHasura = () => {
  const ctx = useContext<HasuraContextInterface>(HasuraContext);
  return ctx;
};