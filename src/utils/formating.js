export const toMoney = (unformatted) => {
    if (String(unformatted).includes('$')) {
        unformatted = String(unformatted).replace('$', "")
    }
    if (String(unformatted).includes(',')) {
        unformatted = String(unformatted).replace(',', "")
    }
    return Number(unformatted).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2, currency: "cad" })
}


export const fromMoney = (unformatted) => {
    if (String(unformatted).includes('$')) {
        unformatted = String(unformatted).replace('$', "")
    }
    if (String(unformatted).includes(',')) {
        unformatted = String(unformatted).replace(',', "")
    }
    return String(unformatted)
}