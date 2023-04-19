# Automated Google Drive Outline Document
The complete functional JavaScript code for Google Apps Script is [Level 2 display](https://github.com/kenquejadas/Automated-Google-Drive-Outline-Document/blob/main/Level%202%20display). Level 3 drive contents display is marked incomplete due to improper parent folder categorization when writing onto the Google Doc due to the data structures writing limitation (for more details, see [**Technical Constraints**](https://github.com/kenquejadas/Google-Drive-Web-Scrape-Outline-Doc-Automation#technical-constraints) section below).

## Purpose
### View what contents are inside each folder in real-time
The Google Drive Outline document, also known by its alias "Table of Contents", assists team members of a Google Workspace shared drive by displaying a high-level outline of the shared drive structure in real-time to enhance the searchability of folders and files in different categories. The outline displays folders/files in hierarchical order in different levels with Level 1 being the most-immediate folders/files a user would see when first opening the Google Drive. Level 2 consists of the folders/files in each Level 1 folder. This would display in the Google Doc as so:
* Level 1 File
* Level 1 Folder
  * Level 2 File
  * Level 2 Folder

As of now, the complete script only writes up to Level 2 drive contents properly categorized under their respective parent folders. This is due to the data structures properly written onto the Google Doc being limited to just multiple arrays for separate folder data (for more details, see [**Technical Constraints**](https://github.com/kenquejadas/Google-Drive-Web-Scrape-Outline-Doc-Automation#technical-constraints) section below).

An [experimental script](https://github.com/kenquejadas/Automated-Google-Drive-Outline-Document/blob/main/Level%203%20incomplete) for writing Level 3 folders/files is available in this repository, but it currently cannot properly organize Level 3 folders/files under their respective parent folders (Level 2 folders).

## Background
### Google Drive Reorganization/UX Project
This automated drive outline script was a sequential project following the completion of a project to reorganize my work team's Google Drive layout. The team Google Drive had many complaints from users regarding findability of mission-critical files for day-to-day operations. One of the problems was having dozens of folders to choose from just on the home page. Another problem found was lack of searchability of some files using Google Drive's search bar. While our team had no control over Google Drive as a software product, we found a way to work around the searchability issue.

### Outline/"Table of Contents" Doc to Enhance Searchability
Following user interviews regarding the team's Google Drive usability, one of the solutions brought up was a "Table of Contents" document, a Google Doc sitting in the home page of the Google Drive that displays an indented list layout of the Google Drive contents so that team members can see the drive contents beyond the home page (Level 1) folders without having to manually click through folders on the Google Drive. Users have also found searching within the document (Ctrl+F for Windows, Cmd+F for Mac) to be more effective than simply using the Google Drive search bar. 

An example written layout is shown below:
* West Building
  * IT Documentation Folder
    * Security Audit Spreadsheet
    * Physical Infrastructure Folder
* East Building
  * IT Documentation Folder
    * Card Access Spreadsheet
    * Cloud Folder
* Team
  * Procedures Folder
    * Software Tutorials
      * Troubleshooting Document

### Automation
While the "Table of Contents" drive outline doc received much appraisal, a potential issue was foreseen due to the document's dependency on manual updates in order to accurately outline the team's Google Drive. As the drive itself will change overtime, from simple file additions/deletions to even a complete revamp in organizational structure of the folders, it is not guaranteed and perhaps unlikely that the document will consistently be manually updated to correspond with the Google Drive contents. My manager requested a look into the possibility of the Google Doc updates being automated, and while I was doubtful at first, I proceeded to explore automation capabilities with one of my coworkers with a computer science background. 

The script that my coworker came up with succeeded at reading the drive contents, but was incapable of writing onto the Google Doc due to an issue with data structures (for more details, see [**Technical Constraints**](https://github.com/kenquejadas/Google-Drive-Web-Scrape-Outline-Doc-Automation#technical-constraints) section below). After some project stagnation due to other projects occupying team members' priorities, I attempted to reverse engineer my coworker's script to identify the problem, and then rewrite the script using a simpler method that would enable Google Apps Script to write the contents on the Google Doc.

## Technical Constraints
### Data Structures Writing Limitation
The original script, written by my coworker, consisted of a recursive function that relied on folder/file data to be stored in JSON objects that stored arrays of more JSON objects at each level -- meaning there would be objects stored within objects.

After running the original script, the folder objects would look something like this:
```
level1folderObj = {
  name: level1folder,
  type: 'folder',
  Url: folderUrl,
  folderId: folder.getId(),
  files: [],
  folders: [
   {
    name: level2folder,
    type: 'folder',
    Url: folderUrl,
    folderId: folder.getId(),
    files: [],
    folders: [
     {
      name: level3folder,
      type: 'folder',
      Url: folderUrl,
      folderId: folder.getId(),
      files: [],
      folders: [],
     }
    ],
   }
  ],
};
```

Unfortunately, this was unable to be written on the Google Docs. I learned about this constraint while rewriting the script, and in response, I experimented a bit with arrays. I found that even storing arrays within arrays led to errors with writing the drive contents on the document, so I ended up with a simpler method of having separate arrays storing separate folder/file names and URLs for each level.

After running the simplified script, the folder objects would look something like this:
```
level1folderObj = {
          name: folderName,
          type: 'folder',
          level: level,
          Url: folderUrl,
          folderId: folderId,
          level2folderNames: ['folderA_name', 'folderB_name', 'folderC_name'],
          level2folderUrls: ['folderA_URL', 'folderB_URL', 'folderC_URL'],
          level2fileNames: ['fileA_name', 'fileB_name', 'fileC_name'],
          level2fileUrls: ['fileA_URL', fileB_URL', 'fileC_URL'],
          };
```
To accommodate for level 3 folders/files, the level 2 arrays can be copied and pasted as level 3 arrays under the level 2 arrays without any added indentation. However, due to to the limitations, level 3 drive contents will be written but not proeprly categorized under their respective parent folder.
