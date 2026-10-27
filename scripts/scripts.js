
 // Seleciona os elementos
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")
const expenseList = document.querySelector("ul")

// Seleciona os elementos de totais
const expenseQuantity = document.querySelector("aside header p span")
const expenseTotal = document.querySelector("aside header h2")

// Formata o valor para moeda brasileira
function formatCurrencyBRL(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })
}

// Formata o campo de valor enquanto digita
amount.oninput = () => {
    let value = amount.value.replace(/\D/g, "")
    value = Number(value) / 100
    amount.value = formatCurrencyBRL(value)
}

// Captura o envio do formulário
form.onsubmit = (event) => {
    event.preventDefault()

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date()
    }

    console.log(newExpense)

    // Adiciona a despesa
    expenseAdd(newExpense)

    // Limpa o formulário
    formClear()
}

// Adiciona uma despesa à lista
function expenseAdd(newExpense) {
    try {
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        // Ícone da categoria
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute(
            "src",
            `img/${newExpense.category_id}.svg`
        )
        expenseIcon.setAttribute("alt", newExpense.category_name)

        // Informações da despesa
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        // Nome
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        // Categoria
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        expenseInfo.append(expenseName, expenseCategory)

        // Valor
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML =
            `<small>R$</small> ${newExpense.amount.replace("R$", "").trim()}`

        // Ícone para remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "Remover despesa")

        // Monta o item
        expenseItem.append(
            expenseIcon,
            expenseInfo,
            expenseAmount,
            removeIcon
        )

        expenseList.append(expenseItem)

        // Atualiza os totais
        updateTotals()

    } catch (error) {
        alert("Não foi possível adicionar a despesa.")
        console.log(error)
    }
}

// Atualiza a quantidade e o valor total
function updateTotals() {
    try {
        const items = expenseList.children

        // Quantidade de despesas
        expenseQuantity.textContent =
            `${items.length} ${items.length === 1 ? "despesa" : "despesas"}`

        let total = 0

        // Percorre as despesas
        for (let i = 0; i < items.length; i++) {
            const itemAmount =
                items[i].querySelector(".expense-amount")

            const value = itemAmount.textContent
                .replace(/[^\d,]/g, "")
                .replace(",", ".")

            const valueFormatted = parseFloat(value)

            if (isNaN(valueFormatted)) {
                throw new Error("O valor da despesa não é válido.")
            }

            total += valueFormatted
        }

        // Exibe o total formatado
        expenseTotal.textContent = formatCurrencyBRL(total)

    } catch (error) {
        console.log(error)
        alert("Não foi possível atualizar os valores.")
    }
}

// Remove uma despesa ao clicar no ícone
expenseList.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-icon")) {
        const item = event.target.closest(".expense")

        if (item) {
            item.remove()
            updateTotals()
        }
    }
})

// Limpa os campos do formulário
function formClear() {
    expense.value = ""
    category.selectedIndex = 0
    amount.value = ""

    expense.focus()
}
