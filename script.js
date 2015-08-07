/**
 * Define all global variables here
 */

/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [];
var current_student = "";

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
function addClicked(){
    console.log('add clicked');
    addStudent();
    addStudentToDom();
    clearAddStudentForm();
    calculateAverage();
}

/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked(){
    clearAddStudentForm();
}

/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
function addStudent(){
    console.log('inside addStudent function');
    var student = {};
    student.name = $('#studentName').val();
    student.course = $('#course').val();
    student.grade = $('#studentGrade').val();
    student_array.push(student);
    console.log("Student Added");
    current_student = student;

}

/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm(){
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
    var numberOfStudents = student_array.length;
    var gradeTotal = 0;
    for (var i = 0; i < numberOfStudents; i++) {
       var oneStudentGrade = parseFloat(student_array[i].grade);
       console.log('oneStudentGrade is', oneStudentGrade);
       gradeTotal = gradeTotal + oneStudentGrade;
       console.log('gradeTotal is', gradeTotal);
       gpa = Math.round((parseFloat(gradeTotal)) / (parseInt(numberOfStudents)));
       console.log("GPA: ", gpa)
    }; //end for loops
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
function updateStudentList(numberOfStudents) { //we first clear out all the previously created and appended student rows and all their data.
    $('.studentRow').remove();
    $('.nameInfo').remove();
    $('.courseInfo').remove();
    $('.gradeInfo').remove();
    $('.operationsColumn').remove();
    $('.deleteStudentButton').remove();
    console.log('student rows removed')
    if (numberOfStudents == 0) {
        var noStudents = $('<h1>',{
            text: 'User Info Unavailable'
        }).appendTo('tbody');
    } // end if
    else {
        $(noStudents).remove(); //remove the possibly appended text for User Info Unavailable
        for (var j = 0; j < numberOfStudents; j++) {
            addStudentToDom(numberOfStudents[j]); //for every student, we add them to the table
        } // end for loop
    } //end else
};
/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
function addStudentToDom() {
    console.log('inside addStudentToDom function');
    console.log('student is', current_student);
    var studentRow = $('<tr>',{
        class: 'studentRow'
    }).appendTo('tbody');
    var nameData = $('<td>',{
        text: current_student.name,
        class: 'nameInfo'
    }).appendTo(studentRow);
    var courseData = $('<td>',{
        text: current_student.course,
        class: 'courseInfo'
    }).appendTo(studentRow);
    var gradeData = $('<td>',{
        text: current_student.grade,
        class: 'gradeInfo'
    }).appendTo(studentRow);
    var operationsData = $('<td>',{
        class: 'operationsColumn'
    }).appendTo(studentRow);
    var operationsButton = $('<button>',{
        class: 'btn btn-danger deleteStudentButton',
        text: 'Delete'
    }).appendTo(operationsData);
    console.log('student added to DOM');
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
 $(document).ready(function(){
    console.log('document loaded');
    reset();
 });