//TODO: save updated access token,
take in single full path param and extract info from that


// bugs: save an apexpage without an ending apexpage tag

// Connect Sublime Build with our tool
// Create files to cache component ids
// Check if access token exists
// Assume credentials.json is fullpath but 2 directories up (we should be at the root of org folder)
// Ability to call "node main.js init [params]" through cli
  // u=username p=password i=test/login
// Ability to call "node main.js createComponent [params]" through cli
  // t=page/class/trigger/cls name=

// node main.js /Users/gorejakz/Bluewolf/Tools/Force-Faster-Save/Test.page Test page
// node main.js /Users/gorejakz/Bluewolf/Tools/Force-Faster-Save/TestApex.cls TestApex cls
// node main.js /Users/gorejakz/Bluewolf/Tools/Force-Faster-Save/Test.trigger Test trigger
// 

/**
 * FLOW
 *
 * Validate Args
 *
 * Check if we have an access token
 * Attempt to log in with access token
    * if failed, log in using credentials and save new token
 * 
 * Get the file Extension
 * Check to see if we have the Id of the file cached somewhere (should be saved as FileName.extension => ID)
 */




