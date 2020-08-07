echo deleting Folder

del "D:\EthereumDev\Project\truffle-starter\build\*.*" /s /f /q

echo Done!
node dataurltest.js

start ganache-cli -p 9545 -e 50000 --allowUnlimitedContractSize -m "athlete come fit winner south rotate over path paddle male virus power"
timeout /t 35 /nobreak > NUL
start truffle migrate
timeout /t 50 /nobreak > NUL

start npm run bridge
timeout /t 30 /nobreak > NUL

start node datamirroringjob.js

timeout /t 10 /nobreak > NUL

start npm run start


IF EXIST "D:\etherumlocalexplore\explorer" START "" /D D:\etherumlocalexplore\explorer call npm run start


