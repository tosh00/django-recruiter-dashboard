let jo = document.getElementById('data').value;
let candidates = JSON.parse(jo);
let table = document.getElementById('list');




for (let i = 0; i < candidates.length; i++) {
    var tr = document.createElement("tr");
    tr.addEventListener('click', function(){window.location.assign('./skills/'+candidates[i].id)}, true)
    table.appendChild(tr);
            var td = document.createElement("td");
            td.innerHTML = i+1;
            tr.appendChild(td);
    for (x in candidates[i]) {
        if (x != 'skills' && x != 'id') {
            var td = document.createElement("td");
            td.innerHTML = candidates[i][x];
            tr.appendChild(td);
        }
    }
    var td = document.createElement("td");
    td.classList.add("delete")
    td.addEventListener('click', function(){window.location.assign('./delete/'+candidates[i].id)})
    td.innerHTML = '<i class="far fa-trash-alt"></i>';
    tr.appendChild(td);
}