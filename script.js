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

  function generateTestData(fileFormat) {
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

          case "Email ID":
            fieldData.push(faker.internet.email());
            break;

          default:
            alert("Invalid input");
            break;
        }
      }
      testData.push(fieldData);

    });
    switch (fileFormat) {
      case ".CSV":
        generateCsvFile(allDropdowns, testData, numRecords);
        break;
      case ".JSON":
        generateJsonFile(allDropdowns, testData, numRecords);
        break;
      case ".TXT":
        generateTextFile(allDropdowns, testData, numRecords);
        break;
      case ".XML":
        generateXmlFile(allDropdowns, testData, numRecords);
        break;
    }
    // console.log(testData);
  }

  let generateDataXML = document.getElementById("xml");
  generateDataXML.addEventListener("click", function () {
    triggerDownloadAnimation("download-animation");
    generateTestData(generateDataXML.textContent);
  });

  let generateDataTXT = document.getElementById("txt");
  generateDataTXT.addEventListener("click", function () {
    triggerDownloadAnimation("download-animation");
    generateTestData(generateDataTXT.textContent);
  });

  let generateDataJSON = document.getElementById("json");
  generateDataJSON.addEventListener("click", function () {
    triggerDownloadAnimation("download-animation");
    generateTestData(generateDataJSON.textContent);
  });

  let generateDataCSV = document.getElementById("csv");
  generateDataCSV.addEventListener("click", function () {
    triggerDownloadAnimation("download-animation");
    generateTestData(generateDataCSV.textContent);
  });

  function generateTextFile(allDropdowns, testData, numRecords) {
    // Text File
    let fieldLabels = Array.from(allDropdowns).map(
      (dropdown) => dropdown.options[dropdown.selectedIndex].text
    );

    // Create lines with data
    let dataLines = [];
    for (let i = 0; i < numRecords; i++) {
      let lineData = [];
      testData.forEach((data) => {
        lineData.push(data[i]);
      });
      dataLines.push(lineData.join(", "));
    }
    // Combine field labels line and data lines
    let testDataText =
      "Field Labels: " + fieldLabels.join(", ") + "\n" + dataLines.join("\n");

    // Create a Blob with the text data
    let blob = new Blob([testDataText], { type: "text/plain" });

    // Create a URL for the Blob
    let url = window.URL.createObjectURL(blob);

    // Create a download link
    let downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "test_data.txt"; // Specify the file name
    downloadLink.textContent = "Download Test Data"; // Optional: Add text to the link

    // Trigger a click event on the download link
    downloadLink.click();

    // Clean up the URL object
    window.URL.revokeObjectURL(url);
  }

  function generateXmlFile(allDropdowns, testData, numRecords) {
    // XML File

    let fieldLabels = Array.from(allDropdowns).map(
      (dropdown) => dropdown.options[dropdown.selectedIndex].text
    );

    // Create the XML document
    let xmlDoc = document.implementation.createDocument(null, "TestData");

    for (let i = 0; i < numRecords; i++) {
      let dataElement = xmlDoc.createElement("Data");

      testData.forEach((data, index) => {
        // Convert field label to a valid XML element name
        let fieldLabel = fieldLabels[index].replace(/\s+/g, "_"); // Replace spaces with underscores
        fieldLabel = fieldLabel.replace(/\W/g, ""); // Remove non-alphanumeric characters

        let fieldElement = xmlDoc.createElement(fieldLabel);
        fieldElement.textContent = data[i];
        dataElement.appendChild(fieldElement);
      });

      xmlDoc.documentElement.appendChild(dataElement);
    }

    // Convert the XML document to a string
    let xmlString = new XMLSerializer().serializeToString(xmlDoc);

    // Create a Blob with the XML data
    let blob = new Blob([xmlString], { type: "application/xml" });

    // Create a URL for the Blob
    let url = window.URL.createObjectURL(blob);

    // Create a download link
    let downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "test_data.xml"; // Specify the file name
    downloadLink.textContent = "Download Test Data XML"; // Optional: Add text to the link

    // Trigger a click event on the download link
    downloadLink.click();

    // Clean up the URL object
    window.URL.revokeObjectURL(url);
  }

  function generateCsvFile(allDropdowns, testData, numRecords) {
    // CSV File

    let fieldLabels = Array.from(allDropdowns).map(
      (dropdown) => dropdown.options[dropdown.selectedIndex].text
    );

    // Create the CSV header row with field labels
    let csvHeader = fieldLabels.join(",");

    // Create lines with data
    let csvData = [];
    for (let i = 0; i < numRecords; i++) {
      let lineData = testData.map((data) => data[i]);
      csvData.push(lineData.join(","));
    }

    // Combine the CSV header and data
    let csvText = [csvHeader, ...csvData].join("\n");

    // Create a Blob with the CSV data
    let blob = new Blob([csvText], { type: "text/csv" });

    // Create a URL for the Blob
    let url = window.URL.createObjectURL(blob);

    // Create a download link
    let downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "test_data.csv"; // Specify the file name
    downloadLink.textContent = "Download Test Data CSV"; // Optional: Add text to the link

    // Trigger a click event on the download link
    downloadLink.click();

    // Clean up the URL object
    window.URL.revokeObjectURL(url);
  }

  function generateJsonFile(allDropdowns, testData, numRecords) {
    // JSON File

    // Create an array of data objects
    let dataObjects = [];
    for (let i = 0; i < numRecords; i++) {
      let dataObject = {};
      testData.forEach((data, index) => {
        dataObject[
          allDropdowns[index].options[allDropdowns[index].selectedIndex].text
        ] = data[i];
      });
      dataObjects.push(dataObject);
    }

    // Convert data objects array to a JSON string
    let jsonDataString = JSON.stringify(dataObjects, null, 2); // The third argument adds indentation for readability

    // Create a Blob with the JSON data
    let blob = new Blob([jsonDataString], { type: "application/json" });

    // Create a URL for the Blob
    let url = window.URL.createObjectURL(blob);

    // Create a download link
    let downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "test_data.json"; // Specify the file name
    downloadLink.textContent = "Download Test Data JSON"; // Optional: Add text to the link

    // Trigger a click event on the download link
    downloadLink.click();

    // Clean up the URL object
    window.URL.revokeObjectURL(url);
  }

   // Function to trigger download animation
   function triggerDownloadAnimation(animationClass) {
    let title = document.querySelector(".navbar");
    title.classList.add(animationClass);

    // Simulate download delay (remove this setTimeout in your actual code)
    setTimeout(function () {
      title.classList.remove(animationClass);
    }, 1000); // Adjust the delay time based on your animation duration
  }
});
