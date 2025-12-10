KodeBase – Online Code Editor

KodeBase is a full-featured online code editor built using the MERN stack (MongoDB, Express.js, React.js, Node.js).
It allows users to write, edit, run, and manage code projects in real time — all inside a clean and intuitive UI.

Users can sign up, create coding projects, choose languages, write code, and see output instantly — similar to Replit or OnlineGDB.

Features
Authentication:-
  Secure user sign-up & login
  Password hashing
  Session-based login

 Code Editor:-
  Syntax-highlighted editor
  Real-time code execution
  Output terminal panel
  Language selection (Java supported, scalable for more)

Project Management:-
Create new code projects
Select language version
Open & edit project files
Run code with instantly visible output

Frontend:-
Modern dark UI
Fully responsive
Smooth UX transitions

Backend:-
RESTful APIs with Express.js
Code execution handled via child_process
MongoDB project & user storage

Execution Flow:-
1:-User writes code in the editor
2:-Code is sent to backend via /api/execute
3:-Backend creates a temporary file
4:-child_process compiles & runs code
5:-Output is returned to frontend
5:-Shown in the Output panel
