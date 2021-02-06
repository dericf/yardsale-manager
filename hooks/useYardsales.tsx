import { useState, useContext, useEffect, createContext } from "react";
import {GET_YARDSALES} from '../graphql/queries'


interface YardSalesContextInterFace {
	// TODO hook this array type up to graphql types
  yardSales: Array;
  selectedYardSale: string;
  updateYardSales: () => boolean;
}

interface ApolloQueryReturn {
	loading: boolean, 
	error: any, 
	data: [],
}

/*
gq https://localhost:8080/v1/graphql  -H "X-Hasura-Admin-Secret: D091hnLASK-1shf-1OSIHF92!1ilksdfh01" --introspect > schema.graphql
gq https://localhost:8080/v1/graphql -H "X-Hasura-Admin-Secret: D091hnLASK-1shf-1OSIHF92!1ilksdfh01" --introspect --format json > schema.json
*/

export const initialYardSalesValue: YardSalesContextInterFace = {
  yardSales: null,
  selectedYardSale: "",
  updateYardSales: () => true,
};

export const YardSalesContext = createContext<YardSalesContextInterFace>(
  {} as YardSalesContextInterFace,
);

import React from "react";
import { useQuery } from "@apollo/client";

export default function YardSalesProvider({ children }) {
	const [yardSales, setYardSales] = useState(['testing', 'testing'])
	const [selectedYardSale, setSelectedYardSale] = useState(null)

	useEffect(() => {
		updateYardSales()
	}, [])

  const updateYardSales = () => {
		// Make query to update all yardsales for this user
		const { loading, error, data } = useQuery(GET_YARDSALES, {
			onError: () => {
			console.log("ERROR WITH QUERY")
		},
			// onCompleted: (data) => {
			//     console.log('Sub Data: ', data)
			// }
			onCompleted: (d) => {
				setYardSales(d)
			}
		});
		console.log("Query...")
		console.log(loading);
		console.log(data);
		console.log(error);
		return { loading, error, data }
	};

  return (
    <YardSalesContext.Provider value={{yardSales, selectedYardSale, updateYardSales}}>{children}</YardSalesContext.Provider>
  );
}

export const useYardsales = () => {
  const {yardSales, selectedYardSale, updateYardSales} = useContext<YardSalesContextInterFace>(YardSalesContext);
  return {yardSales, selectedYardSale, updateYardSales};
};
