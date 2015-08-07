/**
 * Define all global variables here
 */

/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [];

/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var inputIds = '';

/**
 * addClicked - Event Handler when user clicks the add button
 */
function addClicked(){
    addStudent();
}

/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked(){
    $('#studentName').val("");
    $('#course').val("");
    $('#studentGrade').val("");
}

/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
function addStudent(){
    var student = {};
    student.name = $('#studentName').val();
    student.course = $('#course').val();
    student.grade = $('#studentGrade').val();
    student_array.push(student);
    console.log("Student Added");

}

/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm(){

}

/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
 function calculateAverage() {
    var numberOfStudents = student_array.length; 
    for (var i = 0; i < numberOfStudents; i++) {
        var oneStudentGrade = student_array.grade[i];
        console.log('oneStudentGrade is', oneStudentGrade);
        var gradeTotal += oneStudentGrade;
        console.log('gradeTotal is', gradeTotal)
        var gpa = Math.round(gradeTotal / numberOfStudents);
    }; //end for loop
 } // end calculateAverage function

/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData() {
    $('.avgGrade').text(gpa);
    updateStudentList();
} // end updateData function
/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
updateStudentList() {
    if (numberOfStudents == 0) {
        //need to clear out table rows/columns in tbody (clear out any previous students) due to reset
        var noStudents = $('<h1>',{
            text: 'User Info Unavailable'
        }).appendTo('tbody');
    } // end if
    else {
        for (var j = 0; j < numberOfStudents; j++) {
            addStudentToDom(numberOfStudents[j]);
        } // end for loop
    } //end else
}
/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */

/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
reset() {
    student_array = []; //empties out our array
    updateData(); // updateData first runs and since our array is empty and we have no students, gpa becomes '0'.
    //Then updateStudentList runs (as part of the updateData function) and clears out table and adds the user info unavailable.
}

/**
 * Listen for the document to load and reset the data to the initial state
 */