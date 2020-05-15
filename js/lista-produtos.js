var tabela = document.querySelector('#prodTabela');
var tabelaCorpo = tabela.querySelector('tbody');

var prodList = [];

if (localStorage.produtos) {
  var prodList = JSON.parse(localStorage.produtos);
}

renderTable(prodList);


//click add produto
document.querySelector('#prodAdd').addEventListener('click', function(){
  if(prodList.length == 0){
    var id = 1;
  } else {
      var id = prodList.length + 1;
      for(var i = prodList.length; i >= 1; i--){
        if(prodList.find( produto => produto.id == i ) == undefined){
          id = i;
        }
      }
  }

  var nome = document.querySelector('#prodNome').value;
  var estoque = parseFloat(document.querySelector('#prodEstoque').value);
  var valorU = parseFloat(document.querySelector('#prodValor').value);
  valorU = valorU.toFixed(2);
  var valorT = estoque * valorU;
  valorT = valorT.toFixed(2);
  valorU = parseFloat(valorU);
  valorT = parseFloat(valorT);

  if(nome !== '' && !isNaN(estoque) && estoque > 0 && !isNaN(valorU)){
    prodList.push({id, nome, estoque, valorU, valorT});

    document.querySelector('#prodNome').value = '';
    document.querySelector('#prodEstoque').value = '';
    document.querySelector('#prodValor').value = '';

    renderTable(prodList);
  } else{
    alert('Por favor, preencha corretamente as informações. Todos os dados devem ser preenchidos e o estoque deve ser maior que zero.');
  }

})

//renderizar tabela
function renderTable(prodList){
  tabelaCorpo.innerHTML = '';
  for(produto in prodList){
    var novaLinha = document.createElement('tr');
    novaLinha.setAttribute('draggable', 'true');
    novaLinha.setAttribute('ondrop', 'drop(event)');
    novaLinha.setAttribute('ondragstart', 'drag(event)');
    novaLinha.setAttribute('ondragover', 'allowDrop(event)');
    novaLinha.setAttribute('data-id', produto);
    tabelaCorpo.appendChild(novaLinha);
    for(atributo in prodList[produto]){
      adicionarColuna(prodList[produto][atributo], atributo);
    }
  }

  localStorage.produtos = JSON.stringify(prodList);
}

function adicionarColuna(conteudo, atributo){
  var linha = tabelaCorpo.querySelector('tr:last-child');
  var coluna = document.createElement("td");
  linha.appendChild(coluna);
  if(atributo != 'estoque'){
    var txt = document.createTextNode(conteudo);
    coluna.appendChild(txt);
  } else{
    var input = document.createElement("input");
    input.setAttribute('value', conteudo);
    input.setAttribute('onchange', 'atualizarEstoque(this)');
    coluna.appendChild(input);
  }
}

//drag and drop functions
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  var itemDrag = ev.target.getAttribute('data-id');
  ev.dataTransfer.setData("text", itemDrag);
}

function drop(ev) {
  ev.preventDefault();
  var itemDrag = ev.dataTransfer.getData("text");
  var itemDrop = ev.target.parentElement.getAttribute('data-id');

  reordenarProdutos(itemDrag, itemDrop);
  renderTable(prodList);
}

function reordenarProdutos(idDrag, idDrop){
  idDrag = parseInt(idDrag);
  idDrop = parseInt(idDrop);

  var temp = prodList[idDrag];

  if(idDrag > idDrop){
    for(var i = idDrag; i >= idDrop; i--){
      prodList[i] = prodList[i-1];
      if(i == idDrop){
        prodList[i] = temp;
      }
    }
  } else {
    for(var i = idDrag; i <= idDrop; i++){
      prodList[i] = prodList[i+1];
      if(i == idDrop){
        prodList[i] = temp;
      }
    }
  }
}

//ordenar tabela por campos
th = document.getElementsByTagName("th");

for(let c=0; c < th.length; c++){
  th[c].addEventListener('click', ordenarItem(c))
}

function ordenarItem(c){
  return function(){
    sortTable(c);
  }
}

function sortTable(c) {
var table, rows, switching, i, x, y, shouldSwitch;
table = document.getElementById("prodTabela");
switching = true;

while (switching) {

  switching = false;
  rows = table.rows;

  for (i = 1; i < (rows.length - 1); i++) {

    shouldSwitch = false;

    x = rows[i].getElementsByTagName("TD")[c];
    y = rows[i + 1].getElementsByTagName("TD")[c];

    if(isNaN(x.innerHTML) && isNaN(y.innerHTML)){
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    } else{
      if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
        shouldSwitch = true;
        break;
      }
    }




  }
  if (shouldSwitch) {
    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
    switching = true;
  }
}
}

//atualizar Estoque
function atualizarEstoque(elemento){
var novoEstoque = elemento.value;
var idProduto = elemento.parentElement.parentElement.getAttribute('data-id');
if(novoEstoque == 0){
  prodList.splice(idProduto, 1);
} else{
  prodList[idProduto].estoque = novoEstoque;
  prodList[idProduto].valorT = prodList[idProduto].estoque * prodList[idProduto].valorU;
}
renderTable(prodList);
}

//buscar produtos
function buscar() {

var input, filter, table, tr, td, i, txtValue;
input = document.getElementById("busca");
filter = input.value.toUpperCase();
table = document.getElementById("prodTabela");
tr = table.getElementsByTagName("tr");

for (i = 0; i < tr.length; i++) {
  td = tr[i].getElementsByTagName("td")[1];
  if (td) {
    txtValue = td.textContent || td.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
}
}
