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
const amountSubtitle = document.querySelectorAll('.amount__subtitle')
const errorBox = document.querySelector('.error')
const errorBtn = document.querySelector('.error__button')
const state = {
    iHaveCurrency : 'RUB',
    iWontCurrency : 'USD',
    iHaveValue : 1,
    iWontValue : 0,
    order : 'ASK',
    LeftOption : 'ASK',
    rightOption : 'ASK',
    toggleButton : 'ASK'

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
        amountSubtitle.forEach(el => el.style.display = 'block')
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
    e.target.parentElement.parentElement
    if(e.target.parentElement.classList.contains('left__list')){
        leftArow.style.background = 'url("./img/arrow.svg") no-repeat center'
        state.order = 'ASK'
        const arr = leftColumn.querySelectorAll('.target__button')
        arr.forEach(el => el.classList.remove('selected'))
        let item = arr[arr.length - 1]
        item.classList.add('selected')
        item.innerText = e.target.innerText
        state.iHaveCurrency = e.target.innerText
        state.iHaveCurrency === state.iWontCurrency ? equalsValues() : letsConvert()
        selectOne.classList.toggle('visible')
        state.order = 'ASK'
        state.LeftOption = 'DESC'
    }else if(e.target.parentElement.classList.contains('right__list')){
        rightArow.style.background = 'url("./img/arrow.svg") no-repeat center'
        state.order = 'ASK'
        const arr = rightColumn.querySelectorAll('.target__button')
        arr.forEach(el => el.classList.remove('selected'))
        let item = arr[arr.length - 1]
        item.classList.add('selected')
        item.innerText = e.target.innerText
        state.iWontCurrency = e.target.innerText
        state.iWontCurrency === state.iHaveCurrency ? equalsValues() : letsConvert()
        selectTwo.classList.toggle('visible')
        state.order = 'ASK'
        state.rightOption = 'DESC'
    }
}

function getCurrencyOptions(e){
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
    .catch(er => errorBox.style.display = 'block')
    
}

errorBtn.addEventListener('click', e => errorBox.style.display = 'none')

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
        e.target.style.background = 'url("./img/arrow-back.svg") no-repeat center'
        selectTwo.classList.toggle('visible')
        state.order = 'DESC'
    }else{
        e.target.style.background = 'url("./img/arrow.svg") no-repeat center'
        selectTwo.classList.toggle('visible')
        state.order = 'ASK'
    } 
    
})
leftArow.addEventListener('click', e => {
    if(state.order === 'ASK'){
        e.target.style.background = 'url("./img/arrow-back.svg") no-repeat center'
        selectOne.classList.toggle('visible')
        state.order = 'DESC'
    }else{
        e.target.style.background = 'url("./img/arrow.svg") no-repeat center'
        selectOne.classList.toggle('visible')
        state.order = 'ASK'
    }
})

iHaveInput.addEventListener('input', e => {
    amountSubtitle.forEach(el => el.style.display = 'block')
    if (e.target.value === '0'){
        amountSubtitle.forEach(el => el.style.display = 'none')
        iWontInput.value = 0
    }else if(e.target.value === ''){
        amountSubtitle.forEach(el => el.style.display = 'none')
        iWontInput.value = ''
    }else{
        state.iHaveValue = e.target.value
        letsConvert()
    }
})
iWontInput.addEventListener('input', e => {
    amountSubtitle.forEach(el => el.style.display = 'block')
    if (e.target.value === '0'){
        amountSubtitle.forEach(el => el.style.display = 'none')
        iHaveInput.value = 0
    }else if(e.target.value === ''){
        amountSubtitle.forEach(el => el.style.display = 'none')
        iHaveInput.value = ''
    }else{
        e.target.value = e.target.value.replace(/[.]/g, ",")
        state.iWontValue = e.target.value
        getData(state.iWontCurrency, state.iWontValue)
        .then(data => {
            let curr = state.iHaveCurrency
            state.iHaveValue = data.rates[curr]
            changeValues()
            changSubTitle()
        })
    }
})

function changeCurrency(){
    const leftArr = leftColumn.querySelectorAll('.target__button')
    const rightArr = rightColumn.querySelectorAll('.target__button')
    const leftSelected = leftColumn.querySelector('.selected')
    const rightSelected = rightColumn.querySelector('.selected')
    let leftCounter = 0
    let rightCounter = 0
    state.iHaveCurrency = rightSelected.innerText
    state.iWontCurrency = leftSelected.innerText
    leftSelected.classList.remove('selected')
    rightSelected.classList.remove('selected')
    
    for(let el of leftArr){
        if(el.innerText === state.iHaveCurrency){
            el.classList.add('selected')
            break
        }else if(leftCounter === leftArr.length - 1){
            el.innerText = state.iHaveCurrency
            el.classList.add('selected')
            break
        }
        leftCounter++
    }
    for(let el of rightArr){
        if(el.innerText === state.iWontCurrency){
            el.classList.add('selected')
            break
        }else if(rightCounter === rightArr.length - 1){
            el.innerText = state.iWontCurrency
            el.classList.add('selected')
            break
        }
        rightCounter++
    }
}

toggleBtn.addEventListener('click', e => {
    if (state.toggleButton === 'ASK'){
        toggleBtn.style.transform = 'rotate(180deg)'
        state.toggleButton = 'DESC'
    }else{
        toggleBtn.style.transform = 'rotate(0deg)'
        state.toggleButton = 'ASK'
    }
    changeCurrency()
    letsConvert()
})


getCurrencyOptions()
letsConvert()