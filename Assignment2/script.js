//This array contains the list items
var item_array = [];

document.addEventListener('DOMContentLoaded', function() {
    //Modifying the form's onsubmit function
    document.querySelector('#task_form').onsubmit = function() {

        const li = document.createElement('li');
        let title = document.querySelector('#task_title').value;
        let priority = document.querySelector('#task_priority').value;
        let stat = null;
        if (document.querySelector('input[name="task_status"]:checked')==null){
            stat = 'pending';
        }
        else {
            stat = document.querySelector('input[name="task_status"]:checked').value;
        }
        li.dataset.task_title = title;
        li.dataset.task_priority = priority;
        li.dataset.task_status = stat;
        console.log(title + priority + stat);
        updateLi(li);
        //adding list item to DOM
        document.querySelector('#task_list').append(li);
        //adding list item to the array
        item_array.push(li);
        //clearing text input
        document.querySelector('#task_title').value = '';

        return false;
    }

    //Adding functionality to the buttons attached to each list item
    document.addEventListener('click', event => {

        let element = event.target;

        //remove button
        if (element.classList.contains('remove')) {
            //removing list item from array
            for(var i = 0; i < item_array.length; i++){                
                if (item_array[i]==element.parentElement) { 
                    item_array.splice(i, 1); 
                    i--; 
                }
            }
            //removing list item from DOM
            element.parentElement.remove();
        }

        //pending button
        if(element.classList.contains('pending')) {
            element.parentElement.dataset.task_status = 'pending';
            updateLi(element.parentElement);
        }

        //complete button
        if(element.classList.contains('complete')) {
            element.parentElement.dataset.task_status = 'complete';
            updateLi(element.parentElement);
        }
    })
});

function updateLi(list_item) {
    if (list_item.dataset.task_status=='pending') {
        list_item.innerHTML = 
            `<span> ${list_item.dataset.task_title} | Priority: ${list_item.dataset.task_priority} | </span> 
            <button type="button" class="btn btn-success complete">Mark as Complete</button>
            <button type="button" class="btn btn-warning pending">Mark as Pending</button>
            <button type="button" class="btn btn-danger remove">Remove Item</button>`;
    }
    else {
        list_item.innerHTML = 
            `<span style="text-decoration: line-through;"> ${list_item.dataset.task_title} | Priority: ${list_item.dataset.task_priority} | </span> 
            <button type="button" class="btn btn-success complete">Mark as Complete</button>
            <button type="button" class="btn btn-warning pending">Mark as Pending</button>
            <button type="button" class="btn btn-danger remove">Remove Item</button>`;
    }
}