//These functions create different HTML elements and append them to the DOM

function createSelectElement(selectObject) { //creates a select element.

    let select = document.createElement('select');

    //id

    if (selectObject.id != undefined && document.getElementById(selectObject.id) == null) {
        select.id = selectObject.id;
    }
    //className

    if (selectObject.class != undefined ) {
        select.className = selectObject.class;
    }

    let defaultOpt = document.createElement('option');

    defaultOpt.innerText = selectObject.defaultText == undefined ? 'Select An Option' : selectObject.defaultText;

    defaultOpt.value = '';

    select.appendChild(defaultOpt);
    //create default option *
    //set properties of default option *
    //append it to parent

    for (let i = 0; i < selectObject.array.length; i++) {

        let option = document.createElement('option');

        option.innerText = selectObject.array[i];

        option.value = selectObject.array[i];

        select.appendChild(option);
    }

    //onchange property

    select.onchange = selectObject.onchangeFunc != undefined ? selectObject.onchangeFunc : undefined; 

    return select;
}

function createHeading(headingObj) {

    let heading = headingObj.size >= 1 && headingObj.size <= 5 ? document.createElement('h'+ headingObj.size) : document.createElement('h4');

    heading.innerText = (typeof headingObj.text == 'string') ? headingObj.text : 'no text';

    if (headingObj.id != undefined && document.getElementById(headingObj.id) == null) {

        heading.id = headingObj.id
        
    }

    return heading
}

function createImg(imageObj) {

    let image = document.createElement('img');

    image.src = imageObj.src != undefined ? imageObj.src : './img.jpeg';

    image.alt = imageObj.alt != undefined ? imageObj.alt : 'Image Could Not Load';

    if (imageObj.id != undefined && document.getElementById(imageObj.id) == null ) {

        image.id = imageObj.id;
        
    }

    if ( imageObj.class != undefined ) {

        image.className = imageObj.class;
        
    }

    return image 
}

function createDivElement(divObject) {

    //class and id

    const div = document.createElement('div');

    if (divObject.id != undefined && document.getElementById(divObject.id) == null) {

        div.id = divObject.id; 
        
    }

    if (divObject.class != undefined ) {

        div.className = divObject.class;
        
    }

    // console.log(div);

    return div
    
}

function createHyperLink(linkObject) {

    //class and id

    const link = document.createElement('a');


    //set my Id in the case that I define that property in my linkObject
    if (linkObject.id != undefined && document.getElementById(linkObject.id) == null) {

        link.id = linkObject.id; 
        
    }

    //set my Id in the case that I define that property in my linkObject
    if (linkObject.class != undefined ) {

        link.className = linkObject.class;
    }

    //property name openNewTab

    if ( linkObject.openNewTab === true ) {

        link.target = '_blank';
        
    }

    link.innerText = linkObject.text != undefined ? linkObject.text : 'Untitled Link';

    link.href = linkObject.hrefLink != undefined ? linkObject.hrefLink : 'No Link';

    // console.log(link);

    return link
    
}

function createInput(inputObj) { // id, class, sCheck, pHolder

    let input = document.createElement(`input`);

    input.id = inputObj.id != undefined && document.getElementById(inputObj.id) == null ? inputObj.id : `>> No ID <<`;

    input.spellcheck = inputObj.sCheck != undefined ? inputObj.sCheck : true;

    input.placeholder = inputObj.placeholder != undefined ? inputObj.placeholder : ``;

    input.className = inputObj.class != undefined ? inputObj.class : ``;

    return input

}

const goRestKey = 'cCurhOCUM_g5OPpgnDi-gzpu4amlLLfKlQ-Z'; //API key for goRest's API.

window.onload = () => {//Onload function that creates divs, buttons to view all goRest's users, displays all of the user's with 
// requestUsers (currentPage); and allows new users to be created with createPostForm().

    let uiDiv = createDivElement({id: 'uiDiv'});

    let postsDiv = createDivElement({id: 'postsDiv'});

    let formHeader = createHeading({size: 1, text: 'Please Input Information To Create New User'});

    let prevPage = document.createElement('button');
    
    prevPage.id = 'prevPage';

    prevPage.onclick = prevPageRequest;

    prevPage.innerText = 'Previous Page';

    let nextPage = document.createElement('button');

    nextPage.id = 'nextPage';

    nextPage.onclick = nextPageRequest;

    nextPage.innerText = 'Next Page';

    uiDiv.appendChild(prevPage);

    uiDiv.appendChild(nextPage);

    uiDiv.appendChild(formHeader);

    document.body.appendChild(uiDiv);

    document.body.appendChild(postsDiv);
    
    createPostForm()

    requestUsers(currentPage);

}

function requestUsers(pageNum) {  //GET request to access all users from goRest, takes pageNum as an argument.

    let xhr = new XMLHttpRequest();

    endpoint = `https://gorest.co.in/public-api/users?access-token=${goRestKey}&page=${pageNum}`;

    xhr.open('GET', endpoint, true);

    xhr.onload = () => {

        let response = JSON.parse(xhr.responseText);

        maxPages = response._meta.pageCount;

        let allUsers = response.result;

        displayUserPage(allUsers)

    };

    xhr.send();
}

function newUserRequest(body){ //Post request that takes body as an argument and sends to goRest's database.

 let xhr = new XMLHttpRequest(),

    endpoint = `https://gorest.co.in/public-api/users`;

    xhr.open('POST', endpoint, true);

    xhr.onload = () => {    
    
    let response = JSON.parse(xhr.responseText);

    console.log(response);

};

    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.setRequestHeader('Authorization', `Bearer ${goRestKey}`)

    xhr.send(body);
}

function deleteUserRequest(userId) { //Delete request takes userID as an argument and confirms and deletes a user from the DOM and goRest's database.

    let xhr = new XMLHttpRequest(),

    endpoint = `https://gorest.co.in/public-api/users/${userId}?access-token=${goRestKey}`;

    xhr.open('DELETE', endpoint, true);

    xhr.onload = () => {

        let response = JSON.parse(xhr.responseText);

        console.log(response);
    };

    xhr.send();
}

function updateUserRequest(userId, body){  //Patch request to goRest's database to edit a user's information using userId and body as arguments.

let xhr = new XMLHttpRequest(),

    endpoint = `https://gorest.co.in/public-api/users/${userId}?access-token=${goRestKey}`;

    xhr.open('PATCH', endpoint, true);

    xhr.onload = () => {

    let response = JSON.parse(xhr.responseText);

    console.log(response);

    };

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(body);

}

let currentPage = 1, //The first page in the UI

     maxPages; //An empty variable to allow all user's to be displayed to the dom.


function createPostForm(){ //Creates the form that contains inputs for a new user's information, appends to DOM and creates a submit button that is linked to submitnewUser function.

let form = document.createElement('div');

let fNameInput = document.createElement('input');

let lNameInput = document.createElement('input');

let genderInput = document.createElement('input');

let emailInput = document.createElement('input');

let phoneInput = document.createElement('input');

phoneInput.placeholder = 'Phone';

fNameInput.placeholder = 'First Name';

lNameInput.placeholder = 'Last Name';

genderInput.placeholder = 'Gender';

emailInput.placeholder = 'Email';

phoneInput.name = 'phone';

fNameInput.name = 'first_name';

lNameInput.name = 'last_name';

genderInput.name = 'gender';

emailInput.name = 'email';

// fNameInput.value = 'First Name';

// lNameInput.value = 'Last Name';

// genderInput.value = 'Gender';

// emailInput.value = 'Email Input';

let button = document.createElement('button');

button.innerText = 'Submit';

button.onclick = submitnewUser;

uiDiv.appendChild(form);

form.appendChild(fNameInput)

form.appendChild(lNameInput)

form.appendChild(emailInput)

form.appendChild(genderInput)

form.appendChild(phoneInput)

form.appendChild(button)

}

function submitnewUser(){//Iterates through the user inputs and makes sure all inputs are filled with a valid email address and alerts the user if not all of the inputs are filled or if other information is invalid. Then JSON stringifies the information and runs a newUserRequest call
    
       let divChildren = this.parentElement.children,
        
            userBody = {};
        
        for (const htmlElm of divChildren) {
    
            if (htmlElm.localName == 'input' && htmlElm.value.trim() != '') {
    
                userBody[htmlElm.name] = htmlElm.value.trim();
            }
        }
    
        if (Object.entries(userBody).length != 5) {
    
            console.log('no inputs filled');
    
            alert('All Inputs Must Be Filled')
    
            return
    
        } else {
     
            console.log('The request is a go')
        }

        const e = userBody.email,

            atRegEx = /@/g,

            dotRegEx = /\.\./,

            numOfAts = e.match(atRegEx).length;

            //must check there is only one @ symbol, and at least one dot after the @ symbol
        if (e[0] == '.' || e[e.length-1] == '.' || numOfAts != 1 || dotRegEx.test(e)){

                alert('Your email input is not a valid email')

                return

        }
    
        userBody = JSON.stringify(userBody);
    
        newUserRequest(userBody); 
        
}

function prevPageRequest() {//Makes a post request for the previous page.

    currentPage = currentPage == 1 ? maxPages : currentPage-1;

    requestUsers(currentPage);

}

function nextPageRequest(){//Makes a post request for the next page.

    currentPage = currentPage == maxPages ? 1 : currentPage+1;

    requestUsers(currentPage);
}

function displayUserPage(usersData) {//Creates HTML elements for editUser/deleteUser/cancelUser and Users. Appends them to the dom.

    postsDiv.innerHTML = '';

    let pageHeading = createHeading({size: 1, text: `Viewing Page ${currentPage}`})

    postsDiv.appendChild(pageHeading);
    
    console.log(usersData);

    for (let i = 0; i < usersData.length; i++) {

        let div = createDivElement({});

        div.id = usersData[i].id;

        //heading
        let nameHeader = createHeading({size: 2, text: `Name: ${usersData[i].first_name} ${usersData[i].last_name}`});

        let dobHeader = createHeading({size: 4, text: `Date of Birth: ${usersData[i].dob}`});

        let emailHeader = createHeading({size: 4, text: `Email: ${usersData[i].email}`});

        let phoneHeader = createHeading({size: 4, text: `Phone Number: ${usersData[i].phone}`});

        let genderHeader = createHeading({size: 4, text: `Gender: ${usersData[i].gender}`});

        //inputs
        let fNameInput = document.createElement('input');
        
        fNameInput.placeholder = 'Enter A New First Name';

        fNameInput.name = 'first_name';

        let lNameInput = document.createElement('input');

        lNameInput.placeholder = 'Enter A New Last Name';

        lNameInput.name = 'last_name';

        let dobInput = document.createElement('input');

        dobInput.placeholder = 'Date-of-Birth Y-M-D';

        dobInput.name = 'dob';

        let emailInput = document.createElement('input');

        emailInput.placeholder = 'Enter A New Email';

        emailInput.name = 'email';

        let phoneInput = document.createElement('input');

        phoneInput.placeholder = 'Enter A New Phone Number';

        phoneInput.name = 'phone_number';

        let genderInput = document.createElement('input');

        genderInput.placeholder = 'Enter A New Gender';

        genderInput.name = 'gender';
     
    //buttons
        let editBtn = document.createElement('button');

        editBtn.innerText = 'Edit This Post'

        editBtn.onclick = editUser;

        let deleteBtn = document.createElement('button');

        deleteBtn.innerText = 'Delete This Post'

        deleteBtn.onclick = deleteUser;

        let cancelBtn = document.createElement('button');

        cancelBtn.innerText = 'Cancel Edit'

        cancelBtn.onclick = cancelEdit;

        let confirmBtn = document.createElement('button');

        confirmBtn.innerText = 'Confirm Edit'

        confirmBtn.onclick = confirmEdit;

        //append to subdiv

        let displayDiv = document.createElement('div');

        let editDiv = document.createElement('div');

        div.appendChild(displayDiv);

        div.appendChild(editDiv);

        editDiv.style.display = 'none';

        //what displays when not in edit mode

        displayDiv.appendChild(nameHeader);

        displayDiv.appendChild(dobHeader);

        displayDiv.appendChild(emailHeader);

        displayDiv.appendChild(phoneHeader);

        displayDiv.appendChild(genderHeader);

        displayDiv.appendChild(editBtn);
        
        displayDiv.appendChild(deleteBtn);
        
        //What displays in edit mode

        editDiv.innerHTML += '<br>First Name:  ';

        editDiv.appendChild(fNameInput);

        editDiv.innerHTML += '<br>Last Name:  ';

        editDiv.appendChild(lNameInput);

        editDiv.innerHTML += '<br>Date of Birth: ';

        editDiv.appendChild(dobInput);

        editDiv.innerHTML += '<br>Email: ';

        editDiv.appendChild(emailInput);

        editDiv.innerHTML += '<br>Phone Number: ';

        editDiv.appendChild(phoneInput);

        editDiv.innerHTML += '<br>Gender: ';

        editDiv.appendChild(genderInput);

        editDiv.appendChild(cancelBtn);

        editDiv.appendChild(confirmBtn);

        postsDiv.appendChild(div);
    }
}

function editUser() {//When ran this function reveals the input form to edit a user's information.

    let editDiv = this.parentElement.parentElement.lastChild;

    editDiv.style.display = 'inline';

    //hide/show elements

    this.parentElement.style.display = 'none';

}

function deleteUser(){//Delete's a user from the DOM and makes a DELETE XMLHttpRequest to goRest's database.
 
    let userId = this.parentElement.parentElement.id;

    let confirm = prompt('type CONFIRM');

    console.log(userId)

    if (confirm != null && confirm.toLowerCase() == 'confirm' ){

    this.parentElement.parentElement.remove();

    deleteUserRequest(userId);

    } else {

    alert('The User Was Not Deleted')

    }

}

function cancelEdit(){//Allows a user to cancel any sort of information they put into the edit form.

    alert('Nothing was edited');

    let displayDiv = this.parentElement.parentElement.firstChild;

    let editDiv = this.parentElement.parentElement.lastChild;
        
    displayDiv.style.display = 'inline';

    editDiv.style.display = 'none';
}

function confirmEdit(){//Iterates through the inputs of the edit inputs, stringifies them and runs updateUserRequest to make the patch request.

    let divChildren = this.parentElement.children,

        userId = this.parentElement.parentElement.id,

        updateReqBody = {};

        for (const htmlElm of divChildren) {

        if (htmlElm.localName == 'input' && htmlElm.value.trim() != '') {

            updateReqBody[htmlElm.name] = htmlElm.value.trim();
        }
    }

    if (JSON.stringify(updateReqBody) === '{}') {

        console.log('no inputs filled');

        alert('No input were filled, no were changes made.')

        return

    } else {
 
        console.log('The request is a go')
    }

    updateReqBody = JSON.stringify(updateReqBody);

    updateUserRequest(userId, updateReqBody); 

    let displayDiv = this.parentElement.parentElement.firstChild;

    let editDiv = this.parentElement.parentElement.lastChild;
    
    displayDiv.style.display = 'inline';

    editDiv.style.display = 'none';
}


