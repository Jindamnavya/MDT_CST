var logFile = new java.io.FileWriter("./logs/main/cst_hazard-post-save-script.log", false);
var logWriter = new java.io.BufferedWriter(logFile);
var currentDateTime = new java.util.Date().toString();
var system;
var procedure;
var linkedWorkItems = workItem.getLinkedWorkItems();
var status1=workItem.getStatus().getId();
function getSystem(wItem) {
    var systemVal=[];
    var i=0;
    if (linkedWorkItems.size() > 0) {
        for (var x = 0; x < linkedWorkItems.length; x++) 
        {
            var linkedWI = linkedWorkItems.get(x);
            logWriter.write("linkedWI:" + linkedWI.getId() + "\n");
            if (linkedWI.getType().getId().equals("cst_hazardous_situation") && linkedWI.getStatus().getId().equals("approved")) 
            {
                if (linkedWI.getCustomField("hazardous_situation_system") != null)
                 {                  
                    systemVal[i++] = linkedWI.getCustomField("hazardous_situation_system").getName();
                    // logWriter.write("s:" + x + " " + systemVal + "\n");
                }
            }
          
        }
        logWriter.write("systemVal:" + systemVal + "\n");
            return systemVal;
    }
    else{
        return "";
    }
}
function getProcedure(wItem) {
    var procedureVal=[];
    var procedureFlowUp=[];
    var j=0;
    if (linkedWorkItems.size() > 0) {
        for (var x = 0; x < linkedWorkItems.length; x++) {
            var linkedWI = linkedWorkItems.get(x);
            if (linkedWI.getType().getId().equals("cst_hazardous_situation"))
             {
                if (linkedWI.getCustomField("hazardous_situation_procedure") != null && linkedWI.getStatus().getId().equals("approved")) 
                {
                    procedureVal = linkedWI.getCustomField("hazardous_situation_procedure");
                    for (var p = 0; p < procedureVal.length; p++) {
                        procedureFlowUp[j++] = procedureVal[p].getName();
                    }
                    // logWriter.write("p:" + x + " " + procedureVal + "\n");
                }
            }   

        }
        logWriter.write("procedureFlowUp:" + procedureFlowUp + "\n");
       return  procedureFlowUp;
    }
    else{
        return "";
    }
}
function message(item) {
    result = " ";
    for (i = 0; i < item.length; i++) {
        if (i == (item.length - 1)) {
            result = result.concat(item[i]);
        }
        else {
            result = result.concat(item[i] + ", ");
        }
    }
    return result;
}
function removeDuplicates(arr) {
    var descTxtForm="";
    var planeText="";
    var resultArray = [];
    var i = 0;
    for (var ele = 0; ele < arr.length; ele++) {
        if (resultArray.indexOf(arr[ele]) === -1) {
            resultArray[i++] = arr[ele];
        }
    }
    logWriter.write("resultArray:" + resultArray + "\n");
    for (var e = 0; e< resultArray.length; e++) {
        planeText +=resultArray[e]+"<br>";
    }
     descTxtForm = new com.polarion.core.util.types.Text("text/html", planeText);
    return descTxtForm ;

}

try {

    if (workItem.getStatus().id !== "approved")
    {
        workItem.setCustomField("hazard_system", "");
        workItem.setCustomField("hazard_procedure", "");
    }
    else{
    
    system = removeDuplicates(getSystem(workItem));
    workItem.setValue("hazard_system", system);
    procedure = removeDuplicates(getProcedure(workItem));
    workItem.setValue("hazard_procedure", procedure);
    }
    var Procedure = workItem.getCustomField("hazard_procedure");
    logWriter.write("Procedure:" + Procedure + "\n");
    workItem.save();

}
catch (error) {
    logWriter.write("Error message: " + error);
}
logWriter.flush();