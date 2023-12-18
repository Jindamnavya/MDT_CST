var logFile = new java.io.FileWriter("./logs/main/cst_l4_dfmea_row-post-save-script.log",false);
var logWriter = new java.io.BufferedWriter(logFile);
var currentDateTime = new java.util.Date().toString();
var result = "";
var procedure = [];
var system = [];
var severityL3;
var x;
var i1;
var f1;
var s1;
var l;
var useFlowUpL5 = "";
var procedureFlowDownUniqueValues = [];
var systemFlowDownUniqueValues = [];
var linkedWorkItems = workItem.getLinkedWorkItems();

// This function calculates  procedureFlowDown
function getProcedureFlowDown(wItem) {
  var procedureVal = "";
  for (var x = 0; x < linkedWorkItems.length; x++) {
    var linkedWI = linkedWorkItems.get(x);
    if (linkedWI.getType().getId().equals("cst_l3_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
      if (linkedWI.getCustomField("procedure_flow_down_l3") != null) {
        procedureVal += linkedWI.getCustomField("procedure_flow_down_l3").getContent();
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
    if (linkedWI.getType().getId().equals("cst_l3_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
      if (linkedWI.getCustomField("system_flow_down_l3") != null) {
        systemVal += linkedWI.getCustomField("system_flow_down_l3").getContent();
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
      if (linkedWI.getType().getId().equals("cst_l3_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
        if (linkedWI.getCustomField("safety_l3") != null) {
          safety = linkedWI.getCustomField("safety_l3");
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
function lthreeGetSeverity(wItem) {
  var severity = [];
  if (linkedWorkItems.size() > 0) {
    for (var x = 0; x < linkedWorkItems.length; x++) {
      var linkedWI = linkedWorkItems.get(x);
      if (linkedWI.getType().getId().equals("cst_l3_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
        if (linkedWI.getCustomField("severity_l3") != null) {
          var y = linkedWI.getCustomField("severity_l3");
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
      if (linkedWI.getType().getId().equals("cst_l3_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
        if (linkedWI.getCustomField("severity_l3") != null) {
          var i = parseInt(linkedWI.getCustomField("severity_l3"));
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
      if (linkedWI.getType().getId().equals("cst_l3_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
        if (linkedWI.getCustomField("severity_l3") != null) {
          var y = linkedWI.getCustomField("severity_l3");
          if (y.slice(0, 1) == max2) {
            p = linkedWI.getCustomField("severity_l3");
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

// // this function calculates maximum
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
      if (linkedWI.getType().getId().equals("cst_l5_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
        if (linkedWI.getCustomField("l5_final_occurrence") != null) {
          x1 = String(linkedWI.getCustomField("l5_final_occurrence"));
          if (x1.length() <= 48) {
            m = linkedWI.getCustomField("l5_final_occurrence").getId();
            if (m != "6") InitialOccurrenceFlowup.push(m);
          }
          if (x1.length() > 55) {
            y = linkedWI.getCustomField("l5_final_occurrence").getId();
            p = y.slice(0, 1);
            if (p != "6") InitialOccurrenceFlowup.push(p);
          }
        }
      }
    }
    max = Math.max.apply(null, InitialOccurrenceFlowup);
    return String(max);
  } else {
    return "";
  }
}

// // this function calculates inti occurance override
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
      text = useFlowUpL5;
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
      if (linkedWI.getType().getId().equals("cst_l5_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
        if (linkedWI.getCustomField("l5_initial_occurrence_flow_up_override") !=null) {
          if (linkedWI.getCustomField("l5_initial_occurrence") != null) {
            if (linkedWI.getCustomField("l5_initial_occurrence").getId() == "6") {
              useFlowUpValue = linkedWI.getCustomField("l5_initial_occurrence_flow_up_override");
            }
          }
        }
      }
    }
  }
  return String(useFlowUpValue);
}


try {
  //this is the "Title concatenation" code
  var item = String(workItem.getCustomField("l4_item"));
  var functions = String(workItem.getCustomField("l4_function"));
  var failureMode = String(workItem.getCustomField("l4_failure_mode"));
  var cause = String(workItem.getCustomField("l4_cause"));
  var title = "";
  if (item !== null && item.length() > 13) title = item.slice(11);
  if (functions !== null && functions.length() > 12)
    title = title + " - " + functions.slice(11);
  if (failureMode !== null && failureMode.length() > 12)
    title = title + " - " + failureMode.slice(11);
  if (cause !== null && cause.length() > 12)
    title = title + " - " + cause.slice(11);
  workItem.setTitle(title);

  // code for nonSafetyEndEffectSeverity
  if (workItem.getCustomField("l4_non_safety_end_effect_severity") != null)
    x = workItem.getCustomField("l4_non_safety_end_effect_severity").getName();
  if (workItem.getCustomField("l4_non_safety_end_effect_severity") == null)
    x = "";

  if (workItem.getStatus().id !== "approved") {
    workItem.setCustomField("safety_l4", "");
    workItem.setCustomField("severity_l4", "");
    workItem.setCustomField("l4_initial_criticality", "");
    workItem.setCustomField("l4_final_criticality", "");
    workItem.setCustomField("l4_initial_occurrence_flow_up_override", "");
  } 
  else {
    // getting severity from L3 DFMEA linked workitems
    severityL3 = lthreeGetSeverity(workItem);
    if (severityL3 == "-Infinity") {
      severityL3 = "";
    }

    // code for nonSafetyEndEffect
    var nonSafetyL4EndEffect = workItem.getCustomField("non_safety_l4_end_effect");
    if (nonSafetyL4EndEffect != null) {
      workItem.setCustomField("safety_l4", "N");
      workItem.setCustomField("severity_l4", x);
    }
    if (nonSafetyL4EndEffect == "" || nonSafetyL4EndEffect == null) {
      var severityL4 = getSeverity(workItem);
      if (severityL4 == "-Infinity") {
        severityL4 = "";
      }
      workItem.setCustomField("severity_l4", severityL4);
      var value = getSafety(workItem); //get safety from l2 DFMEA linked workitem which is having high sevrity value
      if (value == "") {
        value = "";
      }
      workItem.setCustomField("safety_l4", value);
    }

    // code for procedure flow up
    procedure = getProcedureFlowDown(workItem);
    procedureFlowDownUniqueValues = removeDuplicates(procedure);
    workItem.setCustomField("procedure_flow_down_l4",procedureFlowDownUniqueValues);

    // code for system flow up
    system = getSystemFlowDown(workItem);
    systemFlowDownUniqueValues = removeDuplicates(system);
    workItem.setCustomField("system_flow_down_l4", systemFlowDownUniqueValues);

    // intitial occurance flow up override code
    maximum = getMax(workItem);
    if (maximum != "") {
      var label = getIntiLable(workItem, maximum);
      workItem.setCustomField("l4_initial_occurrence_flow_up_override", label);
    } else {
      workItem.setCustomField("l4_initial_occurrence_flow_up_override", "");
    }

    // intitial occurance code
    var intiFlowUp = workItem.getCustomField(
      "l4_initial_occurrence_flow_up_override"
    );
    var type = typeof workItem.getCustomField("l4_initial_occurrence");
    if (workItem.getCustomField("l4_initial_occurrence") != null) {
      if (type == "object") {
        var t = workItem.getCustomField("l4_initial_occurrence").getName();
      }
    } else {
      workItem.setEnumerationValue("l4_initial_occurrence", "");
    } //end of intitial occurance code

    s1 = workItem.getCustomField("severity_l4");
    i1 = String(workItem.getCustomField("l4_initial_occurrence"));
    if (s1 == "") {
      workItem.setCustomField("l4_initial_criticality", "");
    }
    var inti = workItem.getCustomField("l4_initial_occurrence_flow_up_override");

    // intitial criticality
    if (workItem.getCustomField("l4_initial_occurrence") != "" && s1 != "") {
      if (i1.length() > 55) {
        var j = workItem.getCustomField("l4_initial_occurrence").getId();
        var c = getCriticality(s1, j);
        workItem.setCustomField("l4_initial_criticality", c);
      }
      if (i1.length() <= 48) {
        var k = workItem.getCustomField("l4_initial_occurrence").getName();
        if (k == "Use Flow-up Value") {
          if (inti == null || inti == "") {
            workItem.setCustomField("l4_initial_criticality", " ");
          } else {
            var j = inti.slice(0, 1);
            var c = getCriticality(s1, j);
            workItem.setCustomField("l4_initial_criticality", c);
          }
        } else {
          var l = getCriticality(s1, k);
          workItem.setCustomField("l4_initial_criticality", l);
        }
      }
    }

    // final criticality
    f1 = String(workItem.getCustomField("l4_final_occurrence"));
    if (s1 == "" || f1.length() < 0) {
      workItem.setCustomField("l4_final_criticality", "");
    }
    if (workItem.getCustomField("l4_final_occurrence") != "" && s1 != "") {
      if (f1.length() <= 48) {
        var k1 = workItem.getCustomField("l4_final_occurrence").getName();
        if (k1 == "Use Initial Occurrence Value") {
          if (i1.length() <= 48) {
            var k2 = workItem.getCustomField("l4_initial_occurrence").getName();
            if (k2 == "Use Flow-up Value") {
              if (inti == null || inti == "") {
                workItem.setCustomField("l4_final_criticality", " ");
              } else {
                var j = inti.slice(0, 1);
                var c = getCriticality(s1, j);
                workItem.setCustomField("l4_final_criticality", c);
              }
            } else {
              var l = getCriticality(s1, k2);
              workItem.setCustomField("l4_final_criticality", l);
            }
          }
        } else {
          var l = getCriticality(s1, k1);
          workItem.setCustomField("l4_final_criticality", l);
        }
      }
    }
  }
  workItem.save();
} catch (error) {
  logWriter.write("Error message: " + error);
}
logWriter.flush();
