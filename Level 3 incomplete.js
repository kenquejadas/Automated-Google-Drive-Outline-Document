// Developers working on this script, add any update notifications for users below
var updateDate = "March 31, 2023";
var updateMessage = "Level 3 folders/files are now available";
var refreshInterval = "morning between 8:00am and 9:00am" // Write that the doc will refresh every _____.

const driveId = 'Insert_Google_Drive_ID_Here'; // Input Google Drive ID as string variable

var doc = DocumentApp.openById('Insert_Google_Doc_ID_Here'); // Input Google Doc ID as string variable
var body = doc.getBody();

var allFoldersAndFiles = [];
const rootFolder = DriveApp.getFolderById(driveId);
let rootFolderInfo = {
  name: rootFolder.getName(),
  type: 'folder',
  level: 0,
  folder: rootFolder,
  folderId: driveId,
  folders: [],
  files: [],
};


function write(level, stop, parent) {
  try{
    /** The main issue appears to be the function running through the main-level folders and files 
     * but then gives this error after:
     * Cannot read properties of undefined (reading 'folderId') 
     */
    // LEVEL 1 ITERATION - files and folders
    var parentFolderId = parent.folderId; // error appears to be for this line
    var files = parent.folder.getFiles();
    var folders = parent.folder.getFolders();
    if (parentFolderId == driveId) {
        while (files.hasNext()) {
          var file = files.next();
          var fileName = file.getName();
          var fileId = file.getId();
          var fileUrl = "https://docs.google.com/document/d/" + fileId + "/";
          let fileObj = {
            name: fileName,
            type: 'file',
            level: level,
            Url: fileUrl,
            file: file,
            fileId: file.getId(),
            parentFolderId: parentFolderId,
            };
          allFoldersAndFiles.push(fileObj);
          console.log("Added " + fileObj.name + " to the allFoldersAndFiles array")
        }
      while (folders.hasNext() && level <= stop) {
        var folder = folders.next();
        var folderName = folder.getName();
        var folderId = folder.getId();
        var folderUrl = "https://drive.google.com/drive/folders/" + folderId + "/";
        let folderObj = {
          name: folderName,
          type: 'folder',
          level: level,
          Url: folderUrl,
          // folder: folder,
          folderId: folderId,
          parentFolderId: parentFolderId,
          // Arrays storing objects or other arrays caused errors, so instead make multiple arrays to store names and URLs
          folderNames: [],
          folderUrls: [],
          fileNames: [],
          fileUrls: [],
          // Level 3
          folderNames_Level3: [],
          folderUrls_Level3: [],
          fileNames_Level3: [],
          fileUrls_Level3: [],
          // Level 4 will just display folder/file count
          Level4foldercount: 0,
          Level4filecount: 0,
          };
        //
        //
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // LEVEL 2 ITERATION - insideFiles and insideFolders
        // Loop through inside folders and files to put into the arrays 
        // Level 2 file/folder objects  and arrays cause errors --> somehow store single variables?
        // insideFiles
        var insideFiles = folder.getFiles()
        while (insideFiles.hasNext()) {
          var insideFile = insideFiles.next();
          console.log("Level 2 File iteration has identified " + insideFile)
          var insideFileName = insideFile.getName()
          var insideFileId = insideFile.getId()
          var insideFileUrl = "https://docs.google.com/document/d/" + insideFileId + "/"
          folderObj.fileNames.push(insideFileName)
          folderObj.fileUrls.push(insideFileUrl)
        }
        // insideFolders
        var insideFolders = folder.getFolders()
        while (insideFolders.hasNext()) {
          var insideFolder = insideFolders.next(); 
          console.log("Level 2 Folder iteration has identified " + insideFolder)
          var insideFolderName = insideFolder.getName()
          var insideFolderUrl = DriveApp.getFolderById(insideFolder.getId()).getUrl()
          folderObj.folderNames.push(insideFolderName)
          folderObj.folderUrls.push(insideFolderUrl)
          //////////////////////////// LEVEL 3 ITERATION ////////////////////////////////////////////////
          var level3folders = insideFolder.getFolders()
          var level3files = insideFolder.getFiles()
          while (level3files.hasNext()) {
            var level3file = level3files.next()
            console.log("Level 3 File iteration has identified " + level3file)
            var level3fileName = level3file.getName()
            var level3fileId = level3file.getId()
            var level3fileUrl = "https://docs.google.com/document/d/" + level3fileId + "/"
            folderObj.fileNames_Level3.push(level3fileName)
            folderObj.fileUrls_Level3.push(level3fileUrl)
          }
          while (level3folders.hasNext()) {
            var level3folder = level3folders.next()
            console.log("Level 3 Folder iteration has identified " + level3folder)
            var level3folderName = level3folder.getName()
            var level3folderUrl = DriveApp.getFolderById(level3folder.getId()).getUrl()
            folderObj.folderNames_Level3.push(level3folderName)
            folderObj.folderUrls_Level3.push(level3folderUrl)
          }
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        //
        //
        console.log(folderObj.name + " file names array: " + folderObj.fileNames)
        console.log(folderObj.name + " file URLs array: " + folderObj.fileUrls)
        console.log(folderObj.name + " folder names array: " + folderObj.folderNames)
        console.log(folderObj.name + " folder URLs array: " + folderObj.folderUrls)
        allFoldersAndFiles.push(folderObj);
        console.log("Added " + folderObj.name + " to the allFoldersAndFiles array")
        allFoldersAndFiles.sort();
      }
    }
    else {
      console.log('ERROR') // if-else probably is not needed since this is not recursive
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Now to actually write on the Google Doc
    body.clear();
    body.appendParagraph("Automated Table of Contents for OIT-Data Center Google Drive BETA").setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    body.appendParagraph(" ");
    body.appendParagraph("Last Update: " + updateDate + " - " + updateMessage);
    body.appendParagraph(" ");
    var currentDate = Utilities.formatDate(new Date(), "GMT-5", "MM/dd/yyyy HH:mm:ss");
    body.appendParagraph("This document automatically refreshes every " + refreshInterval + ". Last refresh: " + currentDate);
    body.appendHorizontalRule();
    body.appendParagraph(" ");
    for(let i = 0; i < allFoldersAndFiles.length; i++){
      selectedObject = allFoldersAndFiles[i];
      Logger.log("Level 1 writing iteration has identified " + selectedObject.name);
      var icon = ""
      if (selectedObject.type == "folder") {
        icon = "📂";
      }
      else {
        icon = "📝";
      }
      // Write first level object in the drive
      body.appendParagraph(icon + " " + selectedObject.name + " (" + selectedObject.type + ")").setLinkUrl(selectedObject.Url).setSpacingBefore(20);
      // Write second level (inside) object 
      if (selectedObject.type == "folder") {
        // selectedObject.getFiles() does not work because it is from an array
        var indent1 = 72;
        if (selectedObject.fileNames.length > 0) {
          console.log(selectedObject.name + " files counted by Level 2 writing iteration: " + selectedObject.fileNames.length)
          for (let i = 0; i < selectedObject.files.length; i++) {
            var insideFileName = selectedObject.fileNames[i];
            var insideFileUrl = selectedObject.fileUrls[i];
            Logger.log("Level 2 writing iteration has identified " + insideFileName);
            var addFile = body.appendParagraph("📝 " + insideFileName + " (file)").setIndentFirstLine(indent1);
            var addFile = addFile.setLinkUrl(insideFileUrl).setSpacingBefore(20);
          }
        }
        else {
          console.log(selectedObject.name + " Files array is empty");
        }
        if (selectedObject.folderNames.length > 0) {
          console.log(selectedObject.name + " folders counted by Level 2 writing iteration: " + selectedObject.folderNames.length)
          for (let i = 0; i < selectedObject.folderNames.length; i++) {
            var insideFolderName = selectedObject.folderNames[i];
            var insideFolderUrl = selectedObject.folderUrls[i];
            Logger.log("Level 2 writing iteration has identified " + insideFolderName);
            var addFolder = body.appendParagraph("📂 " + insideFolderName + " (folder)").setIndentFirstLine(indent1);
            var addFolder = addFolder.setLinkUrl(insideFolderUrl).setSpacingBefore(10);
          }
        }
        else {
          console.log(selectedObject.name + " Folders array is empty");
          }
          ////// LEVEL 3 WRITING ITERATION //////////////////////////////////////////
          // LEVEL 3 FILES //
          if (selectedObject.fileNames_Level3.length > 0) {
          console.log(selectedObject.name + " files counted by Level 3 writing iteration: " + selectedObject.fileNames_Level3.length)
          for (let i = 0; i < selectedObject.fileNames_Level3.length; i++) {
            var level3FileName = selectedObject.fileNames_Level3[i];
            var level3FileUrl = selectedObject.fileUrls_Level3[i];
            Logger.log("Level 3 writing iteration has identified " + level3FileName);
            if (level3FileName.length > 25) {
              level3fileName = level3fileName.substring(0, 24) + "...";
            }
            var addFile = body.appendParagraph("📝 " + level3FileName + " (file)").setIndentFirstLine(2 * indent1).setSpacingBefore(10);
            if (level3FileUrl.includes("docs.google.com")) {
              var addFile = addFile.setLinkUrl(level3FileUrl)
            }
          }
          // LEVEL 3 FOLDERS //
          if (selectedObject.folderNames_Level3.length > 0) {
          console.log(selectedObject.name + " folders counted by Level 3 writing iteration: " + selectedObject.folderNames_Level3.length)
          for (let i = 0; i < selectedObject.folderNames_Level3.length; i++) {
            var level3FolderName = selectedObject.folderNames_Level3[i];
            var level3FolderUrl = selectedObject.folderUrls_Level3[i];
            Logger.log("Level 3 writing iteration has identified " + level3FolderName);
            if (level3FolderName.length > 25) {
              level3folderName = level3folderName.substring(0, 24) + "...";
            }
            var addFolder = body.appendParagraph("📂 " + level3FolderName + " (folder)").setIndentFirstLine(2 * indent1);
            var addFolder = addFolder.setLinkUrl(level3FolderUrl).setSpacingBefore(10);
            }
          }
        }
      }
    }
    } catch (err) {
    console.log('Failed with an error: %s ', err.message);
  }
}


write(1, 3, rootFolderInfo);
