/**
 * Define all global variables here
 */

/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [];
var numberOfStudents;

/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var studentName = "#studentName";
var studentCourse = "#course";
var studentGrade = "#studentGrade";
var inputIds = [studentName, studentCourse, studentGrade];

/**
 * addClicked - Event Handler when user clicks the add button
 */
function addClicked() {
    addStudent();
    updateStudentList()
    clearAddStudentForm();
    calculateAverage();
}

/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked() {
    clearAddStudentForm();
}

/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
function addStudent() {
    var student = {};
    student.name = $('#studentName').val();
    student.course = $('#course').val();
    student.grade = $('#studentGrade').val();
    student_array.push(student);

}

/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm() {
    var allInputs = inputIds.length;
    for (var a = 0; a < allInputs; a++) {
        $(inputIds[a]).val("");
    } //end for loop
}; // end function

/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage() {
    numberOfStudents = student_array.length;
    var gradeTotal = 0;
    for (var i = 0; i < numberOfStudents; i++) {
        var oneStudentGrade = parseFloat(student_array[i].grade);
        gradeTotal = gradeTotal + oneStudentGrade;
        gpa = Math.round((parseFloat(gradeTotal)) / (parseInt(numberOfStudents)));
    }
    ; //end for loops
    updateData(gpa);
}; // end calculateAverage function

/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData(gpa) {
    $('.avgGrade').empty();
    $('.avgGrade').append(gpa);
    //updateStudentList();
}; // end updateData function
/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList() { //we first clear out all the previously created and appended student rows and all their data.
    $('tbody').empty();
    for (var i = 0; i < student_array.length; i++) {
        var this_student = student_array[i];
        addStudentToDom(this_student);
    }
};
/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
function addStudentToDom(studentObj) {
    var studentRow = $('<tr>', {
        class: 'studentRow'
    }).appendTo('tbody');
    var nameData = $('<td>', {
        text: studentObj.name,
        class: 'nameInfo'
    }).appendTo(studentRow);
    var courseData = $('<td>', {
        text: studentObj.course,
        class: 'courseInfo'
    }).appendTo(studentRow);
    var gradeData = $('<td>', {
        text: studentObj.grade,
        class: 'gradeInfo'
    }).appendTo(studentRow);
    var operationsData = $('<td>', {
        class: 'operationsColumn'
    }).appendTo(studentRow);
    var operationsButton = $('<button>', {
        class: 'btn btn-danger deleteStudentButton',
        text: 'Delete'
    }).appendTo(operationsData);
};
/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset() {
    student_array = []; //empties out our array
    updateData(); // updateData first runs and since our array is empty and we have no students, gpa becomes '0'.
    //Then updateStudentList runs (as part of the updateData function) and clears out table and adds the user info unavailable.
};

/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(function () {
    var noStudents = $('<h3>', {
        text: 'User Info Unavailable'
    }).appendTo('tbody');
    reset();
});