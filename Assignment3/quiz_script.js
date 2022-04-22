var student_name;
var quiz_length;
var num_correct = 0;


function saveName() {
    student_name = document.getElementById('name_input').value;
}

// appState for state management
const appState = {
    current_view : "#intro_view",
    current_question : 0,
    current_model : {}
}

//initialize
document.addEventListener('DOMContentLoaded', () => {
  // initial state
  appState.current_view =  "#intro_view";
  appState.current_model = {
    action : "start_app"
  }
  update_view(appState);


  // EventDelegation - handle all events of the widget
  document.querySelector("#widget_view").onclick = (e) => {
      handle_widget_event(e)
  }
});

//event delegation handled in this function
function handle_widget_event(e) {
    if (appState.current_view == "#intro_view"){
        if (e.target.id == 'name_button') {
            //save the student's name
            saveName();
            //fetch number of questions
            fetch('https://my-json-server.typicode.com/srasheed1018/CUS1172_SiddeeqRasheed_Public/metadata').then(
                (response) => {
                    return response.json();
                }
            ).then(
                (results) => {
                    quiz_length = results.quiz_length;
                    console.log('student name is '+student_name);
                    console.log('quiz length is '+quiz_length);
                    nextQuestion();
                }
            ).catch(
                (err) => {console.error(err);}
            )
        }
    }
  
    // Handle the answer event for true/false
    if (appState.current_view == "#question_view_tf") {
        if (e.target.className == "answer") {
          isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
          if (isCorrect) {
            num_correct += 1;
          }
          displayFeedback(isCorrect, appState.current_model.correctAnswer);
        }
     }

     // Handle the answer event for mc
    if (appState.current_view == "#question_view_mc") {
        if (e.target.className == "answer") {
          isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
          if (isCorrect) {
            num_correct += 1;
          }
          displayFeedback(isCorrect, appState.current_model.correctAnswer);
        }
      }
  
     // Handle answer event for  text questions.
     if (appState.current_view == "#question_view_text") {
        if (e.target.className == "answer") {
          isCorrect = check_user_response(document.getElementById("answer_text").value, appState.current_model);
          if (isCorrect) {
            num_correct += 1;
          }
          displayFeedback(isCorrect, appState.current_model.correctAnswer);
        }
      }
  
      // Handle answer event for end.
      if (appState.current_view == "#end_view") {
          //todo
        }

      if (appState.current_view == "#feedback_correct") {
        if (e.target.id == "feedback_button") {
          nextQuestion();
        }
       }
      
      if (appState.current_view == "#feedback_incorrect") {
        if (e.target.id == "feedback_button") {
          nextQuestion();
        }
      }
  
   } // end of handle_widget_event
  
  
  function nextQuestion() {
    fetch('https://my-json-server.typicode.com/srasheed1018/CUS1172_SiddeeqRasheed_Public/questions/').then(
      (response) => {
        return response.json();
      }
      ).then(
        (results) => {
          updateQuestion(appState,results[appState.current_question]);
          setQuestionView(appState);
          update_view();
        }
        ).catch(
          (err) => {console.error(err);}
          );
  }

  function displayFeedback(isCorrect, ans) {
    if (isCorrect) {
      appState.current_view = "#feedback_correct";
    }
    else {
      appState.current_view = "#feedback_incorrect";
      //document.getElementById("explanation").innerHTML = ans;
    }
    update_view(appState);
  }

  function check_user_response(user_answer, model) {
    if (user_answer == model.correctAnswer) {
      return true;
    }
    return false;
  }
  
  function updateQuestion(appState, model) {
      //if theres a question left, continue...
      if (appState.current_question < quiz_length-1) {
        appState.current_question =   appState.current_question + 1;
        appState.current_model = model;
      }
      //...otherwise set up for the end view
      else {
        appState.current_question = -2;
        appState.current_model = {};
      }
  }
  
  function setQuestionView(appState) {
    //check if the quiz is over...
    if (appState.current_question == -2) {
      appState.current_view  = "#end_view";
      return
    }
    //...otherwise change the view depending on question type
    if (appState.current_model.questionType == "tf")
      appState.current_view = "#question_view_tf";
    else if (appState.current_model.questionType == "text") {
      appState.current_view = "#question_view_text";
    }
    else if (appState.current_model.questionType == "mc") {
      appState.current_view = "#question_view_mc"
    }
  }
  
  function update_view() {
    //remove later
    console.log(appState.current_model)
    const html_element = render_widget(appState.current_model, appState.current_view)
    document.querySelector("#widget_view").innerHTML = html_element;
  }
  //
  
  const render_widget = (model,view) => {
    // Get the template HTML
    template_source = document.querySelector(view).innerHTML
    // Handlebars compiles the above source into a template
    var template = Handlebars.compile(template_source);
  
    // apply the model to the template.
    var html_widget_element = template({...model,...appState})
  
    return html_widget_element
  }