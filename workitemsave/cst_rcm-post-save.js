var logFile = new java.io.FileWriter("./logs/main/cst_rcm-post-save-script.log", false);
var logWriter = new java.io.BufferedWriter(logFile);
var currentDateTime = new java.util.Date().toString();



try { 
   //this is the title code
  var iD = workItem.getCustomField("rcm_id");
  var description = String(workItem.getCustomField("description").getContent());
  var title = "";
  if (iD !== null) title = iD;
  if (description !== null && description.length() > 12)
    title = title + " - " + description.slice(11);
    workItem.save();
}
catch (error) {
    logWriter.write("Error message: " + error);
}
logWriter.flush();