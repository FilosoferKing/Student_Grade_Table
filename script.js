/**
 * Define all global variables here
 */

/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [];
var numberOfStudents;
var studentRow;


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
    check_new_data();
    clearAddStudentForm();

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
    student_array = [];
    student = {};
    student.name = $('#studentName').val();
    student.course = $('#course').val();
    student.grade = $('#studentGrade').val();
    student.identifier = 0;
    student.deleted = false;
    //student_array.push(student);
    send_student_data(student.name, student.course, student.grade);

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
    var number_undeleted_students=0;
    for (var i = 0; i < numberOfStudents; i++) {
        if (student_array[i].deleted == false) {
            gradeTotal += student_array[i].grade;
            number_undeleted_students++;
        }
    } //end for loops
    gpa = Math.round(gradeTotal / number_undeleted_students);
    console.log("GPA, Grade Total", gpa, gradeTotal,number_undeleted_students);
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
        if (student_array[i].deleted == false) {
            var this_student = student_array[i];
            addStudentToDom(this_student, i+1);
        }
    }
};
/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
function addStudentToDom(studentObj, id) {
    studentRow = $('<tr>', {
        class: 'studentRow',
        id: id
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

function load_data(){
    $.ajax({
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/get',
        crossDomain: true,
        success: function(response){
            student_array = [];
            console.log("load data: ",response);
            for (var i = 0; i < response.data.length; i++){
                student= {};
                student.name = response.data[i].name;
                student.course = response.data[i].course;
                student.grade = response.data[i].grade;
                student.identifier = response.data[i].id;
                student.deleted = false;
                student_array.push(student);
            }
            updateStudentList();
            calculateAverage();
        },
        error: function(response){
            console.log("Could not retrieve data");
        }
    });

}

function send_student_data(the_name, the_course, the_grade){
    //console.log(name, course, grade);
    $.ajax({
        dataType: 'json',
        data: {name: the_name, grade: the_grade, course: the_course},
        method: "POST",
        url: 'http://s-apis.learningfuze.com/sgt/create',
        success: function(response){
            console.log("Sent", response);
            if (response.success){
                console.log("Sent successfully!");
            }
            load_data();
        },
        error: function(response){
            console.log("Data could not be sent");
        }
    });

}

function check_data(){
    $.ajax({
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/get',
        crossDomain: true,
        success: function(response){

            if (response.data.length > student_array.length){
                console.log("load data: ",response);
                load_data();
            }
        },
        error: function(response){
            console.log("No updates");
        }
    });

}

function check_new_data(){
    setInterval(function(){
        check_data();
    }, 15000);
}

function sort_array(){
    student_array.sort(function(a, b){return a.name.localeCompare(b.name)});
    console.log("Sorted Array: ", student_array);
}

/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(function () {
    var noStudents = $('<h3>', {
        text: 'User Info Unavailable'
    }).appendTo('tbody');
    reset();



    $('tbody').on('click', '.deleteStudentButton', function(){
        this_id = $(this).parents('tr').attr('id');
        $('#' + this_id).remove();
        student_array[this_id - 1].deleted = true;
        console.log(student_array[this_id - 1]);
        updateStudentList();
        calculateAverage();

    });
});



