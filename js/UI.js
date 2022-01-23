var pbi = document.getElementById('playerBoxIndex')

function playerBoxIndex_search() {
  fetch('box/search.html')
    .then(response => console.log(response.blob))
}
