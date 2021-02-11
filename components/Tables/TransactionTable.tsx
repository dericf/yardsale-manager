import { Fragment } from "react";
import { Button, Table } from "semantic-ui-react";
import { useYardsales } from "../../hooks/useYardsales";
import { Transaction } from "../../types/Transaction";
import { YardSalesInterface } from "../../types/YardSales";
import { toMoney } from "../../utilities/money_helpers";

interface Props {
  yardSale: YardSalesInterface;
}

export const TransactionTable = ({ yardSale }: Props) => {
  const {
    sellerLinks,
    transactionItems,
    getAllYardSaleTransactions,
    getAllYardSaleSellerLinks,
    clearSelectedYardSale,
    deleteTransactionItem,
  } = useYardsales();

  return (
    <Table
      className="mt0"
      striped
      compact
      basic="very"
      unstackable
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "600px   ",
      }}
    >
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="left" style={{ width: 200 }}>
            Seller
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="left">Description</Table.HeaderCell>
          <Table.HeaderCell textAlign="center" style={{ width: 140 }}>
            Price
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" style={{ width: 140 }}>
            Actions
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Fragment>
          {transactionItems?.length === 0 && (
            <Table.Row textAlign="center">
              <Table.Cell textAlign="center" colSpan="4">
                No Transactions for this Yardsale
              </Table.Cell>
            </Table.Row>
          )}

          {transactionItems?.map((item) => {
            return (
              <Table.Row key={item.uuid}>
                <Table.Cell textAlign="left">
                  {item.seller.name} ({item.seller.initials}){" "}
                  {item.seller.is_deleted === true && (
                    <strong> - *Seller Removed*</strong>
                  )}
                </Table.Cell>
                <Table.Cell textAlign="left">{item.description}</Table.Cell>
                <Table.Cell textAlign="right">
                  $ {toMoney(item.price)}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Button
                    icon="trash"
                    circular
                    negative
                    basic
                    onClick={async (e) => {
                      await deleteTransactionItem(item.uuid);
                      await getAllYardSaleTransactions(yardSale.uuid);
                      await getAllYardSaleSellerLinks(yardSale.uuid);
                    }}
                  ></Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Fragment>
      </Table.Body>
    </Table>
  );
};
