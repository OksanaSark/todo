document.addEventListener('DOMContentLoaded', function (){
    async function getTodo() {
        try{
            const response  = await fetch('http://localhost:3000/todos');
            if (!response.ok) {
                const message = 'Error with Status Code: ' + response.status;
                throw new Error(message);
            }
            const data = await response.json();
            return data.todos;
        } catch (err) {
            console.log('Error: ' + err);
        }
    }

    function getDate(dateStr) {
        const monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec" ];
        const date = new Date(Date.parse(dateStr));
        return `${monthNames[date.getMonth()]} ${date.getDate()}`
    }
    function clearTodosUI() {
        const todos = document.querySelector('.todo');
        todos.innerHTML = '';
    }

    async function showTodo() {
        const data = await getTodo();
        await clearTodosUI();

        const div = document.querySelector('.todo');
        if (data){
            data.forEach((item, index) => {
                div.insertAdjacentHTML('beforeend', `<div class="todo__item">
                        <input class="todo__description" type="text" value="${item.description}">
                        <div class="todo__date">
                            ${getDate(item.date)}
                        </div>
                        <div class="todo__check">
                            <label>
                                <input class="checkbox" type="checkbox">
                                <span class="fake-checkbox"></span>
                            </label>
                        </div>
                        <div class="todo__delete">
                            <img src="icons/basket.svg">
                        </div>
                    </div>`);
                const checkbox = document.querySelectorAll('.checkbox')
                if (item.completed === true) {
                    checkbox[index].setAttribute('checked', true);
                    checkbox[index].closest('.todo__item').firstElementChild.style.textDecoration = 'line-through';
                }
            })
             calcTotalCounter();
             calcSuccessCounter();
             calcPendingCounter();
        }
    }

    async function deleteTodos (id) {
        try{
            const response = await fetch(`http://localhost:3000/todos/${id}`, {
                method: 'delete'
        });
            if (!response.ok){
                const message = 'Error with Status Code: ' + response.status;
                throw new Error(message);
            }
            const data = await response.json();
            return data;
        } catch (err) {
            console.log('Error: ' + err.message);
        }
    }

    function deleteAllTodos(){
        const btnDeleteAll = document.querySelector('.delete_all');
        btnDeleteAll.addEventListener('click', async function(event) {
            event.preventDefault();
            const data = await getTodo();

            for (const item of data){
               await deleteTodos(item._id);
            }
            await showTodo();
        })
    }


    function deleteOneTodo(){
        const todos = document.querySelector('.todo');
        todos.addEventListener('click', async function (event){
            event.preventDefault();
            if (event.target.tagName !== 'IMG') return;
            const todo = event.target.closest('.todo__item');
            const todosAll = Array.from(document.querySelectorAll('.todo__item'));
            const index = todosAll.indexOf(todo);
            const data = await getTodo();
            await deleteTodos(data[index]._id);
            await showTodo();
        })
    }

    function addNewTodo() {
        const form = document.querySelector('form');
        let input = document.forms[0].textInput;

         form.addEventListener('submit',  async function (event){
             event.preventDefault();
             await createTodo({'description': `${input.value}`,
                 'completed': false});
             await showTodo();
             document.querySelector(".textInput").value = "";
         })
    }

    async function createTodo(body) {
        try{
            const response = await fetch('http://localhost:3000/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if (!response.ok){
                const message = 'Error with Status Code: ' + response.status;
                throw new Error(message);
            }
            const data = await response.json();
            return data;
        } catch (err) {
            console.log('Error: ' + err);
        }
    }

    async function changeTodo(id, body) {
        try{
            const response = await fetch(`http://localhost:3000/todos/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                const message = 'Error with Status Code: ' + response.status;
                throw new Error(message);
            }
            const data = await response.json();
            return data;
        } catch (err) {
            console.log(err);
        }
    }


    function changeTodos() {
        const todos = document.querySelector('.todo');
        todos.addEventListener('click', async function (event){
            if ((event.target.className !== 'todo__description') && (event.target.className !== 'fake-checkbox')) return;
            const data = await getTodo();

            const todo = event.target.closest('.todo__item');
            const todosAll = Array.from(document.querySelectorAll('.todo__item'));
            const index = todosAll.indexOf(todo);

            if (event.target.className === 'todo__description'){
                event.target.addEventListener('change', async function (){
                    await changeTodo(data[index]._id, {'description': `${event.target.value}`})
                })
            }

            if (event.target.className === 'fake-checkbox') {
                if (data[index].completed === false) {
                    await changeTodo(data[index]._id, {'completed': true});
                } else if (data[index].completed === true) {
                    await changeTodo(data[index]._id, {'completed': false});
                }
                await showTodo();
            }
        })
    }


    function calcTotalCounter() {
        const totalCounter = document.querySelector('.counters__total');
        const checkboxes = Array.from(document.querySelectorAll('.checkbox'));
        totalCounter.innerHTML = `TOTAL: ${checkboxes.length}`;
    }


    function calcSuccessCounter() {
        const successCounter = document.querySelector('.counters__success');
        const checkboxes = Array.from(document.querySelectorAll('.checkbox'));
        let count = 0;
        checkboxes.forEach(item => {
            if (item.checked === true){
               count++;
            }
        })
        successCounter.innerHTML = `SUCCESS: ${count}`;
    }

    function calcPendingCounter() {
        const pendingCounter = document.querySelector('.counters__pending');
        const checkboxes = Array.from(document.querySelectorAll('.checkbox'));
        let count = 0;
        checkboxes.forEach(item => {
            if (item.checked === false){
                count++;
            }
        })
        pendingCounter.innerHTML = `PENDING: ${count}`;
    }

    showTodo();
    deleteAllTodos();
    deleteOneTodo();
    addNewTodo();
    changeTodos();
})