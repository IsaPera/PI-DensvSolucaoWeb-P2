
//createLists([subjects2,subjects],['title','title'])
function createLists(original_lists,rattributes,rpesquisas) {
let lists = [...original_lists]
let attributes = rattributes// atributos que contêm os textos a serem buscados em cada array
let pesquisas = [...rpesquisas]
for (list in lists) {
    //console.log('list',lists[list])
    // código para sortear os textos primeiro por quantidade de palavras e depois alfabeticamente
    lists[list] = sortWords(sortWordsByNumber(lists[list], attributes[list]),attributes[list])
    console.log('list2',lists[list])
}

//startEngine()
for (let s = 0; s < lists.length; s++) {
    lists[s] = sortWords(sortWordsByNumber(lists[list], attributes[list]),attributes[list])
    search(lists[s], attributes[s], s, pesquisas[s])
}

}

function startEngine() {
    console.log('lists[0]',lists[0])
for (let s = 0; s < lists.length; s++) {
    lists[s] = sortWords(sortWordsByNumber(lists[list], attributes[list]),attributes[list])
    search(lists[s], attributes[s], s, pesquisas[s])
}
}


function search(opcoes,titleProperty,searcherIndex,pesquisa) {   
    //console.log('LOGGG',opcoes)
    let subjects = [...opcoes]
    results = []
    pesquisa = pesquisa.toLowerCase()

      for (n in subjects) {
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
    //console.log('SUBJECTS AFTER INDEX',subjects)

    for (n in subjects) { 
         //subjects[n].innertext = searchInnertext(subjects[n][titleProperty],pesquisa,'(?<=^|\\W)')
         if (subjects[n][titleProperty].search(new RegExp(`(?<=^)${pesquisa}`,"gi")) != -1 && pesquisa.length != 0) {
            //console.log('pushar esse (1)', subjects[n][titleProperty])
             results.push(subjects[n])
             subjects[n].innertext = searchInnertext(subjects[n][titleProperty],pesquisa,'(?<=^)')
         } }
    if (pesquisa.length != 0) {
        for (n in subjects) {
             if (subjects[n][titleProperty].search(new RegExp(`(?<=^)${pesquisa}`,"gi")) == -1 && subjects[n][titleProperty].search(new RegExp(`(?<!([a-z]|[ãáàâéêóõôíúç]))${pesquisa}`,"gi")) != -1 && pesquisa.length != 0) {
                 //console.log('pushar esse (2)', subjects[n][titleProperty])
                results.push(subjects[n])
                subjects[n].innertext = searchInnertext(subjects[n][titleProperty],pesquisa,'(?<!([a-z]|[ãáàâéêóõôíúç]))')
             }}}
 if (pesquisa.length != 0){
    for (n in subjects) {
         if (subjects[n][titleProperty].search(new RegExp(`(?<=^)${pesquisa}`,"gi")) == -1 && subjects[n][titleProperty].search(new RegExp(`(?<!([a-z]|[ãáàâéêóõôíúç]))${pesquisa}`,"gi")) == -1 && subjects[n][titleProperty].search(new RegExp(`${pesquisa}`,"gi")) != -1 && pesquisa.length != 0) {
            //console.log('FOI ESSE',subjects[n][titleProperty])
             //console.log('pushar esse (3)', subjects[n][titleProperty])
            results.push(subjects[n])
            subjects[n].innertext = searchInnertext(subjects[n][titleProperty],pesquisa,'')
         }}}

 }


// Ordena os textos alfabeticamente
function sortWords(palavrasPrimitivas,s) {
    alfabeto = ['a','á','à','ã','â', 'b', 'c','ç', 'd', 'e','é','ê', 'f', 'g', 'h', 'i','í', 'j', 'k', 'l', 'm', 'n', 'o','ó','õ','ô', 'p', 'q', 'r', 's', 't', 'u','ú', 'v', 'w', 'x', 'y', 'z']
palavrasNumericas = []
posicaoPalavras = []

for (palavra in palavrasPrimitivas) {
    word = palavrasPrimitivas[palavra][s].toLowerCase()
    neword = ''
    for (car in word) {
        if (word[car] != ' ') {
            neword+= word[car]
        }
        }
    word = neword
    wordToNumber = ''
    for (letra = 0; letra < word.length; letra++) {
        if (letra != word.length - 1) {
            wordToNumber += `${alfabeto.indexOf(word[letra])}.`
        } else {
            wordToNumber += `${alfabeto.indexOf(word[letra])}`
        }  }
    palavrasNumericas.push(wordToNumber)
    posicaoPalavras.push(palavra)
}

for (pNumber in palavrasNumericas) {
    stop = false
    for (n = 0; stop == false && n < pNumber; n++) {
        if (n != pNumber) {
            palavraAnalisar = []
            numint = ''
            for (num = 0; num < palavrasNumericas[n].length; num++) {
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
            for (num = 0; num < palavrasNumericas[pNumber].length; num++) {
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
             for (numb = 0; numb < palavraAnalisar.length && pare == false; numb++) {
              if (Number(palavraAnalisar[numb]) < Number(palavraOrigin[numb])) {
                pare = true
              }else if (Number(palavraAnalisar[numb]) > Number(palavraOrigin[numb])) {
                pare = true
                stop = true
                palavraSubir = palavrasNumericas[pNumber]
                wordposition = posicaoPalavras[pNumber]
                for (posicao = pNumber; posicao > n; posicao--) {
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
            for (numb = 0; numb < palavraOrigin.length && pare == false; numb++) {
                if (Number(palavraAnalisar[numb]) < Number(palavraOrigin[numb])) {
                    pare = true
                  }else if (Number(palavraAnalisar[numb]) > Number(palavraOrigin[numb])) {
                    pare = true
                    stop = true
                    palavraSubir = palavrasNumericas[pNumber]
                    wordposition = posicaoPalavras[pNumber]
                    for (posicao = pNumber; posicao > n; posicao--) {
                      palavrasNumericas[posicao] = palavrasNumericas[posicao - 1]
                      posicaoPalavras[posicao] = posicaoPalavras[posicao - 1]
                    }
                    palavrasNumericas[n] = palavraSubir
                    posicaoPalavras[n] = wordposition
                  }else{
                      pare = false
                  }}}}}}

newlista = []
for (p in palavrasNumericas) {
newlista.push(palavrasPrimitivas[posicaoPalavras[p]])
}

return newlista
}

// Ordena os objetos numericamente por propriedade
// os textos pelo índice de busca
function sortob(n, pam, pim) {
    let maiorparamenor = []
    let posiçõesnumeros = []
    let yposition = n

    for (n in yposition) {
        maiorparamenor[n] = {}
        yposition[n].original_index = Number(n)
        posiçõesnumeros.push(-1)
        maiorparamenor[n][pam] = Infinity
    }

    for (item in yposition) {
        let volume = 0
        let dn = 0
        for (volume in yposition) {
            if (dn == 0) {
                if (yposition[item][pam] < maiorparamenor[volume][pam] || yposition[item][pam] == maiorparamenor[volume][pam] && yposition[item][pim] < maiorparamenor[volume][pim]) {
                    let itens = yposition.length - (Number(volume) + 1)
                    let leng = yposition.length

                    for (c = 0; c < itens; c++) {
                        maiorparamenor[Number(leng) - 1] = maiorparamenor[Number(leng) - 2]
                        posiçõesnumeros[Number(leng) - 1] = posiçõesnumeros[Number(leng) - 2]
                        leng--
                    }
                    maiorparamenor[volume] = yposition[item]
                    posiçõesnumeros[volume] = Number(item)
                    dn = 10
                }
            }
        }
    }
    return maiorparamenor
}

// Ordena os textos por quantidade de palavras
function sortWordsByNumber(palavrasPrimitivas,s) {
for (palavra in palavrasPrimitivas) {
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
        innertext += `<span style="font-weight: 600;color:blue;">${text.slice(Number(char),Number(char) + Number(busca.length))}</span>`
        char += busca.length - 1
    }
}
return innertext
}
