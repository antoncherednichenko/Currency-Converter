const selectOne = document.querySelector('.currency__select__one')
const selectTwo = document.querySelector('.currency__select__two')
const toggleBtn = document.querySelector('.toggle__button')
const iHaveInput = document.querySelector('.i-have-value')
const iWontInput = document.querySelector('.i-wont-value')
const leftSubtitle = document.querySelector('.left-subtitle')
const rightSubtitle = document.querySelector('.right-subtitle')
const leftColumn = document.querySelector('.left-column')
const rightColumn = document.querySelector('.right-column')
const state = {
    iHaveCurrency : 'RUB',
    iWontCurrency : 'USD',
    iHaveValue : 1,
    iWontValue : 0,
}

iHaveInput.value = state.iHaveValue
const getCurrencyValue = async function(){
    const resp = await fetch('https://api.exchangerate.host/latest')
    const data = await resp.json()
    return data
}

function getCurrencyOptions(){
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

const getData = async function(currency, amount){
    const resp = await fetch(`https://api.exchangerate.host/latest?base=${currency}&amount=${amount}`)
    const data = await resp.json()
    return data
}

function letsConvert(){
    getData(state.iHaveCurrency, state.iHaveValue)
    .then(data => {
        let curr = state.iWontCurrency
        state.iWontValue = data.rates[curr]
        changeValues()
        changSubTitle()
    })
    
    
}

function changeValues(){
    iHaveInput.value = state.iHaveValue
    iWontInput.value = state.iWontValue
}

function changSubTitle(){
    leftSubtitle.innerText = `1 ${state.iHaveCurrency} = ${(state.iWontValue / state.iHaveValue).toFixed(4)} ${state.iWontCurrency}`
    rightSubtitle.innerText = `1 ${state.iWontCurrency} = ${(state.iHaveValue / state.iWontValue).toFixed(4)} ${state.iHaveCurrency}`
}

leftColumn.addEventListener('click', e => {
    const leftArr = leftColumn.querySelectorAll('button')
    if (e.target.classList.contains('currency__select__one')){
        return
    }else{
        leftArr.forEach(el => {
            if (el.classList.contains('selected')){
                el.classList.remove('selected')
            }
            if(!e.target.classList.contains('left-column') && !e.target.classList.contains('currency__select__one')){
                e.target.classList.add('selected')
                state.iHaveCurrency = e.target.innerText
                letsConvert()
            }
        })
       
        
    }
})

rightColumn.addEventListener('click', e => {
    const rightArr = rightColumn.querySelectorAll('button')
    if (e.target.classList.contains('currency__select__two')){
        return
    }else{
        rightArr.forEach(el => {
            if (el.classList.contains('selected')){
                el.classList.remove('selected')
            }
            if(!e.target.classList.contains('right-column') && !e.target.classList.contains('currency__select__two')){
                e.target.classList.add('selected')
            state.iWontCurrency = e.target.innerText
            letsConvert()
            }
        })
    }
})

getCurrencyOptions()
letsConvert()