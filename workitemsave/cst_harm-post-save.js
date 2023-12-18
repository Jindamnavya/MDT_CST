var logFile = new java.io.FileWriter("./logs/main/cst_harm-post-save-script.log", false);
var logWriter = new java.io.BufferedWriter(logFile);
var currentDateTime = new java.util.Date().toString();
var status1=workItem.getStatus().getId();

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


try {
    //this is the title code
    var harm = "";
    var i=0;
    var procedureFlowUp = [];
    if (workItem.getCustomField("harm")) {
        harm = workItem.getCustomField("harm");
    }
    var procedure = "";
    procedure = workItem.getCustomField("harm_procedure");
    for (var p = 0; p < procedure.length; p++) {
        procedureFlowUp[i++] = procedure[p].getName();
       }
    var uniqueArray= removeDuplicates(procedureFlowUp);
   
    // concatenation of harm and procedure 
    var title = "";
    if (harm !== null && harm !== "")
        title = harm;
    if (harm.length() > 0) {
        if (procedure !== null && procedure.length > 0) {
            for (var p = 0; p < uniqueArray.length; p++) {
                title = title + " - " + uniqueArray[p];
               }
            // title = title + " - " + procedure;
        }
    }
    else {
        if (procedure !== null && procedure.length > 0) {
            for (var p = 0; p < uniqueArray.length; p++) {
                if(p==(uniqueArray.length - 1)){
                  title +=uniqueArray[p]
                  break;
                }
                title +=uniqueArray[p]+"-"; 
             } 
                    
        }
    }
    workItem.setTitle(title);
    workItem.save();
}
catch (error) {
    logWriter.write("Error message: " + error);
}
logWriter.flush();