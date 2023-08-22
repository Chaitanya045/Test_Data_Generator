document.addEventListener("DOMContentLoaded", function () {
  let fieldsContainer = document.getElementById("fields_container");
  let addBtn = document.getElementById("addMoreFields");
  fieldsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("fa-trash")) {
      let field = event.target.closest(".fields");
      if (field) {
        field.remove();
        renumberFields();
      }
    }
  });

  addBtn.addEventListener("click", function () {
    addNewFields();
  });

  function renumberFields() {
    let allFields = document.querySelectorAll(".fields");
    allFields.forEach(function (fields, index) {
      let dropdown = fields.querySelector(".inputfield");
      let fieldLabel = fields.querySelector(".fieldLabels");
      dropdown.setAttribute("name", "Field" + (index + 1));
      fieldLabel.innerText = "Field " + (index + 1) + ":";
    });
  }

  function addNewFields() {
    let newFieldsDiv = document.createElement("div");
    newFieldsDiv.className = "fields";

    newFieldsDiv.innerHTML = `
   <label for="Field0" class="fieldLabels">Field 0:</label>

   <select name="Feild0" class="inputfield">
     <option value="select">-- Select --</option>
     <option value="First Name">First Name</option>
     <option value="Middle Name">Middle Name</option>
     <option value="Last Name">Last Name</option>
     <option value="User ID">User ID</option>
     <option value="Email ID">Email ID</option>
     <option value="Password">Password</option>
     <option value="Date of Birth">Date of Birth</option>
     <option value="Address">Address</option>
   </select>

   <button class="btn delete-btn"><i class="fa fa-trash"></i></button>
   `;

    fieldsContainer.appendChild(newFieldsDiv);
    renumberFields();
  }

  function generateTestData() {
    let allDropdowns = document.querySelectorAll(".inputfield");
    console.log(allDropdowns);
    let numRecords = parseInt(document.getElementById("num-records").value, 10);
    console.log(numRecords);
    let testData = [];

    allDropdowns.forEach(function (dropdown) {
      let selectedOption = dropdown.value;
      console.log(selectedOption);

      let fieldData = [];

      for (let i = 0; i < numRecords; i++) {
        switch (selectedOption) {
          case "First Name":
            fieldData.push(faker.fake("{{name.firstName}}"));
            break;

          case "Last Name":
            fieldData.push(faker.fake("{{name.lastName}}"));
            break;

          case "Middle Name":
            fieldData.push(faker.fake("{{name.firstName}}"));
            break;

          case "Address":
            fieldData.push(
              faker.fake(
                "{{address.streetAddress}}, {{address.city}}, {{address.stateAbbr}}, {{address.zipCode}}"
              )
            );
            break;

          case "User ID":
            let userId = faker.fake("{{internet.userName}}");
            let randomNum = faker.datatype.number();
            fieldData.push(`${userId}${randomNum}`);
            break;

          case "Password":
            fieldData.push(faker.fake("{{internet.password}}"));
            break;

          case "Gender":
            let genderOptions = ["Male", "Female", "Non-binary", "Others"];
            fieldData.push(faker.random.arrayElement(genderOptions));
            break;

          default:
            alert("Invalid input");
            break;
        }
      }
      testData.push(fieldData);
    });
    console.log(testData);
  }
  let generateData = document.getElementById("generate-data-btn");
  generateData.addEventListener("click", function () {
    generateTestData();
  });
});
