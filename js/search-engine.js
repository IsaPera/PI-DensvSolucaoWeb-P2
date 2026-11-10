
function createLists(original_lists,rattributes,rpesquisas) {
let lists = [...original_lists]
let attributes = rattributes// atributos que contêm os textos a serem buscados em cada array
let pesquisas = [...rpesquisas]
for (let list in lists) {
    // código para sortear os textos primeiro por quantidade de palavras e depois alfabeticamente
    lists[list] = sortWords(sortTextByWords(lists[list], attributes[list]),attributes[list])
}

let results = []
for (let s = 0; s < lists.length; s++) {
    lists[s] = sortWords(sortTextByWords(lists[s], attributes[s]),attributes[s])
     results.push(search(lists[s], attributes[s], pesquisas[s]))
}

return results[0]

}

function search(opcoes,titleProperty,pesquisa) {

    let subjects = [...opcoes]
    let results = []
    pesquisa = pesquisa.toLowerCase()

      for (let n in subjects) {
        let index_found = subjects[n][titleProperty].search(new RegExp(`${pesquisa}`,"gi"))
        if (index_found > -1) {
            subjects[n].index_found = subjects[n][titleProperty].search(new RegExp(`${pesquisa}`,"gi"))
        }else{
            subjects[n].index_found = 1000
        }
         }

    // ordenação pelos índices em que a busca foi encontrada
    // ex: pesquisa = 'a'
    // índice em 'abacate' = 0
    // índice em 'tangerina' = 1
    subjects = sortob(subjects, 'index_found')

    for (let n in subjects) { 
         if (subjects[n][titleProperty].search(new RegExp(`(?<=^)${pesquisa}`,"gi")) != -1 && pesquisa.length != 0) {
             results.push(subjects[n])
             subjects[n].innertext = searchInnertext(subjects[n][titleProperty],pesquisa,'(?<=^)')
         } }
    if (pesquisa.length != 0) {
        for (let n in subjects) {
             if (subjects[n][titleProperty].search(new RegExp(`(?<=^)${pesquisa}`,"gi")) == -1 && subjects[n][titleProperty].search(new RegExp(`(?<!([a-z]|[ãáàâéêóõôíúç]))${pesquisa}`,"gi")) != -1 && pesquisa.length != 0) {
                results.push(subjects[n])
                subjects[n].innertext = searchInnertext(subjects[n][titleProperty],pesquisa,'(?<!([a-z]|[ãáàâéêóõôíúç]))')
             }}}
 if (pesquisa.length != 0){
    for (let n in subjects) {
         if (subjects[n][titleProperty].search(new RegExp(`(?<=^)${pesquisa}`,"gi")) == -1 && subjects[n][titleProperty].search(new RegExp(`(?<!([a-z]|[ãáàâéêóõôíúç]))${pesquisa}`,"gi")) == -1 && subjects[n][titleProperty].search(new RegExp(`${pesquisa}`,"gi")) != -1 && pesquisa.length != 0) {
            results.push(subjects[n])
            subjects[n].innertext = searchInnertext(subjects[n][titleProperty],pesquisa,'')
         }}}

         return results
 }


// Ordena os textos alfabeticamente
function sortWords(palavrasPrimitivas,s) {
    alfabeto = ['a','á','à','ã','â', 'b', 'c','ç', 'd', 'e','é','ê', 'f', 'g', 'h', 'i','í', 'j', 'k', 'l', 'm', 'n', 'o','ó','õ','ô', 'p', 'q', 'r', 's', 't', 'u','ú', 'v', 'w', 'x', 'y', 'z']
palavrasNumericas = []
posicaoPalavras = []

for (let palavra in palavrasPrimitivas) {
    word = palavrasPrimitivas[palavra][s].toLowerCase()
    neword = ''
    for (let car in word) {
        if (word[car] != ' ') {
            neword+= word[car]
        }
        }
    word = neword
    wordToNumber = ''
    for (let letra = 0; letra < word.length; letra++) {
        if (letra != word.length - 1) {
            wordToNumber += `${alfabeto.indexOf(word[letra])}.`
        } else {
            wordToNumber += `${alfabeto.indexOf(word[letra])}`
        }  }
    palavrasNumericas.push(wordToNumber)
    posicaoPalavras.push(palavra)
}

for (let pNumber in palavrasNumericas) {
    stop = false
    for (let n = 0; stop == false && n < pNumber; n++) {
        if (n != pNumber) {
            palavraAnalisar = []
            numint = ''
            for (let num = 0; num < palavrasNumericas[n].length; num++) {
                   if (palavrasNumericas[n][num] == '.') {
                    palavraAnalisar.push(numint)
                    numint = ''
                   }else if(num == palavrasNumericas[n].length - 1){
                        numint += `${palavrasNumericas[n][num]}`
                        palavraAnalisar.push(numint)
                   }else{
                    numint += `${palavrasNumericas[n][num]}`
                   }}
            palavraOrigin = []
            numint = ''
            for (let num = 0; num < palavrasNumericas[pNumber].length; num++) {
                   if (palavrasNumericas[pNumber][num] == '.') {
                    palavraOrigin.push(numint)
                    numint = ''
                   }else if(num == palavrasNumericas[pNumber].length - 1){
                        numint += `${palavrasNumericas[pNumber][num]}`
                        palavraOrigin.push(numint)
                   }else{
                    numint += `${palavrasNumericas[pNumber][num]}`
                   }}
           if (palavraOrigin.length > palavraAnalisar.length) {
             pare = false
             for (let numb = 0; numb < palavraAnalisar.length && pare == false; numb++) {
              if (Number(palavraAnalisar[numb]) < Number(palavraOrigin[numb])) {
                pare = true
              }else if (Number(palavraAnalisar[numb]) > Number(palavraOrigin[numb])) {
                pare = true
                stop = true
                palavraSubir = palavrasNumericas[pNumber]
                wordposition = posicaoPalavras[pNumber]
                for (let posicao = pNumber; posicao > n; posicao--) {
                  palavrasNumericas[posicao] = palavrasNumericas[posicao - 1]
                  posicaoPalavras[posicao] = posicaoPalavras[posicao - 1]
                }
                palavrasNumericas[n] = palavraSubir
                posicaoPalavras[n] = wordposition
              }else{
                  pare = false
              }}
           }else{
            pare = false
            for (let numb = 0; numb < palavraOrigin.length && pare == false; numb++) {
                if (Number(palavraAnalisar[numb]) < Number(palavraOrigin[numb])) {
                    pare = true
                  }else if (Number(palavraAnalisar[numb]) > Number(palavraOrigin[numb])) {
                    pare = true
                    stop = true
                    palavraSubir = palavrasNumericas[pNumber]
                    wordposition = posicaoPalavras[pNumber]
                    for (let posicao = pNumber; posicao > n; posicao--) {
                      palavrasNumericas[posicao] = palavrasNumericas[posicao - 1]
                      posicaoPalavras[posicao] = posicaoPalavras[posicao - 1]
                    }
                    palavrasNumericas[n] = palavraSubir
                    posicaoPalavras[n] = wordposition
                  }else{
                      pare = false
                  }}}}}}

newlista = []
for (let p in palavrasNumericas) {
newlista.push(palavrasPrimitivas[posicaoPalavras[p]])
}

return newlista
}

// Ordena os objetos numericamente por propriedade
// os textos pelo índice de busca
function sortob(n, index1, index2) {
    let maiorparamenor = []
    let posiçõesnumeros = []
    let listaobs = n

    for (let n in listaobs) {
        maiorparamenor[n] = {}
        listaobs[n].original_index = Number(n)
        posiçõesnumeros.push(-1)
        maiorparamenor[n][index1] = Infinity
    }

    for (let item in listaobs) {
        let dn = 0
        for (let itemd in listaobs) {
            if (dn == 0) {
                if (listaobs[item][index1] < maiorparamenor[itemd][index1] || listaobs[item][index1] == maiorparamenor[itemd][index1] && listaobs[item][index2] < maiorparamenor[itemd][index2]) {
                    let itens = listaobs.length - (Number(itemd) + 1)
                    let leng = listaobs.length

                    for (let c = 0; c < itens; c++) {
                        maiorparamenor[Number(leng) - 1] = maiorparamenor[Number(leng) - 2]
                        posiçõesnumeros[Number(leng) - 1] = posiçõesnumeros[Number(leng) - 2]
                        leng--
                    }
                    maiorparamenor[itemd] = listaobs[item]
                    posiçõesnumeros[itemd] = Number(item)
                    dn = 10
                }
            }
        }
    }
    return maiorparamenor
}

// Ordena os textos por quantidade de palavras
function sortTextByWords(palavrasPrimitivas,s) {
for (let palavra in palavrasPrimitivas) {
    let word = palavrasPrimitivas[palavra][s]
    let break_word = ''
    let words_number = 0
    let word_right_spaced = ''
    word += ' '
    for (car in word) {
        if (word[car] != ' ') {
             if (break_word == '') {
                words_number += 1
            }
            break_word += word[car]
        }else{
            if (break_word != '') {
            if (word_right_spaced != '')
                word_right_spaced += ' '
            word_right_spaced += break_word
            }
            break_word = ''
        }
        }
        palavrasPrimitivas[palavra].words_number = words_number
        palavrasPrimitivas[palavra][s] = word_right_spaced
}

palavrasPrimitivas = sortob(palavrasPrimitivas,'words_number')
return palavrasPrimitivas
}

// Formata as buscas
function searchInnertext(text,busca,search_regex) {

let text_changed = text.replace(new RegExp(`${search_regex}${busca}`,"gi"), `/${busca}`)
let indexes = []
let innertext = ''
let countindex = 0

for (char = 0; char < text_changed.length; char++) {
    if (text_changed[char] == '/') {
        let trecho
        if (char > 0) {
          trecho = text_changed[char - 1] + text_changed.slice(char + 1, char + 1 + busca.length)
        }else{
          trecho = text_changed.slice(char + 1, char + 1 + busca.length)
        }
         if (trecho.search(new RegExp(`${search_regex}${busca}`,"gi")) != -1) {
         indexes.push(char - countindex)
         countindex++
         }
    }
}

for (char = 0; char < text.length; char++) {
    if (indexes.indexOf(Number(char)) == -1) {
        innertext += text[char]
    }else{
        innertext += `<span style="font-weight: 600;">${text.slice(Number(char),Number(char) + Number(busca.length))}</span>`
        char += busca.length - 1
    }
}
return innertext
}
