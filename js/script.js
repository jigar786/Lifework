// import Vue from 'vue'
// import App from './App'
//
// Vue.config.productionTip = false
//

MaterialTextfield.prototype.checkValidity = function () {
 if (this.input_.validity.valid) {
     this.element_.classList.remove(this.CssClasses_.IS_INVALID);
 } else {
     if (this.element_.getElementsByTagName('input')[0].value.length > 0) {
           this.element_.classList.add(this.CssClasses_.IS_INVALID);
     }
 }
};
(function(exports) {
  exports.app = new Vue({
    el: '#todoapp',

    data: {
      tasks: [{
        id: 1,
        body1: 'drink mlik',
        body2: 'dj',
        body3: 'd'
        // completed: true
      }],
      newTask: '',
      editedTask: null
    },

    methods: {
      addTask: function(e) {
        e.preventDefault();

        var value = this.newTask && this.newTask.trim();

        console.log(value);

        if (!value) {
          return;
        }

        var task = {
          body: value,
          // completed: false
        };

        this.tasks.push(task);

        this.newTask = '';

        setTimeout(function() {
          componentHandler.upgradeDom('MaterialCheckbox');
        }, 0);
      }
    }
  });
}(window));
// //
// //
// //
// // var app = new Vue({
// //   el: '#app',
// //   data: {
// //     message: 'Hello Vue!'
// //   }
// // })
// //
// // var myModel = {
// //   name: "Ashley",
// //   age: 24
// // };
//
//
// new Vue({
//     el: '#example',
//     data: { hello: 'Hello World!' }
// })






// function makebody() {
//     var tbody = document.getElementById("theTBody");
//     // empty body
//     while(tbody.firstChild) {
//             tbody.removeChild(tbody.firstChild);
//     }
//
//     var items = ["a", "b", "c"];
//     var descriptions = ["apple", 'banana', 'carrot'];
//     for (var i = 0; i < items.length; i++) {
//         var tr = document.createElement("tr");
//         var tdItem = document.createElement("td");
//         var tdDesc = document.createElement("td");
//
//         tdItem.appendChild(document.createTextNode(items[i]));
//         tdDesc.appendChild(document.createTextNode(descriptions[i]));
//
//         tdItem.classList.add("mdl-data-table__cell--non-numeric");
//         tdDesc.classList.add("mdl-data-table__cell--non-numeric");
//         tr.appendChild(tdItem);
//         tr.appendChild(tdDesc);
//
//         tbody.appendChild(tr);
//     }
// }
//
// // document.getElementById("clickme").addEventListener("click", function() {
// //     makebody();
// // });
//
// $('#click').click(function () {
//   makebody();
// })
