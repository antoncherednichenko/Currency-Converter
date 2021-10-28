const selectOne = document.querySelector('.currency__select__one')
const selectTwo = document.querySelector('.currency__select__two')
const iHaveInput = document.querySelector('.i-have-value')
const iWantInput = document.querySelector('.i-want-value')


const getCurrencyValue = async function(){
    const resp = await fetch('https://api.exchangerate.host/latest')
    const data = await resp.json()
    return data
}

function getCurrencyOptions(){
    let counter = 0
    getCurrencyValue()
    .then(data => {
        const arr = []
        for(let key in data.rates){
            arr.push(key)
        }
        return  arr
    })
    .then(arr => {
        arr.forEach( el => {
            const optionOne = document.createElement('option')
            const optionTwo = document.createElement('option')
            optionOne.innerText = el
            optionTwo.innerText = el
            selectOne.append(optionOne)
            selectTwo.append(optionTwo)
        })
    })
}

getCurrencyOptions()

