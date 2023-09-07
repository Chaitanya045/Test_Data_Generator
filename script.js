document.addEventListener("DOMContentLoaded", function () {
  let fieldsContainer = document.getElementById("fields_container");
  let addBtn = document.getElementById("addMoreFields");
  let fields = document.getElementsByClassName("fields");

  let flag = 0;

  const key = generateRandomKey(16);

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

  fieldsContainer.addEventListener("change", function (event) {
    let target = event.target;
    if (target.classList.contains("inputfield")) {
      let maskcheckbox = target
        .closest(".fields")
        .querySelector(".maskContainer");
      if (
        target.value === "-- Select --" ||
        target.value === "Address" ||
        target.value === "Gender" ||
        target.value === "Date of Birth"
      ) {
        maskcheckbox.style.display = "none";
      } else {
        maskcheckbox.style.display = "block";
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
   <div class="maskContainer" style="display: none;">
    <label for="checkbox">Mask:</label>
    <input type="checkbox" class="mask">
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
    let numRecords = parseInt(document.getElementById("num-records").value, 10);
    let testData = [];

    allDropdowns.forEach(function (dropdown) {
      let selectedOption = dropdown.value;
      let mask = null;
      let maskedCheckbox = dropdown.closest(".fields").querySelector(".mask");
      let maskEnabled = maskedCheckbox.checked;
      if (maskEnabled) {
        flag = 1;
      }
      let fieldData = [];

      for (let i = 0; i < numRecords; i++) {
        switch (selectedOption) {
          case "First Name":
            if (maskEnabled) {
              fieldData.push(maskData(faker.fake("{{name.firstName}}"), key));
            } else {
              fieldData.push(faker.fake("{{name.firstName}}"));
            }
            break;

          case "Last Name":
            if (maskEnabled) {
              fieldData.push(maskData(faker.fake("{{name.lastName}}"), key));
            } else {
              fieldData.push(faker.fake("{{name.lastName}}"));
            }
            break;

          case "Middle Name":
            if (maskEnabled) {
              fieldData.push(maskData(faker.fake("{{name.firstName}}"), key));
            } else {
              fieldData.push(faker.fake("{{name.firstName}}"));
            }
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
            if (maskEnabled) {
              fieldData.push(maskData(`${userId}${randomNum}`, key));
            } else {
              fieldData.push(`${userId}${randomNum}`);
            }
            break;

          case "Password":
            if (maskEnabled) {
              fieldData.push(
                maskData(faker.fake("{{internet.password}}"), key)
              );
            } else {
              fieldData.push(faker.fake("{{internet.password}}"));
            }
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
            if (maskEnabled) {
              fieldData.push(maskData(faker.internet.email(), key));
            } else {
              fieldData.push(faker.internet.email());
            }
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
    if (flag == 1) {
      generateAndDownloadKeyFile();
    }
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

  function maskData(data, key) {
    let maskedData = "";
    for (let i = 0; i < data.length; i++) {
      const maskedChar = String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
      maskedData += maskedChar;
    }
    return btoa(maskedData);
  }

  function generateRandomKey(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      key += characters.charAt(randomIndex);
    }
    return key;
  }

  function generateAndDownloadKeyFile() {
    // Create the text content for the file
    const textContent = `Key : ${key}


    -----Unmask code-----

    #JavaScript

    function unmaskData(maskedData, key) {
      const encodedData = atob(maskedData);
      let originalData = "";
      for (let i = 0; i < encodedData.length; i++) {
        const originalChar = String.fromCharCode(
          encodedData.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
        originalData += originalChar;
      }
      return originalData;
    }

    #JAVA

    import java.util.Base64;

public class UnmaskData {
    public static String unmaskData(String maskedData, String key) {
        byte[] decodedBytes = Base64.getDecoder().decode(maskedData);
        String encodedData = new String(decodedBytes);
        StringBuilder originalData = new StringBuilder();

        for (int i = 0; i < encodedData.length(); i++) {
            char originalChar = (char) (encodedData.charAt(i) ^ key.charAt(i % key.length()));
            originalData.append(originalChar);
        }

        return originalData.toString();
    }

    public static void main(String[] args) {
        String maskedData = "your-masked-data-here";
        String key = "your-key-here";
        String originalData = unmaskData(maskedData, key);
        System.out.println("Original Data: " + originalData);
    }
}

    #Python

import base64

def unmask_data(masked_data, key):
    decoded_bytes = base64.b64decode(masked_data)
    encoded_data = decoded_bytes.decode('utf-8')
    original_data = []

    for i in range(len(encoded_data)):
        original_char = chr(ord(encoded_data[i]) ^ ord(key[i % len(key)]))
        original_data.append(original_char)

    return ''.join(original_data)

    `;

    // Create a Blob with the text data
    const blob = new Blob([textContent], { type: "text/plain" });

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create a download link
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "key.txt"; // Specify the file name
    downloadLink.textContent = "Download Text File"; // Optional: Add text to the link

    // Trigger a click event on the download link
    downloadLink.click();

    // Clean up the URL object
    window.URL.revokeObjectURL(url);
  }
});
