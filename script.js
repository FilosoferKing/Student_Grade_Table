var student_array = [];
var numberOfStudents;
var studentRow;
var course_array = [];
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
    var noStudents = $('<h3>', {
    }).appendTo('tbody');
    $('tbody h3').text("Loading Data").addClass('flash');

    $.ajax({
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/get',
        crossDomain: true,
        success: function(response){
            $('tbody').removeClass('flash');
            if (!response.success){
                console.log("Could not retrieve data");
            }
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
            delete_click();
        },
        error: function(response){
            console.log("Could not retrieve data");
            $('tbody h3').text("No Data Available").removeClass('flash');
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
            success: function (response) {
                if (response.success) {
                    load_data();
                }
            },
            error: function (response) {
                console.log("Could not send data");
                alert("Server error, please try again later!");
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
    }, 30000);
}

function sort_array_name(){
    student_array.sort(function(a, b){return a.name.localeCompare(b.name)});
    updateStudentList();
}

function sort_array_course(){
    student_array.sort(function(a, b){return a.course.localeCompare(b.course)});
    updateStudentList();
}

//function sort_array_grade(){
//    student_array.sort(function(a, b){if (a.grade < b.grade){ });
//        console.log("Grade Array: ", student_array);
//    updateStudentList();
//}

function course_auto_complete(course_input){
    $.ajax({
        dataType: 'json',
        data: {course: course_input},
        method: 'POST',
        url: 'http://s-apis.learningfuze.com/sgt/courses',
        success: function(response){
            if (response.success) {
                $('.auto_fill').css({"visibility": "visible"});
            } else {
                $('.auto_fill').empty().css({"visibility": "hidden"});
            }
            for (var i = 0; i < response.data.length; i++) {
                $('.auto_fill ul').append("<li>" + response.data[i].course + "</li>");
            }
            $('li').on('click', function(){
                var course_selection = $(this).text();
                $('#course').val(course_selection);
                $('.auto_fill').empty().css({"visibility": "hidden"});
            })
        }
    });
}

function delete_student(the_student_id, this_id, this_selector){
        $('#' + this_id).children('td:nth-child(4)').text("Processing").addClass('flash');
        $(this_selector).off('click');
        $.ajax({
            url: 'http://s-apis.learningfuze.com/sgt/delete',
            data: {student_id: the_student_id, "force-failure": "timeout"},
            method: 'POST',
            dataType: 'json',
            crossDomain: true,
            success: function (response) {
                $('#' + this_id).children('td:nth-child(4)').removeClass('flash').text("DELETED");
                $('#' + this_id).delay(2000).fadeOut();
                calculateAverage();
            },
            error: function(response){
                alert("Sorry, could not process request.");
                delete_click();

            }
        });
}

function delete_click() {
    $('.deleteStudentButton').on('click', function () {
        console.log("Click!");
        var this_selector = this;
        this_id = $(this).parents('tr').attr('id');
        student_array[this_id - 1].deleted = true;
        var db_student_id = student_array[this_id - 1].identifier;
        delete_student(db_student_id, this_id, this_selector);
        console.log(student_array[this_id - 1]);
    });
}
/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(function () {
    load_data();

    reset();

    $('#course').keyup(function(){
        $('.auto_fill ul').empty();
        var course_field = $('#course').val();
        course_auto_complete(course_field);
    });

});



