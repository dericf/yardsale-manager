export const getFakeData = () => {
    return JSON.parse(localStorage.getItem('fakeData'))
    
}

export const saveFakeData = (newFakeData) => {
    localStorage.setItem('fakeData', JSON.stringify(newFakeData))
}



export const resetFakeData = () => {
    // let yardsalesModed = 
    const data = {
        ...{
            user: 
                {
                    ...{
                        yardsales: yardsales.map(yardsale => {
                            return{...yardsale, sellers: sellers}
                        }),
                        sellers: sellers 
                    }
                }
        }
    }
    
    saveFakeData(data)
}

export const sellers = [
    {
        id: 1,
        name: "Joe Smith",
        initials: "JS",
        status: "active",
        phone: '',
        email: "",
        company: "",
        notes: ""
    },
    {
        id: 2,
        name: "Abe Jones",
        initials: "AJ",
        status: "inactive",
        phone: '',
        email: "",
        company: "",
        notes: ""
    },
    {
        id: 3,
        name: "Unknown",
        initials: "UU",
        status: "active",
        phone: '',
        email: "",
        company: "",
        notes: ""
    }
]

export const yardsales = [
    {
        id: 1,
        name: "Bonair Fall 2017",
        notes: "",
        status: "inactive"
    },
    {
        id: 2,
        name: "Bonair Fall 2018",
        notes: "",
        status: "inactive"
    },
    {
        id: 3,
        name: "Bonair Fall 2019",
        notes: "",
        status: "active"
    }
]

export const user = {
    id: 1,
    username: "admin",
    initials: "aa"
}

export const defaultFakeData = {
    ...{
        user: 
            {
                ...{
                    ...user,
                    yardsales: yardsales.map(yardsale => {
                        return{...yardsale, sellers: sellers}
                    }),
                    sellers: sellers 
                }
            }
    }
}