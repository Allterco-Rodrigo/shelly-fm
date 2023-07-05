# shelly-fm
Dockerized Fleet Management

Windows Installation

Download and install Docker Desktop
https://docs.docker.com/desktop/install/windows-install/
Open Docker Desktop and leave it open.

Install MAKE
Option 1: Open Terminal as Admin and run: winget install GnuWin32.Make
Option 2: Install Chocolatey (Follow the instructions on https://chocolatey.org/install). Open Terminal as admin and run the command: choco install make
Test the installation bu running: make -v
If the test fails, try next option.

Open Fleet Management folder, click in an empty space with the right button and select "Open in terminal"
Run the command: make run-dev

You will see in Docker desktop the appliction being built. When ou get all play buttons, you can run the application.

Open the browser and go to: http://localhost:3000
FM will open in hte Overview page. If you see 0.000 instead of N/A, the installation was successful and the Backend and Database are running correctly.

Click on Devices / Scan for new devices
Wait until the devices appear.

This is a passive system. You need to ask for it to refresh.
To get new data from your devices, click on Refresh Data. This will send the new data to the Database. And Refresh the Screen
If something doesn't feel right, try to scan again.

To cahnge the name of the devices, go to the device's home page / settings / device info and chenge the device name. The system looks for this name.
