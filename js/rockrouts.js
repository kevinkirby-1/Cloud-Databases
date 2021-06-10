const routList = document.querySelector('#routList');
const form = document.querySelector('#add-rout-form');
const editform = document.querySelector('#edit-rout-form');
const newButton = document.querySelector('#newButton');
const cancel = document.querySelector('#cancel');
const cancelEdit = document.querySelector('#cancelEdit');

// displaying each rout with buttons
function displayRout(doc){
    let li = document.createElement('li');
    let name_grade = document.createElement('span');
    let plus = document.createElement('button');
    let setter = document.createElement('li');
    let attempts = document.createElement('li');
    let notes = document.createElement('li');
    let remove = document.createElement('button');
    let edit = document.createElement('button');

    li.setAttribute('data-id',doc.id);
    setter.setAttribute('class', 'details');
    attempts.setAttribute('class', 'details');
    notes.setAttribute('class', 'details');
    edit.setAttribute('class', 'details');
    edit.setAttribute('id', 'edit');
    remove.setAttribute('class', 'details');
    remove.setAttribute('id', 'delete');

    name_grade.textContent = doc.data().name + ': ' + doc.data().grade;
    plus.textContent = '+';
    setter.textContent = 'Setter: ' + doc.data().setter;
    attempts.textContent =  'Attemps: ' + doc.data().attempts;
    notes.textContent = 'Notes: ' + doc.data().notes;
    remove.textContent = 'Delete Rout';
    edit.textContent = 'Edit Rout';


    li.appendChild(name_grade);
    li.appendChild(plus);
    li.appendChild(setter);
    li.appendChild(attempts);
    li.appendChild(notes);
    li.appendChild(remove);
    li.appendChild(edit);
    routList.appendChild(li);

    // display details
    let toggle = 'min';
    plus.addEventListener('click', (evnt) => {
        if (toggle == 'min') {
            setter.style.display = 'block';
            attempts.style.display = 'block';
            notes.style.display = 'block';
            remove.style.display = 'block';
            edit.style.display = 'block';
            toggle = 'max';
            plus.innerHTML = '-';
        }
        else if (toggle == 'max') {
            setter.style.display  = 'none';
            attempts.style.display  = 'none';
            notes.style.display = 'none';
            remove.style.display = 'none';
            edit.style.display = 'none';
            toggle = 'min';
            plus.innerHTML = '+';
        }
    })

    // remove rout
    remove.addEventListener('click', (evnt) => {
        let id = evnt.target.parentElement.getAttribute('data-id');
        db.collection('routs').doc(id).delete();
    })

    // show edit form
    edit.addEventListener('click', (evnt) => {
        editform.style.display = 'grid';
        editform.setAttribute('id', doc.id);
        editform.name.value = doc.data().name;
        editform.grade.value = doc.data().grade;
        editform.setter.value = doc.data().setter;
        editform.attempts.value = doc.data().attempts;
        editform.notes.value = doc.data().notes;
    })

}

// real-time listener to get data
db.collection('routs').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added'){
            displayRout(change.doc);
        }
        else if (change.type == 'removed'){
            let li = routList.querySelector('[data-id=' + change.doc.id + ']');
            routList.removeChild(li);
        }
    })
})


// adding data
form.addEventListener('submit', (evnt) => {
    evnt.preventDefault();
    db.collection('routs').add({
        name: form.name.value,
        grade: form.grade.value,
        setter: form.setter.value,
        attempts: form.attempts.value,
        notes: form.notes.value
    });
    form.name.value = '';
    form.grade.value = '';
    form.setter.value = '';
    form.attempts.value = '';
    form.notes.value = '';
    form.style.display = 'none';
    newButton.style.display = 'block'
})

// edit data
editform.addEventListener('submit', (evnt) => {
    evnt.preventDefault();
    db.collection('routs').doc(editform.id).update({
        name: editform.name.value,
        grade: editform.grade.value,
        setter: editform.setter.value,
        attempts: editform.attempts.value,
        notes: editform.notes.value
    });
    editform.style.display = 'none';
})

// show add form
newButton.addEventListener('click', (evnt) => {
    evnt.preventDefault();
    form.style.display = 'grid';
    newButton.style.display = 'none';
})

// hide add form
cancel.addEventListener('click', (evnt) => {
    evnt.preventDefault();
    form.style.display = 'none';
    newButton.style.display = 'block';
})

//hide edit form
cancelEdit.addEventListener('click', (evnt) => {
    evnt.preventDefault();
    editform.style.display = 'none';
})

