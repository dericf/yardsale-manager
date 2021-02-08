export const toMoney = (unformatted: string | number): string => {
  if (String(unformatted).includes("$")) {
    unformatted = String(unformatted).replace("$", "");
  }
  if (String(unformatted).includes(",")) {
    unformatted = String(unformatted).replace(",", "");
  }
  return String(Number(unformatted).toLocaleString("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currency: "cad",
  }));
};

export const fromMoney = (unformatted: string | number): string => {
  if (String(unformatted).includes("$")) {
    unformatted = String(unformatted).replace("$", "");
  }
  if (String(unformatted).includes(",")) {
    unformatted = String(unformatted).replace(",", "");
  }
  return String(unformatted);
};
