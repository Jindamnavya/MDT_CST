var logFile = new java.io.FileWriter("./logs/main/cst_l1_dfmea_row-post-save-script.log",false);
var logWriter = new java.io.BufferedWriter(logFile);
var currentDateTime = new java.util.Date().toString();
var severityl1;
var safetyl1;
var procedure = [];
var system = [];
var systemFlowDown;
var procedureFlowDown;
var useFlowUpL2 = "";
var procedureFlowUpUniqueValues = [];
var systemFlowUpUniqueValues = [];
var l1InitialOccurFlowup = "";
var l1FinalOccurFlowup = "";
var intiCriticalityValue;
var s = "";
var i1;
var f1;
var s1;
var l;
var l1InitialOccurrence = "";
var l1FinalOccurrence = "";
var maximum;
var linkedWorkItems = workItem.getLinkedWorkItems();
var status1 = workItem.getStatus().getId();

// this function calculates criticality

var criticality = [
  [0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 2],
  [0, 1, 1, 1, 2, 2],
  [0, 1, 1, 2, 2, 3],
  [0, 2, 2, 2, 2, 3],
  [0, 2, 2, 3, 3, 3],
];
function getCriticality(occurance, severity) {
  var criticalityValue = "";
  if (occurance != null && severity != null) {
    var x = occurance.slice(0, 1);
    var y = severity.slice(0, 1);
    criticalityValue = criticality[parseInt(x)][parseInt(y)];
  }
  return String(criticalityValue);
}

// this function calculates safety
function getSafety(wItem) {
  var safety;
  var yesCount = 0;
  var noCount = 0;
  var j = " ";
  if (linkedWorkItems.size() > 0) {
    for (var x = 0; x < linkedWorkItems.length; x++) {
      var linkedWI = linkedWorkItems.get(x);
      if (linkedWI.getType().getId().equals("cst_end_Effect") && linkedWI.getStatus().getId().equals("approved")) {
        if (linkedWI.getCustomField("end_safety") != null) {
          safety = linkedWI.getCustomField("end_safety").getName();
        
          if (safety == "Y") {
            yesCount++;
          }
          if (safety == "N") {
            noCount++;
          }
        }
      }
    }
    if (yesCount == noCount) return "Y";
    if (yesCount > noCount) return "Y";
    else if (noCount > yesCount) return "N";
  }
 
}

// This function calculates  procedureFlowUp

function getProcedureFlowUp(wItem) {
  var procedureFlowUp = [];
  var i = 0;
  for (var x = 0; x < linkedWorkItems.length; x++) {
    var linkedWI = linkedWorkItems.get(x);
    if (linkedWI.getType().getId().equals("cst_l2_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
      if (linkedWI.getCustomField("procedure") != null) {
        var procedureVal = linkedWI.getCustomField("procedure");
        for (var p = 0; p < procedureVal.length; p++) {
          procedureFlowUp[i++] = procedureVal[p].getId();
        }
      }
    }
  }
  
  return procedureFlowUp;
}

// this function removes duplicates

function removeDuplicates(arr) {
  var resultArray = [];
  var i = 0;
  for (var ele = 0; ele < arr.length; ele++) {
    if (resultArray.indexOf(arr[ele]) === -1) {
      resultArray[i++] = arr[ele];
    }
  }
 
  return resultArray;
}

// This function calculates  systemFlowUp

function getSystemFlowUp(wItem) {
  var systemFlowUp = [];
  var i = 0;
  for (var x = 0; x < linkedWorkItems.length; x++) {
    var linkedWI = linkedWorkItems.get(x);

    if (linkedWI.getType().getId().equals("cst_l2_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
      if (linkedWI.getCustomField("system") != null) {
        var systemVal = linkedWI.getCustomField("system");
        for (var p = 0; p < systemVal.length; p++) {
          systemFlowUp[i++] = systemVal[p].getId();
        }
      }
    }
  }
  return systemFlowUp;
}

 // this function returns the Concatenation value of procedureFlowUp and systemFlowUp

function message(item) {
  result = " ";
  for (i = 0; i < item.length; i++) {
    if (i == item.length - 1) {
      result = result.concat(item[i]);
    } else {
      result = result.concat(item[i] + ", ");
    }
  }
  return result;
}

// this function calculates Severity

function getSeverity(wItem) {
  var severity = [];
  var p = "";
  var max2;
  if (linkedWorkItems.size() > 0) {
    for (var x = 0; x < linkedWorkItems.length; x++) {
      var linkedWI = linkedWorkItems.get(x);
      if (linkedWI.getType().getId().equals("cst_end_Effect") && linkedWI.getStatus().getId().equals("approved")) {
        if (linkedWI.getCustomField("end_severity") != null) {
          var i = parseInt(linkedWI.getCustomField("end_severity").getId());
          severity.push(i);
        }
      }
    }
    var max2 = Math.max.apply(null, severity);
  } 
  else {
    return "";
  }
  if (linkedWorkItems.size() > 0) {
    for (var x = 0; x < linkedWorkItems.length; x++) {
      var linkedWI = linkedWorkItems.get(x);
      if (linkedWI.getType().getId().equals("cst_end_Effect") && linkedWI.getStatus().getId().equals("approved")) {
        if (linkedWI.getCustomField("end_severity") != null) {
          if (linkedWI.getCustomField("end_severity").getId() == max2) {
            p = linkedWI.getCustomField("end_severity").getName();
          }
        }
      }
    }
    return p;
  }
}

// this function calculates maximum

function getMax(wItem) {
  var InitialOccurrenceFlowup = [];
  var x1;
  var m;
  var y;
  var p;
  var max;
  if (linkedWorkItems.size() > 0) {
    for (var x = 0; x < linkedWorkItems.length; x++) {
      var linkedWI = linkedWorkItems.get(x);
      if (linkedWI.getType().getId().equals("cst_l2_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
        if (linkedWI.getCustomField("l2_final_occurrence") != null) {
          x1 = String(linkedWI.getCustomField("l2_final_occurrence"));
          if (x1.length() <= 48) {
            m = linkedWI.getCustomField("l2_final_occurrence").getId();
            if (m != "6"){ 
             InitialOccurrenceFlowup.push(m);
            }
          }
          if (x1.length() > 55) {
            y = linkedWI.getCustomField("l2_final_occurrence").getId();
            p = y.slice(0, 1);
            if (p != "6") {
             InitialOccurrenceFlowup.push(p);
            }
          }
        }
      }
    }
    max = Math.max.apply(null, InitialOccurrenceFlowup);
    return String(max);
  }
   else {
    return "";
  }
}

// this function calculates Intitial label

function getIntiLable(wItem, a) {
  var text = "";
  var x = a;
  switch (x) {
    case "1":
      text = "1: Improbable, < 0.0001";
      break;
    case "2":
      text = "2: Remote, < 0.001 and >= 0.0001";
      break;
    case "3":
      text = "3: Occasional, < 0.01 and >= 0.001";
      break;
    case "4":
      text = "4: Probable, < 0.1 and >= 0.01";
      break;
    case "5":
      text = "5: Frequent, >= 0.1";
      break;
    case "6":
      text = useFlowUpL2;
      break;
    default:
      text = "";
  }

  return text;
}
function useFlowUp(wItem) {
  var useFlowUpValue = "";
  if (linkedWorkItems.size() > 0) {
    for (var x = 0; x < linkedWorkItems.length; x++) {
      var linkedWI = linkedWorkItems.get(x);
      if (linkedWI.getType().getId().equals("cst_l2_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
        if (linkedWI.getCustomField("l2_initial_occurrence_flow_up_override") !=null) {
          if (linkedWI.getCustomField("l2_initial_occurrence") != null) {
            if (linkedWI.getCustomField("l2_initial_occurrence").getId() == "6") {
                useFlowUpValue = linkedWI.getCustomField("l2_initial_occurrence_flow_up_override");
            }
          }
        }
      }
    }
  }
  
  return String(useFlowUpValue);
}

// this function calculates multiple enumeration of procedure

function checkWorkItemLinkProcedure(workItem) {
  //Getting multi enum values
  var cwValues = workItem.getValue("procedure_flow_up_l1");
  //Copying into another variable
  var values = cwValues;
  var enumlist = procedureFlowUpUniqueValues; // "id1", "id3" are enum option ids of Enum
  values.removeAll(cwValues);
  for (var i = 0; i < enumlist.length; i++) {
    cwValues.add(workItem.getEnumerationOptionForField("procedure_flow_up_l1", enumlist[i]));
  }
}

// this function calculates multiple enumeration of system

function checkWorkItemLinkSystem(workItem) {
  //Getting multi enum values
  var cwValues1 = workItem.getValue("system_flow_up_l1");
  //Copying into another variable
  var values = cwValues1;
  var enumlist = systemFlowUpUniqueValues; // "id1", "id3" are enum option ids of Enum
  values.removeAll(cwValues1);
  for (var i = 0; i < enumlist.length; i++) {
    //adding enum option ids one by one to "values"
    cwValues1.add(workItem.getEnumerationOptionForField("system_flow_up_l1", enumlist[i]));
  }
}
// This function calculates  ProcedureFlowDown

function getProcedureFlowDown(wItem) {
  var procedureValFlowDown = "";
  for (var x = 0; x < linkedWorkItems.length; x++) {
    var linkedWI = linkedWorkItems.get(x);
    if (linkedWI.getType().getId().equals("cst_end_Effect")) {
      if (linkedWI.getCustomField("end_procedure") != null && linkedWI.getStatus().getId().equals("approved")) {
        procedureValFlowDown += linkedWI.getCustomField("end_procedure").getContent();
      }
    }
  }

  return procedureValFlowDown;
}
// This function calculates  systemFlowDown

function getSystemFlowDown(wItem) {
  var systemValFlowDown = "";
  for (var x = 0; x < linkedWorkItems.length; x++) {
    var linkedWI = linkedWorkItems.get(x);
    if (linkedWI.getType().getId().equals("cst_end_Effect") && linkedWI.getStatus().getId().equals("approved")) {
      if (linkedWI.getCustomField("end_system") != null) {
        systemValFlowDown += linkedWI.getCustomField("end_system").getContent();
      
      }
    }
  }
  return systemValFlowDown;
}
// This function removes duplicstes

function removeDuplicatesFlowDown(str) {
  var descTxtForm = "";
  var planeText = "";
  var inputString = str;
  var arrayOfWords = inputString.split("<br>");
  var resultArray = [];
  var i = 0;
  for (var ele = 0; ele < arrayOfWords.length; ele++) {
    if (resultArray.indexOf(arrayOfWords[ele]) === -1) {
      resultArray[i++] = arrayOfWords[ele];
    }
  }
  for (var e = 0; e < resultArray.length; e++) {
    planeText += resultArray[e] + "<br>";
  }
  descTxtForm = new com.polarion.core.util.types.Text("text/html", planeText);
  return descTxtForm;
}

try {
  //this is the title code
  var item = workItem.getCustomField("l1_item").getName();
  var functions = String(workItem.getCustomField("l1_function"));
  var failureMode = String(workItem.getCustomField("l1_failure_mode"));
  var cause = String(workItem.getCustomField("l1_cause"));
  var title = "";
  if (item !== null) title = item;
  if (functions !== null && functions.length() > 12)
    title = title + " - " + functions.slice(11);
  if (failureMode !== null && failureMode.length() > 12)
    title = title + " - " + failureMode.slice(11);
  if (cause !== null && cause.length() > 12)
    title = title + " - " + cause.slice(11);
  workItem.setTitle(title);

//   if workitem is not approved, then custom field values need to be empty.
  if (workItem.getStatus().id !== "approved") 
  {
    var mutli_enum1 = workItem.getValue("procedure_flow_up_l1"); //get multi enum values from field
    var enum1 = mutli_enum1;
    while (mutli_enum1.length > 0) 
    {
      enum1.removeAll(mutli_enum1); // remove enums values from array
    }
    workItem.setValue("procedure_flow_up_l1", mutli_enum1); // set empty array to the field
    var mutli_enum2 = workItem.getValue("system_flow_up_l1"); //get multi enum values from field
    var enum2 = mutli_enum2;
    while (mutli_enum2.length > 0) 
    {
      enum2.removeAll(mutli_enum2); // remove enums values from array
    }
    workItem.setValue("system_flow_up_l1", mutli_enum2); // set empty array to the field
    workItem.setCustomField("safety_l1", "");
    workItem.setCustomField("severity_l1", "");
    workItem.setCustomField("l1_initial_occurrence_flow_up_override", "");
    workItem.setCustomField("l1_initial_criticality", "");
    workItem.setCustomField("l1_final_criticality", "");
  }
 else
  {
    // code for severity
    severityl1 = getSeverity(workItem);
    if (severityl1 == "-Infinity") {
      severityl1 = "";
    }
    workItem.setCustomField("severity_l1", severityl1);

    // code for safety
    safetyl1 = getSafety(workItem);
    if (safetyl1 == "") {
      safetyl1 = "";
    }
    workItem.setCustomField("safety_l1", safetyl1);

    // code fpr system and procedure Flow down
    systemFlowDown = removeDuplicatesFlowDown(getSystemFlowDown(workItem));
    procedureFlowDown = removeDuplicatesFlowDown(
      getProcedureFlowDown(workItem)
    );
    workItem.setCustomField("system_flow_down_l1", systemFlowDown);
    workItem.setCustomField("procedure_flow_down_l1", procedureFlowDown);

    // code for procedure flow up
    procedure = getProcedureFlowUp(workItem);
    procedureFlowUpUniqueValues = removeDuplicates(procedure);
    checkWorkItemLinkProcedure(workItem);

    // code for system flow up
    system = getSystemFlowUp(workItem);
    systemFlowUpUniqueValues = removeDuplicates(system);
    checkWorkItemLinkSystem(workItem);

    // li intitial occurance flow up override code
    maximum = getMax(workItem);
    if (maximum != "") {
      var label = getIntiLable(workItem, maximum);
      workItem.setCustomField("l1_initial_occurrence_flow_up_override", label);
    } 
    else 
    {
      workItem.setCustomField("l1_initial_occurrence_flow_up_override", "");
    }
    
    // intitial occurance code
    var intiFlowUp = workItem.getCustomField("l1_initial_occurrence_flow_up_override");
    var type = typeof workItem.getCustomField("l1_initial_occurrence");
    if (workItem.getCustomField("l1_initial_occurrence") != null) 
    {
      if (type == "object") 
      {
        var t = workItem.getCustomField("l1_initial_occurrence").getName();
      }
    } 
    else 
    {
      workItem.setEnumerationValue("l1_initial_occurrence", "");
    } // end of intitial occurance

    s1 = workItem.getCustomField("severity_l1");
    i1 = String(workItem.getCustomField("l1_initial_occurrence"));
    if (s1 == "") 
    {
      workItem.setCustomField("l1_initial_criticality", "");
    }
    var inti = workItem.getCustomField("l1_initial_occurrence_flow_up_override");

    // intitial criticality
    if (workItem.getCustomField("l1_initial_occurrence") != "" && s1 != "") 
    {
      if (i1.length() > 55) 
      {
        var j = workItem.getCustomField("l1_initial_occurrence").getId();
        var c = getCriticality(s1, j);
        workItem.setCustomField("l1_initial_criticality", c);
      }
      if (i1.length() <= 48) 
      {
        var k = workItem.getCustomField("l1_initial_occurrence").getName();
        if (k == "Use Flow-up Value") 
        {
          if (inti != "") 
          {
            var j = inti.slice(0, 1);
            var c = getCriticality(s1, j);
            workItem.setCustomField("l1_initial_criticality", c);
          } else 
          {
            workItem.setCustomField("l1_initial_criticality", "");
          }
        } 
        else 
        {
          var l = getCriticality(s1, k);
          workItem.setCustomField("l1_initial_criticality", l);
        }
      }
    }

    // final criticality
    f1 = String(workItem.getCustomField("l1_final_occurrence"));
    if (s1 == "" || f1.length() < 0) {
      workItem.setCustomField("l1_final_criticality", "");
    }
    if (workItem.getCustomField("l1_final_occurrence") != "" && s1 != "") {
      if (f1.length() <= 48) {
        var k1 = workItem.getCustomField("l1_final_occurrence").getName();
        if (k1 == "Use Initial Occurrence Value") {
          if (i1.length() <= 48) {
            var k2 = workItem.getCustomField("l1_initial_occurrence").getName();
            if (k2 == "Use Flow-up Value") {
              if (inti != "") {
                var j = inti.slice(0, 1);
                var c = getCriticality(s1, j);
                workItem.setCustomField("l1_final_criticality", c);
              } else {
                workItem.setCustomField("l1_final_criticality", "");
              }
            } else {
              var l = getCriticality(s1, k2);
              workItem.setCustomField("l1_final_criticality", l);
            }
          }
        } else {
          var l = getCriticality(s1, k1);
          workItem.setCustomField("l1_final_criticality", l);
        }
      }
    }
  }
  workItem.save();
} catch (error) {
  logWriter.write("Error message: " + error + "\n");
}
logWriter.flush();
