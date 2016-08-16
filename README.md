Todo:
- Create a file (create metadata locally)
- Highlight error line in sublime (is this possible?)
- Run query
- have init tool to create credentials.json and things like that (or not?)

Bugs:
- Save an apexpage without an ending apexpage tag


What the program does:
Connect Sublime Build with our tool
Create files to cache component ids
Check if access token exists
Assume credentials.json is fullpath but 2 directories up (we should be at the root of org folder)
Ability to call "node main.js init [params]" through cli
u=username p=password i=test/login
Ability to call "node main.js createComponent [params]" through cli
t=page/class/trigger/cls name=


Flow:
Validate Args

Check if we have an access token
Attempt to log in with access token
if failed, log in using credentials and save new token

Get the file Extension
Check to see if we have the Id of the file cached somewhere (should be saved as FileName.extension => ID)

