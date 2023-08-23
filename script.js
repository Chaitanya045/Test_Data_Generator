document.addEventListener("DOMContentLoaded", function () {
  let fieldsContainer = document.getElementById("fields_container");
  let addBtn = document.getElementById("addMoreFields");
  let fields = document.getElementsByClassName("fields");

  fields = Array.from(fields);

  fieldsContainer.addEventListener("change", function (event) {
    let target = event.target;
    if (target.classList.contains("inputfield")) {
      let dateRangeInputs = target
        .closest(".fields")
        .querySelector(".date-range-inputs");
      if (target.value === "Date of Birth") {
        dateRangeInputs.style.display = "block";
      } else {
        dateRangeInputs.style.display = "none";
      }
    }
  });

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
      fieldLabel.setAttribute("for", "Field" + (index + 1));
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

   <div class="date-range-inputs" style="display: none;">
          <label for="start-date">Start Date:</label>
          <input type="date" class="start-date">
          <label for="end-date">End Date:</label>
          <input type="date" class="end-date">
   </div>

   <button class="btn delete-btn"><i class="fa fa-trash"></i></button>
   `;

    fieldsContainer.appendChild(newFieldsDiv);
    renumberFields();

    fieldsContainer.addEventListener("change", function (event) {
      let target = event.target;
      if (target.classList.contains("inputfield")) {
        let dateRangeInputs = target
          .closest(".fields")
          .querySelector(".date-range-inputs");
        if (target.value === "Date of Birth") {
          dateRangeInputs.style.display = "block";
        } else {
          dateRangeInputs.style.display = "none";
        }
      }
    });
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

          case "Date of Birth":
            let startDateInput =
              dropdown.nextElementSibling.querySelector(".start-date");
            let endDateInput =
              dropdown.nextElementSibling.querySelector(".end-date");

            if (startDateInput && endDateInput) {
              let startDate = new Date(startDateInput.value);
              let endDate = new Date(endDateInput.value);
              let randomBirthdate = faker.date.between(startDate, endDate);
              fieldData.push(randomBirthdate.toLocaleDateString());
            }
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
