export const toMoney = (unformatted) => {
    return Number(unformatted).toLocaleString('en', {minimumFractionDigits:2, maximumFractionDigits:2, currency: "cad"})
}