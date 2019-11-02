import _ from "lodash";
import { format } from 'date-fns';

console.log(format(new Date(), "'Today is a' iiii"));

let appState = 'Main'; //Available app states are Main, AddTask, EditTask, AddCategory
let selectedItem;
let taskList = [];
let categoryList = ['Default', 'Chores'];

const pageLoad = () => {
    let itemSelected = false;
    itemManagement.addTestItems();
    pageManagement.populateCategoryList();
    pageManagement.displayList();
    pageManagement.startButtonListeners();

    $(document).on('click', '.list-group-item', function () {
        if (itemSelected === false) {
            itemSelected = true;
            $(".list-group-item").removeClass("active");
            $(this).addClass("active");
            let idAttribute = ($(this).attr('id'));
            let recordId = idAttribute.substring(8);
            selectedItem = recordId;
            pageManagement.enableEditandDeleteBtns();
            console.log(selectedItem);
        } else if (itemSelected === true) {
            $(".list-group-item").removeClass("active");
            pageManagement.disableEditandDeleteBtns();
            itemSelected = false;
        }
    });
}

const itemManagement = (() => {
    let itemRecord = 0;

    const createItem = (subject, status, priority, dueDate, category) => {
        itemRecord++;
        let active = true;
        console.log(`item ${itemRecord} created!`);
        return { itemRecord, active, subject, status, priority, dueDate, category }
    }
    const deleteItem = (itemToDelete) => {
        let deletedItem = _.remove(taskList, item => item.itemRecord === itemToDelete);
        console.log(`deleted item ${itemToDelete}`);
    }
    const addToArray = (itemToPush) => {
        taskList.push(itemToPush);
    }
    const showArray = () => {
        console.log(taskList);
    }
    const addTestItems = () => {
        let newItem;
        newItem = itemManagement.createItem('toDo2', 'New', 'High', '10/31/2019', 'Default');
        itemManagement.addToArray(newItem);
        itemManagement.showArray();
    }
    const addNewItem = () => {

        let pageValues = pageManagement.getFormValues();
        const newItem = itemManagement.createItem(pageValues.subject, pageValues.status, pageValues.priority, pageValues.dueDate, pageValues.category);
        itemManagement.addToArray(newItem);
        itemManagement.showArray();
    }

    const editItem = () => {
        let pageValues = pageManagement.getFormValues();
        const newItem = itemManagement.createItem(pageValues.subject, pageValues.status, pageValues.priority, pageValues.dueDate, pageValues.category);
        const foundIndex = taskList.findIndex(({ itemRecord }) => itemRecord == selectedItem);
        taskList.splice(foundIndex, 1, newItem)
    }

    return {createItem, deleteItem, addToArray, showArray, addTestItems, addNewItem, editItem}
})()

const pageManagement = (() => {
    const insertForm = () => {
        $(function () {
            $('Body').append('<form></form>');
            $('form').append('<input type="text" id="inputSubject" value="Subject">');
            $('form').append('<input type="text" id="inputDescription" value="Description">');
            $('form').append('<input type="text" id="inputStatus" value="Status">');
            $('form').append('<input type="text" id="inputPriority" value="Priority">');
            $('form').append('<input type="text" id="inputDueDate" value="Due Date">');
            $('form').append('<input type="button" id="btnSaveTask" value="Save Task">');
            $("input").after("<br />")
            $('#btnSaveTask').click(function () {
                itemManagement.addNewItem();
                pageManagement.insertListItems();
            });
        });
    }

    const disableEditandDeleteBtns = () => {
        $('#btnEditTask').prop('disabled', true);
        $('#btnDeleteTask').prop('disabled', true);
    }

    const enableEditandDeleteBtns = () => {
        $('#btnEditTask').prop('disabled', false);
        $('#btnDeleteTask').prop('disabled', false);
    }


    const clearInputBoxes = () => {
        $('#inputSubject').val('');
        $('#inputPriority').val('Low');
        $('#inputDueDate').val('');
        $('#inputStatus').val('New');
        $('#inputCategoryAddEdit').val('Default');

    }

    const getFormValues = () => {
        const subject = $('#inputSubject').val();
        const status = $('#inputStatus').val();
        const priority = $('#inputPriority').val();
        const getDate = new Date($('#inputDueDate').val());
        const dueDate = getDate.toUTCString();
        const category = $('#inputCategoryAddEdit').val();

        return{subject, status, priority, dueDate, category};
    }

    const displayList = () => {
        $("#listSpace").empty();
        const selectedCategory = $('#inputCategoryMain').val();
        let i = 0;
        for (i = 0; i < taskList.length; i++) {
            if (taskList[i].active === true) {
                let j = 0;
                    if (taskList[i].category === selectedCategory) {
                        let listSubject = taskList[i].subject;
                        let listDueDate = taskList[i].dueDate;
                        console.log(listDueDate);
                        console.log(format(new Date(listDueDate), 'MM/dd/yyyy'))
                        let listPriority = taskList[i].priority;
                        let listStatus = taskList[i].status;
                        let itemRecord = taskList[i].itemRecord;
                        let itemCategory = taskList[i].category;
                        $("#listSpace").append(`<a href="#" id="listItem${itemRecord}" class="list-group-item list-group-item-action"> <div class= "d-flex w-100 justify-content-between"><h5 class="mb-1">${listSubject}</h5><small>${listDueDate}</small></div ><p class="mb-1">${listStatus}</p><small>${listPriority}</small></a >`);
                    }
            }
        }
    }

    const populateCategoryList = () => {
        $("#inputCategoryMain").empty();
        $("#inputCategoryAddEdit").empty();
        categoryList.sort();
        let i = 0;
        for (i = 0; i < categoryList.length; i++) {
            let mainPageList = $("#inputCategoryMain");
            let addEditList = $("#inputCategoryAddEdit");
            mainPageList.append(new Option(categoryList[i], categoryList[i]));
            addEditList.append(new Option(categoryList[i], categoryList[i]));
        }
    }

    const getSelectedItem = () => {

        let i = 0;
        for (i = 0; i<taskList.length; i++) {
            if (taskList[i].itemRecord == selectedItem) {
                const selectedRecordID = selectedItem;
                const selectedSubject = taskList[i].subject;
                const selectedPriority = taskList[i].priority;
                const selectedStatus = taskList[i].status;
                const selectedDueDate = taskList[i].dueDate;
                const selectedCategory = taskList[i].category;
                updateEditBoxValues(selectedRecordID, selectedSubject, selectedStatus, selectedPriority, selectedDueDate, selectedCategory);
            }
        }
    }

    const updateEditBoxValues = (recordID, subject, status, priority, dueDate, category) => {
        $('#inputSubject').val(subject);
        $('#inputDueDate').val(dueDate);
        $(`#inputPriority option[value="${priority}"]`).attr('selected', 'selected');
        $(`#inputPriority option[value="${priority}"]`).prop('selected', 'selected');
        $(`#inputStatus option[value="${status}"]`).attr('selected', 'selected');
        $(`#inputStatus option[value="${status}"]`).prop('selected', 'selected');
        $(`#inputCategoryAddEdit option[value="${category}"]`).attr('selected', 'selected');
        $(`#inputCategoryAddEdit option[value="${category}"]`).prop('selected', 'selected');
    }

    const startButtonListeners = () => {
        $('#btnAddTask').click(function () {
            $("#addTaskModal").modal('show');
            $('#addTaskModalLabel').text('Add Task')
            $('#btnSaveTask').val('Save Task')
            pageManagement.clearInputBoxes();
            appState = 'AddTask';
        })
        $('#btnEditTask').click(function () {
            pageManagement.clearInputBoxes();
            pageManagement.getSelectedItem();
            $('#addTaskModalLabel').text('Edit Task')
            $('#btnSaveTask').val('Save Changes')
            $("#addTaskModal").modal('show');
            appState = 'EditTask'; 

        })
        $('#addTaskForm').submit(function () {
            console.log('ya submit');
            if (appState === 'AddTask') {
                itemManagement.addNewItem();
            } else if (appState === 'EditTask') {
                itemManagement.editItem();
            }
            
            pageManagement.displayList();
            $('#addTaskModal').modal('hide')
            appState = 'Main';

        })
        $('#btnDeleteTask').click(function () {
            let i = 0;
            for(i = 0; i < taskList.length; i++) {
                if (taskList[i].itemRecord == selectedItem) {
                    taskList[i].active = false
                }
            }
            pageManagement.displayList();
        })

        $('#btnAddCategory').click(function () {
            $("#addCategoryModal").modal('show');
            appState = 'addCategory';
        })

        $('#btnSaveCategory').click(function () {
            pageManagement.addCategory();
            appState = 'Main';
        })

        $('#btnCloseCategoryModal').click(function () {
            $("#addCategoryModal").modal('hide');
            appState = 'Main';
        })

        $('#btnCloseAddTaskModal').click(function () {
            $("#addTaskModal").modal('hide');
            appState = 'Main';
        })


        $("#inputCategoryMain").change(function () {
            pageManagement.displayList();
        });
    }

    return {disableEditandDeleteBtns, enableEditandDeleteBtns, getFormValues, insertForm, displayList, clearInputBoxes, startButtonListeners, getSelectedItem, updateEditBoxValues, populateCategoryList}
})();

pageLoad();