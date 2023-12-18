var logFile = new java.io.FileWriter("./logs/main/cst_l5_dfmea_row-post-save-script.log",false);
var logWriter = new java.io.BufferedWriter(logFile);
var currentDateTime = new java.util.Date().toString();
var result = "";
var procedure = [];
var system = [];
var severityL4;
var x;
var procedureFlowDownUniqueValues = [];
var systemFlowDownUniqueValues = [];
var linkedWorkItems = workItem.getLinkedWorkItems();

// This function calculates  procedureFlowDown
function getProcedureFlowDown(wItem) {
  var procedureVal = "";
  for (var x = 0; x < linkedWorkItems.length; x++) {
    var linkedWI = linkedWorkItems.get(x);
    if (linkedWI.getType().getId().equals("cst_l4_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
      if (linkedWI.getCustomField("procedure_flow_down_l4") != null) {
        procedureVal += linkedWI.getCustomField("procedure_flow_down_l4").getContent();
      }
    }
  }
  return procedureVal;
}

// This function calculates  systemFlowDown
function getSystemFlowDown(wItem) {
  var systemVal = "";
  for (var x = 0; x < linkedWorkItems.length; x++) {
    var linkedWI = linkedWorkItems.get(x);
    if (linkedWI.getType().getId().equals("cst_l4_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
      if (linkedWI.getCustomField("system_flow_down_l4") != null) {
        systemVal += linkedWI.getCustomField("system_flow_down_l4").getContent();
      }
    }
  }
  return systemVal;
}

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
  if (occurance != null && severity != null)
    criticalityValue = criticality[parseInt(occurance)][parseInt(severity)];
  return String(criticalityValue);
}

// This function calculates  safety
function getSafety(wItem) {
  var safety;
  var yesCount = 0;
  var noCount = 0;
  if (linkedWorkItems.size() > 0) {
    for (var x = 0; x < linkedWorkItems.length; x++) {
      var linkedWI = linkedWorkItems.get(x);
      if (linkedWI.getType().getId().equals("cst_l4_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
        if (linkedWI.getCustomField("safety_l4") != null) {
          safety = linkedWI.getCustomField("safety_l4");
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
  } else {
    return "";
  }
}

// This function calculates  severity
function loneGetSeverity(wItem) {
  var severity = [];
  if (linkedWorkItems.size() > 0) {
    for (var x = 0; x < linkedWorkItems.length; x++) {
      var linkedWI = linkedWorkItems.get(x);
      if (linkedWI.getType().getId().equals("cst_l4_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
        if (linkedWI.getCustomField("severity_l4") != null) {
          var y = linkedWI.getCustomField("severity_l4");
          var n = y.slice(0, 1);
          var i = parseInt(n);
          severity.push(i);
        }
      }
    }
    var max = Math.max.apply(null, severity);
    return String(max);
  } else {
    return "0";
  }
}

// This function calculates  severity
function getSeverity(wItem) {
  var severity = [];
  var max2;
  var p = "";
  if (linkedWorkItems.size() > 0) {
    for (var x = 0; x < linkedWorkItems.length; x++) {
      var linkedWI = linkedWorkItems.get(x);
      if (linkedWI.getType().getId().equals("cst_l4_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
        if (linkedWI.getCustomField("severity_l4") != null) {
          var i = parseInt(linkedWI.getCustomField("severity_l4"));
          severity.push(i);
        }
      }
    }
    max2 = Math.max.apply(null, severity);
  } else {
    return "";
  }
  if (linkedWorkItems.size() > 0) {
    for (var x = 0; x < linkedWorkItems.length; x++) {
      var linkedWI = linkedWorkItems.get(x);
      if (
        linkedWI.getType().getId().equals("cst_l4_dfmea_row") &&
        linkedWI.getStatus().getId().equals("approved")
      ) {
        if (linkedWI.getCustomField("severity_l4") != null) {
          var y = linkedWI.getCustomField("severity_l4");
          if (y.slice(0, 1) == max2) {
            p = linkedWI.getCustomField("severity_l4");
          }
        }
      }
    }
    return p;
  }
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

// this function removes duplicates
function removeDuplicates(str) {
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
  //this is the "Titke concatenation" code
  var item = String(workItem.getCustomField("l5_item"));
  var functions = String(workItem.getCustomField("l5_function"));
  var failureMode = String(workItem.getCustomField("l5_failure_mode"));
  var cause = String(workItem.getCustomField("l5_cause"));
  var title = "";
  if (item !== null && item.length() > 13) title = item.slice(12);
  if (functions !== null && functions.length() > 12)
    title = title + " - " + functions.slice(12);
  if (failureMode !== null && failureMode.length() > 12)
    title = title + " - " + failureMode.slice(12);
  if (cause !== null && cause.length() > 12)
    title = title + " - " + cause.slice(12);
  workItem.setTitle(title);

  // code for nonSafetyEndEffectSeverity
  if (workItem.getCustomField("l5_non_safety_end_effect_severity") != null)
    x = workItem.getCustomField("l5_non_safety_end_effect_severity").getName();
  if (workItem.getCustomField("l5_non_safety_end_effect_severity") == null)
    x = "";
  if (workItem.getStatus().id !== "approved")
   {
    workItem.setEnumerationValue("safety_l5", "");
    workItem.setCustomField("severity_l5", "");
    workItem.setCustomField("l5_initial_criticality", "");
    workItem.setCustomField("l5_final_criticality", "");
  } 
  else {
    // getting severity from L4 DFMEA linked workitems
    severityL4 = loneGetSeverity(workItem);
    if (severityL4 == "-Infinity") {
      severityL4 = "";
    }

    // code for nonSafetyEndEffect
    var nonSafetyL5EndEffect = workItem.getCustomField("non_safety_l5_end_effect");
    if (nonSafetyL5EndEffect != null) {
      workItem.setEnumerationValue("safety_l5", "no");
      workItem.setCustomField("severity_l5", x);
    }
    if (nonSafetyL5EndEffect == "" || nonSafetyL5EndEffect == null) {
      var severityL5 = getSeverity(workItem);
      if (severityL5 == "-Infinity") {
        severityL5 = "";
      }
      workItem.setCustomField("severity_l5", severityL5);
      var value = getSafety(workItem);
      if (value == "") {
        value = "";
      }
      workItem.setEnumerationValue("safety_l5", value);
    }

    // code for procedure flow up
    procedure = getProcedureFlowDown(workItem);
    procedureFlowDownUniqueValues = removeDuplicates(procedure);
    workItem.setCustomField("procedure_flow_down_l5",procedureFlowDownUniqueValues);

    // code for system flow up
    system = getSystemFlowDown(workItem);
    systemFlowDownUniqueValues = removeDuplicates(system);
    workItem.setCustomField("system_flow_down_l5", systemFlowDownUniqueValues);

    var s1 = workItem.getCustomField("severity_l5"); // severity of l5DFMEA

    // initial criticality
    if (s1 == "") {
      workItem.setCustomField("l5_initial_criticality", "");
    }
    if (workItem.getCustomField("l5_initial_occurrence") == null) {
      workItem.setCustomField("l5_initial_criticality", "");
    }
    if (workItem.getCustomField("l5_initial_occurrence") != null && s1 != "") {
      var i1 = workItem.getCustomField("l5_initial_occurrence").getId();
      var c = getCriticality(s1, i1);
      workItem.setCustomField("l5_initial_criticality", c);
    }
    
    // final criticallity
    if (s1 == "") {
      workItem.setCustomField("l5_final_criticality", "");
    }
    if (workItem.getCustomField("l5_final_occurrence") == null) {
      workItem.setCustomField("l5_final_criticality", "");
    }
    if (workItem.getCustomField("l5_final_occurrence") != null && s1 != "") {
      var i1 = workItem.getCustomField("l5_final_occurrence").getId();
      var c = getCriticality(s1, i1);
      workItem.setCustomField("l5_final_criticality", c);
    }
  }

  workItem.save();
} catch (error) {
  logWriter.write("Error message: " + error);
}
logWriter.flush();
