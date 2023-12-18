var logFile = new java.io.FileWriter("./logs/main/cst_l2_dfmea_row-post-save-script.log",false);
var logWriter = new java.io.BufferedWriter(logFile);
var currentDateTime = new java.util.Date().toString();
var result = "";
var prob = [];
var sys = [];
var sev;
var x;
var i1;
var f1;
var s1;
var l;
var useFlowUpL3 = "";
var severityL1;
var l1InitialOccurFlowup = "";
var l1FinalOccurFlowup = "";
var l1InitialOccurrence = "";
var l1FinalOccurrence = "";
var maximum;
var linkedWorkItems = workItem.getLinkedWorkItems();

// this function calculates safety
function getSafety(wItem) {
  var safety;
  var yesCount = 0;
  var noCount = 0;
  if (linkedWorkItems.size() > 0) {
    for (var x = 0; x < linkedWorkItems.length; x++) {
      var linkedWI = linkedWorkItems.get(x);
      if (linkedWI.getType().getId().equals("cst_l1_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
        if (linkedWI.getCustomField("safety_l1") != null) {
          safety = linkedWI.getCustomField("safety_l1");
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

function loneGetSeverity(wItem) {
  var severity = [];
  if (linkedWorkItems.size() > 0) {
    for (var x = 0; x < linkedWorkItems.length; x++) {
      var linkedWI = linkedWorkItems.get(x);
      if (linkedWI.getType().getId().equals("cst_l1_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
        if (linkedWI.getCustomField("severity_l1") != null) {
          var i = parseInt(linkedWI.getCustomField("severity_l1"));
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

// this function calculates Severity
function getSeverity(wItem) {
  var severity = [];
  var max2;
  var p = "";
  if (linkedWorkItems.size() > 0) {
    for (var x = 0; x < linkedWorkItems.length; x++) {
      var linkedWI = linkedWorkItems.get(x);
      if (linkedWI.getType().getId().equals("cst_l1_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
        if (linkedWI.getCustomField("severity_l1") != null) {
          var i = parseInt(linkedWI.getCustomField("severity_l1"));
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
      if (linkedWI.getType().getId().equals("cst_l1_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
        if (linkedWI.getCustomField("severity_l1") != null) {
          var y = linkedWI.getCustomField("severity_l1");
          if (y.slice(0, 1) == max2) {
            p = linkedWI.getCustomField("severity_l1");
          }
        }
      }
    }
    return p;
  }
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
  if (occurance != null && severity != null) {
    var x = occurance.slice(0, 1);
    var y = severity.slice(0, 1);
    criticalityValue = criticality[parseInt(x)][parseInt(y)];
  }
  return String(criticalityValue);
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
      if (linkedWI.getType().getId().equals("cst_l3_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
        if (linkedWI.getCustomField("l3_final_occurrence") != null) {
          x1 = String(linkedWI.getCustomField("l3_final_occurrence"));
          if (x1.length() <= 48) {
            m = linkedWI.getCustomField("l3_final_occurrence").getId();
            if (m != "6") InitialOccurrenceFlowup.push(m);
          }
          if (x1.length() > 55) {
            y = linkedWI.getCustomField("l3_final_occurrence").getId();
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
      text = useFlowUpL3;
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
      if (linkedWI.getType().getId().equals("cst_l3_dfmea_row") && linkedWI.getStatus().getId().equals("approved")) {
        if (linkedWI.getCustomField("l3_initial_occurrence_flow_up_override") !=null) {
          if (linkedWI.getCustomField("l3_initial_occurrence") != null) {
            if (linkedWI.getCustomField("l3_initial_occurrence").getId() == "6") {
              useFlowUpValue = linkedWI.getCustomField("l3_initial_occurrence_flow_up_override");
            }
          }
        }
      }
    }
  }
  return String(useFlowUpValue);
}

try {
  //this is the title code
  var item = String(workItem.getCustomField("l2_item"));
  var functions = String(workItem.getCustomField("l2_function"));
  var failureMode = String(workItem.getCustomField("l2_failure_mode"));
  var cause = String(workItem.getCustomField("l2_cause"));

  // code for nonSafetyEndEffectSeverity
  if (workItem.getCustomField("l2_non_safety_end_effect_severity") != null)
    x = workItem.getCustomField("l2_non_safety_end_effect_severity").getName();
  if (workItem.getCustomField("l2_non_safety_end_effect_severity") == null)
    x = "";
  
  var title = "";
  if (item !== null && item.length() > 13) title = item.slice(11);
  if (functions !== null && functions.length() > 12)
    title = title + " - " + functions.slice(11);
  if (failureMode !== null && failureMode.length() > 12)
    title = title + " - " + failureMode.slice(11);
  if (cause !== null && cause.length() > 12)
    title = title + " - " + cause.slice(11);
  workItem.setTitle(title);

  // if workitem is not approved, then custom field values need to be empty.
  if (workItem.getStatus().id !== "approved")
   {
    workItem.setCustomField("safety_l2", "");
    workItem.setCustomField("severity_l2", "");
    workItem.setCustomField("l2_initial_criticality", "");
    workItem.setCustomField("l2_final_criticality", "");
    workItem.setCustomField("l2_initial_occurrence_flow_up_override", "");
  } 
  else {
    // getting severity from L1 DFMEA linked workitems
    severityL1 = loneGetSeverity(workItem);
    if (severityL1 == "-Infinity") {
      severityL1 = "";
    }
    var nonSafetyL2EndEffect = workItem.getCustomField("non_safety_l2_end_effect");

    // code for nonSafetyEndEffect
    if (nonSafetyL2EndEffect != null) {
      workItem.setCustomField("safety_l2", "N");
      workItem.setCustomField("severity_l2", x);
    }
    if (nonSafetyL2EndEffect == "" || nonSafetyL2EndEffect == null) {
      var severityL2 = getSeverity(workItem);
      if (severityL2 == "-Infinity") {
        severityL2 = "";
      }
      workItem.setCustomField("severity_l2", severityL2);

      // code for safety
      var value = getSafety(workItem);
      if (value == "") {
        value = "";
      }
      workItem.setCustomField("safety_l2", value);
    }

    // l2 intitial occurance flow up override code
    maximum = getMax(workItem);
    if (maximum != "") {
      var label = getIntiLable(workItem, maximum);
      workItem.setCustomField("l2_initial_occurrence_flow_up_override", label);
    } else {
      workItem.setCustomField("l2_initial_occurrence_flow_up_override", "");
    }

    // intitial occurance code
    var intiFlowUp = workItem.getCustomField("l2_initial_occurrence_flow_up_override");
    var type = typeof workItem.getCustomField("l2_initial_occurrence");
    if (workItem.getCustomField("l2_initial_occurrence") != null) {
      if (type == "object") {
        var t = workItem.getCustomField("l2_initial_occurrence").getName();
      }
    } else {
      workItem.setEnumerationValue("l2_initial_occurrence", "");
    }//end of intitial occurance code

    s1 = workItem.getCustomField("severity_l2");
    i1 = String(workItem.getCustomField("l2_initial_occurrence"));
    if (s1 == "") {
      workItem.setCustomField("l2_initial_criticality", "");
    }
    var inti = workItem.getCustomField("l2_initial_occurrence_flow_up_override");
    
    // intitial criticality
    if (workItem.getCustomField("l2_initial_occurrence") != "" && s1 != "") {
      if (i1.length() > 55) {
        var j = workItem.getCustomField("l2_initial_occurrence").getId();
        var c = getCriticality(s1, j);
        workItem.setCustomField("l2_initial_criticality", c);
      }
      if (i1.length() <= 48) {
        var k = workItem.getCustomField("l2_initial_occurrence").getName();
        if (k == "Use Flow-up Value") {
          if (inti == null || inti == "") {
            workItem.setCustomField("l2_initial_criticality", " ");
          } else {
            var j = inti.slice(0, 1);
            var c = getCriticality(s1, j);
            workItem.setCustomField("l2_initial_criticality", c);
          }
        } else {
          var l = getCriticality(s1, k);
          workItem.setCustomField("l2_initial_criticality", l);
        }        
      }
    }

    // final criticality
    f1 = String(workItem.getCustomField("l2_final_occurrence"));
    if (s1 == "" || f1.length() < 0) {
      workItem.setCustomField("l2_final_criticality", "");
    }
    if (workItem.getCustomField("l2_final_occurrence") != "" && s1 != "") {
      if (f1.length() <= 48) {
        var k1 = workItem.getCustomField("l2_final_occurrence").getName();
        if (k1 == "Use Initial Occurrence Value") {
          if (i1.length() <= 48) {
            var k2 = workItem.getCustomField("l2_initial_occurrence").getName();
            if (k2 == "Use Flow-up Value") {
              if (inti == null || inti == "") {
                workItem.setCustomField("l2_final_criticality", " ");
              } else {
                var j = inti.slice(0, 1);
                var c = getCriticality(s1, j);
                workItem.setCustomField("l2_final_criticality", c);
              }
            } else {
              var l = getCriticality(s1, k2);
              workItem.setCustomField("l2_final_criticality", l);
            }
          }
        } else {
          var l = getCriticality(s1, k1);
          workItem.setCustomField("l2_final_criticality", l);
        }
      }
    }
  }
  workItem.save();
} catch (error) {
  logWriter.write("Error message: " + error);
}
logWriter.flush();
