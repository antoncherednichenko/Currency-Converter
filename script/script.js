const selectOne = document.querySelector('.left__list')
const selectTwo = document.querySelector('.right__list')
const toggleBtn = document.querySelector('.toggle__button')
const iHaveInput = document.querySelector('.i-have-value')
const iWontInput = document.querySelector('.i-wont-value')
const leftSubtitle = document.querySelector('.left-subtitle')
const rightSubtitle = document.querySelector('.right-subtitle')
const leftColumn = document.querySelector('.left-column')
const rightColumn = document.querySelector('.right-column')
const leftArow = document.querySelector('.left__arow')
const rightArow = document.querySelector('.right__arow')
const page = document.querySelector('.page')
const btnArr = document.querySelectorAll('.target__button')
const state = {
    iHaveCurrency : 'RUB',
    iWontCurrency : 'USD',
    iHaveValue : 1,
    iWontValue : 0,
    order : 'ASK'
}

iHaveInput.value = state.iHaveValue

function equalsValues(){
    state.iWontValue = 1
    state.iHaveValue = 1
    changeValues()
    changSubTitle()
}

btnArr.forEach(el => {
    el.addEventListener('click', e => {
        const arr = e.target.parentElement.querySelectorAll('.target__button')
        arr.forEach(el => {
            el.classList.remove('selected')
        })
        e.target.classList.add('selected')
        if(e.target.parentElement.classList.contains('left-column')){
            state.iHaveCurrency = e.target.innerText
            state.iHaveCurrency === state.iWontCurrency ? equalsValues() : letsConvert()
        }else{
            state.iWontCurrency = e.target.innerText
            state.iWontCurrency === state.iHaveCurrency ? equalsValues() : letsConvert()
        }
    })
})

const getCurrencyValue = async function(){
    const resp = await fetch('https://api.exchangerate.host/latest')
    const data = await resp.json()
    return data
}

function getCurrencyFromOption(e){
    if(e.target.parentElement.classList.contains('left__list')){
        const arr = leftColumn.querySelectorAll('.target__button')
        arr.forEach(el => el.classList.remove('selected'))
        let item = arr[arr.length - 1]
        item.classList.add('selected')
        item.innerText = e.target.innerText
        state.iHaveCurrency = e.target.innerText
        state.iHaveCurrency === state.iWontCurrency ? equalsValues() : letsConvert()
        selectOne.classList.toggle('visible')
        state.order = 'ASK'
    }else if(e.target.parentElement.classList.contains('right__list')){
        const arr = rightColumn.querySelectorAll('.target__button')
        arr.forEach(el => el.classList.remove('selected'))
        let item = arr[arr.length - 1]
        item.classList.add('selected')
        item.innerText = e.target.innerText
        state.iWontCurrency = e.target.innerText
        state.iWontCurrency === state.iHaveCurrency ? equalsValues() : letsConvert()
        selectTwo.classList.toggle('visible')
        state.order = 'ASK'
    }
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
            const optionOne = document.createElement('li')
            const optionTwo = document.createElement('li')
            optionOne.classList.add('option')
            optionTwo.classList.add('option')
            optionOne.innerText = el
            optionTwo.innerText = el
            selectOne.append(optionOne)
            selectTwo.append(optionTwo)
            selectOne.addEventListener('click', getCurrencyFromOption)
            selectTwo.addEventListener('click', getCurrencyFromOption)
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

rightArow.addEventListener('click', e => {
    if(state.order === 'ASK'){
        selectTwo.classList.toggle('visible')
        console.log(e.target)
        state.order = 'DESK'
    }else{
        selectTwo.classList.toggle('visible')
        state.order = 'ASK'
    } 
    
})
leftArow.addEventListener('click', e => {
    if(state.order === 'ASK'){
        selectOne.classList.toggle('visible')
        state.order = 'DESK'
    }else{
        selectOne.classList.toggle('visible')
        state.order = 'ASK'
    }
})

getCurrencyOptions()
letsConvert()