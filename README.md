SETUP
    Haven't found a way to make this a single command
    Two terminals
        Front end -- either of these should work
            npm start --prefix .\frontend\ 
            cd frontend && npm run start
        Backend -- either of these should work
            npm start --prefix .\backend\ 
            npm run ./backend/index.js
            cd backend && npm run start
Backend will run on 8080 by default 
Frontend will run on port 3000 by default
Routes
    /colas -- the one true route
    All requests go through here
    DELETE - deletes json -- requires {} json
    POST - adds new soda to store -- requires {} json
    PUT - updates soda in store requires "item" json
    GET - returns all soda in store -- requires nothing
    GET/id - returns single soda information -- requires Product Name

General: may updates may require an extra click to render
Vending Machine: For buying sodas, mostly
    Select sodas by clicking button
    Reset transaction by pressing "Reset", clears selected items and money in machine
    Current change will be below selected items list
    Input money by pressing the button with money amounts or by using the text box and pressing enter
    Purchase by pressing "Purchase Items"
    Purchased sodas with be downloaded, failed purchases will remain in set

Admin Page: to restock and update prices
    To make any changes enter either the new price or new amount and press enter
    Confirm/Finalize by pressing "update/restock Items" to send changes to backend and confirm update

Testing 
    only on frontend to lightly verify the app is rendering without crashing