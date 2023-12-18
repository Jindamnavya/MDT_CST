var logFile = new java.io.FileWriter("./logs/main/cst_hazardous_situation-post-save-script.log", false);
var logWriter = new java.io.BufferedWriter(logFile);
var currentDateTime = new java.util.Date().toString();
var linkedWorkItems = workItem.getLinkedWorkItems();

function getProcedure(wItem) {
    // var procedureVal;
    var procedureFlowUp = [];
    var i=0;
    if (linkedWorkItems.size() > 0) {
        for (var x = 0; x < linkedWorkItems.length; x++) {
            var linkedWI = linkedWorkItems.get(x);
            if (linkedWI.getType().getId().equals("cst_harm") && linkedWI.getStatus().getId().equals("approved")) {
                if (linkedWI.getCustomField("harm_procedure") != null) {
                    var procedureVal = linkedWI.getCustomField("harm_procedure");
                   for (var p = 0; p < procedureVal.length; p++) {
                        procedureFlowUp[i++] = procedureVal[p].getId();
                       }
                  
                }
            }
        }
        //  logWriter.write("p:" + procedureFlowUp + "\n");
        return procedureFlowUp;
    }
    else {
        return "";
    }

}
function removeDuplicates(arr) {
    var resultArray = [];
    var i = 0;
    for (var ele = 0; ele < arr.length; ele++) {
        if (resultArray.indexOf(arr[ele]) === -1) {
            resultArray[i++] = arr[ele];
        }
    }
    // logWriter.write("resultArray:" + resultArray + "\n");
    return resultArray;

}
function checkWorkItemLink(workItem) 
{  
       //Getting multi enum values
       var cwValues = workItem.getValue("hazardous_situation_procedure");
	   //Copying into another variable
	   var val = cwValues;
       var enumlist = procedure;
	   //for time being 2 loops, will be one loop in future
	   val.removeAll(cwValues);
          for (var i = 0; i < enumlist.length; i++) {
              val.add(workItem.getEnumerationOptionForField("hazardous_situation_procedure", enumlist[i]));
         }

	    workItem.setValue("hazardous_situation_procedure",val);	   
	    // workItem.save();	
}

try {
     //this is the title code
     var hazardSituation = "";
     var procedureFlowUp = [];
     var i=0;
     if (workItem.getCustomField("hazardous_situation")) {
         hazardSituation = workItem.getCustomField("hazardous_situation");
     }
     var system = "";
     if (workItem.getCustomField("hazardous_situation_system")) {
         system = workItem.getCustomField("hazardous_situation_system").getName();
     }

    if (workItem.getStatus().id !== "approved")
    {
        // workItem.setEnumerationValue("hazardous_situation_system", "");
        // workItem.setEnumerationValue("hazardous_situation_procedure", "");
        // workItem.setEnumerationValue("l1_initial_occurrence", "");
        // // setCustomField
        // workItem. setCustomField("hazardous_situation_system", "");
        // workItem. setCustomField("hazardous_situation_procedure", "");

    }
    else
    {
    var procedure = removeDuplicates(getProcedure(workItem));
    checkWorkItemLink(workItem);
    }
    // logWriter.write("procedure final" + procedure + "\n");
    // // workItem.setEnumerationValue("hazardous_situation_procedure",procedure);
	var Procedure = workItem.getCustomField("hazardous_situation_procedure");
    for (var p = 0; p < Procedure.length; p++) {
        procedureFlowUp[i++] = Procedure[p].getName();
       }
    logWriter.write("procedureFlowUp " + procedureFlowUp);
    var uniqueArray= removeDuplicates(procedureFlowUp);
    // var FlowUp=[];
    // var j=0;
    // for (var p = 0; p <  Procedure.length; p++) {
    //     FlowUp[j++] =  Procedure[p].getId();
    //    }
    logWriter.write("uniqueArray " +  uniqueArray + "\n");
	


    // // concatenation of system and procedure 
    var title = "";
    if (hazardSituation !== null && hazardSituation !== "")
        title = hazardSituation;

    if (hazardSituation.length() > 0) {
        if (system !== null && system.length() > 0) {
            title = title + "-" + system;
        }
    }
    else {
        if (system !== null && system.length() > 0) {
            title = system;
        }
    }
    if (system.length() > 0) {
        if (Procedure !== null && Procedure.length > 0) {
            for (var p = 0; p < uniqueArray.length; p++) {
                title = title + " - " + uniqueArray[p];
               }
        }
    }
    else {

        if (Procedure !== null && Procedure.length > 0) {
            if (hazardSituation.length() > 0){
                title = hazardSituation;
                 for (var p = 0; p < uniqueArray.length; p++) {
                    title +="-" + uniqueArray[p];
               }
            }
            else{
            for (var p = 0; p < uniqueArray.length; p++) {
                if(p==(uniqueArray.length - 1)){
                  title +=uniqueArray[p]
                  break;
                }
                title +=uniqueArray[p]+"-"; 
             } 
           }
        }
    }

    workItem.setTitle(title);
    // }
    workItem.save();
}

catch (error) {
    logWriter.write("Error message: " + error);
}
logWriter.flush();
































// var logFile = new java.io.FileWriter("./logs/main/cst_hazardous_situation-post-save-script.log", false);
// var logWriter = new java.io.BufferedWriter(logFile);
// var currentDateTime = new java.util.Date().toString();


// try {
//     //this is the title code
//     var hazardSituation = "";
//     if (workItem.getCustomField("hazardous_situation")) {
//         hazardSituation = workItem.getCustomField("hazardous_situation");
//     }
//     var system = "";
//     if (workItem.getCustomField("hazardous_situation_system")) {
//         system = workItem.getCustomField("hazardous_situation_system").getName();
//     }
//     var procedure = "";
//     if (workItem.getCustomField("hazardous_situation_procedure")) {
//         procedure = workItem.getCustomField("hazardous_situation_procedure").getName();
//     }
//     // concatenation of system and procedure 
//     var title = "";
//     if (hazardSituation !== null && hazardSituation !== "")
//         title = hazardSituation;

//     if (hazardSituation.length() > 0) {
//         if (system !== null && system.length() > 0) {
//             title = title + "-" + system;
//         }
//     }
//     else {
//         if (system !== null && system.length() > 0) {
//             title = system;
//         }
//     }
//     if (system.length() > 0) {
//         if (procedure !== null && procedure.length() > 0) {
//             title = title + "-" + procedure;
//         }
//     }
//     else {

//         if (procedure !== null && procedure.length() > 0) {
//             if (hazardSituation.length() > 0)
//                 title = hazardSituation + "-" + procedure;
//             else
//                 title = procedure;
//         }
//     }

//     workItem.setTitle(title);
//     workItem.save();
// }

// catch (error) {
//     logWriter.write("Error message: " + error);
// }
// logWriter.flush();