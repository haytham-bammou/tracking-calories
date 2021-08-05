// storage controller
const StorageCtrl = (function () {

    return {
        storeItem : newItem => {
            let items = [];
            if(localStorage.getItem('items') !== null ) {
                items = JSON.parse(localStorage.getItem('items'));
            }
            items.push(newItem);
            localStorage.setItem('items', JSON.stringify(items));
        },
        getItemsFromStorage : () => {
            return localStorage.getItem('items') !== null ? JSON.parse(localStorage.getItem('items')) : [];
        },
        updateItemStorage : updatedItem => {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item , index) => {
                if(item.id === updatedItem.id) {
                    items.splice(index,1,updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage : id => {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach( (item , index) => {
                if(item.id === id) {
                    items.splice(index,1);
                }
            })
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearAllFromStorage : () => localStorage.removeItem('items')
    }


})();

// item controller
const ItemCtrl = (function () {

    const item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    // data structure / State

    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        logData: () => data,
        getItems: () => data.items,
        addItem: (name,cal) => {
            let ID;
            // create id 
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID=0;
            }
            const calories = parseInt(cal);
            const newItem = new item(ID,name,calories)
            data.items.push(newItem);
            return newItem;
        },
        getTotalCalories : ()=>{
            let totalCalories = 0;
            data.items.forEach(item => totalCalories += item.calories);
            data.totalCalories = totalCalories;
            return data.totalCalories;
        },
        setCurrentItem : current => data.currentItem = current ,
        getCurrentItem : () => data.currentItem ,
        updateItem : (name , calories) => {
            calories = parseInt(calories); 
            let found = null;
            data.items.forEach(item => {
                if(item.id === data.currentItem.id)
                {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            })
            return found;
        },
        deleteItem : id => {
            const ids = data.items.map(item => item.id);
            const index = ids.indexOf(id);
            data.items.splice(index, 1); 
        },
        deleteAll : () => {
            data.items = [];
        }
    }
})();

// UI controller

const UICtrl = (function () {

    // UI selectors 
    const UISelectors = {
        itemList : '#item-list',
        addBtn : '.add-btn',
        updateBtn : '.update-btn',
        deleteBtn : '.delete-btn',
        backBtn : '.back-btn',
        itemNameInput : '#item-name',
        itemCaloriesInput : '#item-calories',
        totalCalories : '.total-calories',
        listItems : '#item-list li',
        clearBtn : '.clear-btn',
    }
    // get forms input 
    return {
        populateItemList: (items) => {

            let html = '';
            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>
                        </li>`
            });
            document.querySelector(UISelectors.itemList).innerHTML = html;
        } ,
        getSeletors : () => UISelectors ,

        getItemInput : () => {
            return {
                name : document.querySelector(UISelectors.itemNameInput).value,
                calories : document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem : (item)=>{
            document.querySelector(UISelectors.itemList).style.display = 'block';
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `;
            // insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend' , li);
        },
        clearInputs : () => {
            document.querySelector(UISelectors.itemNameInput).value = '' ;
            document.querySelector(UISelectors.itemCaloriesInput).value = '' ;
        },
        hideList : () => {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories : (totalCalories) => {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState : () => {
            UICtrl.clearInputs();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        addItemToform : ()=> {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name ;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories ;
            UICtrl.showEditState();
        },
        showEditState : () => {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';        
        },
        updateListItem : updatedItem => {
            let listItems = document.querySelectorAll(UISelectors.listItems)
            listItems.forEach(item =>{
                let itemId = item.getAttribute('id');
                if(itemId === `item-${updatedItem.id}`){
                    document.querySelector(`#${itemId}`).innerHTML=`
                    <strong>${updatedItem.name}: </strong> <em>${updatedItem.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                    `;
                }
            })
        },
        deleteListItem : id => {
            document.getElementById(`item-${id}`).remove();
            if(ItemCtrl.getItems().length === 0) {
                UICtrl.hideList();
            }
        },
        deleteItems : () => {
            const items = document.querySelectorAll(UISelectors.listItems);
            items.forEach(item => item.remove());
            UICtrl.hideList();
        }
    } 

})();


// App controller

const App = (function (ItemCtrl, UICtrl , StorageCtrl) {

    // Load Event Listeners

    const loadEventListeners = ()=>{
        const UISelectors = UICtrl.getSeletors();
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);
        // disable submit on enter
        document.addEventListener('keypress',(e)=>{
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
            }
        })
        document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);
        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);
        document.querySelector(UISelectors.backBtn).addEventListener('click',e => {
            e.preventDefault();
            UICtrl.clearEditState();
        });

        // delete event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);
        document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAll);


    }

    // add item submit function
    const itemAddSubmit = function(e) {
        // get form input from the ui ctrl 
        const input = UICtrl.getItemInput();  
        // check  for name and calories 
        if(input.name!=='' && input.calories!==''){
            // ADD item 
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // add item to the ui 
            UICtrl.addListItem(newItem);

            // get the total calories 
            const totalCalories = ItemCtrl.getTotalCalories();

            // add total calories to the ui 

            UICtrl.showTotalCalories(totalCalories);

            // store in local storage 
            StorageCtrl.storeItem(newItem)

            // clear inputs 
            UICtrl.clearInputs();
        }
        e.preventDefault();

    }

    const itemEditClick = (e) => {
        e.preventDefault();
        if(e.target.classList.contains('edit-item')){
            // get the list item id 
            let id = e.target.parentElement.parentElement.id;
            id = parseInt(id.split('-')[1]);
            let currentItem; 
            ItemCtrl.getItems().forEach(item => {
                if(item.id === id) currentItem = item;
            });
            ItemCtrl.setCurrentItem(currentItem);        
            // add item to the form  
            UICtrl.addItemToform();   
        }
    }

    const itemUpdateSubmit = e => {
        e.preventDefault();
        // get item inputs 
        const input = UICtrl.getItemInput();

        // update item 
        const updateItem = ItemCtrl.updateItem(input.name , input.calories);

        // update the ui
        UICtrl.updateListItem(updateItem);

        // get the total calories 
        const totalCalories = ItemCtrl.getTotalCalories()
        // add total calories to the ui 

        UICtrl.showTotalCalories(totalCalories);

        // update local storage
        StorageCtrl.updateItemStorage(updateItem);

        UICtrl.clearEditState();
    }

    const itemDeleteSubmit = e =>{
        e.preventDefault();

        // get id from current item 
        const id = ItemCtrl.getCurrentItem().id;
        ItemCtrl.deleteItem(id);

        // delete from the ui 
        UICtrl.deleteListItem(id);

        // get the total calories 
        const totalCalories = ItemCtrl.getTotalCalories()
        // add total calories to the ui 

        UICtrl.showTotalCalories(totalCalories);

        // delete from storage
        StorageCtrl.deleteItemFromStorage(id);
        // clear edit state
        UICtrl.clearEditState();

    }

    const clearAll = () => {
        // delete all items from data
        ItemCtrl.deleteAll();

        // get the total calories 
        const totalCalories = ItemCtrl.getTotalCalories()
        // add total calories to the ui 
    
        UICtrl.showTotalCalories(totalCalories);

        // delete from the storage
        StorageCtrl.clearAllFromStorage();

        // remove from the ui 
        UICtrl.deleteItems();
    }

    return {
        init: () => {
            console.log("init app ....");
            UICtrl.clearEditState();
            const items = ItemCtrl.getItems();
            if(items.length === 0) UICtrl.hideList();
            else {
                UICtrl.populateItemList(items);
                const totalCalories = ItemCtrl.getTotalCalories()
                UICtrl.showTotalCalories(totalCalories)
            }
           loadEventListeners();
        }
    }

})(ItemCtrl, UICtrl , StorageCtrl);

App.init();
